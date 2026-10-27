import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { parse, stringify } from 'yaml';

export const ICON_SIZE = 96;
const MAX_BYTES = 2 * 1024 * 1024;
const USER_AGENT = 'Mozilla/5.0 (compatible; EasyPowerPlatformLinkIcons/1.0)';

function declaredSize(sizes = '') {
  if (/\bany\b/i.test(sizes)) return Infinity;
  return Math.max(0, ...[...sizes.matchAll(/(\d+)x(\d+)/gi)].map((match) => Math.min(Number(match[1]), Number(match[2]))));
}

// Icons declared by the page, best first, then the conventional /favicon.ico.
export function iconCandidates(html, pageUrl) {
  const $ = cheerio.load(html);
  const base = new URL($('base[href]').attr('href') || pageUrl, pageUrl);
  const found = [];
  $('link[rel][href]').each((index, element) => {
    const rel = ($(element).attr('rel') || '').toLowerCase().split(/\s+/);
    const touch = rel.includes('apple-touch-icon') || rel.includes('apple-touch-icon-precomposed');
    if (!touch && !rel.includes('icon')) return;
    let url;
    try { url = new URL($(element).attr('href'), base); } catch { return; }
    if (!['http:', 'https:', 'data:'].includes(url.protocol)) return;
    const svg = /svg/i.test($(element).attr('type') || '') || /\.svg$/i.test(url.pathname);
    const size = svg ? Infinity : declaredSize($(element).attr('sizes')) || (touch ? 180 : 0);
    found.push({ url: url.href, size, index });
  });
  found.sort((a, b) => b.size - a.size || a.index - b.index);
  const urls = [...new Set(found.map((icon) => icon.url))];
  const fallback = new URL('/favicon.ico', pageUrl).href;
  if (!urls.includes(fallback)) urls.push(fallback);
  return urls;
}

export function isIco(buffer) {
  return buffer.length >= 6 && buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1 && buffer.readUInt16LE(4) > 0;
}

function decodeIcoBitmap(dib) {
  const headerSize = dib.readUInt32LE(0);
  const width = dib.readInt32LE(4);
  const height = Math.abs(dib.readInt32LE(8)) / 2;
  const bpp = dib.readUInt16LE(14);
  if (!width || !height || ![1, 4, 8, 24, 32].includes(bpp)) throw new Error(`Bitmap ICO non pris en charge (${bpp} bits)`);
  const paletteSize = bpp <= 8 ? (dib.readUInt32LE(32) || 2 ** bpp) : 0;
  const palette = headerSize;
  const pixels = palette + paletteSize * 4;
  const stride = Math.floor((width * bpp + 31) / 32) * 4;
  const maskStart = pixels + stride * height;
  const maskStride = Math.floor((width + 31) / 32) * 4;
  const hasMask = dib.length >= maskStart + maskStride * height;
  const data = Buffer.alloc(width * height * 4);
  let alphaUsed = false;
  for (let y = 0; y < height; y++) {
    const row = pixels + (height - 1 - y) * stride;
    for (let x = 0; x < width; x++) {
      const out = (y * width + x) * 4;
      let blue, green, red, alpha = 255;
      if (bpp >= 24) {
        const offset = row + x * (bpp / 8);
        [blue, green, red] = [dib[offset], dib[offset + 1], dib[offset + 2]];
        if (bpp === 32) { alpha = dib[offset + 3]; if (alpha) alphaUsed = true; }
      } else {
        const bit = x * bpp;
        const index = (dib[row + (bit >> 3)] >> (8 - bpp - (bit & 7))) & (2 ** bpp - 1);
        const entry = palette + index * 4;
        [blue, green, red] = [dib[entry], dib[entry + 1], dib[entry + 2]];
      }
      data[out] = red; data[out + 1] = green; data[out + 2] = blue; data[out + 3] = alpha;
    }
  }
  // Without an alpha channel, transparency comes from the AND mask.
  if (hasMask && !(bpp === 32 && alphaUsed)) {
    for (let y = 0; y < height; y++) {
      const row = maskStart + (height - 1 - y) * maskStride;
      for (let x = 0; x < width; x++) if ((dib[row + (x >> 3)] >> (7 - (x & 7))) & 1) data[(y * width + x) * 4 + 3] = 0;
    }
  }
  return { data, width, height };
}

