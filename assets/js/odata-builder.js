import { analyzeSharePointJson, buildFilter, filterWarnings, formatValue, needsValue, operatorLabel, operatorsFor, sampleGetItems } from './odata.js';

const tool = document.querySelector('[data-odata-builder]');
if (tool) {
  const json = tool.querySelector('#odata-json');
  const dynamicValuesInput = tool.querySelector('#odata-dynamic-values');
  const sample = tool.querySelector('#odata-sample');
  const jsonStatus = tool.querySelector('#odata-json-status');
  const columnsPanel = tool.querySelector('#odata-columns');
  const columnsBody = tool.querySelector('#odata-columns-body');
  const columnsCount = tool.querySelector('#odata-columns-count');
  const builder = tool.querySelector('#odata-builder');
  const datalists = tool.querySelector('#odata-datalists');
  const output = tool.querySelector('#odata-output');
  const copy = tool.querySelector('#odata-copy');
  const reset = tool.querySelector('#odata-reset');
  const status = tool.querySelector('#odata-status');
  const warningsList = tool.querySelector('#odata-warnings');
  const canCopy = Boolean(navigator.clipboard && window.isSecureContext);
  const placeholders = { text: 'Valeur', number: '100', date: '2024-01-31' };
  const formats = { number: 'Nombre attendu, par exemple 100 ou 12.5.', date: 'Date attendue au format AAAA-MM-JJ ou AAAA-MM-JJTHH:MM:SSZ.' };
  let targets = [];
  let dynamicValues = [];
  let nextId = 1;
  let root;

  const newCondition = () => ({ type: 'condition', id: nextId++, enabled: true, path: '', operator: '', value: '' });
  const newGroup = () => ({ type: 'group', id: nextId++, enabled: true, logic: 'and', children: [newCondition()] });
  const resetTree = () => { root = { type: 'group', id: 0, enabled: true, logic: 'and', children: [newCondition()] }; };
  const targetFor = node => targets.find(target => target.path === node.path);
  resetTree();

  function el(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) {
      if (value === false || value === null || value === undefined) continue;
      if (name === 'text') element.textContent = value;
      else if (name === 'class') element.className = value;
      else element.setAttribute(name, value === true ? '' : value);
    }
    element.append(...children.filter(Boolean));
    return element;
  }

  function find(id, node = root, parent = null) {
    if (node.id === id) return { node, parent };
    if (node.type !== 'group') return null;
    for (const child of node.children) {
      const found = find(id, child, node);
      if (found) return found;
    }
    return null;
  }

  function cloneNode(node) {
    return node.type === 'group'
      ? { ...node, id: nextId++, children: node.children.map(cloneNode) }
      : { ...node, id: nextId++ };
  }

  function valueIsInvalid(node, target) {
    return Boolean(target && needsValue(node.operator) && node.value.trim() && formatValue(target, node.value) === null);
  }

  function menu(label, focus, items, className) {
    return el('details', { class: `odata-menu ${className}` },
      el('summary', { 'data-focus': focus, 'aria-label': label.aria, text: label.text }),
      el('div', { class: 'odata-menu-list' }, ...items.map(([text, action, id]) => el('button', { type: 'button', 'data-action': action, 'data-node': id, text }))));
  }

  function fieldSelect(node, label) {
    const select = el('select', { id: `odata-field-${node.id}`, 'data-role': 'field', 'data-node': node.id, 'data-focus': `${node.id}:field` },
      el('option', { value: '', text: 'Sélectionner un champ' }));
    for (const column of currentColumns.filter(candidate => candidate.supported)) {
      const group = el('optgroup', { label: `${column.name} (${column.kind})` });
      for (const target of column.targets) {
        group.append(el('option', { value: target.path, selected: target.path === node.path, text: target.detail ? `${column.name} — ${target.detail}` : column.name }));
      }
      select.append(group);
    }
    return [el('label', { for: select.id, class: 'odata-label' }, 'Champ', el('span', { class: 'sr-only', text: ` — ${label}` })), select];
  }

  function operatorSelect(node, target, label) {
    const select = el('select', { id: `odata-operator-${node.id}`, 'data-role': 'operator', 'data-node': node.id, 'data-focus': `${node.id}:operator`, disabled: !target });
    if (!target) select.append(el('option', { value: '', text: 'Opérateur' }));
    for (const operator of operatorsFor(target)) select.append(el('option', { value: operator, selected: operator === node.operator, text: operatorLabel(target, operator) }));
    return [el('label', { for: select.id, class: 'odata-label' }, 'Opérateur', el('span', { class: 'sr-only', text: ` — ${label}` })), select];
  }

  function valueControl(node, target, label) {
    const id = `odata-value-${node.id}`;
    const caption = el('label', { for: id, class: 'odata-label' }, 'Valeur', el('span', { class: 'sr-only', text: ` — ${label}` }));
    if (target && !needsValue(node.operator)) return [el('span', { class: 'odata-label', 'aria-hidden': 'true', text: 'Valeur' }), el('span', { class: 'odata-no-value muted', text: 'Aucune valeur requise' })];
    if (target?.type === 'boolean') {
      return [caption, el('select', { id, 'data-role': 'value', 'data-node': node.id, 'data-focus': `${node.id}:value` },
        el('option', { value: '1', selected: node.value === '1', text: 'Oui' }),
        el('option', { value: '0', selected: node.value === '0', text: 'Non' }),
        ...dynamicValues.map(value => el('option', { value, selected: node.value === value, text: value })))];
    }
    const invalid = valueIsInvalid(node, target);
    const errorId = `${id}-error`;
    const index = targets.indexOf(target);
    const input = el('input', {
      id, type: 'text', value: node.value, 'data-role': 'value', 'data-node': node.id, 'data-focus': `${node.id}:value`,
      disabled: !target, autocomplete: 'off', spellcheck: 'false', placeholder: placeholders[target?.type] ?? 'Valeur',
      inputmode: target?.type === 'number' && !target.multi ? 'decimal' : null,
      list: target?.samples.length ? `odata-values-${index}` : null,
      'aria-invalid': invalid ? 'true' : null, 'aria-describedby': errorId
    });
    input.value = node.value;
    const dynamicSelect = dynamicValues.length ? el('select', {
      id: `odata-dynamic-value-${node.id}`, 'data-role': 'dynamic-value', 'data-node': node.id, disabled: !target,
      'aria-label': `Insérer une valeur dynamique — ${label}`
    },
    el('option', { value: '', text: 'Insérer une valeur dynamique' }),
    ...dynamicValues.map(value => el('option', { value, text: value }))) : null;
    const error = el('span', { id: errorId, class: 'odata-error', hidden: !invalid, text: formats[target?.type] ?? '' });
    return [caption, el('span', { class: 'odata-value' }, input, dynamicSelect, error)];
  }

  function renderCondition(node, counter) {
    const number = ++counter.conditions;
    const label = `condition ${number}`;
    const target = targetFor(node);
    const toggleId = `odata-enabled-${node.id}`;
    return el('li', { class: `odata-row${node.enabled ? '' : ' is-disabled'}` },
      el('span', { class: 'odata-check' },
        el('input', { type: 'checkbox', id: toggleId, checked: node.enabled, 'data-role': 'enabled', 'data-node': node.id, 'data-focus': `${node.id}:enabled` }),
        el('label', { for: toggleId, class: 'sr-only', text: `Inclure la ${label}` })),
      el('span', { class: 'odata-cell' }, ...fieldSelect(node, label)),
      el('span', { class: 'odata-cell' }, ...operatorSelect(node, target, label)),
      el('span', { class: 'odata-cell' }, ...valueControl(node, target, label)),
      menu({ text: '…', aria: `Actions de la ${label}` }, `${node.id}:menu`, [['Dupliquer', 'duplicate', node.id], ['Supprimer', 'remove', node.id]], 'odata-row-menu'));
  }

  function renderGroup(node, counter) {
    const isRoot = node === root;
    const number = isRoot ? 0 : ++counter.groups;
    const name = isRoot ? 'filtre principal' : `groupe ${number}`;
    const headingId = `odata-group-${node.id}-label`;
    const logicId = `odata-logic-${node.id}`;
    const header = el('div', { class: 'odata-group-header' });
    if (!isRoot) {
      const toggleId = `odata-enabled-${node.id}`;
      header.append(el('span', { class: 'odata-check' },
        el('input', { type: 'checkbox', id: toggleId, checked: node.enabled, 'data-role': 'enabled', 'data-node': node.id, 'data-focus': `${node.id}:enabled` }),
        el('label', { for: toggleId, class: 'sr-only', text: `Inclure le ${name}` })));
    }
    header.append(
      el('span', { id: headingId, class: isRoot ? 'sr-only' : 'odata-group-name', text: isRoot ? 'Filtre principal' : `Groupe ${number}` }),
      el('label', { for: logicId, class: 'odata-logic-label' }, 'Combiner', el('span', { class: 'sr-only', text: ` les conditions du ${name}` })),
      el('select', { id: logicId, 'data-role': 'logic', 'data-node': node.id, 'data-focus': `${node.id}:logic` },
        el('option', { value: 'and', selected: node.logic === 'and', text: 'ET — toutes les conditions' }),
        el('option', { value: 'or', selected: node.logic === 'or', text: 'OU — au moins une condition' })));
    if (!isRoot) header.append(menu({ text: '…', aria: `Actions du ${name}` }, `${node.id}:menu`, [['Dupliquer le groupe', 'duplicate', node.id], ['Supprimer le groupe', 'remove', node.id]], 'odata-row-menu'));
    const list = el('ul', { class: 'odata-list' });
    for (const child of node.children) list.append(child.type === 'group' ? el('li', { class: 'odata-nested' }, renderGroup(child, counter)) : renderCondition(child, counter));
    const add = menu({ text: '+ Ajouter', aria: `Ajouter au ${name}` }, `${node.id}:add`, [['Ajouter une ligne', 'add-condition', node.id], ['Ajouter un groupe', 'add-group', node.id]], 'odata-add');
    return el('div', { class: `odata-group${isRoot ? ' is-root' : ''}${node.enabled ? '' : ' is-disabled'}`, role: 'group', 'aria-labelledby': headingId }, header, node.children.length ? list : el('p', { class: 'muted odata-empty', text: 'Ce groupe est vide.' }), add);
  }

  let currentColumns = [];
  function render(focusKey = document.activeElement?.dataset.focus) {
    dynamicValues = [...new Set(dynamicValuesInput.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean))];
    builder.replaceChildren();
    if (!targets.length) {
      builder.append(el('p', { class: 'muted', text: 'Les champs apparaîtront ici après l’analyse du JSON.' }));
    } else {
      builder.append(renderGroup(root, { conditions: 0, groups: 0 }));
    }
    reset.disabled = !targets.length;
    if (focusKey) builder.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus();
    update();
  }

  function update() {
    const { filter, incomplete } = buildFilter(root, targets);
    if (output.value !== filter) output.value = filter;
    copy.disabled = !filter || !canCopy;
    const messages = [];
    if (!targets.length) messages.push('');
    else if (filter) messages.push('Requête de filtre générée.');
    else messages.push('Complétez au moins une condition pour générer la requête.');
    if (incomplete && targets.length) messages.push(`${incomplete} condition${incomplete > 1 ? 's' : ''} incomplète${incomplete > 1 ? 's' : ''} ou invalide${incomplete > 1 ? 's' : ''} ignorée${incomplete > 1 ? 's' : ''}.`);
    if (filter && !canCopy) messages.push('Copie automatique indisponible : sélectionnez la requête et copiez-la manuellement.');
    const message = messages.join(' ').trim();
    if (status.textContent !== message) status.textContent = message;
    const warnings = filter ? filterWarnings(root, targets) : [];
    warningsList.replaceChildren(...warnings.map(text => el('li', { text })));
    warningsList.hidden = !warnings.length;
  }

  function renderColumns(columns) {
    columnsBody.replaceChildren(...columns.map(column => el('tr', {},
      el('th', { scope: 'row' }, el('code', { text: column.name })),
      el('td', { text: column.kind }),
      el('td', { text: column.supported ? column.targets.map(target => target.path).join(', ') : 'Non filtrable avec OData' }))));
    columnsCount.textContent = String(columns.length);
    columnsPanel.hidden = !columns.length;
    datalists.replaceChildren(...targets.map((target, index) => target.samples.length
      ? el('datalist', { id: `odata-values-${index}` }, ...target.samples.map(value => el('option', { value })))
      : null).filter(Boolean));
  }

  function keepValidPaths(node) {
    if (node.type === 'group') return node.children.forEach(keepValidPaths);
    const target = targetFor(node);
    if (!target) Object.assign(node, { path: '', operator: '', value: '' });
    else if (!operatorsFor(target).includes(node.operator)) node.operator = operatorsFor(target)[0];
  }

  function analyze() {
    const analysis = analyzeSharePointJson(json.value);
    const hadTargets = targets.length > 0;
    targets = analysis.targets;
    currentColumns = analysis.columns;
    renderColumns(currentColumns);
    json.setAttribute('aria-invalid', analysis.error ? 'true' : 'false');
    if (!json.value.trim()) jsonStatus.textContent = '';
    else if (analysis.error) jsonStatus.textContent = analysis.error;
    else {
      const filterable = currentColumns.filter(column => column.supported).length;
      jsonStatus.textContent = `${analysis.items.length} élément${analysis.items.length > 1 ? 's' : ''} analysé${analysis.items.length > 1 ? 's' : ''} : ${filterable} colonne${filterable > 1 ? 's' : ''} filtrable${filterable > 1 ? 's' : ''} sur ${currentColumns.length}.`;
    }
    keepValidPaths(root);
    if (!hadTargets && targets.length && !root.children.length) root.children.push(newCondition());
    render(null);
  }

  function changeField(node, path) {
    const previous = targetFor(node);
    node.path = path;
    const target = targetFor(node);
    node.operator = operatorsFor(target)[0] ?? '';
    if (!target || previous?.type !== target.type || !node.value.trim()) node.value = defaultValue(target);
  }

  function defaultValue(target) {
    if (!target) return '';
    if (target.type === 'boolean') return '1';
    return target.samples.find(value => formatValue(target, value) !== null) ?? '';
  }

  function changeValue(control) {
    const { node } = find(Number(control.dataset.node));
    node.value = control.value;
    if (control.tagName === 'INPUT') {
      const invalid = valueIsInvalid(node, targetFor(node));
      control.setAttribute('aria-invalid', String(invalid));
      document.getElementById(`${control.id}-error`).hidden = !invalid;
    }
    update();
  }

  builder.addEventListener('input', event => {
    const control = event.target;
    if (control.dataset.role === 'value') changeValue(control);
  });

  builder.addEventListener('change', event => {
    const control = event.target;
    const found = find(Number(control.dataset.node));
    if (!found) return;
    const { node } = found;
    switch (control.dataset.role) {
      case 'field': changeField(node, control.value); return render();
      case 'operator':
        node.operator = control.value;
        if (needsValue(node.operator) && !node.value.trim()) node.value = defaultValue(targetFor(node));
        return render();
      case 'dynamic-value':
        if (!control.value) return;
        node.value = control.value;
        return render(`${node.id}:value`);
      case 'value': return changeValue(control);
      case 'logic': node.logic = control.value; return update();
      case 'enabled':
        node.enabled = control.checked;
        control.closest('.odata-row, .odata-group').classList.toggle('is-disabled', !node.enabled);
        return update();
    }
  });

  builder.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { node, parent } = find(Number(button.dataset.node));
    let focus;
    switch (button.dataset.action) {
      case 'add-condition': {
        const condition = newCondition();
        node.children.push(condition);
        focus = `${condition.id}:field`;
        break;
      }
      case 'add-group': {
        const group = newGroup();
        node.children.push(group);
        focus = `${group.children[0].id}:field`;
        break;
      }
      case 'duplicate': {
        const copyNode = cloneNode(node);
        parent.children.splice(parent.children.indexOf(node) + 1, 0, copyNode);
        focus = copyNode.type === 'group' ? `${copyNode.id}:logic` : `${copyNode.id}:field`;
        break;
      }
      case 'remove':
        parent.children.splice(parent.children.indexOf(node), 1);
        focus = `${parent.id}:add`;
        break;
    }
    render(focus);
  });

  document.addEventListener('click', event => {
    for (const open of tool.querySelectorAll('.odata-menu[open]')) if (!open.contains(event.target)) open.open = false;
  });
  tool.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = event.target.closest('.odata-menu[open]');
    if (!open) return;
    open.open = false;
    open.querySelector('summary').focus();
  });

  let timer;
  json.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(analyze, 250);
  });
  dynamicValuesInput.addEventListener('input', () => render());
  window.addEventListener('pageshow', event => {
    if (event.persisted) render();
  });
  sample.addEventListener('click', () => {
    json.value = JSON.stringify(sampleGetItems, null, 2);
    analyze();
  });
  reset.addEventListener('click', () => {
    resetTree();
    render(`${root.children[0].id}:field`);
  });
  copy.addEventListener('click', async () => {
    const text = output.value;
    try {
      await navigator.clipboard.writeText(text);
      if (output.value === text) status.textContent = 'Requête de filtre copiée dans le presse-papier.';
    } catch (error) {
      console.warn('Copie de la requête OData impossible :', error);
      status.textContent = 'La copie a échoué. Sélectionnez la requête et copiez-la manuellement.';
      output.focus();
      output.select();
    }
  });

  json.disabled = false;
  sample.disabled = false;
  if (json.value.trim()) analyze();
  else render(null);
}
