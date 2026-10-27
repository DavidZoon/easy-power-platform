import assert from 'node:assert/strict';
import test from 'node:test';
import { yamlHighlightTokens } from '../assets/js/code-editor.js';
import { generateThemeScreen } from '../assets/js/theme-screen.js';

const styled = (source) => yamlHighlightTokens(source).map(token => [source.slice(token.start, token.end), token.style]);

test('YAML highlighting: keys, scalars, comments and inline Power Fx formulas', () => {
  const source = '# Ecran\nScreens:\n  Ecran visualiseur de theme:\n    Children:\n      - ctn_ecran:\n          Control: GroupContainer@1.5.0\n          Properties:\n            Height: =Parent.Height\n            LayoutGap: =16\n            Visible: true\n            Text: ="Bonjour"\n            Fill: =RGBA(255, 255, 255, 1)';
  assert.deepEqual(styled(source), [
    ['# Ecran', 'c'], ['Screens', 'nt'], ['Ecran visualiseur de theme', 'nt'], ['Children', 'nt'], ['ctn_ecran', 'nt'],
    ['Control', 'nt'], ['GroupContainer@1.5.0', 's'], ['Properties', 'nt'], ['Height', 'nt'], ['Parent', 'k'], ['LayoutGap', 'nt'], ['16', 'm'],
    ['Visible', 'nt'], ['true', 'm'], ['Text', 'nt'], ['"Bonjour"', 's'], ['Fill', 'nt'], ['RGBA', 'nf'],
    ['255', 'm'], ['255', 'm'], ['255', 'm'], ['1', 'm']
  ]);
});

test('YAML highlighting: multi-line |- formulas are Power Fx, following keys stay keys', () => {
  const source = '    OnSelect: |-\n      =Copy(ThisItem.Nom); Notify($"Copié {ThisItem.Nom}", NotificationType.Success)\n    Text: ="HEX"\n    Items: |-\n      =Table(\n        {Nom: "fond"}\n      )\n    X: =1';
  const result = styled(source);
  assert.deepEqual(result.filter(([, style]) => style === 'nt').map(([text]) => text), ['OnSelect', 'Text', 'Items', 'X']);
  for (const expected of [['Copy', 'nf'], ['Notify', 'nf'], ['$"Copié {', 's'], ['"HEX"', 's'], ['Table', 'nf'], ['"fond"', 's'], ['1', 'm']]) {
    assert(result.some(([text, style]) => text === expected[0] && style === expected[1]), `${expected.join(' ')} absent`);
  }
});

test('YAML highlighting covers the generated theme screen without overlaps', () => {
  const source = generateThemeScreen("Mon thème 'test'", [{ name: 'fond', hex: '#6750A4' }, { name: 'texte', hex: '#FFFFFF', role: 'text' }], 'formulas');
  const tokens = yamlHighlightTokens(source);
  let offset = 0;
  for (const token of tokens) {
    assert(token.start >= offset && token.end > token.start && token.end <= source.length, `Jeton invalide à ${token.start}`);
    offset = token.end;
  }
  const kinds = new Set(tokens.map(token => token.style));
  for (const kind of ['nt', 'nf', 's', 'm']) assert(kinds.has(kind), `${kind} absent`);
  assert.deepEqual(yamlHighlightTokens(''), []);
});
