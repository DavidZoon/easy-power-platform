import test from 'node:test';
import assert from 'node:assert/strict';
import { bestTextColor, contrastLevel, createPalette, harmonies, hexToHsl, hexToRgb, hslToHex, normalizeHex, powerFxRgba } from '../assets/js/color-harmonizer.js';

test('normalise HEX et rejette les entrées invalides', () => {
  assert.equal(normalizeHex(' abc '), '#AABBCC');
  assert.equal(normalizeHex('#6750a4'), '#6750A4');
  for (const input of ['', '#12', '#12345g', '#12345678', '<script>']) assert.equal(normalizeHex(input), null);
  assert.throws(() => createPalette('bad input', 'square'), RangeError);
  assert.throws(() => createPalette('#123456', 'unknown'), RangeError);
});

test('conversions RGB et HSL exactes sur les primaires et nuances', () => {
  assert.deepEqual(hexToRgb('#ff0080'), [255, 0, 128]);
  assert.deepEqual(hexToHsl('#FF0000'), { h: 0, s: 100, l: 50 });
  assert.deepEqual(hexToHsl('#00FF00'), { h: 120, s: 100, l: 50 });
  assert.equal(hslToHex({ h: -120, s: 100, l: 50 }), '#0000FF');
  for (const hex of ['#000000', '#FFFFFF', '#808080', '#6750A4', '#FF0080', '#FEFE01']) assert.equal(hslToHex(hexToHsl(hex)), hex);
});

test('sept harmonies, toujours cinq couleurs et base inchangée', () => {
  assert.equal(Object.keys(harmonies).length, 7);
  for (const name of Object.keys(harmonies)) {
    for (const base of ['#6750A4', '#FF0000', '#000000', '#FFFFFF', '#808080']) {
      const palette = createPalette(base, name);
      assert.equal(palette.length, 5);
      assert.equal(palette[0], base);
      for (const color of palette) assert.match(color, /^#[0-9A-F]{6}$/);
    }
  }
});

test('géométrie des harmonies sur une base rouge saturée', () => {
  for (const name of ['analogous', 'complementary', 'split', 'triadic', 'tetradic', 'square']) {
    const hues = createPalette('#FF0000', name).map(color => hexToHsl(color).h);
    hues.forEach((hue, index) => {
      const expected = (harmonies[name].offsets[index] + 360) % 360;
      assert(Math.abs(hue - expected) < 1, `${name}, couleur ${index}: ${hue} vs ${expected}`);
    });
  }
  const mono = createPalette('#FF0000', 'monochromatic');
  assert.equal(new Set(mono).size, 5);
  for (const color of mono) assert.equal(hexToHsl(color).h, 0);
});

test('formules Power Fx locales avec alpha opaque', () => {
  assert.equal(powerFxRgba('#6750A4'), 'RGBA(103; 80; 164; 1)');
  assert.equal(powerFxRgba('#FF0080', 'en'), 'RGBA(255, 0, 128, 1)');
});

test('contraste WCAG 2.1 : extrêmes, couleurs connues et seuil AAA exact', () => {
  assert.deepEqual(bestTextColor('#000000'), { hex: '#FFFFFF', ratio: 21, level: 'AAA' });
  assert.deepEqual(bestTextColor('#FFFFFF'), { hex: '#000000', ratio: 21, level: 'AAA' });
  assert(Math.abs(bestTextColor('#FF0000').ratio - 5.252) < 0.0001);
  assert.equal(bestTextColor('#FF0000').hex, '#000000');
  assert.equal(bestTextColor('#FF0000').level, 'AA');
  assert.equal(bestTextColor('#0000FF').hex, '#FFFFFF');
  assert.equal(bestTextColor('#0000FF').level, 'AAA');
  assert(bestTextColor('#949494').ratio < 7);
  assert.equal(bestTextColor('#949494').level, 'AA');
  assert(bestTextColor('#959595').ratio >= 7);
  assert.equal(bestTextColor('#959595').level, 'AAA');
  assert.throws(() => bestTextColor('invalid'), RangeError);
});

test('noir ou blanc maximise le contraste et garantit AA pour tous les gris', () => {
  for (let value = 0; value <= 255; value++) {
    const hex = '#' + value.toString(16).padStart(2, '0').repeat(3);
    const result = bestTextColor(hex);
    assert(result.ratio >= 4.5, hex);
    assert(result.ratio >= 21 / result.ratio, hex);
  }
});

test('capsules : seuils exacts sans arrondi, A est un repère interne', () => {
  for (const [ratio, level] of [[1, 'Insuffisant'], [2.9999, 'Insuffisant'], [3, 'A'], [4.4999, 'A'], [4.5, 'AA'], [6.9999, 'AA'], [7, 'AAA'], [21, 'AAA']]) {
    assert.equal(contrastLevel(ratio), level);
  }
  for (const ratio of [NaN, Infinity, 0, 22]) assert.throws(() => contrastLevel(ratio), RangeError);
});

test('mode interface : base exacte, angles conservés et saturation atténuée', () => {
  for (const harmony of Object.keys(harmonies)) {
    const palette = createPalette('#FF0000', harmony, 'ui');
    assert.equal(palette.length, 5);
    assert.equal(palette[0], '#FF0000');
    for (let index = 1; index < 5; index++) {
      const hsl = hexToHsl(palette[index]);
      const expected = (harmonies[harmony].offsets[index] + 360) % 360;
      assert(Math.min(Math.abs(hsl.h - expected), 360 - Math.abs(hsl.h - expected)) < 3);
      assert(hsl.s < 100);
    }
    for (const base of ['#000000', '#FFFFFF', '#808080']) {
      const neutral = createPalette(base, harmony, 'ui');
      assert.equal(neutral[0], base);
      for (const color of neutral) assert.equal(hexToHsl(color).s, 0);
    }
  }
  const mono = createPalette('#6750A4', 'monochromatic', 'ui').slice(1).map(color => hexToHsl(color).l);
  [18, 38, 75, 95].forEach((value, index) => assert(Math.abs(mono[index] - value) < 0.5));
  assert.throws(() => createPalette('#123456', 'square', 'unknown'), RangeError);
});

test('arc analogique réglable, centré sur la base dans les deux modes', () => {
  for (const arc of [30, 60, 90, 120]) {
    for (const mode of ['geometric', 'ui']) {
      const palette = createPalette('#FF0000', 'analogous', mode, arc);
      assert.equal(palette[0], '#FF0000');
      [0, -arc / 2, -arc / 4, arc / 4, arc / 2].forEach((offset, index) => {
        const expected = (offset + 360) % 360;
        const actual = hexToHsl(palette[index]).h;
        assert(Math.min(Math.abs(actual - expected), 360 - Math.abs(actual - expected)) < 3);
      });
    }
  }
  for (const arc of [0, 29, 121, NaN]) assert.throws(() => createPalette('#FF0000', 'analogous', 'ui', arc), RangeError);
});
