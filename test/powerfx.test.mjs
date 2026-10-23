import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePowerFx, browserSeparator, convertPowerFx } from '../assets/js/powerfx.js';

test('Power Fx browser defaults follow the decimal separator, not just the language', () => {
  for (const locale of ['fr-FR', 'de-DE', 'es-ES', 'pt-BR']) assert.equal(browserSeparator(locale), 'semicolon');
  for (const locale of ['en-US', 'en-GB', 'ja-JP', 'de-CH']) assert.equal(browserSeparator(locale), 'comma');
});

const examples = [
  ['Set(x, 1.25); Notify("ok", NotificationType.Success)', 'Set(x; 1,25);; Notify("ok"; NotificationType.Success)'],
  ['Set(x,1);Set(y,2)', 'Set(x;1);;Set(y;2)'],
  ['If(ok, Set(x, 1); Set(y, 2), Blank())', 'If(ok; Set(x; 1);; Set(y; 2); Blank())'],
  ['Table({a: 1, b: 2}, {a: 3, b: 4})', 'Table({a: 1; b: 2}; {a: 3; b: 4})'],
  ['Set(x, .5 + 1.2e-3 + 1.)', 'Set(x; ,5 + 1,2e-3 + 1,)'],
  ['Set(x, Foo.Bar + ThisItem.Value)', 'Set(x; Foo.Bar + ThisItem.Value)'],
  ['Set(x, "a,b;1.5;; ""quoted"""); /* , ; 1.5 */\n// , ;\nSet(\'my,table;name\', 2.5)',
    'Set(x; "a,b;1.5;; ""quoted""");; /* , ; 1.5 */\n// , ;\nSet(\'my,table;name\'; 2,5)'],
  ['Set(x, $"literal , ; 1.5 {{text}} {Sum(1.5, 2)}")',
    'Set(x; $"literal , ; 1.5 {{text}} {Sum(1,5; 2)}")'],
  ['Set(x, $"nested {If(ok, $"value {Sum(1, 2)}", "x;y")}")',
    'Set(x; $"nested {If(ok; $"value {Sum(1; 2)}"; "x;y")}")'],
  ['f(x: Number, y: Number): Number = x + y;', 'f(x: Number; y: Number): Number = x + y;;']
];

test('Power Fx conversions preserve strings, comments, identifiers, member access and interpolation', () => {
  for (const [comma, semicolon] of examples) {
    assert.equal(convertPowerFx(comma, 'semicolon', 'comma'), semicolon);
    assert.equal(convertPowerFx(semicolon, 'comma', 'semicolon'), comma);
    assert.equal(convertPowerFx(comma, 'comma', 'comma'), comma);
    assert.equal(convertPowerFx(semicolon, 'semicolon', 'semicolon'), semicolon);
  }
});

test('Power Fx identifies both source syntaxes when there is sufficient evidence', () => {
  for (const [comma, semicolon] of examples.filter(([text]) => !text.includes('1.)'))) {
    assert.equal(analyzePowerFx(comma).mode, 'comma', comma);
    assert.equal(analyzePowerFx(semicolon).mode, 'semicolon', semicolon);
    assert.equal(convertPowerFx(comma, 'semicolon'), semicolon);
    assert.equal(convertPowerFx(semicolon, 'comma'), comma);
  }
  assert.equal(analyzePowerFx('Set(x;1,5)').mode, 'semicolon');
  assert.equal(convertPowerFx('Set(x;1,5)', 'comma'), 'Set(x,1.5)');
  assert.equal(analyzePowerFx('Set(x,1)').mode, 'comma');
  assert.equal(analyzePowerFx('[1, 2]').mode, 'comma');
});

test('Power Fx ambiguous, mixed or malformed snippets remain unchanged', () => {
  for (const source of ['[1,2]', '1,5', 'Notify("A");Notify("B")',
    'Set(x;1)\nSet(x,1)', 'Set(x,1);;Set(y;2)', 'Set(x; 1.5)', 'Set(x, "unfinished', 'Set(x,1', '/* unfinished']) {
    assert.equal(analyzePowerFx(source).mode, null, source);
    assert.equal(convertPowerFx(source, 'comma'), source);
    assert.equal(convertPowerFx(source, 'semicolon'), source);
  }
  assert.equal(convertPowerFx('[1,2]', 'semicolon', 'comma'), '[1;2]');
  assert.equal(convertPowerFx('[1,2]', 'comma', 'semicolon'), '[1.2]');
  assert.equal(analyzePowerFx('ThisItem.Value + 1 // , ;').mode, 'neutral');
});
