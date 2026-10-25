export function cleanText(input, options = {}) {
  let text = input;
  if (options.normalizeUnicode) text = text.normalize('NFC');
  if (options.accents) text = text.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');
  if (options.quotes) text = text.replace(/[‘’‚‛]/g, "'").replace(/[“”„‟«»]/g, '"');
  if (options.punctuation) text = text.replace(/\p{P}/gu, '');
  if (options.invisibleCharacters) text = text.replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');
  if (options.nonBreakingSpaces) text = text.replace(/[\u00A0\u202F]/g, ' ');
  if (options.tabs === 'remove') text = text.replace(/\t/g, '');
  else if (['1', '2', '4'].includes(options.tabs)) text = text.replace(/\t/g, ' '.repeat(Number(options.tabs)));
  if (options.multipleSpaces) text = text.replace(/ {2,}/g, ' ');

  if (options.trimStart || options.trimEnd || options.emptyLines || options.collapseEmptyLines || options.duplicateLines) {
    const parts = text.split(/(\r\n|\r|\n)/);
    const lines = [];
    const seen = new Set();
    let previousEmpty = false;
    for (let index = 0; index < parts.length; index += 2) {
      let line = parts[index];
      if (options.trimStart) line = line.replace(/^[^\S\r\n]+/u, '');
      if (options.trimEnd) line = line.replace(/[^\S\r\n]+$/u, '');
      const empty = /^\s*$/u.test(line);
      if (options.emptyLines && empty) continue;
      if (options.collapseEmptyLines && empty && previousEmpty) continue;
      if (options.duplicateLines && seen.has(line)) continue;
      seen.add(line);
      lines.push({ text: line, separator: parts[index + 1] ?? '' });
      previousEmpty = empty;
    }
    // Keep the separator of each retained line, but never invent a trailing line.
    text = lines.map((line, index) => line.text + (index < lines.length - 1 ? line.separator : '')).join('');
  }

  if (options.carriageReturns === 'normalize') text = text.replace(/\r\n?/g, '\n');
  else if (options.carriageReturns === 'remove') text = text.replace(/\r/g, '');
  if (options.lineBreaks === 'space') text = text.replace(/\r\n|\r|\n/g, ' ');
  else if (options.lineBreaks === 'remove') text = text.replace(/\r\n|\r|\n/g, '');
  if (options.letterCase === 'lower') text = text.toLocaleLowerCase('fr');
  else if (options.letterCase === 'upper') text = text.toLocaleUpperCase('fr');
  return text;
}
