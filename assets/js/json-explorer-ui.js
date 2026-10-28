import { parseJsonTree, generateJsonExpression, jsonValueLabel, inferJsonSource } from './json-explorer.js';

const tool = document.querySelector('[data-json-explorer]');
if (tool) {
  const get = id => tool.querySelector(`#json-${id}`);
  const input = get('source');
  const diagram = get('diagram');
  const dialog = get('dialog');
  const status = get('status');
  const output = get('expression');
  const copyStatus = get('copy-status');
  const canCopy = Boolean(navigator.clipboard && window.isSecureContext);
  const fullscreenPanel = get('diagram-panel');
  const fullscreenButton = get('fullscreen');
  function updateFullscreen() {
    const active = document.fullscreenElement === fullscreenPanel;
    const label = active ? 'Quitter le plein écran du diagramme' : 'Afficher le diagramme en plein écran';
    fullscreenButton.setAttribute('aria-label', label);
    fullscreenButton.setAttribute('title', label);
    fullscreenButton.setAttribute('aria-pressed', String(active));
    get('fullscreen-expand').toggleAttribute('hidden', active);
    get('fullscreen-reduce').toggleAttribute('hidden', !active);
    scheduleConnections();
  }
  fullscreenButton.disabled = !document.fullscreenEnabled;
  if (!document.fullscreenEnabled) fullscreenButton.title = 'Plein écran non pris en charge par ce navigateur';
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === fullscreenPanel) await document.exitFullscreen();
      else await fullscreenPanel.requestFullscreen();
    } catch (error) {
      console.warn('Plein écran du diagramme impossible :', error);
      copyStatus.textContent = 'Le changement de mode plein écran a échoué. Vérifiez les autorisations du navigateur.';
    }
  });
  document.addEventListener('fullscreenchange', updateFullscreen);
  let tree;
  let config;
  let zoom = 100;
  let selected;
  let selectionTools;
  let selectedAnchor;
  let selectedExpression = '';
  let pending;
  let configuredInput = null;
  const nodes = new Map();
  get('example').addEventListener('click', () => {
    input.value = JSON.stringify({
      headers: { 'Content-Type': 'application/json', 'x-ms-workflow-name': 'Exemple_de_flux' },
      statusCode: 200,
      body: {
        id: '12345678901234567890', title: 'Demande de démonstration', active: true,
        archived: false, count: 0, amount: 125.75, missing: null, emptyText: '',
        customer: { firstname: 'David', address: { city: 'Lille', country: 'France' } },
        value: [
          { id: 1, name: 'Pomme', color: '#FF0000', details: { type: 'Fruit', available: true } },
          { id: 2, name: 'Banane', color: '#FFFF00', details: { type: 'Fruit', available: false } }
        ],
        tags: ['Power Automate', 'JSON'], mixed: ['texte', 42, true, null, { name: 'Objet' }],
        matrix: [[1, 2], [3, 4]], emptyArray: [], emptyObject: {},
        'Clé avec espaces': 'Valeur de démonstration', 'a/b': { "l'été": 'Clés spéciales' },
        '': 'Nom de champ vide', message: 'Première ligne\nDeuxième ligne',
        html: '<strong>Texte uniquement, jamais exécuté</strong>'
      }
    }, null, 2);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    prepare();
    get('function').value = 'triggerOutputs';
    get('scope').value = 'outputs';
    updateConfig();
  });
  let edges = [];
  let connectionLayer;
  let drawFrame;
  function scheduleConnections() {
    cancelAnimationFrame(drawFrame);
    drawFrame = requestAnimationFrame(drawConnections);
  }
  function drawConnections() {
    if (!connectionLayer?.isConnected) return;
    const bounds = diagram.getBoundingClientRect();
    const scale = bounds.width / diagram.offsetWidth || 1;
    if (selectionTools?.isConnected && selectedAnchor?.getClientRects().length) {
      const anchor = selectedAnchor.getBoundingClientRect();
      selectionTools.style.left = `${Math.max(72, Math.min(diagram.offsetWidth - 72, (anchor.left + anchor.width / 2 - bounds.left) / scale))}px`;
      selectionTools.style.top = `${Math.max(76, (anchor.top - bounds.top) / scale)}px`;
    }
    if (selectionTools) selectionTools.hidden = !selectedAnchor?.getClientRects().length;
    connectionLayer.setAttribute('width', diagram.offsetWidth);
    connectionLayer.setAttribute('height', diagram.offsetHeight);
    connectionLayer.replaceChildren();
    const svgNS = 'http://www.w3.org/2000/svg';
    for (const edge of edges) {
      if (!edge.from.getClientRects().length || !edge.to.getClientRects().length) continue;
      const start = edge.from.getBoundingClientRect();
      const end = edge.to.getBoundingClientRect();
      const x1 = (start.right - bounds.left) / scale;
      const y1 = (start.top + start.height / 2 - bounds.top) / scale;
      const x2 = (end.left - bounds.left) / scale;
      const y2 = (end.top + end.height / 2 - bounds.top) / scale;
      const bend = (x2 - x1) / 2;
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', (x1 + x2) / 2);
      label.setAttribute('y', (y1 + y2) / 2 - 6);
      label.textContent = edge.label.length > 22 ? edge.label.slice(0, 21) + '…' : edge.label;
      connectionLayer.append(path, label);
    }
  }
  new ResizeObserver(scheduleConnections).observe(diagram);
  function clearSelection() {
    selected?.classList.remove('json-selected');
    selected = null;
    selectedAnchor = null;
    selectionTools?.remove();
    output.value = '';
    selectedExpression = '';
    get('copy').disabled = true;
    get('selected').textContent = 'Sélectionnez un champ ou une valeur dans le diagramme.';
    copyStatus.textContent = '';
    scheduleConnections();
  }
  function updateConfig() {
    const source = get('function').value;
    const named = ['outputs', 'body', 'items'].includes(source);
    get('action-field').hidden = !named;
    get('action').required = named;
    get('scope-field').hidden = !['outputs', 'triggerOutputs'].includes(source);
    get('config-error').textContent = '';
  }
  function prepare() {
    clearSelection();
    diagram.replaceChildren();
    tree = null;
    nodes.clear();
    try {
      pending = parseJsonTree(input.value);
      if (configuredInput !== input.value) {
        const inferred = inferJsonSource(pending.value);
        get('function').value = inferred.source;
        get('scope').value = inferred.scope;
      }
      status.textContent = 'JSON valide. Configurez la source de l’expression.';
      updateConfig();
      if (!dialog.open) dialog.showModal();
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      pending = null;
      status.textContent = error.message;
      input.setAttribute('aria-invalid', 'true');
    }
  }
  function makeButton(text, node, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text || '(nom vide)';
    button.setAttribute('aria-label', `${className === 'json-key' ? 'Champ' : 'Valeur'} ${node.path} : ${text}`);
    button.addEventListener('click', () => select(node, button));
    return button;
  }
  function select(node, anchor) {
    clearSelection();
    const field = anchor.closest('.json-field');
    selectedAnchor = anchor;
    selected = field;
    field.classList.add('json-selected');
    output.value = generateJsonExpression(node.segments, config);
    selectedExpression = output.value;
    get('copy').disabled = !canCopy;
    get('selected').textContent = `${node.path} · ${node.type}`;
    selectionTools = document.createElement('div');
    selectionTools.className = 'json-selection-tools';
    selectionTools.setAttribute('role', 'group');
    selectionTools.setAttribute('aria-label', `Copier ${node.label}`);
    for (const [label, value, icon] of [
      ['Nom du champ', node.label, 'Aa'], ['Chemin JSON', node.path, '{...}'], ['Expression Power Automate', output.value, null]
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'json-copy-icon';
      button.setAttribute('aria-label', label);
      if (icon) {
        const symbol = document.createElement('span');
        symbol.setAttribute('aria-hidden', 'true');
        symbol.textContent = icon;
        button.append(symbol);
      } else {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M13 2 4 14h7l-1 8 10-13h-7z');
        path.setAttribute('fill', 'currentColor');
        svg.append(path);
        button.append(svg);
      }
      const tooltip = document.createElement('span');
      tooltip.className = 'json-copy-tooltip';
      tooltip.textContent = label;
      button.append(tooltip);
      button.addEventListener('click', () => copy(value, label));
      selectionTools.append(button);
    }
    diagram.append(selectionTools);
    scheduleConnections();
    if (!canCopy) copyStatus.textContent = 'Copie automatique indisponible : les boutons affichent le texte à copier manuellement.';
  }
  async function copy(value, label) {
    try {
      if (!canCopy) throw new Error('API presse-papier indisponible');
      await navigator.clipboard.writeText(value);
      copyStatus.textContent = `${label} copié dans le presse-papier.`;
    } catch (error) {
      console.warn('Copie JSON impossible :', error);
      output.value = value;
      output.focus();
      output.select();
      copyStatus.textContent = 'La copie a échoué ou est indisponible. Le texte est sélectionné : copiez-le manuellement.';
    }
  }
  function field(node) {
    const row = document.createElement('div');
    row.className = 'json-field';
    row.dataset.type = node.type;
    row.append(makeButton(node.label, node, 'json-key'), makeButton(jsonValueLabel(node), node, 'json-value'));
    if (node.type === 'string' && /^#(?:[a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(node.value)) {
      const swatch = document.createElement('span');
      swatch.className = 'json-color-swatch';
      swatch.style.backgroundColor = node.value;
      swatch.setAttribute('aria-hidden', 'true');
      row.querySelector('.json-value').prepend(swatch);
    }
    nodes.set(node.path, row);
    return row;
  }
  function card(node) {
    const group = document.createElement('div');
    group.className = 'json-node-group';
    const details = document.createElement('details');
    details.className = 'json-card';
    details.open = true;
    const summary = document.createElement('summary');
    const heading = document.createElement('span');
    heading.className = 'json-card-name';
    heading.textContent = `${node.label} · ${node.type}`;
    summary.append(heading);
    if (node.type === 'object' || node.type === 'array') {
      const count = document.createElement('span');
      count.className = 'json-card-count';
      count.textContent = jsonValueLabel(node);
      summary.append(count);
    }
    details.append(summary);
    if (node.type !== 'object' && node.type !== 'array') details.append(field(node));
    const children = document.createElement('div');
    children.className = 'json-children';
    group.append(details, children);
    for (const child of node.children) {
      const row = field(child);
      details.append(row);
      if (child.type === 'object' || child.type === 'array') {
        const records = child.type === 'array' && child.children.length
          && child.children.every(item => item.type === 'object' || item.type === 'array')
          ? child.children : [child];
        for (const record of records) {
          const branch = card(record);
          children.append(branch);
          edges.push({ from: row, to: branch.firstElementChild, label: child.label });
        }
      }
    }
    details.addEventListener('toggle', () => {
      children.hidden = !details.open;
      scheduleConnections();
    });
    return group;
  }
  function render() {
    clearSelection();
    nodes.clear();
    edges = [];
    connectionLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    connectionLayer.classList.add('json-connections');
    connectionLayer.setAttribute('aria-hidden', 'true');
    connectionLayer.setAttribute('focusable', 'false');
    diagram.replaceChildren(connectionLayer, card(tree));
    scheduleConnections();
    status.textContent = `Diagramme prêt : ${nodes.size} nœud(s). Source : ${config.source}(${['outputs', 'body', 'items'].includes(config.source) ? config.action : ''}).`;
  }
  input.addEventListener('paste', () => setTimeout(prepare, 0));
  input.addEventListener('input', () => {
    clearSelection();
    tree = null;
    diagram.replaceChildren();
    status.textContent = 'Le JSON a changé : cliquez sur Explorer pour actualiser le diagramme.';
    input.removeAttribute('aria-invalid');
  });
  get('explore').addEventListener('click', prepare);
  get('function').addEventListener('change', updateConfig);
  get('cancel').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => get('explore').focus());
  get('config').addEventListener('submit', event => {
    event.preventDefault();
    const next = { source: get('function').value, action: get('action').value, scope: get('scope').value };
    try {
      generateJsonExpression([], next);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      get('config-error').textContent = error.message;
      return;
    }
    config = next;
    configuredInput = input.value;
    tree = pending;
    input.removeAttribute('aria-invalid');
    render();
    dialog.close();
  });
  get('copy').addEventListener('click', () => copy(selectedExpression, 'Expression Power Automate'));
  for (const [id, open] of [['expand', true], ['collapse', false]]) {
    get(id).addEventListener('click', () => {
      clearSelection();
      for (const details of diagram.querySelectorAll('details')) details.open = open;
      scheduleConnections();
    });
  }
  function setZoom(value) {
    zoom = Math.max(50, Math.min(150, value));
    diagram.style.zoom = zoom / 100;
    get('zoom').value = `${zoom} %`;
    get('zoom-out').disabled = zoom === 50;
    get('zoom-in').disabled = zoom === 150;
    scheduleConnections();
  }
  get('zoom-in').addEventListener('click', () => setZoom(zoom + 10));
  get('zoom-out').addEventListener('click', () => setZoom(zoom - 10));
  tool.disabled = false;
  updateConfig();
}
