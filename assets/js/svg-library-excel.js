import { validateSvgLibrary } from './svg-library.js';

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
  const excelText = value => value.replace(/_x[0-9a-f]{4}_/gi, token => '_x005F_' + token.slice(1));
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
  return workbook.xlsx.writeBuffer();
}
