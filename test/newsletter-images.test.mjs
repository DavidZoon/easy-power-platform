import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { createNewsletterImage } from '../scripts/newsletter-images.mjs';

test('newsletter images are JPEG, keep proportions and never upscale sources', async () => {
  for (const [width, height, expectedWidth, expectedHeight] of [[1600, 900, 1200, 675], [800, 1498, 800, 1498]]) {
    const input = await sharp({ create: { width, height, channels: 4, background: '#00000000' } }).png().toBuffer();
    const bytes = await createNewsletterImage(input);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, 'jpeg');
    assert.equal(metadata.width, expectedWidth);
    assert.equal(metadata.height, expectedHeight);
    assert.equal(metadata.hasAlpha, false);
  }
});
