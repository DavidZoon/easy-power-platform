import { normalizeSvg, uniqueSvgName, imageNameErrors, generateSvgLibrary, svgImageExpression, svgImageReference, parseSvgLibrary } from './svg-library.js';
import { validateSvgExcel, excelTableName, createSvgWorkbook, readSvgWorkbook } from './svg-library-excel.js';
import { generateSvgScreen } from './svg-library-screen.js';
import { createCodeEditor, highlighters } from './code-editor.js';

const tool = document.querySelector('[data-svg-library]');
if (tool) {
  const find = id => tool.querySelector(`#svg-${id}`);
  const source = find('source');
  const files = find('files');
  const sources = find('sources');
  const pendingList = find('pending');
  const clearFiles = find('clear-files');
  const importStatus = find('import-status');
  const importErrors = find('import-errors');
  const name = find('library-name');
  const nameError = find('name-error');
  const gallery = find('gallery');
  const galleryStatus = find('gallery-status');
  const copyMode = find('copy-mode');
  const output = find('output');
  const outputStatus = find('output-status');
  const copyLibrary = find('copy-library');
  const example = find('image-example');
  const exportButton = find('export');
  const excelStatus = find('excel-status');
  const manualPanel = find('manual-panel');
  const manual = find('manual');
  const editor = createCodeEditor(output, highlighters.powerfx);
  const screen = find('screen');
  const screenStatus = find('screen-status');
  const copyScreen = find('copy-screen');
  const screenEditor = createCodeEditor(screen, highlighters.yaml);
  const deleteDialog = find('delete-dialog');
  let deleting = null;
  const template = document.querySelector('#svg-card-template');
  const images = [];
  let pending = [];
  let counter = 0;
  let id = 0;
  let importing = false;
  let exporting = false;
  const sourceMode = () => tool.querySelector('[name="svg-source-mode"]:checked').value;
  const locale = () => tool.querySelector('[name="svg-locale"]:checked').value;

  function showPending() {
    pendingList.replaceChildren(...pending.map(file => {
      const item = document.createElement('li');
      item.textContent = file.name;
      return item;
    }));
    clearFiles.disabled = !pending.length;
  }

  function refresh() {
    find('empty').hidden = images.length > 0;
    const errors = imageNameErrors(images);
    images.forEach((image, index) => {
      image.input.setAttribute('aria-invalid', String(Boolean(errors[index])));
      image.error.textContent = errors[index];
      image.error.hidden = !errors[index];
      image.preview.alt = `Aperçu de ${image.name.trim() || 'l’image sans nom'}`;
      const label = image.name.trim() || `l’image ${image.id}`;
      image.copy.setAttribute('aria-label', `Copier ${label} (${copyMode.value === 'raw' ? 'SVG brut' : 'expression Power Fx'})`);
      image.copy.title = image.copy.getAttribute('aria-label');
      image.remove.setAttribute('aria-label', `Supprimer ${label}`);
      image.remove.title = image.remove.getAttribute('aria-label');
    });
    nameError.textContent = !name.value.trim() || /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(name.value)
      ? 'Donnez un nom de bibliothèque sans caractères de contrôle.' : '';
    nameError.hidden = !nameError.textContent;
    name.setAttribute('aria-invalid', String(Boolean(nameError.textContent)));
    output.value = '';
    screen.value = '';
    copyScreen.disabled = true;
    example.value = '';
    copyLibrary.disabled = true;
    exportButton.disabled = true;
    try {
      output.value = generateSvgLibrary(name.value, images, locale());
      screen.value = generateSvgScreen(name.value, images);
      copyScreen.disabled = false;
      screenStatus.textContent = `Écran YAML prêt : ${images.length} image(s), quatre boutons de copie par vignette.`;
      example.value = svgImageReference(name.value, images[0].name);
      copyLibrary.disabled = false;
      outputStatus.textContent = `Formule prête pour App.Formulas (${locale().toUpperCase()}) : ${images.length} image(s), SVG bruts.`;
      try {
        validateSvgExcel(name.value, images);
        exportButton.disabled = exporting;
        if (!exporting) excelStatus.textContent = `Tableau Excel : ${excelTableName(name.value)} — ${images.length} colonne(s), une ligne de données.`;
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        excelStatus.textContent = error.message;
      }
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      outputStatus.textContent = error.message;
      screenStatus.textContent = error.message;
      excelStatus.textContent = 'Corrigez la bibliothèque pour exporter le tableau Excel.';
    }
    editor.refresh();
    screenEditor.refresh();
  }

  async function copyText(value, status, target = null) {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Presse-papier indisponible dans ce contexte.');
      await navigator.clipboard.writeText(value);
      status.textContent = 'Contenu copié dans le presse-papier.';
    } catch (error) {
      if (!target) {
        manualPanel.hidden = false;
        manual.value = value;
        target = manual;
      }
      target.focus();
      target.select();
      status.textContent = `La copie automatique a échoué : ${error.message} Le contenu est sélectionné ; copiez-le manuellement.`;
    }
  }

  function addImage(svg, proposed) {
    const image = { id: ++id, svg, name: uniqueSvgName(proposed, images.map(item => item.name)) };
    const fragment = template.content.cloneNode(true);
    image.card = fragment.querySelector('li');
    image.input = fragment.querySelector('input');
    image.error = fragment.querySelector('.svg-card-error');
    image.preview = fragment.querySelector('img');
    image.copy = fragment.querySelector('.svg-card-copy');
    image.remove = fragment.querySelector('.svg-card-remove');
    image.input.value = image.name;
    image.input.id = `svg-image-name-${image.id}`;
    image.input.closest('label').querySelector('span').textContent = `Nom de l’image ${image.id}`;
    image.error.id = `svg-image-error-${image.id}`;
    image.input.setAttribute('aria-describedby', image.error.id);
    image.preview.addEventListener('error', () => {
      const error = image.card.querySelector('.svg-preview-error');
      error.textContent = 'Aperçu indisponible : vérifiez le rendu de ce SVG dans Power Apps.';
      error.hidden = false;
    });
    image.preview.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    image.input.addEventListener('input', () => {
      image.name = image.input.value;
      refresh();
    });
    image.copy.addEventListener('click', () => {
      manualPanel.hidden = true;
      copyText(copyMode.value === 'raw' ? image.svg : svgImageExpression(image.svg), galleryStatus);
    });
    image.remove.addEventListener('click', () => {
      deleting = image;
      find('delete-message').textContent = `L’image « ${image.name} » sera retirée de la bibliothèque. Cette action est irréversible.`;
      deleteDialog.showModal();
    });
    images.push(image);
    gallery.append(fragment);
  }

  find('delete-cancel').addEventListener('click', () => deleteDialog.close());
  find('delete-confirm').addEventListener('click', () => deleteDialog.close('delete'));
  deleteDialog.addEventListener('close', () => {
    const image = deleting;
    deleting = null;
    if (!image) return;
    if (deleteDialog.returnValue !== 'delete') {
      image.remove.focus();
      return;
    }
    const index = images.indexOf(image);
    images.splice(index, 1);
    image.card.remove();
    manualPanel.hidden = true;
    galleryStatus.textContent = `Image « ${image.name} » supprimée.`;
    refresh();
    (images[index]?.input ?? images[index - 1]?.input ?? name).focus();
  });
  deleteDialog.addEventListener('cancel', () => { deleteDialog.returnValue = ''; });

  files.addEventListener('change', () => {
    pending.push(...files.files);
    files.value = '';
    showPending();
  });
  clearFiles.addEventListener('click', () => {
    pending = [];
    showPending();
  });
  for (const radio of tool.querySelectorAll('[name="svg-source-mode"]')) radio.addEventListener('change', () => {
    find('files-panel').hidden = sourceMode() !== 'files';
    find('code-panel').hidden = sourceMode() !== 'code';
  });
  const dropZone = find('drop-zone');
  for (const eventName of ['dragenter', 'dragover']) dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    if (!importing) dropZone.dataset.dragging = '';
  });
  for (const eventName of ['dragleave', 'drop']) dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    delete dropZone.dataset.dragging;
    if (eventName === 'drop' && !importing) {
      const dropped = [...event.dataTransfer.files];
      if (!dropped.length) {
        importStatus.textContent = 'Déposez des fichiers SVG ou Excel, pas un lien ni du texte.';
        return;
      }
      pending.push(...dropped);
      showPending();
    }
  });

  find('add').addEventListener('click', async () => {
    if (importing) return;
    const mode = sourceMode();
    if (mode === 'files' && !pending.length) {
      importStatus.textContent = 'Choisissez ou déposez au moins un fichier SVG ou Excel.';
      return;
    }
    importing = true;
    sources.disabled = true;
    importErrors.replaceChildren();
    importErrors.hidden = true;
    importStatus.textContent = 'Lecture et validation des SVG…';
    const batch = mode === 'files' ? [...pending] : [{ name: 'Code collé', text: async () => source.value }];
    const rejected = [];
    let added = 0;
    try {
      for (const file of batch) {
        try {
          let library;
          if (mode === 'files' && /\.xlsx$/i.test(file.name)) {
            library = await readSvgWorkbook(await file.arrayBuffer());
          } else {
            if (mode === 'files' && !/\.svg$/i.test(file.name)) throw new RangeError('Seuls les fichiers .svg et .xlsx sont acceptés.');
            const text = await file.text();
            library = mode === 'code' && text.trim() && !text.trimStart().startsWith('<')
              ? parseSvgLibrary(text)
              : { images: [{ name: mode === 'files' ? file.name.replace(/\.svg$/i, '') : `Image${++counter}`, svg: text }] };
          }
          if (library.name && images.length && library.name.trim() !== name.value.trim()) {
            throw new RangeError(`Cette source appartient à « ${library.name} », pas à « ${name.value.trim()} ». Videz la bibliothèque ou modifiez son nom avant cet import.`);
          }
          const entries = library.images.map(image => ({ name: image.name, svg: normalizeSvg(image.svg) }));
          if (library.name) name.value = library.name;
          for (const image of entries) addImage(image.svg, image.name);
          added += entries.length;
        } catch (error) {
          if (!(error instanceof RangeError || error instanceof DOMException || error instanceof TypeError)) throw error;
          rejected.push(file);
          const issue = document.createElement('li');
          issue.textContent = `${file.name} : ${error.message}`;
          importErrors.append(issue);
        }
      }
      if (mode === 'files') pending = rejected;
      else if (added) source.value = '';
      importErrors.hidden = !rejected.length;
      importStatus.textContent = `${added} image(s) ajoutée(s), ${rejected.length} source(s) refusée(s). ${images.length} image(s) dans la bibliothèque.`;
      showPending();
      refresh();
    } finally {
      importing = false;
      sources.disabled = false;
    }
  });

  name.addEventListener('input', refresh);
  copyMode.addEventListener('change', refresh);
  for (const radio of tool.querySelectorAll('[name="svg-locale"]')) radio.addEventListener('change', refresh);
  for (const button of tool.querySelectorAll('[data-svg-size]')) button.addEventListener('click', () => {
    gallery.dataset.size = button.dataset.svgSize;
    for (const other of tool.querySelectorAll('[data-svg-size]')) other.setAttribute('aria-pressed', String(other === button));
  });
  copyLibrary.addEventListener('click', () => copyText(output.value, outputStatus, output));
  copyScreen.addEventListener('click', () => copyText(screen.value, screenStatus, screen));
  exportButton.addEventListener('click', async () => {
    if (exporting) return;
    exporting = true;
    exportButton.disabled = true;
    const libraryName = name.value;
    const snapshot = images.map(image => ({ name: image.name, svg: image.svg }));
    excelStatus.textContent = 'Génération du classeur Excel…';
    let url;
    try {
      const buffer = await createSvgWorkbook(libraryName, snapshot);
      url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${excelTableName(libraryName)}.xlsx`;
      document.body.append(link);
      link.click();
      link.remove();
      excelStatus.textContent = `Téléchargement lancé : ${excelTableName(libraryName)}.xlsx, tableau ${excelTableName(libraryName)}, ${snapshot.length} colonne(s) et une ligne de SVG bruts.`;
    } catch (error) {
      excelStatus.textContent = `Échec de l’export Excel : ${error.message}`;
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
      exporting = false;
      try {
        validateSvgExcel(name.value, images);
        exportButton.disabled = false;
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        exportButton.disabled = true;
      }
    }
  });
  tool.disabled = false;
  refresh();
}
