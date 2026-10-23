import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSharePointJson, buildFilter, escapeODataString, extractItems, filterWarnings, formatValue, operatorsFor, sampleGetItems } from '../assets/js/odata.js';

const analysis = analyzeSharePointJson(JSON.stringify(sampleGetItems));
const column = name => analysis.columns.find(candidate => candidate.name === name);
const target = path => analysis.targets.find(candidate => candidate.path === path);
const condition = (path, operator, value = '', enabled = true) => ({ type: 'condition', path, operator, value, enabled });
const group = (logic, ...children) => ({ type: 'group', logic, children });

test('OData builder accepts every Get items output shape', () => {
  const items = sampleGetItems.body.value;
  for (const input of [sampleGetItems, sampleGetItems.body, items, items[0]]) {
    assert.ok(extractItems(JSON.stringify(input)).items.length >= 1);
  }
  assert.equal(extractItems('').error, '');
  assert.match(extractItems('{ invalid').error, /JSON valide/);
  assert.match(extractItems('[1, 2]').error, /Aucun élément/);
  assert.match(analyzeSharePointJson('{"@odata.etag":"1","{Link}":"x"}').error, /Aucune colonne/);
});

test('OData builder detects SharePoint columns and ignores metadata', () => {
  assert.deepEqual(analysis.columns.map(({ name, kind, supported }) => [name, kind, supported]), [
    ['ID', 'Nombre', true],
    ['Title', 'Texte', true],
    ['Montant', 'Nombre', true],
    ['Urgent', 'Oui/Non', true],
    ['Echeance', 'Date', true],
    ['Modified', 'Date', true],
    ['Created', 'Date', true],
    ['Statut', 'Choix', true],
    ['Projet', 'Recherche ou choix', true],
    ['Author', 'Personne', true],
    ['Etiquettes', 'Recherche multiple ou choix', true],
    ['Commentaire', 'Plusieurs lignes de texte', false]
  ]);
  assert.deepEqual(column('Author').targets.map(({ path }) => path), ['Author/EMail', 'Author/Title']);
  assert.deepEqual(column('Projet').targets.map(({ path }) => path), ['Projet/Id', 'Projet/Title', 'Projet']);
  assert.deepEqual(target('Author/EMail').samples, ['alex@contoso.com', 'lea@contoso.com']);
  assert.deepEqual(target('Statut').samples, ['En cours', 'Terminé']);
  assert.equal(target('Etiquettes/Id').multi, true);
  assert.deepEqual(operatorsFor(target('Etiquettes/Id')), ['eq']);
  assert.deepEqual(operatorsFor(target('Urgent')), ['eq', 'ne']);
  assert.equal(analyzeSharePointJson('[{"OData__x0031_Code":"A"}]').targets[0].path, '_x0031_Code');
});

test('OData builder formats values safely', () => {
  assert.equal(escapeODataString('l\'été d\'Alex'), 'l\'\'été d\'\'Alex');
  assert.equal(formatValue(target('Title'), ' Demande d\'accès '), '\'Demande d\'\'accès\'');
  assert.equal(formatValue(target('Montant'), '12,5'), '12.5');
  assert.equal(formatValue(target('Montant'), '12 euros'), null);
  assert.equal(formatValue(target('Urgent'), 'Oui'), '1');
  assert.equal(formatValue(target('Urgent'), '0'), '0');
  assert.equal(formatValue(target('Created'), '2024-06-01'), '\'2024-06-01\'');
  assert.equal(formatValue(target('Created'), '01/06/2024'), null);
  assert.equal(formatValue(target('Created'), '@{utcNow()}'), '\'@{utcNow()}\'');
  assert.equal(formatValue(target('Title'), '@{variables(\'Nom\')}'), '\'@{variables(\'Nom\')}\'');
  assert.equal(formatValue(target('Montant'), '@{variables(\'Seuil\')}'), '@{variables(\'Seuil\')}');
  assert.equal(formatValue(target('Title'), '   '), null);
});

test('OData builder generates every operator', () => {
  const cases = [
    [condition('Title', 'eq', 'A'), 'Title eq \'A\''],
    [condition('Title', 'ne', 'A'), 'Title ne \'A\''],
    [condition('Title', 'startswith', 'Dem'), 'startswith(Title, \'Dem\')'],
    [condition('Title', 'substringof', 'accès'), 'substringof(\'accès\', Title)'],
    [condition('Title', 'null'), 'Title eq null'],
    [condition('Echeance', 'notnull'), 'Echeance ne null'],
    [condition('Montant', 'ge', '100'), 'Montant ge 100'],
    [condition('Created', 'lt', '2024-06-02T00:00:00Z'), 'Created lt \'2024-06-02T00:00:00Z\''],
    [condition('Urgent', 'eq', '1'), 'Urgent eq 1'],
    [condition('Statut', 'eq', 'En cours'), 'Statut eq \'En cours\''],
    [condition('Projet/Id', 'eq', '12'), 'Projet/Id eq 12'],
    [condition('Author/EMail', 'eq', 'alex@contoso.com'), 'Author/EMail eq \'alex@contoso.com\''],
    [condition('Etiquettes', 'eq', 'RH'), 'Etiquettes eq \'RH\'']
  ];
  for (const [input, expected] of cases) assert.equal(buildFilter(group('and', input), analysis.targets).filter, expected);
});

test('OData builder combines nested groups and skips unusable rows', () => {
  const root = group('and',
    condition('Statut', 'eq', 'En cours'),
    group('or', condition('Montant', 'gt', '1000'), condition('Urgent', 'eq', '1'), group('and')),
    group('or', condition('Author/EMail', 'eq', 'alex@contoso.com')),
    condition('Title', 'eq', ''),
    condition('Commentaire', 'eq', 'x'),
    condition('Title', 'eq', 'ignorée', false),
    condition('Urgent', 'gt', '1')
  );
  assert.deepEqual(buildFilter(root, analysis.targets), {
    filter: 'Statut eq \'En cours\' and (Montant gt 1000 or Urgent eq 1) and Author/EMail eq \'alex@contoso.com\'',
    incomplete: 3,
    disabled: 1
  });
  assert.equal(buildFilter(group('or', condition('Title', 'eq', 'A'), condition('Title', 'eq', 'B')), analysis.targets).filter, 'Title eq \'A\' or Title eq \'B\'');
  assert.equal(buildFilter(group('and'), analysis.targets).filter, '');
  assert.deepEqual(buildFilter(group('and', condition('Title', 'eq', 'A'), { ...group('or', condition('Title', 'eq', 'B'), condition('ID', 'eq', '2')), enabled: false }), analysis.targets), { filter: 'Title eq \'A\'', incomplete: 0, disabled: 1 });
  assert.deepEqual(filterWarnings(group('and', condition('Projet/Title', 'eq', 'x'), condition('Created', 'gt', '2024-01-01'), condition('Title', 'substringof', 'x')), analysis.targets).length, 3);
  assert.deepEqual(filterWarnings(group('and', condition('Created', 'null')), analysis.targets), []);
});
