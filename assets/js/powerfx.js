// Literal text is never rewritten, including the text portions of interpolated strings.
function tokenize(source) {
  const tokens = [];
  let index = 0;
  let valid = true;
  const add = (start, kind) => tokens.push({ start, end: index, text: source.slice(start, index), kind });
  function quoted(quote) {
    index++;
    while (index < source.length) {
      if (source[index++] !== quote) continue;
      if (source[index] === quote) { index++; continue; }
      return;
    }
    valid = false;
  }
  function interpolated() {
    let start = index;
    index += 2;
    while (index < source.length) {
      if (source[index] === '"' && source[index + 1] !== '"') {
        index++;
        add(start, 'literal');
        return;
      }
      if (['""', '{{', '}}'].includes(source.slice(index, index + 2))) { index += 2; continue; }
      if (source[index] === '{') {
        index++;
        add(start, 'literal');
        code(true);
        start = index;
      } else index++;
    }
    add(start, 'literal');
    valid = false;
  }
  function code(interpolation = false) {
    const stack = [];
    while (index < source.length) {
      const start = index;
      const char = source[index];
      if (interpolation && char === '}' && !stack.length) { index++; return; }
      if (source.startsWith('//', index)) {
        const end = source.indexOf('\n', index);
        index = end < 0 ? source.length : end;
        add(start, 'literal');
      } else if (source.startsWith('/*', index)) {
        const end = source.indexOf('*/', index + 2);
        if (end < 0) valid = false;
        index = end < 0 ? source.length : end + 2;
        add(start, 'literal');
      } else if (source.startsWith('$"', index)) interpolated();
      else if (char === '"' || char === "'") {
        quoted(char);
        add(start, 'literal');
      } else if (/\s/.test(char)) {
        index++;
      } else {
        const number = source.slice(index).match(/^\d+(?:[eE][+-]?\d+)?/);
        const name = source.slice(index).match(/^[\p{L}_][\p{L}\p{N}_]*/u);
        if (number) index += number[0].length;
        else if (name) index += name[0].length;
        else if (source.startsWith(';;', index)) index += 2;
        else index++;
        add(start, number ? 'number' : name ? 'name' : 'punctuation');
        tokens.at(-1).depth = stack.length;
        if ('([{'.includes(char)) stack.push(char);
        if (')]}'.includes(char) && stack.pop() !== { ')': '(', ']': '[', '}': '{' }[char]) valid = false;
      }
    }
    if (stack.length || interpolation) valid = false;
  }
  code();
  return { tokens, valid };
}

function decimal(tokens, index, source) {
  const token = tokens[index];
  const previous = tokens[index - 1];
  const next = tokens[index + 1];
  const left = previous?.kind === 'number' && previous.end === token.start;
  const right = next?.kind === 'number' && next.start === token.end;
  // A leading decimal is valid (.5 / ,5), but a member access is not a decimal.
  const leading = right && (!previous || /[({[=:,+*/<>;&|!-]$/.test(previous.text));
  return (left && (right || (token.text === '.' && !/[\p{L}\p{N}_]/u.test(source[token.end] || ' ')))) || leading;
}

export function browserSeparator(locale) {
  return new Intl.NumberFormat(locale).formatToParts(1.5).some(part => part.type === 'decimal' && part.value === ',')
    ? 'semicolon' : 'comma';
}

export function analyzePowerFx(source, hint) {
  const { tokens, valid } = tokenize(source);
  if (!valid) return { mode: null, tokens };
  if (hint === 'comma' || hint === 'semicolon') return { mode: hint, tokens };
  const punctuation = tokens.filter(token => token.kind === 'punctuation');
  const commas = punctuation.filter(token => token.text === ',');
  const semicolons = punctuation.filter(token => token.text === ';');
  const double = punctuation.some(token => token.text === ';;');
  const dotDecimal = tokens.some((token, i) => token.text === '.' && decimal(tokens, i, source));
  const commaEvidence = commas.some(token => !decimal(tokens, tokens.indexOf(token), source));
  if (double) return { mode: commaEvidence || dotDecimal ? null : 'semicolon', tokens };
  if (commaEvidence || dotDecimal) {
    // A single semicolon can chain English actions, but mixed-language examples must remain untouched.
    const chainsOnly = semicolons.every(token => token.depth === 0 || [')', '}'].includes(tokens[tokens.indexOf(token) - 1]?.text));
    return { mode: semicolons.length && !chainsOnly ? null : 'comma', tokens };
  }
  if (semicolons.length) {
    const argumentSeparator = semicolons.some(token => token.depth > 0 && ![')', '}'].includes(tokens[tokens.indexOf(token) - 1]?.text));
    return { mode: argumentSeparator ? 'semicolon' : null, tokens };
  }
  if (commas.length) return { mode: null, tokens };
  return { mode: 'neutral', tokens };
}

export function powerFxEdits(source, target, hint) {
  const { mode, tokens } = analyzePowerFx(source, hint);
  if (!mode || mode === 'neutral' || mode === target) return [];
  return tokens.flatMap((token, i) => {
    if (token.kind !== 'punctuation') return [];
    let text = token.text;
    if (mode === 'comma') {
      if (text === ',') text = ';';
      else if (text === ';') text = ';;';
      else if (text === '.' && decimal(tokens, i, source)) text = ',';
    } else {
      if (text === ';;') text = ';';
      else if (text === ';') text = ',';
      else if (text === ',') text = '.';
    }
    return text === token.text ? [] : [{ start: token.start, end: token.end, text }];
  });
}

export function convertPowerFx(source, target, hint) {
  return powerFxEdits(source, target, hint).reverse().reduce((result, edit) =>
    result.slice(0, edit.start) + edit.text + result.slice(edit.end), source);
}

export function initializePowerFx(content, locale = navigator.language) {
  const preferred = browserSeparator(locale);
  content.querySelectorAll('[data-powerfx]').forEach(block => {
    const code = block.querySelector('pre code');
    const select = block.querySelector('[data-powerfx-select]');
    const control = block.querySelector('[data-powerfx-control]');
    const status = block.querySelector('[data-powerfx-status]');
    if (!code || !select || !control || !status) return;
    const original = code.cloneNode(true);
    const source = code.textContent;
    const hint = block.dataset.powerfx;
    const { mode } = analyzePowerFx(source, hint);
    control.hidden = false;
    if (!mode) {
      select.disabled = true;
      status.hidden = false;
      status.textContent = 'Syntaxe ambiguë ou mixte : code original conservé.';
      return;
    }
    function render() {
      code.replaceChildren(...original.cloneNode(true).childNodes);
      // Edit text ranges, not HTML: keep Rouge highlighting and never interpret code as markup.
      for (const edit of powerFxEdits(source, select.value, hint).reverse()) {
        const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
        let offset = 0;
        let node;
        const range = document.createRange();
        while ((node = walker.nextNode())) {
          const end = offset + node.length;
          if (edit.start >= offset && edit.start < end) range.setStart(node, edit.start - offset);
          if (edit.end > offset && edit.end <= end) {
            range.setEnd(node, edit.end - offset);
            break;
          }
          offset = end;
        }
        range.deleteContents();
        range.insertNode(document.createTextNode(edit.text));
      }
    }
    select.value = preferred;
    select.addEventListener('change', render);
    render();
  });
}
