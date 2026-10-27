import { analyzePowerFx, convertPowerFx, powerFxHighlightTokens } from './powerfx.js';

const converter = document.querySelector('[data-powerfx-converter]');
if (converter) {
  const source = converter.querySelector('#powerfx-input');
  const output = converter.querySelector('#powerfx-output');
  const format = converter.querySelector('#powerfx-source-format');
  const detected = converter.querySelector('#powerfx-detected');
  const outputLabel = converter.querySelector('#powerfx-output-label');
  const copy = converter.querySelector('#powerfx-copy');
  const status = converter.querySelector('#powerfx-conversion-status');
  const languages = { comma: 'EN', semicolon: 'FR' };
  const canCopy = Boolean(navigator.clipboard && window.isSecureContext);
  converter.disabled = false;

  const editors = [source, output].map(textarea => {
    const wrapper = document.createElement('div');
    wrapper.className = 'powerfx-editor';
    const preview = document.createElement('pre');
    preview.className = 'highlight';
    preview.setAttribute('aria-hidden', 'true');
    const code = document.createElement('code');
    preview.append(code);
    textarea.before(wrapper);
    wrapper.append(preview, textarea);
    textarea.wrap = 'off';
    return { textarea, code, scrollTop: 0 };
  });

  function alignPreview(editor) {
    const { textarea, code } = editor;
    editor.scrollTop = textarea.scrollTop;
    code.style.transform = `translate(${-textarea.scrollLeft}px, ${-textarea.scrollTop}px)`;
  }

  function highlight() {
    for (const editor of editors) {
      const { textarea, code } = editor;
      const text = textarea.value;
      const fragment = document.createDocumentFragment();
      let offset = 0;
      for (const token of powerFxHighlightTokens(text)) {
        fragment.append(document.createTextNode(text.slice(offset, token.start)));
        const span = document.createElement('span');
        span.className = token.style;
        span.textContent = text.slice(token.start, token.end);
        fragment.append(span);
        offset = token.end;
      }
      fragment.append(document.createTextNode(text.slice(offset) + '\n'));
      code.replaceChildren(fragment);
      alignPreview(editor);
    }
    output.scrollTop = source.scrollTop;
    alignPreview(editors[1]);
  }

  editors.forEach((editor, index) => {
    editor.textarea.addEventListener('scroll', () => {
      const other = editors[1 - index];
      if (editor.textarea.scrollTop !== editor.scrollTop) {
        other.textarea.scrollTop = editor.textarea.scrollTop;
      }
      alignPreview(editor);
      alignPreview(other);
    });
  });

  function render() {
    const scrollTop = source.scrollTop;
    convert();
    source.scrollTop = scrollTop;
    highlight();
  }

  function convert() {
    const text = source.value;
    const hint = format.value === 'auto' ? undefined : format.value;
    const { mode } = analyzePowerFx(text, hint);
    output.value = '';
    copy.disabled = true;
    outputLabel.textContent = 'Code converti';
    detected.textContent = 'Format : en attente';
    status.textContent = '';
    if (!text.trim()) return;
    if (!mode) {
      detected.textContent = 'Format indéterminé';
      status.textContent = 'Syntaxe ambiguë, mixte ou incomplète : vérifiez votre code et précisez le format source EN ou FR si nécessaire.';
      return;
    }
    if (mode === 'neutral') {
      detected.textContent = 'Format neutre';
      output.value = text;
      status.textContent = 'Aucun séparateur régional détecté : le code est identique en EN et en FR.';
    } else {
      const target = mode === 'comma' ? 'semicolon' : 'comma';
      detected.textContent = `Format ${hint ? 'source' : 'détecté'} : ${languages[mode]}`;
      outputLabel.textContent = `Conversion au format ${languages[target]}`;
      output.value = convertPowerFx(text, target, hint);
      status.textContent = `Conversion ${languages[mode]} vers ${languages[target]}.`;
    }
    copy.disabled = !canCopy;
    if (!canCopy) status.textContent += ' Copie automatique indisponible : sélectionnez le résultat et copiez-le manuellement.';
  }

  source.addEventListener('input', render);
  format.addEventListener('change', render);
  copy.addEventListener('click', async () => {
    const text = output.value;
    try {
      await navigator.clipboard.writeText(text);
      if (output.value === text) status.textContent = 'Code converti copié dans le presse-papier.';
    } catch (error) {
      console.warn('Copie du code Power Fx impossible :', error);
      status.textContent = 'La copie a échoué. Sélectionnez le résultat et copiez-le manuellement.';
      output.focus();
      output.select();
    }
  });
  render();
}
