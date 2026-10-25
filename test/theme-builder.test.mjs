import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectColors, normalizeThemeHex, parseThemeColor, readHarmonyPalette, themeRgba, generateThemeCode, powerFxIdentifier, themeCombinations
} from '../assets/js/theme-builder.js';
import { htmlColors, ralClassic } from '../assets/js/theme-color-references.js';

test('HEX court, long, alpha, opaque et transparent sont canoniques', () => {
  for (const [value, expected] of [
    [' #abc ', '#AABBCC'], ['#abcd', '#AABBCCDD'], ['0xff0000', '#FF0000'],
    ['#ff0000ff', '#FF0000'], ['#12345600', '#00000000'], ['#abcde', null], ['#xxff00', null], ['0xabc', null]
  ]) assert.equal(normalizeThemeHex(value), expected);
});

test('déduplique tous les formats et conserve l’ordre des premières occurrences', () => {
  const { colors, duplicates, issues } = detectColors(`
    #F00 RGBA(255; 0; 0; 1) RGBA(255, 0, 0, 1) rgb(255,0,0)
    hsl(0,100%,50%) cmyk(0%,100%,100%,0%) red Color.Red ColorValue("#ff0000")
    #ff0000ff RAL 3026 #00f
  `);
  assert.deepEqual(colors.map(color => color.hex), ['#FF0000', '#0000FF']);
  assert.equal(duplicates, 10);
  assert.deepEqual(issues, []);
});

test('chaque filtre de format fonctionne indépendamment', () => {
  const text = '#123456 RGBA(1;2;3;1) rgb(4,5,6) hsl(0 0% 50%) CMJN(0; 1; 1; 0) blue RAL-5015';
  const expected = { hex: '#123456', powerfx: '#010203', rgb: '#040506', hsl: '#808080', cmyk: '#FF0000', html: '#0000FF', ral: '#2874B2' };
  for (const [format, hex] of Object.entries(expected)) assert.deepEqual(detectColors(text, [format]).colors.map(color => color.hex), [hex]);
  assert.deepEqual(detectColors(text, []).colors, []);
});

test('Power Fx FR décimal et EN, ColorValue et énumérations', () => {
  assert.equal(parseThemeColor('RGBA(255; 127; 0; 0,5)'), '#FF7F0080');
  assert.equal(parseThemeColor('RGBA(255, 127, 0, 0.5)'), '#FF7F0080');
  assert.equal(parseThemeColor('ColorValue("CornflowerBlue")'), '#6495ED');
  assert.equal(parseThemeColor('Color . DarkSlateGrey'), '#2F4F4F');
  assert.equal(parseThemeColor('ColorValue("constructor")'), null);
  assert.equal(parseThemeColor('RGBA(255, 0, 0, variable)'), null);
  assert.equal(parseThemeColor('RGBA(255; 0; 0; 1) + Color.Blue'), null);
  assert.equal(parseThemeColor('rgb(255 0 0)'), null);
});

test('RGBA avec virgules appartient à la fois à CSS et à Power Fx EN', () => {
  for (const format of ['powerfx', 'rgb']) {
    for (const token of ['RGBA(255, 0, 0, 1)', 'rgba(255, 0, 0, 1)']) {
      assert.equal(detectColors(token, [format]).colors[0].hex, '#FF0000');
    }
  }
  assert.deepEqual(detectColors('RGBA(255; 0; 0; 1)', ['rgb']).colors, []);
  assert.equal(detectColors('RGBA(100%, 0%, 0%, 100%)', ['rgb']).colors[0].hex, '#FF0000');
  assert.equal(detectColors('RGBA(100%, 0%, 0%, 100%)', ['powerfx']).issues.length, 1);
  assert.equal(detectColors('rgba(255 0 0 / 1)', ['powerfx']).issues.length, 1);
});

test('CSS moderne, unités HSL, pourcentages et transparence', () => {
  const { colors, issues } = detectColors(`
    rgb(100% 0% 0% / 50%) rgba(255,0,0,.5) hsl(.5turn 100% 50% / 25%)
    hsl(200grad,100%,50%) hsl(3.141592653589793rad 100% 50%)
    rgba(0,255,0,0) transparent #0000
  `);
  assert.deepEqual(colors.map(color => color.hex), ['#FF000080', '#00FFFF40', '#00FFFF', '#00000000']);
  assert.deepEqual(issues, []);
  assert.equal(normalizeThemeHex('#FF000080'), parseThemeColor(themeRgba('#FF000080', 'fr')));
  assert.equal(normalizeThemeHex('#FF000080'), parseThemeColor(themeRgba('#FF000080', 'en')));
});

