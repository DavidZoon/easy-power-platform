import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const source = path.dirname(require.resolve('exceljs/package.json'));
const destination = path.resolve('assets', 'js', 'third-party', 'exceljs');
await fs.mkdir(destination, { recursive: true });
for (const [from, to] of [['dist/exceljs.min.js', 'exceljs.min.js'], ['LICENSE', 'LICENSE.txt']]) {
  await fs.copyFile(path.join(source, from), path.join(destination, to));
}
console.log('Distribution navigateur ExcelJS et licence copiées dans assets/js/third-party/exceljs.');
