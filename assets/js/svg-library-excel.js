import { validateSvgLibrary } from './svg-library.js';

const excelText = value => value.replace(/_x[0-9a-f]{4}_/gi, token => '_x005F_' + token.slice(1));

export function excelTableName(name) {
  let value = name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(value) || /^[A-Za-z]{1,3}\d+$|^R\d*C\d*$|^[RC]$/i.test(value)) value = 'SVG_' + value;
  return value.slice(0, 255);
}

export function validateSvgExcel(name, images) {
  validateSvgLibrary(name, images);
  if (images.length > 16384) throw new RangeError('Excel accepte au maximum 16 384 colonnes. Réduisez la bibliothèque pour cet export.');
  for (const image of images) {
    if (image.name.trim().length > 255) throw new RangeError(`« ${image.name} » : un en-tête Excel est limité à 255 caractères.`);
    if (image.svg.length > 32767) throw new RangeError(`« ${image.name} » : ${image.svg.length.toLocaleString('fr-FR')} caractères, au-delà des 32 767 caractères par cellule Excel. Aucune donnée n’a été tronquée ; la sortie Power Fx reste disponible.`);
  }
}

let excelLoading;
function loadExcel() {
  if (globalThis.ExcelJS) return Promise.resolve(globalThis.ExcelJS);
  if (!excelLoading) {
    excelLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('./third-party/exceljs/exceljs.min.js', import.meta.url).href;
      script.onload = () => {
        if (globalThis.ExcelJS) resolve(globalThis.ExcelJS);
        else {
          excelLoading = undefined;
          reject(new Error('Le module ExcelJS chargé est indisponible.'));
        }
        script.remove();
      };
      script.onerror = () => {
        excelLoading = undefined;
        script.remove();
        reject(new Error('Impossible de charger le module Excel local. Réessayez l’export.'));
      };
      document.head.append(script);
    });
  }
  return excelLoading;
}

export async function createSvgWorkbook(name, images, excel) {
  validateSvgExcel(name, images);
  const { Workbook } = excel ?? await loadExcel();
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet('Bibliotheque SVG');
  // ExcelJS does not escape literal OOXML character tokens when writing strings.
  sheet.addTable({
    name: excelTableName(name),
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: { theme: 'TableStyleMedium2', showRowStripes: true },
    columns: images.map(image => ({ name: excelText(image.name.trim()), filterButton: true })),
    rows: [images.map(image => excelText(image.svg))]
  });
  sheet.columns.forEach(column => { column.width = 32; });
  const metadata = workbook.addWorksheet('_SVG_Metadata', { state: 'veryHidden' });
  metadata.addRow(['EasyPowerPlatform.SVG.1', excelText(name.trim())]);
  return workbook.xlsx.writeBuffer();
}

export async function readSvgWorkbook(buffer, excel) {
  const { Workbook } = excel ?? await loadExcel();
  const workbook = new Workbook();
  try {
    await workbook.xlsx.load(buffer);
  } catch (error) {
    throw new RangeError(`Classeur Excel illisible : ${error.message}`);
  }
  const tables = workbook.worksheets.flatMap(sheet => sheet.getTables().map(table => ({ sheet, model: table.table })));
  if (tables.length !== 1) throw new RangeError('Le classeur doit contenir exactement un tableau de bibliothèque SVG.');
  const { sheet, model } = tables[0];
  const [start, end] = model.tableRef.split(':').map(address => sheet.getCell(address));
  if (!model.headerRow || model.totalsRow || !end || end.row !== start.row + 1) {
    throw new RangeError('Le tableau SVG doit contenir des en-têtes et une seule ligne de données.');
  }
  const text = cell => {
    if (typeof cell.value !== 'string') throw new RangeError('Les noms et les SVG du tableau doivent être du texte brut, sans formule Excel.');
    return cell.value;
  };
  let name = model.name;
  const metadata = workbook.getWorksheet('_SVG_Metadata');
  if (metadata) {
    if (metadata.getCell('A1').value !== 'EasyPowerPlatform.SVG.1') throw new RangeError('Métadonnées de bibliothèque SVG non reconnues.');
    name = text(metadata.getCell('B1'));
    if (excelTableName(name) !== model.name) throw new RangeError('Le nom de bibliothèque ne correspond pas au tableau Excel.');
  }
  const images = Array.from({ length: end.col - start.col + 1 }, (_, index) => ({
    name: text(sheet.getCell(start.row, start.col + index)),
    svg: text(sheet.getCell(start.row + 1, start.col + index))
  }));
  validateSvgLibrary(name, images);
  return { name, images };
}