test('alpha Power Fx court, sans décimales parasites et sans perte sur les 256 valeurs HEX', () => {
  assert.equal(themeRgba('#00000080', 'fr'), 'RGBA(0; 0; 0; 0,5)');
  assert.equal(themeRgba('#00000080', 'en'), 'RGBA(0, 0, 0, 0.5)');
  for (const locale of ['fr', 'en']) {
    for (let byte = 0; byte <= 255; byte++) {
      const hex = '#123456' + byte.toString(16).padStart(2, '0');
      assert.equal(parseThemeColor(themeRgba(hex, locale)), normalizeThemeHex(hex));
    }
  }
});

test('CMJN : conversion naïve documentée, fractions et pourcentages', () => {
  assert.equal(detectColors('cmyk(0, 1, 1, 0)').colors[0].hex, '#FF0000');
  assert.equal(detectColors('device-cmyk(0% 0% 0% 50%)').colors[0].hex, '#808080');
  assert.equal(detectColors('cmjn(0; 0,5; 1; 0)').colors[0].hex, '#FF8000');
  assert.equal(detectColors('cmyk(0,100,100,0)').issues.length, 1);
});

test('littéraux invalides signalés et absence d’exécution du code', () => {
  const result = detectColors('rgb(256,0,0) RGBA(0;0;0;-1) #12345 RAL 9999 Color.NoSuchColor ColorValue(x) hsl(0 150% 50%)');
  assert.deepEqual(result.colors, []);
  assert.equal(result.issues.length, 7);
  assert.deepEqual(detectColors('infrared my_red_color red2 RAL 50150 ColorValue("#12345")').colors, []);
  assert.equal(detectColors('alert("red"); <img src=x onerror=alert(1)>').colors[0].hex, '#FF0000');
});

test('référentiels CSS et RAL Classic complets pour la source choisie', () => {
  assert.equal(Object.keys(htmlColors).length, 149);
  assert.equal(Object.keys(ralClassic).length, 215);
  for (const hex of [...Object.values(htmlColors), ...Object.values(ralClassic)]) assert.equal(normalizeThemeHex(hex), hex);
  assert.equal(ralClassic['9010'], '#F7F9EF');
});

test('identifiants Power Fx : espaces, accents, apostrophes, mots réservés', () => {
  assert.equal(powerFxIdentifier("Bleu d'été"), "'Bleu d''été'");
  assert.equal(powerFxIdentifier('true'), "'true'");
  assert.equal(powerFxIdentifier('couleur_01'), 'couleur_01');
});

const colors = [{ name: 'primaire', hex: '#f00' }, { name: 'accent', hex: '#12345680' }];
test('transfert harmoniseur : couleurs dédupliquées par rôle, langue et validation', () => {
  const fragment = new URLSearchParams({ palette: '#ffffff,#FFFFFF,#000000', texts: '#FFFFFF,#000000', locale: 'en' }).toString();
  assert.deepEqual(readHarmonyPalette('#' + fragment), { backgrounds: ['#FFFFFF', '#000000'], texts: ['#FFFFFF', '#000000'], locale: 'en' });
  assert.equal(readHarmonyPalette(''), null);
  for (const params of [
    { palette: 'invalid', texts: '#000000', locale: 'fr' },
    { palette: '#FFFFFF', texts: '#FF0000', locale: 'fr' },
    { palette: '#FFFFFF', texts: '#000000', locale: 'de' },
    { palette: '#FFFFFF', locale: 'fr' }
  ]) assert.throws(() => readHarmonyPalette(new URLSearchParams(params).toString()), RangeError);
});
test('sorties exactes App.Formulas et App.OnStart en FR/EN', () => {
  const hexComment = '// Theme de couleurs, valeurs héxadécimales à utiliser dans les contrôles htmlText et les images SVG';
  const fxComment = "// Theme de couleurs, valeurs Power FX à utiliser dans les paramètres des contrôles de l'application ou les formules Power Fx";
  for (const locale of ['fr', 'en']) {
    const separator = locale === 'fr' ? ';' : ',';
    const chain = locale === 'fr' ? ';;' : ';';
    const hex = `{\n    primaire: "#FF0000"${separator}\n    accent: "#12345680"\n}`;
    const fx = prefix => `{\n    primaire: ColorValue(${prefix}Ocean_HEX.primaire)${separator}\n    accent: ColorValue(${prefix}Ocean_HEX.accent)\n}`;
    assert.equal(generateThemeCode('Ocean', colors, locale, 'formulas'), `${hexComment}\nfOcean_HEX = ${hex}${chain}\n\n${fxComment}\nfOcean_FX = ${fx('f')}${chain}`);
    assert.equal(generateThemeCode('Ocean', colors, locale, 'onstart'), `${hexComment}\nSet(gblOcean_HEX${separator} ${hex})${chain}\n\n${fxComment}\nSet(gblOcean_FX${separator} ${fx('gbl')})`);
  }
});

