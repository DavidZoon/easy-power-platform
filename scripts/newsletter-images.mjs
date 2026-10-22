import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parse } from 'yaml';
import { safePath } from './migration-utils.mjs';

export function createNewsletterImage(input) {
  return sharp(input).rotate().resize({ width: 1200, withoutEnlargement: true })
    .flatten({ background: '#ffffff' }).jpeg({ quality: 85, progressive: true }).toBuffer();
}

async function regenerate() {
  const root = fileURLToPath(new URL('..', import.meta.url));
  let count = 0;
  for (const filename of await fs.readdir(path.join(root, '_posts'))) {
    if (!filename.endsWith('.md')) continue;
    const markdown = await fs.readFile(path.join(root, '_posts', filename), 'utf8');
    const frontmatter = parse(markdown.match(/^---\r?\n([\s\S]+?)\r?\n---/)[1]);
    if (!frontmatter.image || !frontmatter.wordpress_id) continue;
    const source = safePath(root, frontmatter.image.replace(/^\//, ''));
    const target = safePath(root, `assets/images/newsletter/${frontmatter.wordpress_id}.jpg`);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, await createNewsletterImage(source));
    count++;
  }
  console.log(`${count} images JPEG de newsletter generees.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await regenerate();
