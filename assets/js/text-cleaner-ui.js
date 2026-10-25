import { cleanText } from './text-cleaner.js';

const tool = document.querySelector('[data-text-cleaner]');
if (tool) {
  const input = tool.querySelector('#cleaner-input');
  const output = tool.querySelector('#cleaner-output');
  const copy = tool.querySelector('#cleaner-copy');
  const status = tool.querySelector('#cleaner-status');
  const controls = [...tool.querySelectorAll('[data-option]')];
  const canCopy = Boolean(navigator.clipboard && window.isSecureContext);
  let source = input.value;
  let result = '';

  function update() {
    const options = Object.fromEntries(controls.map(control => [
      control.dataset.option, control.type === 'checkbox' ? control.checked : control.value
    ]));
    result = cleanText(source, options);
    output.value = result;
    copy.disabled = !result || !canCopy;
    status.textContent = !source ? '' : result === source
      ? 'Texte inchangé avec les options sélectionnées.'
      : result ? 'Texte nettoyé.' : 'Le nettoyage a supprimé tout le texte.';
    if (result && !canCopy) status.textContent += ' Copie automatique indisponible : sélectionnez le résultat et copiez-le manuellement.';
  }

  input.addEventListener('input', () => {
    source = input.value;
    update();
  });
  // Textareas normalize CR and CRLF to LF; retain the original pasted separators for copying.
  input.addEventListener('paste', event => {
    if (!event.clipboardData) return;
    event.preventDefault();
    const offsetInSource = position => {
      let index = 0;
      for (let count = 0; count < position && index < source.length; count++) {
        index += source.startsWith('\r\n', index) ? 2 : 1;
      }
      return index;
    };
    const start = offsetInSource(input.selectionStart);
    const end = offsetInSource(input.selectionEnd);
    const pasted = event.clipboardData.getData('text/plain');
    source = source.slice(0, start) + pasted + source.slice(end);
    input.setRangeText(pasted, input.selectionStart, input.selectionEnd, 'end');
    update();
  });
  for (const control of controls) control.addEventListener('change', update);
  tool.querySelector('#cleaner-select-all').addEventListener('click', () => {
    for (const control of controls) {
      if (control.type === 'checkbox') control.checked = true;
    }
    update();
  });
  tool.querySelector('#cleaner-reset').addEventListener('click', () => {
    for (const control of controls) {
      if (control.type === 'checkbox') control.checked = false;
      else control.value = 'keep';
    }
    update();
  });
  copy.addEventListener('click', async () => {
    const text = result;
    try {
      await navigator.clipboard.writeText(text);
      if (result === text) status.textContent = 'Texte nettoyé copié dans le presse-papier.';
    } catch (error) {
      console.warn('Copie du texte nettoyé impossible :', error);
      status.textContent = 'La copie a échoué. Sélectionnez le résultat et copiez-le manuellement.';
      output.focus();
      output.select();
    }
  });
  window.addEventListener('pageshow', update);
  tool.disabled = false;
  update();
}
