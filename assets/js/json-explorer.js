const sources = ['triggerBody', 'triggerOutputs', 'item', 'items', 'outputs', 'body'];
const quote = value => "'" + value.replaceAll("'", "''") + "'";
const kind = value => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

export function inferJsonSource(value) {
  const envelope = value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.hasOwn(value, 'body') && (Object.hasOwn(value, 'headers') || Object.hasOwn(value, 'statusCode'));
  return envelope ? { source: 'outputs', scope: 'outputs' } : { source: 'body', scope: 'body' };
}

export function parseJsonTree(text) {
  if (!text.trim()) throw new RangeError('Collez un JSON à explorer.');
  if (text.length > 2_000_000) throw new RangeError('Le JSON dépasse la limite de 2 millions de caractères.');
  let value;
  try {
    value = JSON.parse(text);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    throw new RangeError(`JSON invalide : ${error.message}`);
  }
  let count = 0;
  function node(value, label, segments, depth) {
    if (++count > 10000 || depth > 80) {
      throw new RangeError('JSON trop volumineux pour le diagramme : maximum 10 000 nœuds et 80 niveaux. Réduisez le JSON puis réessayez.');
    }
    const type = kind(value);
    const path = '$' + segments.map(key => typeof key === 'number' ? `[${key}]` : `[${JSON.stringify(key)}]`).join('');
    const result = { label, value, path, type, segments, children: [] };
    if (type === 'object' || type === 'array') {
      result.children = Object.entries(value).map(([key, child]) =>
        node(child, type === 'array' ? `[${key}]` : key, [...segments, type === 'array' ? Number(key) : key], depth + 1));
    }
    return result;
  }
  return node(value, 'Racine', [], 0);
}

export function generateJsonExpression(segments, { source, action = '', scope = 'body' }) {
  if (!sources.includes(source) || !['body', 'outputs'].includes(scope)) throw new RangeError('Source de l’expression invalide.');
  if (['outputs', 'body', 'items'].includes(source) && !action.trim()) {
    throw new RangeError(source === 'items' ? 'Indiquez le nom interne de la boucle.' : 'Indiquez le nom interne de l’action.');
  }
  if (/[\r\n]/.test(action)) throw new RangeError('Le nom interne ne doit pas contenir de retour à la ligne.');
  const argument = ['outputs', 'body', 'items'].includes(source) ? quote(action.trim().replaceAll(' ', '_')) : '';
  let expression = `${source}(${argument})`;
  const path = ['outputs', 'triggerOutputs'].includes(source) && scope === 'body' ? ['body', ...segments] : segments;
  // Slash shorthand is only safe for simple keys before the first array index.
  let first = 0;
  while (first < path.length && typeof path[first] === 'string' && /^[A-Za-z_][A-Za-z_0-9]*$/.test(path[first])) first++;
  if (first) expression += `?[${quote(path.slice(0, first).join('/'))}]`;
  for (let index = first; index < path.length; index++) {
    const key = path[index];
    expression += typeof key === 'number' ? `[${key}]` : `${typeof path[index - 1] === 'number' ? '' : '?'}[${quote(key)}]`;
  }
  return expression;
}

export function jsonValueLabel(node) {
  if (node.type === 'object') return `{ ${node.children.length} champ(s) }`;
  if (node.type === 'array') return `[ ${node.children.length} élément(s) ]`;
  return JSON.stringify(node.value);
}
