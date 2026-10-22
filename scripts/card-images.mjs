import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parse } from 'yaml';
import { safePath } from './migration-utils.mjs';

export function createCardImage(input) {
  return sharp(input).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
}

async function regenerate() {
  const root = fileURLToPath(new URL('..', import.meta.url));
  let count = 0;
  for (const filename of await fs.readdir(path.join(root, '_posts'))) {
    if (!filename.endsWith('.md')) continue;
    const markdown = await fs.readFile(path.join(root, '_posts', filename), 'utf8');
    const frontmatter = parse(markdown.match(/^---\r?\n([\s\S]+?)\r?\n---/)[1]);
    if (!frontmatter.card_image) continue;
    const source = safePath(root, frontmatter.image.replace(/^\//, ''));
    const target = safePath(root, frontmatter.card_image.replace(/^\//, ''));
    const bytes = await createCardImage(source);
    const { width, height } = await sharp(bytes).metadata();
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, bytes);
    console.log(`${frontmatter.wordpress_id}: ${width}x${height}`);
    if (width < 640) console.warn(`Source de faible resolution : ${frontmatter.image} (${width}px, aucun agrandissement artificiel).`);
    count++;
  }
  console.log(`${count} miniatures regenerees.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await regenerate();
