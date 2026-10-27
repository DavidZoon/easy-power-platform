import { detectColors, generateThemeCode, parseThemeColor, readHarmonyPalette, themeAlpha, themeRgba, themeCombinations } from './theme-builder.js';
import { generateThemeScreen } from './theme-screen.js';
import { createCodeEditor, highlighters } from './code-editor.js';

const tool = document.querySelector('[data-theme-builder]');
if (tool) {
  const source = tool.querySelector('#theme-source');
  const name = tool.querySelector('#theme-name');
  const palette = tool.querySelector('#theme-palette');
  const template = document.querySelector('#theme-color-template');
  const detectionStatus = tool.querySelector('#theme-detection-status');
  const issues = tool.querySelector('#theme-detection-issues');
  const output = tool.querySelector('#theme-code');
  const status = tool.querySelector('#theme-code-status');
  const copy = tool.querySelector('#theme-copy');
  const screenOutput = tool.querySelector('#theme-screen-code');
  const screenCopy = tool.querySelector('#theme-screen-copy');
  const screenStatus = tool.querySelector('#theme-screen-status');
  const codeEditor = createCodeEditor(output, highlighters.powerfx);
  const screenEditor = createCodeEditor(screenOutput, highlighters.yaml);
  const add = tool.querySelector('#theme-add');
  const textDialog = tool.querySelector('#theme-text-dialog');
  const combinationsGallery = tool.querySelector('#theme-combinations');
  const combinationsStatus = tool.querySelector('#theme-combinations-status');
  const canCopy = Boolean(navigator.clipboard && window.isSecureContext);
  const rows = [];
  let counter = 0;
  const locale = () => tool.querySelector('[name="theme-locale"]:checked').value;
  const paletteColors = () => rows.map(row => ({ name: row.name.value, hex: row.hex, role: row.role.value }));

  function renderCombinations(colors) {
    combinationsGallery.replaceChildren();
    const { combinations, excluded } = themeCombinations(colors);
    combinationsStatus.textContent = (combinations.length ? '' : 'Aucune association : ajoutez au moins un fond opaque et une couleur de texte opaque.')
      + (excluded.length ? ` Couleurs semi-transparentes exclues des associations et du classement : ${excluded.map(color => color.name).join(', ')}. Leur contraste dépend du fond réel.` : '');
    for (const level of ['AAA', 'AA', 'A', 'Insuffisant']) {
      const matches = combinations.filter(match => match.level === level).sort((a, b) => b.ratio - a.ratio);
      if (!matches.length) continue;
      const heading = document.createElement('h3');
      heading.textContent = level;
      const grid = document.createElement('div');
      grid.className = 'theme-combination-grid';
      for (const match of matches) {
        const card = document.createElement('div');
        card.className = 'theme-combination';
        const sample = document.createElement('div');
        sample.className = 'theme-combination-sample';
        sample.style.backgroundColor = match.background.hex;
        sample.style.color = match.text.hex;
        sample.setAttribute('role', 'img');
        sample.setAttribute('aria-label', `Aperçu : fond ${match.background.hex}, texte ${match.text.hex}, contraste ${match.ratio.toFixed(2)}:1`);
        const sampleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        sampleIcon.setAttribute('viewBox', '0 0 40 44');
        sampleIcon.setAttribute('width', '40');
        sampleIcon.setAttribute('height', '44');
        sampleIcon.setAttribute('aria-hidden', 'true');
        sampleIcon.setAttribute('focusable', 'false');
        const sampleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        sampleText.setAttribute('x', '20');
        sampleText.setAttribute('y', '28');
        sampleText.setAttribute('text-anchor', 'middle');
        sampleText.setAttribute('fill', 'currentColor');
        sampleText.textContent = 'Aa';
        sampleIcon.append(sampleText);
        sample.append(sampleIcon);
        const label = document.createElement('p');
        label.textContent = `${match.background.name} / ${match.text.name}`;
        const badge = document.createElement('span');
        badge.className = 'theme-contrast';
        badge.dataset.level = level;
        badge.textContent = `${level} · ${match.ratio.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}:1`;
        card.append(sample, label, badge);
        grid.append(card);
      }
      combinationsGallery.append(heading, grid);
    }
  }

  function refreshColor(row) {
    row.picker.value = row.hex.slice(0, 7);
    row.swatch.style.backgroundColor = row.hex;
    const alpha = themeAlpha(row.hex);
    row.alpha.value = String(Math.round((1 - alpha) * 1000) / 10);
    row.alphaValue.value = `${Number(row.alpha.value).toLocaleString('fr-FR')} %`;
    row.open.title = `${row.name.value.trim() || 'Sans nom'} : ${row.hex}`;
  }

  function updateCode() {
    generateCode();
    codeEditor.refresh();
    screenEditor.refresh();
  }

  function generateCode() {
    for (const row of rows) if (row.pending) resolveColor(row);
    const target = tool.querySelector('[name="theme-target"]:checked').value;
    tool.querySelector('#theme-onstart-warning').hidden = target !== 'onstart';
    tool.querySelector('#theme-empty').hidden = rows.length > 0;
    const names = rows.map(row => row.name.value.trim().toLowerCase());
    for (const row of rows) {
      const key = row.name.value.trim().toLowerCase();
      const nameError = !key ? 'Donnez un nom à cette couleur.'
        : names.filter(value => value === key).length > 1 ? 'Ce nom de couleur est déjà utilisé.' : '';
      row.name.setAttribute('aria-invalid', String(Boolean(nameError)));
      row.roleError = rows.some(other => other !== row && other.hex === row.hex && other.role.value === row.role.value)
        ? 'Cette couleur existe déjà pour ce rôle.' : '';
      row.role.setAttribute('aria-invalid', String(Boolean(row.roleError)));
      row.error.textContent = nameError || row.colorError || row.roleError;
      row.error.hidden = !row.error.textContent;
    }
    name.setAttribute('aria-invalid', String(!name.value.trim()));
    output.value = '';
    copy.disabled = true;
    screenOutput.value = '';
    screenCopy.disabled = true;
    screenStatus.textContent = 'Le YAML sera disponible lorsque le code du thème sera valide.';
    if (rows.some(row => row.colorError || row.roleError || row.name.getAttribute('aria-invalid') === 'true')) {
      combinationsGallery.replaceChildren();
      combinationsStatus.textContent = 'Corrigez les erreurs de la palette pour actualiser les associations.';
      status.textContent = 'Corrigez les couleurs ou les noms signalés avant de copier le code.';
      return;
    }
    if (!rows.length) {
      renderCombinations([]);
      status.textContent = 'Ajoutez au moins une couleur pour générer le code.';
      return;
    }
    try {
      const colors = paletteColors();
      renderCombinations(colors);
      output.value = generateThemeCode(name.value, colors, locale(), target);
      screenOutput.value = generateThemeScreen(name.value, colors, target);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      status.textContent = error.message;
      return;
    }
    copy.disabled = !canCopy;
    screenCopy.disabled = !canCopy;
    screenStatus.textContent = 'Écran YAML prêt à coller après la définition du thème.'
      + (canCopy ? '' : ' Copie automatique indisponible : sélectionnez le YAML et copiez-le manuellement.');
    status.textContent = `Code prêt pour ${target === 'formulas' ? 'App.Formulas' : 'App.OnStart'} (${locale().toUpperCase()}).`
      + (canCopy ? '' : ' Copie automatique indisponible : sélectionnez le code et copiez-le manuellement.');
  }

  function resolveColor(row) {
    const { value, active } = row.pending;
    const hex = parseThemeColor(value);
    row.colorError = !hex ? 'Valeur invalide : utilisez un code HEX ou une formule Power Fx à valeurs numériques.'
      : rows.some(other => other !== row && other.hex === hex && other.role.value === row.role.value) ? 'Cette couleur existe déjà dans la palette pour ce rôle.' : '';
    active.setAttribute('aria-invalid', String(Boolean(row.colorError)));
    if (!row.colorError) {
      row.hex = hex;
      row.hexInput.setAttribute('aria-invalid', 'false');
      row.fxInput.setAttribute('aria-invalid', 'false');
      row.picker.setAttribute('aria-invalid', 'false');
      row.alpha.setAttribute('aria-invalid', 'false');
      if (active !== row.hexInput) row.hexInput.value = hex;
      if (active !== row.fxInput) row.fxInput.value = themeRgba(hex, locale());
      refreshColor(row);
      row.pending = null;
    }
  }

  function applyColor(row, value, active) {
    row.pending = { value, active };
    resolveColor(row);
    updateCode();
  }

  function appendColor(hex, role = 'background', customName) {
    const element = template.content.firstElementChild.cloneNode(true);
    const row = {
      element, hex, colorError: '',
      name: element.querySelector('.theme-color-name'),
      role: element.querySelector('.theme-color-role'),
      hexInput: element.querySelector('.theme-hex'),
      fxInput: element.querySelector('.theme-fx'),
      picker: element.querySelector('.theme-picker'),
      swatch: element.querySelector('.theme-swatch'),
      open: element.querySelector('.theme-color-open'),
      editor: element.querySelector('.theme-color-editor'),
      alpha: element.querySelector('.theme-alpha'),
      alphaValue: element.querySelector('.theme-alpha-value'),
      error: element.querySelector('.theme-color-error')
    };
    let defaultName;
    do { defaultName = `couleur_${String(++counter).padStart(2, '0')}`; }
    while (rows.some(other => other.name.value.trim().toLowerCase() === defaultName));
    let uniqueName = customName || defaultName;
    let suffix = 2;
    while (rows.some(other => other.name.value.trim().toLowerCase() === uniqueName.toLowerCase())) uniqueName = `${customName}_${suffix++}`;
    row.name.value = uniqueName;
    row.role.value = role;
    row.hexInput.value = hex;
    row.fxInput.value = themeRgba(hex, locale());
    refreshColor(row);
    row.editor.id = `theme-color-editor-${counter}`;
    row.open.setAttribute('aria-controls', row.editor.id);
    row.error.id = `theme-color-error-${counter}`;
    for (const control of [row.name, row.hexInput, row.fxInput, row.picker, row.alpha]) control.setAttribute('aria-describedby', row.error.id);
    const remove = element.querySelector('.theme-remove');
    const refreshLabels = () => {
      const label = row.name.value.trim() || 'sans nom';
      remove.setAttribute('aria-label', `Supprimer la couleur ${label}`);
      remove.title = `Supprimer la couleur ${label}`;
      row.picker.setAttribute('aria-label', `Sélectionner la couleur ${label}`);
      row.open.setAttribute('aria-label', `Modifier la couleur ${label}`);
      row.open.title = `${label} : ${row.hex}`;
    };
    const closeEditor = () => {
      row.editor.hidden = true;
      row.open.setAttribute('aria-expanded', 'false');
      row.open.focus();
    };
    row.open.addEventListener('click', () => {
      const opening = row.editor.hidden;
      row.editor.hidden = !opening;
      row.open.setAttribute('aria-expanded', String(opening));
      if (opening) row.picker.focus();
    });
    element.querySelector('.theme-color-close').addEventListener('click', closeEditor);
    row.editor.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); closeEditor(); }
    });
    row.name.addEventListener('input', () => { refreshLabels(); updateCode(); });
    row.role.addEventListener('change', updateCode);
    for (const control of [row.hexInput, row.fxInput]) {
      control.addEventListener('input', () => applyColor(row, control.value, control));
      control.addEventListener('change', () => {
        applyColor(row, control.value, control);
        if (!row.colorError) {
          row.hexInput.value = row.hex;
          row.fxInput.value = themeRgba(row.hex, locale());
        }
      });
    }
    row.picker.addEventListener('input', () => applyColor(row, row.picker.value + row.hex.slice(7), row.picker));
    row.alpha.addEventListener('input', () => {
      const alpha = Math.round((1 - Number(row.alpha.value) / 100) * 255).toString(16).padStart(2, '0');
      applyColor(row, row.hex.slice(0, 7) + alpha, row.alpha);
    });
    remove.addEventListener('click', () => {
      const index = rows.indexOf(row);
      rows.splice(index, 1);
      element.remove();
      updateCode();
      (rows[index]?.name ?? rows[index - 1]?.name ?? add).focus();
    });
    rows.push(row);
    palette.append(element);
    refreshLabels();
    return row;
  }

  tool.querySelector('#theme-detect').addEventListener('click', () => {
    const formats = [...tool.querySelectorAll('.theme-formats input:checked')].map(control => control.value);
    issues.replaceChildren();
    issues.hidden = true;
    if (!formats.length || !source.value.trim()) {
      detectionStatus.textContent = !formats.length ? 'Cochez au moins un format à détecter.' : 'Collez un texte contenant des couleurs.';
      return;
    }
    const detected = detectColors(source.value, formats);
    let added = 0;
    let duplicates = detected.duplicates;
    const existingColors = [];
    for (const color of detected.colors) {
      const existing = rows.find(row => row.hex === color.hex && row.role.value === 'background');
      if (existing) {
        duplicates++;
        existingColors.push(`${existing.name.value.trim() || 'Sans nom'} (${color.hex})`);
        continue;
      }
      appendColor(color.hex);
      added++;
    }
    detectionStatus.textContent = `${added} couleur(s) ajoutée(s), ${duplicates} doublon(s) ignoré(s).`
      + (existingColors.length ? ` Couleurs déjà présentes, non ajoutées : ${existingColors.join(', ')}.` : '')
      + (detected.colors.some(color => ['ral', 'cmyk'].includes(color.format)) ? ' RAL et CMJN : conversions sRGB approximatives.' : '')
      + (detected.issues.length ? ` ${detected.issues.length} valeur(s) non reconnue(s).` : '');
    for (const message of detected.issues.slice(0, 10)) {
      const li = document.createElement('li');
      li.textContent = message;
      issues.append(li);
    }
    if (detected.issues.length > 10) {
      const li = document.createElement('li');
      li.textContent = `Seules les 10 premières valeurs non reconnues sont affichées (${detected.issues.length} au total).`;
      issues.append(li);
    }
    issues.hidden = !detected.issues.length;
    updateCode();
    if (rows.length && !rows.some(row => row.role.value === 'text')) textDialog.showModal();
  });
  tool.querySelector('#theme-text-no').addEventListener('click', () => textDialog.close());
  tool.querySelector('#theme-text-yes').addEventListener('click', () => {
    for (const [hex, textName] of [['#000000', 'couleur_Texte_fondClair'], ['#FFFFFF', 'couleur_Texte_fondSombre']]) {
      if (!rows.some(row => row.hex === hex && row.role.value === 'text')) appendColor(hex, 'text', textName);
    }
    updateCode();
    textDialog.close();
  });
  add.addEventListener('click', () => {
    let value = 0;
    let hex = '#000000';
    const used = new Set(rows.filter(row => row.role.value === 'background').map(row => row.hex));
    while (used.has(hex) && value < 0xFFFFFF) hex = '#' + (++value).toString(16).padStart(6, '0').toUpperCase();
    if (used.has(hex)) {
      status.textContent = 'Toutes les couleurs opaques sont déjà présentes. Modifiez une couleur existante.';
      return;
    }
    appendColor(hex).name.focus();
    updateCode();
  });
  name.addEventListener('input', updateCode);
  for (const control of tool.querySelectorAll('[name="theme-locale"], [name="theme-target"]')) {
    control.addEventListener('change', () => {
      for (const row of rows) if (!row.colorError) row.fxInput.value = themeRgba(row.hex, locale());
      updateCode();
    });
  }
  for (const [button, field, message, label] of [
    [copy, output, status, 'Code Power Fx'],
    [screenCopy, screenOutput, screenStatus, 'Code YAML']
  ]) {
    button.addEventListener('click', async () => {
      const code = field.value;
      try {
        await navigator.clipboard.writeText(code);
        if (field.value === code) message.textContent = `${label} copié dans le presse-papier.`;
      } catch (error) {
        console.warn(`Copie du ${label} impossible :`, error);
        message.textContent = 'La copie a échoué. Sélectionnez le code et copiez-le manuellement.';
        field.focus();
        field.select();
      }
    });
  }
  window.addEventListener('pageshow', updateCode);
  tool.disabled = false;
  try {
    const imported = readHarmonyPalette(window.location.hash);
    if (imported) {
      tool.querySelector(`[name="theme-locale"][value="${imported.locale}"]`).checked = true;
      for (const hex of imported.backgrounds) appendColor(hex);
      for (const hex of imported.texts) appendColor(hex, 'text', hex === '#000000' ? 'couleur_Texte_fondClair' : 'couleur_Texte_fondSombre');
      detectionStatus.textContent = `Palette de l’harmoniseur importée : ${imported.backgrounds.length} fond(s), ${imported.texts.length} couleur(s) de texte.`;
    }
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    detectionStatus.textContent = error.message;
  }
  updateCode();
}