test('noms libres échappés et valeurs invalides bloquées', () => {
  const code = generateThemeCode("Été d'ici", [{ name: "L'accent", hex: '#abc' }]);
  assert(code.includes("'fÉté d''ici_HEX'.'L''accent'"));
  for (const args of [
    ['', colors], ['Ocean', []], ['Ocean', [{ name: '', hex: '#f00' }]],
    ['Ocean', [{ name: 'A', hex: '#f00' }, { name: 'a', hex: '#00f' }]],
    ['Ocean', [{ name: 'A', hex: 'invalid' }]], ['Ocean', colors, 'de']
  ]) assert.throws(() => generateThemeCode(...args), RangeError);
});

test('associe le texte opaque au contraste maximal, même si insuffisant', () => {
  const colors = [
    { name: 'clair', hex: '#FFFFFF', role: 'background' },
    { name: 'sombre', hex: '#000000', role: 'background' },
    { name: 'noir', hex: '#000000', role: 'text' },
    { name: 'blanc', hex: '#FFFFFF', role: 'text' },
    { name: 'transparent', hex: '#FF000080', role: 'background' },
    { name: 'texte_alpha', hex: '#00000080', role: 'text' }
  ];
  const result = themeCombinations(colors);
  assert.deepEqual(result.combinations.map(item => [item.background.name, item.text.name, item.ratio, item.level]),
    [['clair', 'noir', 21, 'AAA'], ['sombre', 'blanc', 21, 'AAA']]);
  assert.deepEqual(result.excluded.map(color => color.name), ['transparent', 'texte_alpha']);
  const poor = themeCombinations(colors.filter(color => color.name !== 'blanc')).combinations[1];
  assert.equal(poor.level, 'Insuffisant');
  assert.equal(poor.ratio, 1);
  assert.equal(themeCombinations(colors.filter(color => color.role === 'background')).combinations.length, 0);
});

test('ajoute les on_ uniques, commentaires exacts et références dans les quatre sorties', () => {
  const colors = [
    { name: 'fond', hex: '#FFFFFF', role: 'background' },
    { name: 'noir', hex: '#000000', role: 'text' }
  ];
  for (const locale of ['fr', 'en']) {
    const sep = locale === 'fr' ? ';' : ',';
    for (const target of ['formulas', 'onstart']) {
      const code = generateThemeCode('Theme', colors, locale, target);
      assert(code.includes(`fond: "#FFFFFF"${sep}\n    on_fond: "#000000"${sep} // noir - accessibilité AAA contraste 21.00\n    noir:`));
      assert(code.includes(`on_fond: ColorValue(${target === 'formulas' ? 'f' : 'gbl'}Theme_HEX.on_fond)${sep} // noir - accessibilité AAA contraste 21.00`));
    }
  }
  assert.throws(() => generateThemeCode('Theme', [...colors, { name: 'ON_fond', hex: '#F00' }]), /réservé/);
  const code = generateThemeCode('Theme', [{ name: "Fond d'été", hex: '#FFF' }, { name: 'texte\n// test', hex: '#000', role: 'text' }]);
  assert(code.includes("'on_Fond d''été'"));
  assert(code.includes('// texte // test - accessibilité AAA contraste 21.00'));
});

test('classe les contrastes réels avant arrondi et retient aussi des textes colorés', () => {
  for (const [hex, level] of [['#595959', 'AAA'], ['#767676', 'AA'], ['#777777', 'A'], ['#BBBBBB', 'Insuffisant']]) {
    const { combinations } = themeCombinations([
      { name: 'fond', hex: '#FFFFFF' }, { name: 'texte', hex, role: 'text' }
    ]);
    assert.equal(combinations[0].level, level);
  }
  const { combinations } = themeCombinations([
    { name: 'fond', hex: '#000000' },
    { name: 'rouge', hex: '#FF0000', role: 'text' },
    { name: 'jaune', hex: '#FFFF00', role: 'text' },
    { name: 'cyan', hex: '#00FFFF', role: 'text' }
  ]);
  assert.equal(combinations[0].text.name, 'jaune');
});

test('avertissements des commentaires A et Insuffisant dans les quatre sorties', () => {
  for (const locale of ['fr', 'en']) {
    for (const target of ['formulas', 'onstart']) {
      for (const [hex, warning] of [
        ['#777777', "⚠️ à n'utiliser qu'avec une grande taille de police"],
        ['#BBBBBB', '⛔ contraste inaccessible, NE PAS UTILISER'],
        ['#767676', ''],
        ['#595959', '']
      ]) {
        const code = generateThemeCode('Theme', [
          { name: 'fond', hex: '#FFFFFF' }, { name: 'texte', hex, role: 'text' }
        ], locale, target);
        if (warning) assert.equal(code.split(warning).length - 1, 2, 'Avertissement présent dans HEX et FX');
        else assert(!code.includes('⚠️') && !code.includes('⛔'));
      }
    }
  }
});