// Returns the largest image of an ICO file, as an embedded PNG or raw RGBA pixels.
export function decodeIco(buffer) {
  if (!isIco(buffer)) throw new Error('Fichier ICO invalide');
  const entries = [];
  for (let index = 0; index < buffer.readUInt16LE(4); index++) {
    const entry = 6 + index * 16;
    if (entry + 16 > buffer.length) break;
    const length = buffer.readUInt32LE(entry + 8);
    const offset = buffer.readUInt32LE(entry + 12);
    if (offset + length > buffer.length) continue;
    entries.push({ size: (buffer[entry] || 256) * (buffer[entry + 1] || 256), bpp: buffer.readUInt16LE(entry + 6), image: buffer.subarray(offset, offset + length) });
  }
  if (!entries.length) throw new Error('Fichier ICO sans image');
  entries.sort((a, b) => b.size - a.size || b.bpp - a.bpp);
  const { image } = entries[0];
  if (image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { png: image };
  return decodeIcoBitmap(image);
}

export async function createLinkIcon(buffer) {
  let input = sharp(buffer, { density: 300 });
  if (isIco(buffer)) {
    const decoded = decodeIco(buffer);
    input = decoded.png ? sharp(decoded.png) : sharp(decoded.data, { raw: { width: decoded.width, height: decoded.height, channels: 4 } });
  }
  return input.resize(ICON_SIZE, ICON_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toBuffer();
}

export function iconFilename(url) {
  const { hostname } = new URL(url);
  return `${hostname.replace(/^www\./, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.png`;
}

async function download(url) {
  if (url.startsWith('data:')) {
    const [, meta, data] = url.match(/^data:([^,]*),(.*)$/s) || [];
    if (meta === undefined) throw new Error('URL data invalide');
    return Buffer.from(meta.endsWith(';base64') ? data : decodeURIComponent(data), meta.endsWith(';base64') ? 'base64' : 'utf8');
  }
  const response = await fetch(url, { headers: { 'user-agent': USER_AGENT }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_BYTES) throw new Error('fichier trop volumineux');
  return { buffer, url: response.url, type: response.headers.get('content-type') || '' };
}

async function fetchLinkIcon(pageUrl) {
  const page = await download(pageUrl);
  const errors = [];
  for (const candidate of iconCandidates(page.buffer.toString('utf8'), page.url)) {
    try {
      const icon = await download(candidate);
      const buffer = Buffer.isBuffer(icon) ? icon : icon.buffer;
      if (!Buffer.isBuffer(icon) && /text\/html/i.test(icon.type)) throw new Error('page HTML au lieu d’une image');
      return { icon: await createLinkIcon(buffer), source: candidate };
    } catch (error) {
      errors.push(`${candidate} : ${error.message}`);
    }
  }
  throw new Error(`aucune icône exploitable\n    ${errors.join('\n    ')}`);
}

async function regenerate() {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const links = parse(await fs.readFile(path.join(root, '_data', 'links.yml'), 'utf8')) || [];
  const mapFile = path.join(root, '_data', 'link_icons.yml');
  const previous = parse(await fs.readFile(mapFile, 'utf8').catch(() => '')) || {};
  const icons = {};
  const directory = path.join(root, 'assets', 'images', 'links');
  await fs.mkdir(directory, { recursive: true });
  let failures = 0;
  for (const link of links) {
    if (link.icon) continue;
    try {
      const { icon, source } = await fetchLinkIcon(link.url);
      const filename = iconFilename(link.url);
      await fs.writeFile(path.join(directory, filename), icon);
      icons[link.url] = `/assets/images/links/${filename}`;
      console.log(`OK  ${link.name} <- ${source}`);
    } catch (error) {
      failures++;
      if (previous[link.url]) icons[link.url] = previous[link.url];
      console.warn(`--  ${link.name} : ${error.message}${previous[link.url] ? ' (icône précédente conservée)' : ' (monogramme affiché)'}`);
    }
  }
  const header = '# Généré par `npm run images:links` : favicons téléchargés des liens utiles.\n';
  await fs.writeFile(mapFile, header + (Object.keys(icons).length ? stringify(icons) : '{}\n'));
  console.log(`${Object.keys(icons).length} icône(s) de liens, ${failures} échec(s).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await regenerate();
