import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
import { generateThemeScreen } from '../assets/js/theme-screen.js';

const colors = [
  { name: 'primaire', hex: '#98F69D', role: 'background' },
  { name: 'sombre', hex: '#265436', role: 'background' },
  { name: 'alpha', hex: '#12345680', role: 'background' },
  { name: 'noir', hex: '#000000', role: 'text' },
  { name: 'blanc', hex: '#FFFFFF', role: 'text' }
];
const galleryFrom = yaml => parse(yaml).Screens['Ecran visualiseur de theme'].Children[0]
  .ctn_ecran.Children[1].MainContainer1.Children[0].gal_ThemePalette;

test('écran YAML valide, toutes les couleurs et références f/gbl, sans virgule finale', () => {
  for (const [target, prefix] of [['formulas', 'f'], ['onstart', 'gbl']]) {
    const yaml = generateThemeScreen('Mon_theme', colors, target);
    const gallery = galleryFrom(yaml);
    assert.equal(gallery.Control, 'Gallery@2.15.0');
    const items = gallery.Properties.Items;
    assert(items.startsWith('=['));
    assert.equal((items.match(/NomCouleur:/g) || []).length, colors.length);
    assert(items.includes(`CouleurTexte_FX: ${prefix}Mon_theme_FX.on_primaire`));
    assert(items.includes(`CouleurTexte_HEX: ${prefix}Mon_theme_HEX.on_sombre`));
    assert(items.includes('NomCouleurTexte: "noir"'));
    assert(items.includes('NomCouleurTexte: "blanc"'));
    assert.equal((items.match(/CouleurTexte_FX: Blank\(\)/g) || []).length, 3);
    assert(!/,\s*\]/.test(items), 'Pas de virgule finale dans la table');
    assert(!items.includes(';;'), 'Syntaxe invariante EN');
    if (target === 'onstart') assert(!yaml.includes('fMon_theme'), 'Variables globales uniquement');
  }
});

test('écran : noms libres échappés pour YAML, identifiants et chaînes Power Fx', () => {
  const yaml = generateThemeScreen('L\'été: "Bleu"\nTest', [
    { name: 'L\'accent: "bleu"\nfin', hex: '#ABCDEF' },
    { name: 'Texte', hex: '#000000', role: 'text' }
  ]);
  const items = galleryFrom(yaml).Properties.Items;
  assert(items.includes(`CouleurFond_FX: 'fL''été: "Bleu"\nTest_FX'.'L''accent: "bleu"\nfin'`));
  assert(items.includes('NomCouleur: "L\'accent: ""bleu""" & Char(10) & "fin"'));
  assert(items.includes(`NomVarFond: "'fL''été: ""Bleu""" & Char(10)`));
});

test('écran : boutons de copie des quatre valeurs et désactivation sans texte associé', () => {
  const gallery = galleryFrom(generateThemeScreen('Palette', colors));
  const controls = gallery.Children[0].Container2.Children;
  for (const [id, field] of [
    ['btn_cpy_fond_var', 'NomVarFond'], ['btn_cpy_txt_var', 'NomVarTexte'],
    ['btn_cpy_fond_hex', 'CouleurFond_HEX'], ['btn_cpy_text_hex', 'CouleurTexte_HEX']
  ]) {
    const button = controls.find(control => control[id])[id];
    assert(button.Properties.OnSelect.startsWith(`=Copy(ThisItem.${field}); Notify(`));
    assert.equal(button.Properties.DisplayMode, `=If(IsBlank(ThisItem.${field}), DisplayMode.Disabled, DisplayMode.Edit)`);
  }
});

test('écran corrigé : AutoLayout horizontal avec retour à la ligne, dimensions et galerie', () => {
  const gallery = galleryFrom(generateThemeScreen('Palette', colors));
  assert.equal(gallery.Properties.TemplateSize, '=210');
  assert.equal(gallery.Properties.TemplatePadding, '=10');
  assert.equal(gallery.Properties.WrapCount, '=5');
  const container = gallery.Children[0].Container2;
  assert.equal(container.Variant, 'AutoLayout');
  assert.equal(container.Properties.LayoutDirection, '=LayoutDirection.Horizontal');
  assert.equal(container.Properties.LayoutWrap, '=true');
  assert.equal(container.Properties.Width, '=Parent.TemplateWidth');
  assert.equal(container.Properties.Height, '=Parent.TemplateHeight');
  assert.equal(container.Children.length, 7);
  for (const control of container.Children) {
    const properties = Object.values(control)[0].Properties;
    assert.equal(properties.LayoutMinHeight, '=16');
    assert.equal(properties.LayoutMinWidth, '=16');
    assert.equal(properties.Width, control.lbl_preview ? '=Parent.Width-10' : '=Parent.Width*0.5-10');
    assert(!Object.keys(properties).some(key => key.startsWith('LayoutGrid')));
  }
});

test('bandeau HTML : hauteur fixe, largeur flexible, lien et crédit sans placeholder', () => {
  const screen = parse(generateThemeScreen('Palette', colors)).Screens['Ecran visualiseur de theme'];
  const footer = screen.Children[0].ctn_ecran.Children[2].FooterContainer1;
  assert.equal(footer.Properties.Height, '=75');
  const info = footer.Children[0].htm_Infos.Properties;
  assert.equal(info.Height, '=75');
  assert.equal(info.FillPortions, '=1');
  assert.equal(info.AlignInContainer, '=AlignInContainer.Stretch');
  assert.equal(info.AutoHeight, '=false');
  assert.equal(info.LayoutMinWidth, '=0');
  for (const side of ['Top', 'Bottom', 'Left', 'Right']) assert.equal(info[`Padding${side}`], '=0');
  assert(info.HtmlText.includes("href='https://davidzoon.github.io/easy-power-platform/'"));
  assert(info.HtmlText.includes('height:75px'));
  assert(info.HtmlText.includes('width:100%'));
  assert(info.HtmlText.includes('Constructeur de thème · David Zoonekyndt'));
  assert(!info.HtmlText.includes('Bandeau avec le lien'));
});

test('écran : erreurs de palette identiques au générateur Power Fx et aucune limite de taille', () => {
  assert.throws(() => generateThemeScreen('', colors), RangeError);
  assert.throws(() => generateThemeScreen('Test', []), RangeError);
  assert.throws(() => generateThemeScreen('Test', [{ name: 'a', hex: '#badvalue' }]), RangeError);
  assert.throws(() => generateThemeScreen('Test', [...colors, { name: 'on_primaire', hex: '#FF0000' }]), /réservé/);
  const many = Array.from({ length: 130 }, (_, index) => ({ name: `c_${index}`, hex: '#ABCDEF' }));
  const gallery = galleryFrom(generateThemeScreen('Grand', many));
  assert.equal(gallery.Properties.Items.match(/NomCouleur:/g).length, 130);
});
