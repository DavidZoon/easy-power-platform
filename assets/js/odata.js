const ignoredKeys = new Set(['ItemInternalId', 'ComplianceAssetId', 'OData__ColorTag', 'OData__DisplayName', 'OData__UIVersionString', 'GUID', 'FileLeafRef', 'FileRef']);
const isoDate = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const expression = /^@\{[\s\S]*\}$/;
const sampleLimit = 50;

export const operators = {
  text: ['eq', 'ne', 'startswith', 'substringof', 'null', 'notnull'],
  number: ['eq', 'ne', 'gt', 'ge', 'lt', 'le', 'null', 'notnull'],
  date: ['eq', 'ne', 'gt', 'ge', 'lt', 'le', 'null', 'notnull'],
  boolean: ['eq', 'ne'],
  multi: ['eq']
};

export const operatorLabels = {
  eq: 'Est égal à', ne: 'N’est pas égal à', startswith: 'Commence par', substringof: 'Contient',
  gt: 'Supérieur à', ge: 'Supérieur ou égal à', lt: 'Inférieur à', le: 'Inférieur ou égal à',
  null: 'Ne contient pas de données', notnull: 'Contient des données'
};

export const dateOperatorLabels = { eq: 'Le', ne: 'Pas le', gt: 'Après', ge: 'Le ou après', lt: 'Avant', le: 'Le ou avant' };

export function operatorLabel(target, operator) {
  if (target?.multi && operator === 'eq') return 'Contient la valeur';
  if (target?.type === 'date' && dateOperatorLabels[operator]) return dateOperatorLabels[operator];
  return operatorLabels[operator];
}

export function operatorsFor(target) {
  if (!target) return [];
  return target.multi ? operators.multi : operators[target.type];
}

export function needsValue(operator) {
  return operator !== 'null' && operator !== 'notnull';
}

export function extractItems(input) {
  let data = input;
  if (typeof input === 'string') {
    const text = input.trim();
    if (!text) return { items: [], error: '' };
    try {
      data = JSON.parse(text);
    } catch {
      return { items: [], error: 'Le texte collé n’est pas un JSON valide.' };
    }
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.body && typeof data.body === 'object') data = data.body;
    if (Array.isArray(data.value)) data = data.value;
  }
  if (!Array.isArray(data)) data = data && typeof data === 'object' ? [data] : [];
  const items = data.filter(item => item && typeof item === 'object' && !Array.isArray(item));
  return items.length
    ? { items, error: '' }
    : { items: [], error: 'Aucun élément trouvé : collez la sortie complète de l’action « Obtenir les éléments » (propriété body ou value).' };
}

function columnName(key) {
  return key.startsWith('OData_') ? key.slice(6) : key;
}

function isIgnored(key) {
  return ignoredKeys.has(key) || key.startsWith('@') || key.startsWith('{') || key.includes('#') || key.includes('@odata');
}

function isPerson(value) {
  return value && typeof value === 'object' && ('Claims' in value || 'Email' in value || 'DisplayName' in value || String(value['@odata.type'] ?? '').includes('ExpandedUser'));
}

function isReference(value) {
  return value && typeof value === 'object' && 'Value' in value;
}

function isTaxonomy(value) {
  return value && typeof value === 'object' && ('TermGuid' in value || 'WssId' in value);
}

function kindOf(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    if (isoDate.test(value)) return 'date';
    return /[\r\n]|<\/?(?:div|p|br)\b/i.test(value) ? 'note' : 'text';
  }
  if (Array.isArray(value)) return value.length ? 'array' : null;
  if (isTaxonomy(value)) return 'taxonomy';
  if (isPerson(value)) return 'person';
  if (isReference(value)) return 'reference';
  return 'object';
}

function addSamples(target, values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '' || target.samples.length >= sampleLimit) continue;
    const text = String(value);
    if (!target.samples.includes(text)) target.samples.push(text);
  }
}

function makeTarget(column, path, type, detail, values, multi = false) {
  const target = { path, column, type, detail, multi, samples: [] };
  addSamples(target, values);
  return target;
}

function referenceTargets(name, references, multi) {
  const values = references.map(reference => reference.Value);
  const ids = references.map(reference => reference.Id).filter(id => typeof id === 'number');
  const choice = !ids.length || ids.includes(0);
  if (choice) return { kind: multi ? 'Choix multiple' : 'Choix', targets: [makeTarget(name, name, 'text', '', values, multi)] };
  return {
    kind: multi ? 'Recherche multiple ou choix' : 'Recherche ou choix',
    targets: [
      makeTarget(name, `${name}/Id`, 'number', 'ID de l’élément lié (recherche)', ids, multi),
      makeTarget(name, `${name}/Title`, 'text', 'titre de l’élément lié (recherche)', values, multi),
      makeTarget(name, name, 'text', 'valeur (choix)', values, multi)
    ]
  };
}

