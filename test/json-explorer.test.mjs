import test from 'node:test';
import assert from 'node:assert/strict';
import { parseJsonTree, generateJsonExpression, jsonValueLabel, inferJsonSource } from '../assets/js/json-explorer.js';

test('présélection heuristique : enveloppe de sorties ou corps seul', () => {
  for (const value of [
    { body: {}, headers: {} }, { body: null, statusCode: 200 }, { body: false, headers: null }
  ]) assert.deepEqual(inferJsonSource(value), { source: 'outputs', scope: 'outputs' });
  for (const value of [null, [], false, 1, 'body', { body: {} }, { headers: {} }, { value: [] }]) {
    assert.deepEqual(inferJsonSource(value), { source: 'body', scope: 'body' });
  }
});

test('arbre complet : objets imbriqués, tableaux, primitifs, null et chemins non ambigus', () => {
  const tree = parseJsonTree('{"value":[{"firstname":"David","child":{"n":0}},null,[],true],"a/b":{"x.y":false},"":""}');
  assert.equal(tree.type, 'object');
  const firstname = tree.children[0].children[0].children[0];
  assert.deepEqual({ label: firstname.label, value: firstname.value, path: firstname.path, type: firstname.type },
    { label: 'firstname', value: 'David', path: '$["value"][0]["firstname"]', type: 'string' });
  assert.deepEqual(firstname.segments, ['value', 0, 'firstname']);
  assert.equal(tree.children[0].children[1].type, 'null');
  assert.equal(jsonValueLabel(tree.children[0].children[2]), '[ 0 élément(s) ]');
  assert.equal(jsonValueLabel(tree.children[1].children[0]), 'false');
  assert.equal(tree.children[2].path, '$[""]');
  assert.equal(parseJsonTree('123').value, 123);
  assert.equal(parseJsonTree('null').type, 'null');
  assert.equal(parseJsonTree('{"__proto__":{"polluted":true}}').children[0].label, '__proto__');
  assert.equal({}.polluted, undefined);
});

test('expressions exactes des exemples et six fonctions de source', () => {
  const config = { source: 'outputs', action: 'Get_item', scope: 'body' };
  assert.equal(generateJsonExpression(['firstname'], config), "outputs('Get_item')?['body/firstname']");
  assert.equal(generateJsonExpression(['customer', 'firstname'], config), "outputs('Get_item')?['body/customer/firstname']");
  assert.equal(generateJsonExpression(['value', 0, 'firstname'], { ...config, action: 'List_rows' }),
    "outputs('List_rows')?['body/value'][0]['firstname']");
  for (const [source, expected] of [
    ['triggerBody', "triggerBody()?['firstname']"], ['triggerOutputs', "triggerOutputs()?['body/firstname']"],
    ['item', "item()?['firstname']"], ['items', "items('Loop')?['firstname']"],
    ['body', "body('Loop')?['firstname']"], ['outputs', "outputs('Loop')?['body/firstname']"]
  ]) assert.equal(generateJsonExpression(['firstname'], { source, action: 'Loop', scope: 'body' }), expected);
  assert.equal(generateJsonExpression(['body', 'name'], { ...config, scope: 'outputs' }), "outputs('Get_item')?['body/name']");
  assert.equal(generateJsonExpression([], config), "outputs('Get_item')?['body']");
  assert.equal(generateJsonExpression([0, 1, 'a'], { source: 'item' }), "item()[0][1]['a']");
});

test('clés spéciales et noms internes échappés sans confondre slash et chemin', () => {
  for (const source of ['outputs', 'body', 'items']) {
    assert.equal(generateJsonExpression(['name'], { source, action: ' Obtenir les éléments ' }),
      `${source}('Obtenir_les_éléments')${source === 'outputs' ? "?['body/name']" : "?['name']"}`);
  }
  assert.equal(generateJsonExpression(['a/b', "l'été", ''], { source: 'outputs', action: "Get_'item", scope: 'body' }),
    "outputs('Get_''item')?['body']?['a/b']?['l''été']?['']");
  assert.equal(generateJsonExpression(['0'], { source: 'body', action: 'Get' }), "body('Get')?['0']");
  assert.throws(() => generateJsonExpression([], { source: 'outputs' }), /nom interne/);
  assert.throws(() => generateJsonExpression([], { source: 'items', action: 'a\nb' }), /retour/);
  assert.throws(() => generateJsonExpression([], { source: 'eval' }), /invalide/);
});

test('erreurs explicites et limites sans arbre tronqué', () => {
  for (const text of ['', '{', '{"a":1,}', 'undefined']) assert.throws(() => parseJsonTree(text), RangeError);
  assert.throws(() => parseJsonTree(' '.repeat(2_000_001) + '0'), /millions/);
  assert.throws(() => parseJsonTree('['.repeat(82) + '0' + ']'.repeat(82)), /80 niveaux/);
  assert.throws(() => parseJsonTree(JSON.stringify(Array(10001).fill(0))), /10 000/);
});
