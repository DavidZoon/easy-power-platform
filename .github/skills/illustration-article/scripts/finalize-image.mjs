// Converts a generated image to the blog's 1600 x 900 WebP format.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1600;
const HEIGHT = 900;
const args = process.argv.slice(2);
const blur = args.includes('--blur');
const [input, output] = args.filter((arg) => arg !== '--blur');

if (!input || !output) {
  console.log('Usage : node finalize-image.mjs <source> <cible.webp> [--blur]');
  console.log('  --blur : image entière sur fond flou, sans recadrage (titre ou personnage près du bord).');
  process.exit(1);
}

await fs.mkdir(path.dirname(output), { recursive: true });

if (blur) {
  const background = await sharp(input).resize(WIDTH, HEIGHT, { fit: 'cover' }).blur(40).toBuffer();
  const foreground = await sharp(input).resize(WIDTH, HEIGHT, { fit: 'inside' }).toBuffer();
  await sharp(background).composite([{ input: foreground, gravity: 'center' }]).webp({ quality: 85 }).toFile(output);
} else {
  await sharp(input).resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' }).webp({ quality: 85 }).toFile(output);
}

const { width, height } = await sharp(output).metadata();
const { size } = await fs.stat(output);
console.log(`${output} : ${width} x ${height}, ${Math.round(size / 1024)} Ko`);
