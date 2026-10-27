import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import { ICON_SIZE, createLinkIcon, decodeIco, iconCandidates, iconFilename } from '../scripts/link-icons.mjs';

function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, bpp, data }, index) => {
    const entry = 6 + index * 16;
    header[entry] = size % 256; header[entry + 1] = size % 256;
    header.writeUInt16LE(bpp, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

// 2x2 bitmap, bottom-up rows: top = red, green; bottom = blue, transparent.
function bitmap32() {
  const dib = Buffer.alloc(40 + 16 + 8);
  dib.writeUInt32LE(40, 0); dib.writeInt32LE(2, 4); dib.writeInt32LE(4, 8); dib.writeUInt16LE(1, 12); dib.writeUInt16LE(32, 14);
  Buffer.from([255, 0, 0, 255, 0, 0, 0, 0, 0, 0, 255, 255, 0, 255, 0, 255]).copy(dib, 40);
  return dib;
}

test('link icons: page icons ranked by size, SVG first, favicon.ico fallback', () => {
  const html = `<link rel="icon" href="/small.png" sizes="16x16"><link rel="apple-touch-icon" href="touch.png">
    <link rel="shortcut icon" href="https://cdn.example.com/big.png" sizes="64x64"><link rel="icon" type="image/svg+xml" href="logo.svg">
    <link rel="stylesheet" href="style.css"><link rel="icon" href="javascript:alert(1)">`;
  assert.deepEqual(iconCandidates(html, 'https://example.com/blog/index.html'), [
    'https://example.com/blog/logo.svg', 'https://example.com/blog/touch.png', 'https://cdn.example.com/big.png',
    'https://example.com/small.png', 'https://example.com/favicon.ico'
  ]);
  assert.deepEqual(iconCandidates('<p>Sans icône</p>', 'https://example.com/a/'), ['https://example.com/favicon.ico']);
});

test('link icons: ICO picks the largest image and decodes BMP colours and alpha', async () => {
  const png = await sharp({ create: { width: 48, height: 48, channels: 4, background: '#123456' } }).png().toBuffer();
  assert.deepEqual(decodeIco(ico([{ size: 2, bpp: 32, data: bitmap32() }, { size: 48, bpp: 32, data: png }])), { png });
  const { data, width, height } = decodeIco(ico([{ size: 2, bpp: 32, data: bitmap32() }]));
  assert.deepEqual([width, height], [2, 2]);
  assert.deepEqual([...data], [255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 0, 0, 0, 0]);
  assert.throws(() => decodeIco(Buffer.from('<html>')), /ICO invalide/);
});

test('link icons: output is a square transparent PNG and filenames come from the host', async () => {
  const icon = await sharp(await createLinkIcon(ico([{ size: 2, bpp: 32, data: bitmap32() }]))).metadata();
  assert.deepEqual([icon.format, icon.width, icon.height, icon.hasAlpha], ['png', ICON_SIZE, ICON_SIZE, true]);
  const svg = await sharp(await createLinkIcon(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10"><rect width="20" height="10"/></svg>'))).metadata();
  assert.deepEqual([svg.width, svg.height], [ICON_SIZE, ICON_SIZE]);
  assert.equal(iconFilename('https://www.Example.co.uk/path/?q=1'), 'example-co-uk.png');
});
