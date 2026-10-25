import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanText } from '../assets/js/text-cleaner.js';

test('sans option, conserve exactement le texte et les retours', () => {
  const text = '  Éléphant\t\t\r\n\n  suite\rfin\n';
  assert.equal(cleanText(text), text);
  assert.equal(cleanText(''), '');
});

test('espaces multiples sans fusionner les lignes ou les tabulations', () => {
  assert.equal(cleanText('a   b\t\tc\r\n  d', { multipleSpaces: true }), 'a b\t\tc\r\n d');
});

test('nettoyage indépendant des débuts et fins de ligne', () => {
  const text = ' \ta  \r\n  b\t\r c ';
  assert.equal(cleanText(text, { trimStart: true }), 'a  \r\nb\t\rc ');
  assert.equal(cleanText(text, { trimEnd: true }), ' \ta\r\n  b\r c');
  assert.equal(cleanText(text, { trimStart: true, trimEnd: true }), 'a\r\nb\rc');
  assert.equal(cleanText('a\n', { trimStart: true }), 'a\n');
});

test('tabulations, espaces insécables et caractères invisibles', () => {
  for (const count of ['1', '2', '4']) {
    assert.equal(cleanText('a\tb', { tabs: count }), `a${' '.repeat(Number(count))}b`);
  }
  assert.equal(cleanText('a\tb', { tabs: 'remove' }), 'ab');
  assert.equal(cleanText('\uFEFFa\u200Bb\u200Cc\u200Dd\u2060', { invisibleCharacters: true }), 'abcd');
  assert.equal(cleanText('a\u00A0\u202Fb', { nonBreakingSpaces: true, multipleSpaces: true }), 'a b');
});

test('lignes vides et doublons, séparateurs mixtes et première occurrence', () => {
  assert.equal(cleanText('\r\n a \r\n \t\r\nb\r\n', { emptyLines: true }), ' a \r\nb');
  assert.equal(cleanText('a\n\n \n\nb', { collapseEmptyLines: true }), 'a\n\nb');
  assert.equal(cleanText('A\r\nb\nA\rb\rC', { duplicateLines: true }), 'A\r\nb\nC');
  assert.equal(cleanText(' a \n a\nA', { trimStart: true, trimEnd: true, duplicateLines: true }), 'a\nA');
  assert.equal(cleanText('\r\n \t\n', { emptyLines: true }), '');
  assert.equal(cleanText('a\n\n', { collapseEmptyLines: true }), 'a\n');
});

test('CR et retours à la ligne sont configurables séparément', () => {
  const text = 'a\r\nb\rc\nd';
  assert.equal(cleanText(text, { carriageReturns: 'normalize' }), 'a\nb\nc\nd');
  assert.equal(cleanText(text, { carriageReturns: 'remove' }), 'a\nbc\nd');
  assert.equal(cleanText(text, { lineBreaks: 'space' }), 'a b c d');
  assert.equal(cleanText(text, { lineBreaks: 'remove' }), 'abcd');
  assert.equal(cleanText(text, { carriageReturns: 'remove', lineBreaks: 'space' }), 'a bc d');
});

test('Unicode, accents, guillemets, ponctuation et casse', () => {
  assert.equal(cleanText('e\u0301', { normalizeUnicode: true }), 'é');
  assert.equal(cleanText('Été, déjà !', { accents: true }), 'Ete, deja !');
  assert.equal(cleanText('«Bonjour», l’ami “test”', { quotes: true }), '"Bonjour", l\'ami "test"');
  assert.equal(cleanText('Bonjour, l’ami ! 😀', { punctuation: true }), 'Bonjour lami  😀');
  assert.equal(cleanText('ÉTÉ', { letterCase: 'lower' }), 'été');
  assert.equal(cleanText('été', { letterCase: 'upper' }), 'ÉTÉ');
});

test('ordre des options et texte HTML non interprété', () => {
  assert.equal(cleanText(' ÉTÉ\t\t \n ÉTÉ \n\n Fin! ', {
    accents: true, punctuation: true, tabs: '2', multipleSpaces: true,
    trimStart: true, trimEnd: true, emptyLines: true, duplicateLines: true,
    lineBreaks: 'space', letterCase: 'lower'
  }), 'ete fin');
  assert.equal(cleanText('<script>alert("x")</script>'), '<script>alert("x")</script>');
});
