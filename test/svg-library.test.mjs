import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { createRequire } from 'node:module';
import { parseStringPromise } from 'xml2js';
import { uniqueSvgName, imageNameErrors, generateSvgLibrary, svgImageExpression, svgImageReference } from '../assets/js/svg-library.js';
import { createSvgWorkbook, validateSvgExcel } from '../assets/js/svg-library-excel.js';

const requireExcel = createRequire(import.meta.resolve('exceljs'));
const JSZip = requireExcel('jszip');
const svg = "<svg xmlns='http://www.w3.org/2000/svg'><text>L&apos;image &amp; \"Bonjour\" ; ,</text></svg>";
const images = [{ name: 'Image1', svg }, { name: "L'image été", svg: "<svg xmlns='http://www.w3.org/2000/svg'></svg>" }];

test('noms incrémentiels : collisions insensibles à la casse et suffixes existants', () => {
  const names = ['Logo', 'logo_2'];
  assert.equal(uniqueSvgName(' LOGO ', names), 'LOGO_3');
  names.push('Image1');
  assert.equal(uniqueSvgName('Image1', names), 'Image1_2');
  assert.deepEqual(imageNameErrors([{ name: 'Logo' }, { name: ' logo ' }, { name: '' }, { name: 'A\nB' }]),
    ['Ce nom est déjà utilisé (sans distinction de casse).', 'Ce nom est déjà utilisé (sans distinction de casse).', 'Donnez un nom à cette image.', 'Le nom ne doit pas contenir de caractères de contrôle.']);
});

test('formule nommée FR/EN : SVG bruts, identifiants échappés et guillemets sans altération', () => {
  const literal = svg.replaceAll('"', '""');
  assert.equal(generateSvgLibrary("Ma bibliothèque d'été", images),
    `'Ma bibliothèque d''été' = {\n    Image1: "${literal}";\n    'L''image été': "${images[1].svg}"\n};;`);
  assert.equal(generateSvgLibrary('Bibliotheque', images, 'en'),
    `Bibliotheque = {\n    Image1: "${literal}",\n    'L''image été': "${images[1].svg}"\n};`);
  assert(!generateSvgLibrary('Test', images).includes('EncodeUrl'));
  assert.equal(svgImageExpression(svg), `"data:image/svg+xml;utf8," & EncodeUrl("${literal}")`);
  assert.equal(svgImageReference('Ma bibliothèque', "L'image été"),
    `"data:image/svg+xml;utf8," & EncodeUrl('Ma bibliothèque'.'L''image été')`);
});

test('sorties invalides : vide, collision, nom de contrôle, absence de SVG et locale inconnue', () => {
  for (const [name, entries, locale] of [
    ['', images, 'fr'], ['A\nB', images, 'fr'], ['A', [], 'fr'],
    ['A', [{ name: 'A', svg }, { name: 'a', svg }], 'fr'],
    ['A', [{ name: 'a', svg: '' }], 'fr'], ['A', images, 'de']
  ]) assert.throws(() => generateSvgLibrary(name, entries, locale), RangeError);
});

test('XLSX : vrai tableau OOXML, N colonnes, en-têtes et une ligne de SVG texte intacts', async () => {
  const entries = [...images, { name: '=Une formule', svg: '<svg><text>_x000D_ _x005F_ _x000d_\nété 😀 =SUM(A1)</text></svg>' }, { name: '_x000D_', svg }];
  const bytes = await createSvgWorkbook('Ma bibliothèque', entries, ExcelJS);
  const zip = await JSZip.loadAsync(bytes);
  const tables = Object.keys(zip.files).filter(file => /^xl\/tables\/table\d+\.xml$/.test(file));
  assert.equal(tables.length, 1);
  const { table } = await parseStringPromise(await zip.file(tables[0]).async('string'));
  assert.equal(table.$.ref, 'A1:D2');
  assert.equal(table.$.name, 'Ma_bibliotheque');
  assert.equal(table.tableColumns[0].$.count, '4');
  assert.deepEqual(table.tableColumns[0].tableColumn.map(column => column.$.name), ['Image1', "L'image été", '=Une formule', '_x005F_x000D_']);
  const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('string');
  assert.match(sheetXml, /<tableParts count="1">/);
  assert(!/<f[ >]/.test(sheetXml), 'Les données ne doivent jamais devenir des formules Excel');
  const relationships = await zip.file('xl/worksheets/_rels/sheet1.xml.rels').async('string');
  assert.match(relationships, /relationships\/table/);
  const workbook = await new ExcelJS.Workbook().xlsx.load(bytes);
  const sheet = workbook.getWorksheet(1);
  assert.equal(sheet.rowCount, 2);
  assert.equal(sheet.columnCount, entries.length);
  assert.deepEqual(sheet.getRow(1).values.slice(1), entries.map(image => image.name));
  assert.deepEqual(sheet.getRow(2).values.slice(1), entries.map(image => image.svg));
});

test('limites Excel : seuil exact, aucun blocage de Power Fx et aucune troncature', async () => {
  const entries = [{ name: 'Longue', svg: 'x'.repeat(32767) }];
  validateSvgExcel('Test', entries);
  const bytes = await createSvgWorkbook('Test', entries, ExcelJS);
  const workbook = await new ExcelJS.Workbook().xlsx.load(bytes);
  assert.equal(workbook.getWorksheet(1).getCell('A2').value.length, 32767);
  entries[0].svg += 'x';
  assert.throws(() => validateSvgExcel('Test', entries), /32 767/);
  assert(generateSvgLibrary('Test', entries).includes('x'.repeat(32768)));
  assert.throws(() => validateSvgExcel('Test', [{ name: 'x'.repeat(256), svg }]), /255/);
  const many = Array.from({ length: 16384 }, (_, index) => ({ name: `Image${index}`, svg }));
  validateSvgExcel('Test', many);
  many.push({ name: 'Image16384', svg });
  assert.throws(() => validateSvgExcel('Test', many), /16 384/);
});
