import { hslToHex, hexToRgb, contrastRatio, contrastLevel } from './color-harmonizer.js';
import { htmlColors, ralClassic } from './theme-color-references.js';

export const colorFormats = ['powerfx', 'hex', 'rgb', 'hsl', 'cmyk', 'html', 'ral'];
const own = (object, key) => Object.hasOwn(object, key);
const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

export function normalizeThemeHex(value) {
  if (/^0x/i.test(value.trim()) && !/^0x(?:[a-f\d]{6}|[a-f\d]{8})$/i.test(value.trim())) return null;
  let hex = value.trim().replace(/^0x/i, '#').replace(/^#/, '');
  if (!/^(?:[a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(hex)) return null;
  if (hex.length <= 4) hex = [...hex].map(char => char + char).join('');
  hex = hex.toUpperCase();
  if (hex.length === 8 && hex.endsWith('00')) return '#00000000';
  if (hex.length === 8 && hex.endsWith('FF')) hex = hex.slice(0, 6);
  return '#' + hex;
}

function number(value, max, percent = false) {
  const isPercent = value.endsWith('%');
  const token = isPercent ? value.slice(0, -1) : value;
  if (!numeric.test(token) || (isPercent && !percent)) return null;
  const parsed = Number(token);
  if (parsed < 0 || parsed > (isPercent ? 100 : max)) return null;
  return isPercent ? parsed * max / 100 : parsed;
}

function rgbaHex(channels, alpha = 1) {
  const rgb = '#' + channels.map(value => Math.round(value).toString(16).padStart(2, '0')).join('');
  return normalizeThemeHex(rgb + Math.round(alpha * 255).toString(16).padStart(2, '0'));
}

function components(body, french = false) {
  if (french) return body.split(';').map(value => value.trim().replace(',', '.'));
  if (body.includes(',')) return body.split(',').map(value => value.trim());
  const sections = body.trim().split(/\s*\/\s*/);
  if (sections.length > 2) return [];
  return [...sections[0].split(/\s+/), ...(sections.length === 2 ? [sections[1]] : [])];
}

function functionColor(name, body, format) {
  const lower = name.toLowerCase();
  if (lower === 'colorvalue') {
    const match = body.trim().match(/^"([^"]*)"$/);
    if (!match) return null;
    const name = match[1].toLowerCase();
    return normalizeThemeHex(match[1]) ?? (own(htmlColors, name) ? htmlColors[name] : null);
  }
  const french = body.includes(';');
  const parts = components(body, french);
  if (['rgb', 'rgba'].includes(lower)) {
    const powerfx = format === 'powerfx';
    if (powerfx && (lower !== 'rgba' || !/[;,]/.test(body) || body.includes('/'))) return null;
    if (parts.length !== 3 && parts.length !== 4) return null;
    if ((powerfx || lower === 'rgba') && parts.length !== 4) return null;
    const channels = parts.slice(0, 3).map(value => number(value, 255, !powerfx));
    const alpha = parts.length === 4 ? number(parts[3], 1, !powerfx) : 1;
    if (channels.includes(null) || alpha === null) return null;
    return rgbaHex(channels, alpha);
  }
  if (['hsl', 'hsla'].includes(lower)) {
    if (parts.length !== 3 && parts.length !== 4) return null;
    const hueMatch = parts[0].match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(deg|rad|grad|turn)?$/i);
    if (!hueMatch || !parts[1].endsWith('%') || !parts[2].endsWith('%')) return null;
    const units = { deg: 1, rad: 180 / Math.PI, grad: .9, turn: 360 };
    const h = Number(hueMatch[1]) * (units[hueMatch[2]?.toLowerCase() ?? 'deg']);
    const s = number(parts[1], 100, true);
    const l = number(parts[2], 100, true);
    const alpha = parts.length === 4 ? number(parts[3], 1, true) : 1;
    if (!Number.isFinite(h) || s === null || l === null || alpha === null) return null;
    return rgbaHex(hexToRgb(hslToHex({ h, s, l })), alpha);
  }
  if (['cmyk', 'cmjn', 'device-cmyk'].includes(lower)) {
    if (parts.length !== 4) return null;
    const values = parts.map(value => number(value, 1, true));
    if (values.includes(null)) return null;
    const [c, m, y, k] = values;
    return rgbaHex([c, m, y].map(value => 255 * (1 - value) * (1 - k)));
  }
  return null;
}

function classify(token) {
  if (/^(?:#|0x)/i.test(token)) return 'hex';
  if (/^RAL/i.test(token)) return 'ral';
  if (/^Color\s*\./i.test(token) || /^ColorValue\s*\(/i.test(token)) return 'powerfx';
  const name = token.slice(0, token.indexOf('(')).trim();
  if (name === 'RGBA' || (/^rgba?\s*\(/i.test(token) && token.includes(';'))) return 'powerfx';
  if (/^rgba?\s*\(/i.test(token)) return 'rgb';
  if (/^hsla?\s*\(/i.test(token)) return 'hsl';
  if (/^(?:cmyk|cmjn|device-cmyk)\s*\(/i.test(token)) return 'cmyk';
  return 'html';
}

function readToken(token, format) {
  if (format === 'hex') return normalizeThemeHex(token);
  if (format === 'ral') {
    const code = token.match(/\d{4}/)?.[0];
    return own(ralClassic, code) ? ralClassic[code] : null;
  }
  if (/^Color\s*\./i.test(token)) {
    const name = token.replace(/^Color\s*\.\s*/i, '').toLowerCase();
    return own(htmlColors, name) ? htmlColors[name] : null;
  }
  if (format === 'html') return own(htmlColors, token.toLowerCase()) ? htmlColors[token.toLowerCase()] : null;
  const match = token.match(/^([\w-]+)\s*\(([\s\S]*)\)$/);
  return match ? functionColor(match[1], match[2], format) : null;
}

// Match literals only; never evaluate pasted code or expressions.
const colorTokens = /(?<![\p{L}\p{N}_#])(?:ColorValue\s*\([^()]*\)|(?:rgba?|hsla?|cmyk|cmjn|device-cmyk)\s*\([^()]*\)|Color\s*\.\s*[a-z]+|RAL[\s-]*\d{4}(?![\p{L}\p{N}_])|#[a-z\d]+|0x[a-z\d]+|[a-z]+)(?![\p{L}\p{N}_])/giu;

export function detectColors(text, enabledFormats = colorFormats) {
  const enabled = new Set(enabledFormats);
  const colors = [];
  const issues = [];
  const seen = new Set();
  let recognized = 0;
  for (const match of text.matchAll(colorTokens)) {
    const token = match[0];
    const candidates = /^rgba\s*\(/i.test(token) && !token.includes(';')
      ? ['powerfx', 'rgb'] : [classify(token)];
    const selected = candidates.filter(format => enabled.has(format));
    if (!selected.length) continue;
    let hex = null;
    let format = selected[0];
    for (const candidate of selected) {
      hex = readToken(token, candidate);
      if (hex) { format = candidate; break; }
    }
    if (!hex) {
      if (format !== 'html') issues.push(`Valeur non reconnue : ${token}`);
      continue;
    }
    recognized++;
    if (!seen.has(hex)) {
      colors.push({ hex, source: token, format });
      seen.add(hex);
    }
  }
  return { colors, issues, duplicates: recognized - colors.length };
}

export function parseThemeColor(value) {
  const token = value.trim();
  const hex = normalizeThemeHex(token);
  if (hex) return hex;
  if (!/^(?:RGBA\s*\([^()]*\)|ColorValue\s*\([^()]*\)|Color\s*\.\s*[a-z]+)$/i.test(token)) return null;
  return readToken(token, 'powerfx');
}

export function themeAlpha(hex) {
  const normalized = normalizeThemeHex(hex);
  if (!normalized) throw new RangeError('Couleur HEX invalide');
  const alphaByte = normalized.length === 9 ? parseInt(normalized.slice(7), 16) : 255;
  let alpha = alphaByte / 255;
  // Use the shortest decimal that round-trips to the same 8-bit alpha.
  for (let digits = 0; digits <= 3; digits++) {
    const rounded = Number(alpha.toFixed(digits));
    if (Math.round(rounded * 255) === alphaByte) {
      alpha = rounded;
      break;
    }
  }
  return alpha;
}

export function themeRgba(hex, locale = 'fr') {
  const normalized = normalizeThemeHex(hex);
  if (!normalized) throw new RangeError('Couleur HEX invalide');
  if (!['fr', 'en'].includes(locale)) throw new RangeError('Langue Power Fx invalide');
  const values = [...hexToRgb(normalized.slice(0, 7)), themeAlpha(normalized)];
  return `RGBA(${values.map(value => locale === 'fr' ? String(value).replace('.', ',') : String(value)).join(locale === 'fr' ? '; ' : ', ')})`;
}

export function powerFxIdentifier(name) {
  return /^[A-Za-z_][A-Za-z_0-9]*$/.test(name) && !/^(?:true|false|blank|as|in|exactin|and|or|not|self|parent|thisrecord|thisitem)$/i.test(name)
    ? name : "'" + name.replaceAll("'", "''") + "'";
}

export function readHarmonyPalette(fragment) {
  const params = new URLSearchParams(fragment.replace(/^#/, ''));
  if (!params.has('palette')) return null;
  const readColors = (key, max) => {
    const values = (params.get(key) ?? '').split(',');
    if (!values.length || values.length > max || values.some(value => !/^#[a-f\d]{6}$/i.test(value))) {
      throw new RangeError('Palette transmise invalide. Ouvrez à nouveau la palette depuis l’harmoniseur.');
    }
    return [...new Set(values.map(normalizeThemeHex))];
  };
  const backgrounds = readColors('palette', 5);
  const texts = readColors('texts', 2);
  if (texts.some(hex => !['#000000', '#FFFFFF'].includes(hex)) || !['fr', 'en'].includes(params.get('locale'))) {
    throw new RangeError('Couleurs de texte ou langue de la palette transmise invalides.');
  }
  return { backgrounds, texts, locale: params.get('locale') };
}

export function themeCombinations(colors) {
  const opaque = colors.filter(color => normalizeThemeHex(color.hex)?.length === 7);
  const texts = opaque.filter(color => color.role === 'text');
  const combinations = [];
  for (const background of opaque.filter(color => (color.role ?? 'background') === 'background')) {
    let best = null;
    for (const text of texts) {
      const ratio = contrastRatio(background.hex, text.hex);
      if (!best || ratio > best.ratio) best = { background, text, ratio, level: contrastLevel(ratio) };
    }
    if (best) combinations.push(best);
  }
  return { combinations, excluded: colors.filter(color => normalizeThemeHex(color.hex)?.length === 9) };
}

export function generateThemeCode(name, colors, locale = 'fr', target = 'formulas') {
  if (!['fr', 'en'].includes(locale) || !['formulas', 'onstart'].includes(target)) throw new RangeError('Format de sortie invalide');
  if (!name.trim()) throw new RangeError('Donnez un nom au thème.');
  if (!colors.length) throw new RangeError('Ajoutez au moins une couleur au thème.');
  const names = new Set();
  for (const color of colors) {
    if (!color.name.trim()) throw new RangeError('Chaque couleur doit avoir un nom.');
    const key = color.name.trim().toLowerCase();
    if (names.has(key)) throw new RangeError('Chaque couleur doit avoir un nom unique (sans distinction de casse).');
    names.add(key);
    if (!normalizeThemeHex(color.hex)) throw new RangeError(`Valeur invalide pour ${color.name}.`);
    if (!['background', 'text'].includes(color.role ?? 'background')) throw new RangeError('Rôle de couleur invalide.');
  }
  const { combinations } = themeCombinations(colors);
  const entries = [];
  for (const color of colors) {
    entries.push({ name: color.name.trim(), hex: color.hex });
    const match = combinations.find(item => item.background === color);
    if (!match) continue;
    const associatedName = 'on_' + color.name.trim();
    if (names.has(associatedName.toLowerCase())) throw new RangeError(`Le nom ${associatedName} est réservé à la couleur de texte associée.`);
    names.add(associatedName.toLowerCase());
    const textName = match.text.name.replace(/[\r\n\u2028\u2029]/g, ' ');
    const warning = match.level === 'A' ? " - ⚠️ à n'utiliser qu'avec une grande taille de police"
      : match.level === 'Insuffisant' ? ' - ⛔ contraste inaccessible, NE PAS UTILISER' : '';
    entries.push({ name: associatedName, hex: match.text.hex,
      comment: `${textName} - accessibilité ${match.level} contraste ${match.ratio.toFixed(2)}${warning}` });
  }
  const prefix = target === 'formulas' ? 'f' : 'gbl';
  const hexName = powerFxIdentifier(prefix + name.trim() + '_HEX');
  const fxName = powerFxIdentifier(prefix + name.trim() + '_FX');
  const separator = locale === 'fr' ? ';' : ',';
  const chain = locale === 'fr' ? ';;' : ';';
  const record = (value, comments = false) => '{\n' + entries.map((color, index) =>
    `    ${powerFxIdentifier(color.name)}: ${value(color)}${index < entries.length - 1 ? separator : ''}${comments && color.comment ? ' // ' + color.comment : ''}`
  ).join('\n') + '\n}';
  const hexRecord = record(color => `"${normalizeThemeHex(color.hex)}"`, true);
  const fxRecord = record(color => `ColorValue(${hexName}.${powerFxIdentifier(color.name.trim())})`, true);
  const hexComment = '// Theme de couleurs, valeurs héxadécimales à utiliser dans les contrôles htmlText et les images SVG';
  const fxComment = "// Theme de couleurs, valeurs Power FX à utiliser dans les paramètres des contrôles de l'application ou les formules Power Fx";
  if (target === 'formulas') return `${hexComment}\n${hexName} = ${hexRecord}${chain}\n\n${fxComment}\n${fxName} = ${fxRecord}${chain}`;
  return `${hexComment}\nSet(${hexName}${separator} ${hexRecord})${chain}\n\n${fxComment}\nSet(${fxName}${separator} ${fxRecord})`;
}
