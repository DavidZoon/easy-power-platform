import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { categoryHierarchy, escapeLiquid, inferLanguage, mediaKey, safePath, taxonomySlug } from '../scripts/migration-utils.mjs';

test('WordPress URLs, CDN variants and query strings map to original media', () => {
  assert.equal(mediaKey('https://dz13n.wordpress.com/wp-content/uploads/2025/02/textunits.png?w=1024'), '2025/02/textunits.png');
  assert.equal(mediaKey('https://dz13n.files.wordpress.com/2025/02/a%20b.png'), '2025/02/a b.png');
  assert.equal(mediaKey('https://example.com/logo.png'), null);
});
test('taxonomy slugs remain distinct for accented and emoji variants', () => {
  assert.notEqual(taxonomySlug('⭐ Débutant'), taxonomySlug('⭐⭐ Débutant'));
  assert.match(taxonomySlug('Power Apps'), /^power-apps-[a-f0-9]{8}$/);
});
test('archive paths cannot escape their destination', () => {
  assert.throws(() => safePath('media', '../secret'));
  assert.equal(safePath('media', '2025/a.png'), path.resolve('media', '2025/a.png'));
});
test('category hierarchy keeps used branches, nested ancestors and survives cycles', () => {
  const definitions = [
    { slug: 'power-apps', name: 'Power Apps', parent: '' },
    { slug: 'canvas', name: 'Canvas Apps', parent: 'power-apps' },
    { slug: 'components', name: 'Composants', parent: 'canvas' },
    { slug: 'pages', name: 'Power Pages', parent: '' },
    { slug: 'unused', name: 'Inutilisée', parent: 'pages' },
    { slug: 'a', name: 'A', parent: 'b' },
    { slug: 'b', name: 'B', parent: 'a' }
  ];
  assert.deepEqual(categoryHierarchy(definitions, ['components', 'pages', 'a']), {
    A: 'B', 'Canvas Apps': 'Power Apps', Composants: 'Canvas Apps'
  });
});
test('Liquid syntax in formulas remains literal without corrupting code', () => {
  assert.equal(escapeLiquid('{{value}} {% comment %}'), '{{ "{{" }}value}} {{ "{%" }} comment %}');
});
test('code languages include Power Fx, YAML, JSON, JS, PowerShell and C#', () => {
  for (const [code, expected] of [
    ['With({Value: 1}; Value)', 'powerfx'], ['Screens:\n  Home:', 'yaml'],
    ['{"value": 1}', 'json'], ['const x = 2;', 'javascript'],
    ['Get-Item $env:TEMP', 'powershell'], ['using System;', 'csharp']
  ]) assert.equal(inferLanguage(code), expected);
  assert.equal(inferLanguage('foo', 'language-c#'), 'csharp');
});
