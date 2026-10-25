const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = hue => ((hue % 360) + 360) % 360;

export const harmonies = {
  monochromatic: { name: 'Monochromatique', offsets: [0, 0, 0, 0, 0], description: 'Une seule teinte, déclinée en nuances claires et sombres.' },
  analogous: { name: 'Analogique', offsets: [0, -30, -15, 15, 30], description: 'Des teintes voisines sur un arc de 60° autour de la couleur de base.' },
  complementary: { name: 'Complémentaire', offsets: [0, 180, 0, 180, 180], description: 'Deux teintes opposées à 180°, complétées par des nuances claires et sombres.' },
  split: { name: 'Split-complémentaire', offsets: [0, 150, 210, 150, 210], description: 'La base et les deux voisines de sa complémentaire, à 150° et 210°, puis deux nuances.' },
  triadic: { name: 'Triadique', offsets: [0, 120, 240, 120, 240], description: 'Trois teintes espacées de 120°, complétées par deux nuances.' },
  tetradic: { name: 'Tétradique', offsets: [0, 60, 180, 240, 0], description: 'Un rectangle : deux paires complémentaires à 0°/180° et 60°/240°, puis une nuance de la base.' },
  square: { name: 'Carrée', offsets: [0, 90, 180, 270, 0], description: 'Quatre teintes espacées de 90°, complétées par une nuance de la base.' }
};

export const harmonyAdvice = {
  monochromatic: 'Une gamme tonale convient aux surfaces, bordures et états. Écartez suffisamment les luminosités pour éviter une interface plate.',
  analogous: 'Les teintes voisines sont calmes mais font peu ressortir les actions. Un accent complémentaire est possible en UI, mais sort de cette harmonie stricte.',
  complementary: 'Évitez deux grandes surfaces complémentaires très saturées. Atténuez la dominante et réservez la complémentaire aux accents.',
  split: 'Un bon point de départ pour une interface : une base et deux accents plus doux que la complémentaire pure. Gardez les accents rares.',
  triadic: 'Attribuez des rôles distincts aux trois teintes et évitez de les utiliser à parts égales. Ne déduisez pas les états succès/erreur de la géométrie.',
  tetradic: 'Deux paires complémentaires offrent beaucoup de possibilités. Pour une UI ciblée, privilégiez deux teintes et gardez les autres en réserve ; pour les graphiques, vérifiez leur distinction.',
  square: 'Quatre teintes équidistantes peuvent servir aux catégories de graphiques. Une interface demande davantage de retenue et des luminosités différenciées.'
};

export function normalizeHex(value) {
  const hex = value.trim().replace(/^#/, '');
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null;
  return '#' + (hex.length === 3 ? [...hex].map(char => char + char).join('') : hex).toUpperCase();
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) throw new RangeError('Couleur HEX invalide');
  return [1, 3, 5].map(index => parseInt(normalized.slice(index, index + 2), 16));
}

export function hexToHsl(hex) {
  const [r, g, b] = hexToRgb(hex).map(value => value / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  return { h: wrap(h * 60), s: delta ? delta / (1 - Math.abs(2 * l - 1)) * 100 : 0, l: l * 100 };
}

export function hslToHex({ h, s, l }) {
  h = wrap(h);
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  const rgb = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + rgb.map(value => Math.round((value + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function powerFxRgba(hex, locale = 'fr') {
  return `RGBA(${[...hexToRgb(hex), 1].join(locale === 'fr' ? '; ' : ', ')})`;
}

export function contrastLevel(ratio) {
  if (!Number.isFinite(ratio) || ratio < 1 || ratio > 21) throw new RangeError('Ratio de contraste invalide');
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'A' : 'Insuffisant';
}

export function bestTextColor(hex) {
  const [r, g, b] = hexToRgb(hex).map(channel => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const blackRatio = (luminance + 0.05) / 0.05;
  const whiteRatio = 1.05 / (luminance + 0.05);
  const ratio = Math.max(blackRatio, whiteRatio);
  return { hex: blackRatio >= whiteRatio ? '#000000' : '#FFFFFF', ratio, level: contrastLevel(ratio) };
}

export function createPalette(hex, harmony, mode = 'geometric', analogousArc = 60) {
  const base = normalizeHex(hex);
  if (!base) throw new RangeError('Couleur HEX invalide');
  const rule = harmonies[harmony];
  if (!rule) throw new RangeError('Harmonie inconnue');
  if (!['geometric', 'ui'].includes(mode)) throw new RangeError('Mode de palette inconnu');
  if (!Number.isFinite(analogousArc) || analogousArc < 30 || analogousArc > 120) throw new RangeError('Arc analogique attendu entre 30 et 120 degrés');
  const { h, s, l } = hexToHsl(base);
  const shades = harmony === 'monochromatic' ? [0, -0.65, -0.3, 0.35, 0.7]
    : ['complementary', 'split', 'triadic'].includes(harmony) ? [0, 0, harmony === 'complementary' ? 0.45 : 0, -0.4, 0.5]
      : ['tetradic', 'square'].includes(harmony) ? [0, 0, 0, 0, l > 50 ? -0.45 : 0.45] : [0, 0, 0, 0, 0];
  const offsets = harmony === 'analogous' ? [0, -analogousArc / 2, -analogousArc / 4, analogousArc / 4, analogousArc / 2] : rule.offsets;
  return offsets.map((offset, index) => {
    if (index === 0) return base;
    if (mode === 'ui') {
      const lightness = harmony === 'monochromatic' ? [l, 18, 38, 75, 95] : [l, 42, 55, 24, 96];
      const saturation = [1, 0.65, 0.85, 0.45, 0.2];
      return hslToHex({ h: h + offset, s: s * saturation[index], l: lightness[index] });
    }
    const amount = shades[index];
    return hslToHex({ h: h + offset, s, l: amount < 0 ? l * (1 + amount) : l + (100 - l) * amount });
  });
}