function personTargets(name, people, multi) {
  return {
    kind: multi ? 'Personnes' : 'Personne',
    targets: [
      makeTarget(name, `${name}/EMail`, 'text', 'adresse e-mail', people.map(person => person.Email), multi),
      makeTarget(name, `${name}/Title`, 'text', 'nom affiché', people.map(person => person.DisplayName), multi)
    ]
  };
}

function describeColumn(key, values) {
  const name = columnName(key);
  const kinds = new Set(values.map(kindOf).filter(Boolean));
  const unsupported = reason => ({ key, name, kind: reason, supported: false, targets: [] });
  if (!kinds.size) return { key, name, kind: 'Vide', supported: true, targets: [makeTarget(name, name, 'text', '', [])] };
  if (kinds.has('taxonomy')) return unsupported('Métadonnées gérées');
  if (kinds.has('note')) return unsupported('Plusieurs lignes de texte');
  if (kinds.has('array')) {
    if (kinds.size > 1) return unsupported('Valeurs mixtes');
    const entries = values.filter(Array.isArray).flat().filter(entry => entry !== null && entry !== undefined);
    if (entries.every(isPerson)) return { key, name, supported: true, ...personTargets(name, entries, true) };
    if (entries.every(isReference)) return { key, name, supported: true, ...referenceTargets(name, entries, true) };
    if (entries.every(entry => typeof entry === 'string')) return { key, name, kind: 'Choix multiple', supported: true, targets: [makeTarget(name, name, 'text', 'valeur', entries, true)] };
    return unsupported('Liste de valeurs');
  }
  if (kinds.size > 1) {
    if ([...kinds].every(kind => kind === 'text' || kind === 'date' || kind === 'number')) {
      return { key, name, kind: 'Texte', supported: true, targets: [makeTarget(name, name, 'text', '', values)] };
    }
    return unsupported('Valeurs mixtes');
  }
  const [kind] = kinds;
  const present = values.filter(value => kindOf(value));
  if (kind === 'person') return { key, name, supported: true, ...personTargets(name, present, false) };
  if (kind === 'reference') return { key, name, supported: true, ...referenceTargets(name, present, false) };
  if (kind === 'object') return unsupported('Objet');
  const labels = { text: 'Texte', number: 'Nombre', date: 'Date', boolean: 'Oui/Non' };
  const samples = kind === 'boolean' ? [] : present;
  return { key, name, kind: labels[kind], supported: true, targets: [makeTarget(name, name, kind, '', samples)] };
}

export function detectColumns(items) {
  const keys = [];
  for (const item of items) for (const key of Object.keys(item)) if (!isIgnored(key) && !keys.includes(key)) keys.push(key);
  return keys.map(key => describeColumn(key, items.map(item => item[key])));
}

export function analyzeSharePointJson(input) {
  const { items, error } = extractItems(input);
  if (error) return { items, columns: [], targets: [], error };
  const columns = detectColumns(items);
  const targets = columns.flatMap(column => column.targets);
  return { items, columns, targets, error: targets.length ? '' : 'Aucune colonne filtrable détectée dans ce JSON.' };
}

export function escapeODataString(value) {
  return String(value).replaceAll('\'', '\'\'');
}

function quote(value) {
  const text = String(value).trim();
  return expression.test(text) ? `'${text}'` : `'${escapeODataString(text)}'`;
}

export function formatValue(target, rawValue) {
  const value = String(rawValue ?? '').trim();
  if (!value) return null;
  if (expression.test(value)) return target.type === 'number' || target.type === 'boolean' ? value : quote(value);
  if (target.type === 'number') {
    const number = value.replace(',', '.');
    return /^-?\d+(?:\.\d+)?$/.test(number) ? number : null;
  }
  if (target.type === 'boolean') {
    if (/^(?:1|true|oui|yes)$/i.test(value)) return '1';
    if (/^(?:0|false|non|no)$/i.test(value)) return '0';
    return null;
  }
  if (target.type === 'date') return isoDate.test(value) ? quote(value) : null;
  return quote(value);
}

