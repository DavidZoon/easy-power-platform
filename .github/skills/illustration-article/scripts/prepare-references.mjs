// Resizes mascot reference sheets so they fit the image generator request size limit.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const mascotsDir = path.join(root, 'assets/images/Mascots');
const outDir = path.join(os.tmpdir(), 'epp-mascot-references');

const normalize = (value) => value
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/\.png$/, '').replace(/^mascotte/, '').replace(/[^a-z0-9]/g, '');

const files = (await fs.readdir(mascotsDir)).filter((file) => file.toLowerCase().endsWith('.png'));
const requested = process.argv.slice(2);

if (requested.length === 0) {
  console.log('Usage : node prepare-references.mjs "Power Apps" "SharePoint" ...');
  console.log('Mascottes disponibles :', files.map((file) => file.replace(/^Mascotte[ _]/, '').replace(/\.png$/, '').replace(/_/g, ' ')).join(', '));
  process.exit(1);
}

await fs.mkdir(outDir, { recursive: true });
let failed = false;

for (const name of requested) {
  const file = files.find((candidate) => normalize(candidate) === normalize(name));
  if (!file) {
    console.error(`Mascotte introuvable : ${name}`);
    failed = true;
    continue;
  }
  const target = path.join(outDir, `${normalize(name)}.jpg`);
  await sharp(path.join(mascotsDir, file))
    .resize({ width: 768, height: 768, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 85 })
    .toFile(target);
  console.log(target);
}

process.exit(failed ? 1 : 0);
