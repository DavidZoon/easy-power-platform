import { powerFxHighlightTokens } from './powerfx.js';

// Power Apps YAML: keys, scalars, and Power Fx formulas after "=" (inline or in |- blocks).
export function yamlHighlightTokens(source) {
  const tokens = [];
  const lines = [];
  let position = 0;
  for (const text of source.split('\n')) {
    lines.push({ start: position, text });
    position += text.length + 1;
  }
  const formula = (start, end) => {
    for (const token of powerFxHighlightTokens(source.slice(start, end))) {
      if (token.style) tokens.push({ start: start + token.start, end: start + token.end, style: token.style });
    }
  };
  const scalar = (start, end) => {
    const value = source.slice(start, end);
    if (!value) return;
    if (value.startsWith('=')) formula(start + 1, end);
    else if (/^-?\d+(?:\.\d+)?$/.test(value) || /^(true|false|null)$/i.test(value)) tokens.push({ start, end, style: 'm' });
    else tokens.push({ start, end, style: 's' });
  };
  for (let index = 0; index < lines.length; index++) {
    const { start, text } = lines[index];
    const comment = text.match(/^(\s*)#/);
    if (comment) {
      tokens.push({ start: start + comment[1].length, end: start + text.length, style: 'c' });
      continue;
    }
    const entry = text.match(/^(\s*)(- )?([^\s:#-][^:]*?):(?=\s|$)/);
    if (!entry) {
      const item = text.match(/^(\s*)- (.+?)\s*$/);
      if (item) scalar(start + item[1].length + 2, start + item[1].length + 2 + item[2].length);
      continue;
    }
    const keyColumn = entry[1].length + (entry[2] ? 2 : 0);
    tokens.push({ start: start + keyColumn, end: start + keyColumn + entry[3].length, style: 'nt' });
    const rest = text.slice(entry[0].length);
    const valueStart = start + entry[0].length + (rest.length - rest.trimStart().length);
    const value = rest.trim();
    if (/^[|>][-+]?$/.test(value)) {
      let end = index + 1;
      while (end < lines.length && (!lines[end].text.trim() || lines[end].text.search(/\S/) > keyColumn)) end++;
      while (end > index + 1 && !lines[end - 1].text.trim()) end--;
      if (end > index + 1) {
        const blockStart = lines[index + 1].start;
        const blockEnd = lines[end - 1].start + lines[end - 1].text.length;
        const first = blockStart + source.slice(blockStart, blockEnd).search(/\S/);
        if (source[first] === '=') formula(first + 1, blockEnd);
        else tokens.push({ start: first, end: blockEnd, style: 's' });
      }
      index = end - 1;
    } else scalar(valueStart, valueStart + value.length);
  }
  return tokens.sort((a, b) => a.start - b.start);
}

export const highlighters = { powerfx: powerFxHighlightTokens, yaml: yamlHighlightTokens };

// Decorates a native textarea with a highlighted, aria-hidden layer that follows its scroll position.
export function createCodeEditor(textarea, highlight) {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-editor';
  const preview = document.createElement('pre');
  preview.className = 'highlight';
  preview.setAttribute('aria-hidden', 'true');
  const code = document.createElement('code');
  preview.append(code);
  textarea.before(wrapper);
  wrapper.append(preview, textarea);
  textarea.wrap = 'off';
  const editor = { textarea, code, scrollTop: 0, align, refresh };

  function align() {
    editor.scrollTop = textarea.scrollTop;
    code.style.transform = `translate(${-textarea.scrollLeft}px, ${-textarea.scrollTop}px)`;
  }

  function refresh() {
    const text = textarea.value;
    const fragment = document.createDocumentFragment();
    let offset = 0;
    for (const token of highlight(text)) {
      if (!token.style || token.start < offset) continue;
      fragment.append(document.createTextNode(text.slice(offset, token.start)));
      const span = document.createElement('span');
      span.className = token.style;
      span.textContent = text.slice(token.start, token.end);
      fragment.append(span);
      offset = token.end;
    }
    fragment.append(document.createTextNode(text.slice(offset) + '\n'));
    code.replaceChildren(fragment);
    align();
  }

  textarea.addEventListener('scroll', align);
  refresh();
  return editor;
}
