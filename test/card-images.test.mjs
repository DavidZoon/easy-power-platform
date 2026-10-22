import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import { parse } from 'yaml';
import { createCardImage } from '../scripts/card-images.mjs';

test('card thumbnails retain sufficient width for portrait and landscape sources without upscaling', async () => {
  for (const [width, height, expectedWidth, expectedHeight] of [
    [800, 1498, 800, 1498],
    [1600, 900, 960, 540],
    [378, 377, 378, 377]
  ]) {
    const source = await sharp({ create: { width, height, channels: 3, background: '#272836' } }).png().toBuffer();
    const thumbnail = await createCardImage(source);
    const metadata = await sharp(thumbnail).metadata();
    assert.equal(metadata.width, expectedWidth);
    assert.equal(metadata.height, expectedHeight);
    assert.equal(metadata.format, 'webp');
  }
});

test('all published card thumbnails use the available source resolution', async () => {
  const root = new URL('../', import.meta.url);
  let count = 0;
  for (const filename of await fs.readdir(new URL('_posts/', root))) {
    if (!filename.endsWith('.md')) continue;
    const markdown = await fs.readFile(new URL(`_posts/${filename}`, root), 'utf8');
    const frontmatter = parse(markdown.match(/^---\r?\n([\s\S]+?)\r?\n---/)[1]);
    if (!frontmatter.card_image) continue;
    const source = await sharp(await fs.readFile(new URL(frontmatter.image.slice(1), root))).metadata();
    const thumbnail = await sharp(await fs.readFile(new URL(frontmatter.card_image.slice(1), root))).metadata();
    assert.equal(thumbnail.width, Math.min(960, source.width), `Resolution insuffisante : ${filename}`);
    assert(Math.abs(thumbnail.height / thumbnail.width - source.height / source.width) < .01, `Proportions modifiees : ${filename}`);
    count++;
  }
  assert(count > 0, 'Aucune miniature verifiee');
});