export function buildCondition(condition, targets) {
  const target = targets.find(candidate => candidate.path === condition.path);
  if (!target || !operatorsFor(target).includes(condition.operator)) return null;
  const { path } = target;
  const { operator } = condition;
  if (operator === 'null') return `${path} eq null`;
  if (operator === 'notnull') return `${path} ne null`;
  const value = formatValue(target, condition.value);
  if (value === null) return null;
  if (operator === 'startswith') return `startswith(${path}, ${value})`;
  if (operator === 'substringof') return `substringof(${value}, ${path})`;
  return `${path} ${operator} ${value}`;
}

function buildNode(node, targets, stats, nested) {
  if (node.type === 'condition') {
    if (node.enabled === false) {
      stats.disabled += 1;
      return null;
    }
    const clause = buildCondition(node, targets);
    if (!clause) stats.incomplete += 1;
    return clause;
  }
  if (node.enabled === false) {
    stats.disabled += 1;
    return null;
  }
  const parts = node.children.map(child => buildNode(child, targets, stats, true)).filter(Boolean);
  if (!parts.length) return null;
  if (parts.length === 1) return parts[0];
  const joined = parts.join(` ${node.logic === 'or' ? 'or' : 'and'} `);
  return nested ? `(${joined})` : joined;
}

export function buildFilter(root, targets) {
  const stats = { incomplete: 0, disabled: 0 };
  const filter = buildNode(root, targets, stats, false) ?? '';
  return { filter, ...stats };
}

export function filterWarnings(root, targets) {
  const warnings = new Set();
  const visit = node => {
    if (node.enabled === false) return;
    if (node.type === 'group') return node.children.forEach(visit);
    const target = targets.find(candidate => candidate.path === node.path);
    if (!target) return;
    if (target.path.endsWith('/Title') && target.detail.includes('recherche')) warnings.add('Le filtre « /Title » d’une colonne de recherche suppose que la colonne affichée est Title ; sinon, filtrez sur l’ID.');
    if (target.type === 'date' && needsValue(node.operator)) warnings.add('Les dates SharePoint sont comparées en UTC : préférez le format 2024-01-31T00:00:00Z pour une heure précise.');
    if (node.operator === 'substringof') warnings.add('« Contient » (substringof) peut ne pas être pris en charge par certaines colonnes ; testez la requête dans votre flux.');
  };
  visit(root);
  return [...warnings];
}

export const sampleGetItems = {
  body: {
    value: [
      {
        '@odata.etag': '"1"', ItemInternalId: '1', ID: 1, Title: 'Demande d\'accès', Montant: 1250.5, Urgent: true,
        Echeance: '2024-06-30', Modified: '2024-06-10T08:15:00Z', Created: '2024-06-01T09:00:00Z',
        Statut: { '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference', Id: 0, Value: 'En cours' },
        'Statut#Id': 0,
        Projet: { '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference', Id: 12, Value: 'Intranet' },
        'Projet#Id': 12,
        Author: { '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedUser', Claims: 'i:0#.f|membership|alex@contoso.com', DisplayName: 'Alex Martin', Email: 'alex@contoso.com' },
        'Author#Claims': 'i:0#.f|membership|alex@contoso.com',
        Etiquettes: [{ '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference', Id: 1, Value: 'RH' }],
        Commentaire: '<div>Première ligne<br>Seconde ligne</div>',
        '{Identifier}': 'Lists%252fDemandes%252f1_.000', '{IsFolder}': false, '{Link}': 'https://contoso.sharepoint.com', '{Name}': 'Demande', '{VersionNumber}': '1.0'
      },
      {
        '@odata.etag': '"2"', ItemInternalId: '2', ID: 2, Title: 'Achat matériel', Montant: 89, Urgent: false,
        Echeance: null, Modified: '2024-06-12T14:30:00Z', Created: '2024-06-02T10:00:00Z',
        Statut: { '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference', Id: 1, Value: 'Terminé' },
        'Statut#Id': 1,
        Projet: { '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference', Id: 7, Value: 'ERP' },
        'Projet#Id': 7,
        Author: { '@odata.type': '#Microsoft.Azure.Connectors.SharePoint.SPListExpandedUser', Claims: 'i:0#.f|membership|lea@contoso.com', DisplayName: 'Léa Dubois', Email: 'lea@contoso.com' },
        'Author#Claims': 'i:0#.f|membership|lea@contoso.com',
        Etiquettes: [],
        Commentaire: null,
        '{Identifier}': 'Lists%252fDemandes%252f2_.000', '{IsFolder}': false, '{Link}': 'https://contoso.sharepoint.com', '{Name}': 'Achat', '{VersionNumber}': '1.0'
      }
    ]
  }
};