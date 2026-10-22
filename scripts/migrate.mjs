import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parseStringPromise, Builder } from 'xml2js';
import { load } from 'cheerio';
import { stringify, parse } from 'yaml';
import sharp from 'sharp';
import { createCardImage } from './card-images.mjs';
import { categoryHierarchy, escapeLiquid, inferLanguage, mediaKey, safePath, taxonomySlug } from './migration-utils.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const xml = path.resolve(args[0] || 'easypowerplatform.WordPress.2026-10-22.xml');
const archive = path.resolve(args[1] || 'media-export-241591370-from-0-to-1605.tar');
const work = path.join(root, '.migration');
const extracted = path.join(work, 'original-media');
const output = path.join(work, `converted-${Date.now()}`);
const generated = new Map();
const hash = value => createHash('sha256').update(value).digest('hex');
const text = value => typeof value === 'object' ? value?._ || '' : value || '';
const first = (item, key) => text(item[key]?.[0]);
const report = { posts: [], pages: [], skipped: [], media: 0, missingMedia: [], unavailableMedia: [], externalImages: [], substitutions: [], downloads: [], emptyAlt: [], codeBlocks: 0 };
const emit = (name, content) => generated.set(name, Buffer.from(content));
const config = parse(await fs.readFile(path.join(root, '_config.yml'), 'utf8'));
const mediaOverrides = JSON.parse(await fs.readFile(path.join(root, 'scripts', 'media-overrides.json'), 'utf8'));
const tree = await parseStringPromise(await fs.readFile(xml, 'utf8'));
const channel = tree.rss.channel[0];
const origin = first(channel, 'link');
const items = channel.item;
const attachments = new Map(items.filter(i => first(i, 'wp:post_type') === 'attachment').map(i => [first(i, 'wp:post_id'), i]));
const published = items.filter(i => first(i, 'wp:status') === 'publish' &&
  (first(i, 'wp:post_type') === 'post' || (first(i, 'wp:post_type') === 'page' && new URL(first(i, 'link')).pathname === '/about/')));
for (const i of items.filter(i => !published.includes(i))) {
  report.skipped.push({ id: first(i, 'wp:post_id'), type: first(i, 'wp:post_type'), status: first(i, 'wp:status') });
}
await fs.mkdir(extracted, { recursive: true });
const extraction = spawnSync(process.env.PYTHON || 'python', [path.join(root, 'scripts', 'extract-media.py'), archive, extracted], { stdio: 'inherit' });
if (extraction.error || extraction.status !== 0) throw extraction.error || new Error('Extraction TAR echouee (Python 3.12+ requis).');
const media = new Map();
async function walk(dir, prefix = '') {
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const key = `${prefix}${item.name}`;
    if (item.isDirectory()) await walk(path.join(dir, item.name), `${key}/`);
    else if (item.isFile()) {
      const source = path.join(dir, item.name);
      if (!/\.(png|jpe?g|gif|webp)$/i.test(item.name)) {
        const url = `/assets/media/${key}`;
        emit(url.slice(1), await fs.readFile(source));
        media.set(key, { url });
        continue;
      }
      const input = await fs.readFile(source);
      const bytes = await sharp(input, { animated: true }).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
      const metadata = await sharp(bytes, { animated: true }).metadata();
      const portableKey = key.length > 110 ? `${key.slice(0, 90)}-${hash(key).slice(0, 12)}` : key;
      const url = `/assets/media/${portableKey}.webp`;
      emit(url.slice(1), bytes);
      media.set(key, { url, width: metadata.width, height: metadata.pageHeight || metadata.height, source: input });
    }
  }
}
await walk(extracted);
report.media = media.size;
const downloaded = new Map();
function findMedia(value) {
  if (downloaded.has(value)) return downloaded.get(value);
  const host = new URL(value, origin).hostname;
  if (![new URL(origin).hostname, 'dz13n.files.wordpress.com'].includes(host)) return undefined;
  const key = mediaKey(value, origin);
  if (!key) return undefined;
  const direct = media.get(key) || media.get(key.replace(/-\d+x\d+(?=\.\w+$)/, ''));
  if (direct) return direct;
  const edited = [...media.entries()].filter(([name]) => name.replace(/-e\d+(?=\.\w+$)/, '') === key);
  if (edited.length === 1) {
    report.substitutions.push({ original: value, replacement: edited[0][0] });
    return edited[0][1];
  }
  return undefined;
}
const sources = new Set(published.flatMap(item => {
  const $ = load(first(item, 'content:encoded'), null, false);
  return $('img[src]').toArray().map(el => $(el).attr('src'));
}));
const downloadDir = path.join(work, 'downloads');
await fs.mkdir(downloadDir, { recursive: true });
for (const source of sources) {
  if (findMedia(source)) continue;
  if (mediaOverrides[source]) continue;
  const url = new URL(source, origin);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`Source image non autorisee : ${source}`);
  const cacheFile = path.join(downloadDir, hash(source));
  let input = await fs.readFile(cacheFile).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
  if (!input) {
    console.log(`Recuperation du media : ${url.href}`);
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`Media inaccessible : HTTP ${response.status} ${url.href}`);
    input = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(cacheFile, input);
  }
  const bytes = await sharp(input, { animated: true }).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  const metadata = await sharp(bytes, { animated: true }).metadata();
  const localUrl = `/assets/media/imported/${hash(source).slice(0, 20)}.webp`;
  emit(localUrl.slice(1), bytes);
  downloaded.set(source, { url: localUrl, width: metadata.width, height: metadata.pageHeight || metadata.height });
  report.downloads.push({ source, local: localUrl });
}
report.media += downloaded.size;
function liquidUrl(url) {
  return `{{ '${url.replace(/'/g, '%27')}' | relative_url }}`;
}
const links = new Map(published.map(i => [new URL(first(i, 'link')).pathname.toLowerCase(), new URL(first(i, 'link')).pathname]));
links.set('/articles/', '/articles/');
links.set('/', '/');
const terms = { categories: new Map(), tags: new Map() };
const usedCategorySlugs = new Set();
const protectedContent = new Map();
let sequence = 0;
function protect($, element, replacement) {
  const token = `MIGRATIONTOKEN${++sequence}END`;
  protectedContent.set(token, replacement);
  $(element).replaceWith(`\n<p>${token}</p>\n`);
}
for (const item of published) {
  const id = first(item, 'wp:post_id');
  const $ = load(first(item, 'content:encoded'), null, false);
  $('script,style,iframe,form,input,button').remove();
  $('*').each((_, el) => {
    for (const attr of Object.keys(el.attribs || {})) {
      if (/^on/i.test(attr) || ['style', 'srcset', 'sizes'].includes(attr)) $(el).removeAttr(attr);
    }
  });
  $('h1').each((_, el) => { el.tagName = 'h2'; });
  $('h2[id],h3[id],h4[id],h5[id],h6[id]').each((_, el) => {
    const level = Number(el.tagName.slice(1));
    const id = $(el).attr('id');
    const legacyAnchor = /^[A-Za-z]/.test(id) ? '' : `<span id="${id.replace(/"/g, '&quot;')}"></span>\n\n`;
    const headingId = /^[A-Za-z]/.test(id) ? id : `section-${id}`;
    protect($, el, `\n\n${legacyAnchor}${'#'.repeat(level)} ${escapeLiquid($(el).text())} {#${headingId}}\n\n`);
  });
  $('pre').each((_, el) => {
    const code = $(el).find('code');
    const body = code.length ? code.text() : $(el).text();
    const lang = inferLanguage(body, `${$(el).attr('class') || ''} ${code.attr('class') || ''}`);
    const fence = '`'.repeat(Math.max(3, ...[...body.matchAll(/`+/g)].map(m => m[0].length + 1)));
    protect($, el, `\n\n${fence}${lang}\n${escapeLiquid(body)}\n${fence}\n\n`);
    report.codeBlocks++;
  });
  $('img').each((_, el) => {
    const image = $(el);
    const src = image.attr('src');
    if (!src) throw new Error(`Image sans src, article ${id}`);
    if (mediaOverrides[src]) {
      report.unavailableMedia.push({ id, src, reason: mediaOverrides[src] });
      protect($, el, `<blockquote class="media-unavailable"><p>Média original indisponible dans l’export. <a href="${src.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">Consulter la référence d’origine</a>.</p></blockquote>`);
      return;
    }
    const local = findMedia(src);
    if (!local) {
      (mediaKey(src, origin) ? report.missingMedia : report.externalImages).push({ id, src });
    }
    image.attr('src', local ? liquidUrl(local.url) : src);
    image.attr('alt', image.attr('alt') || '');
    if (!image.attr('alt')) report.emptyAlt.push({ id, src });
    image.attr('loading', 'lazy').attr('decoding', 'async');
    image.removeAttr('class');
    if (local?.width) image.attr('width', String(local.width)).attr('height', String(local.height));
    protect($, el, $.html(el).replace(/&#123;/g, '{').replace(/&#125;/g, '}'));
  });
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (/^(javascript|data):/i.test(href.trim())) throw new Error(`Lien interdit, article ${id}`);
    const url = new URL(href, origin);
    const localMedia = findMedia(href);
    let target;
    if (localMedia) target = localMedia.url;
    else if (url.origin === new URL(origin).origin) {
      const legacyId = url.searchParams.get('p') || url.searchParams.get('page_id');
      const legacyPost = legacyId && published.find(i => first(i, 'wp:post_id') === legacyId);
      target = legacyPost ? new URL(first(legacyPost, 'link')).pathname : links.get(url.pathname.toLowerCase());
      if (!target) {
        const match = url.pathname.match(/^\/(category|tag)\/([^/]+)\/?$/);
        if (match) {
          const domain = match[1] === 'category' ? 'category' : 'post_tag';
          const term = items.flatMap(i => i.category || []).find(c => c.$?.domain === domain && c.$?.nicename === decodeURIComponent(match[2]));
          if (term) target = `/${domain === 'category' ? 'categories' : 'tags'}/${taxonomySlug(text(term))}/`;
        }
      }
    }
    if (target) {
      const token = `MIGRATIONLINK${++sequence}END`;
      protectedContent.set(token, liquidUrl(target) + url.hash);
      $(el).attr('href', token);
    }
    $(el).removeAttr('target');
  });
  // Keep complex WordPress tables intact; Markdown cannot represent nested blocks.
  $('table').each((_, el) => {
    $(el).find('[class],[style]').removeAttr('class').removeAttr('style');
    protect($, el, `<div class="table-scroll" role="region" aria-label="Tableau de l’article" tabindex="0">\n${$.html(el)}\n</div>`);
  });
  $('details').each((_, el) => {
    const summary = $(el).children('summary').first();
    const label = summary.text();
    summary.remove();
    const openToken = `MIGRATIONTOKEN${++sequence}END`;
    const closeToken = `MIGRATIONTOKEN${++sequence}END`;
    protectedContent.set(openToken, `<details markdown="1">\n<summary>${escapeLiquid(label.replace(/&/g, '&amp;').replace(/</g, '&lt;'))}</summary>\n\n`);
    protectedContent.set(closeToken, '\n\n</details>');
    $(el).replaceWith(`<p>${openToken}</p>${$(el).html()}<p>${closeToken}</p>`);
  });
  item['content:encoded'] = [$.html()];
  // Avoid exporting personal metadata, comments, credentials or draft content.
  delete item['wp:comment'];
  item['wp:postmeta'] = (item['wp:postmeta'] || []).filter(m => first(m, 'wp:meta_key') === '_thumbnail_id');
}
channel.item = published;
delete channel['wp:author'];
await fs.writeFile(path.join(work, 'sanitized.xml'), new Builder({ cdata: true }).buildObject(tree));
const run = spawnSync(process.execPath, [
  path.join(root, 'node_modules', 'wordpress-export-to-markdown', 'app.js'),
  `--input=${path.join(work, 'sanitized.xml')}`, `--output=${output}`, '--wizard=false',
  '--post-folders=false', '--prefix-date=true', '--date-folders=none', '--save-images=none',
  '--frontmatter-fields=id,title', '--timezone=Europe/Paris'
], { cwd: root, stdio: 'inherit' });
if (run.error || run.status !== 0) throw run.error || new Error(`Conversion echouee : ${run.status}`);
async function convertedFiles(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) files.push(...await convertedFiles(path.join(dir, entry.name)));
    else if (entry.name.endsWith('.md')) files.push(path.join(dir, entry.name));
  }
  return files;
}
const converted = new Map();
for (const file of await convertedFiles(output)) {
  const markdown = await fs.readFile(file, 'utf8');
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Front matter invalide : ${file}`);
  converted.set(String(parse(match[1]).id), match[2]);
}
await fs.rm(output, { recursive: true });
for (const item of published) {
  const id = first(item, 'wp:post_id');
  if (!converted.has(id)) throw new Error(`Article non converti : ${id}`);
  let body = escapeLiquid(converted.get(id));
  // Resolve nested placeholders (tables can contain protected images and links).
  for (let pass = 0; pass < 4; pass++) {
    body = body.replace(/MIGRATION(?:TOKEN|LINK)\d+END/g, token => {
      if (!protectedContent.has(token)) throw new Error(`Jeton inconnu : ${token}`);
      return protectedContent.get(token);
    });
  }
  if (/MIGRATION(?:TOKEN|LINK)\d+END/.test(body)) throw new Error(`Jeton non resolu : ${id}`);
  const pathname = new URL(first(item, 'link')).pathname;
  const isPost = first(item, 'wp:post_type') === 'post';
  const categories = (item.category || []).filter(t => t.$.domain === 'category').map(text);
  (item.category || []).filter(t => t.$.domain === 'category').forEach(t => usedCategorySlugs.add(t.$.nicename));
  const tags = (item.category || []).filter(t => t.$.domain === 'post_tag').map(text);
  for (const [type, values] of [['categories', categories], ['tags', tags]]) {
    for (const value of values) {
      if (!terms[type].has(value)) terms[type].set(value, { name: value, slug: taxonomySlug(value), count: 0 });
      terms[type].get(value).count++;
    }
  }
  const thumbnailId = first((item['wp:postmeta'] || []).find(m => first(m, 'wp:meta_key') === '_thumbnail_id') || {}, 'wp:meta_value');
  const thumbnail = attachments.get(thumbnailId);
  const cover = thumbnail && findMedia(first(thumbnail, 'wp:attachment_url'));
  if (thumbnail && !cover) report.missingMedia.push({ id, src: first(thumbnail, 'wp:attachment_url') });
  let cardImage;
  if (cover?.source) {
    cardImage = `/assets/images/cards/${id}.webp`;
    emit(cardImage.slice(1), await createCardImage(generated.get(cover.url.slice(1))));
  }
  const original = load(first(item, 'content:encoded'), null, false);
  const description = original('p').filter((_, el) => !/MIGRATION/.test(original(el).text())).first().text().trim().replace(/\s+/g, ' ').slice(0, 170);
  const fm = {
    layout: isPost ? 'post' : 'page',
    title: first(item, 'title').trim(),
    ...(isPost ? { date: new Date(first(item, 'pubDate')).toISOString(), categories, tags } : {}),
    permalink: pathname,
    author: 'David Zoonekyndt',
    wordpress_id: Number(id),
    ...(description ? { description } : {}),
    ...(cover ? { image: cover.url, ...(cardImage ? { card_image: cardImage } : {}) } : {})
  };
  const filename = isPost ? `_posts/${first(item, 'wp:post_date').slice(0, 10)}-${decodeURIComponent(pathname.split('/').filter(Boolean).at(-1)).replace(/[<>:"/\\|?*]/g, '-')}.md` : 'about/index.md';
  emit(filename, `---\n${stringify(fm, { lineWidth: 0 })}---\n\n${body.trim()}\n`);
  report[isPost ? 'posts' : 'pages'].push({ id, file: filename, permalink: pathname, title: fm.title });
}
for (const [type, entries] of Object.entries(terms)) {
  for (const term of entries.values()) {
    emit(`${type}/${term.slug}.html`, `---\n${stringify({ layout: 'taxonomy', title: term.name, taxonomy: type, term: term.name, permalink: `/${type}/${term.slug}/` })}---\n`);
  }
}
const taxonomy = Object.fromEntries(Object.entries(terms).map(([type, entries]) => [type, [...entries.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'))]));
emit('_data/taxonomies.yml', stringify(taxonomy, { lineWidth: 0 }));
const categoryDefinitions = (channel['wp:category'] || []).map(category => ({
  slug: first(category, 'wp:category_nicename'), name: first(category, 'wp:cat_name'), parent: first(category, 'wp:category_parent')
}));
emit('_data/category_hierarchy.yml', stringify(categoryHierarchy(categoryDefinitions, usedCategorySlugs), { lineWidth: 0 }));
const brand = media.get('2025/02/logo-easy-power-platform-color.png');
if (!brand?.source) throw new Error('Logo WordPress introuvable');
emit('assets/images/brand.webp', await sharp(brand.source).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 90 }).toBuffer());
emit('assets/images/social.png', await sharp(brand.source).resize(1200, 630, { fit: 'contain', background: '#272836' }).png().toBuffer());
emit('_data/migration.json', JSON.stringify({ posts: report.posts, pages: report.pages, media: report.media }, null, 2));
if (report.missingMedia.length) {
  await fs.mkdir(path.join(root, 'reports'), { recursive: true });
  await fs.writeFile(path.join(root, 'reports', 'migration.json'), JSON.stringify(report, null, 2));
  throw new Error(`${report.missingMedia.length} medias manquants : consulter reports\\migration.json`);
}
const manifestFile = path.join(work, 'manifest.json');
const previous = await fs.readFile(manifestFile, 'utf8').then(JSON.parse, error => {
  if (error.code === 'ENOENT') return {};
  throw error;
});
async function exists(file) {
  return fs.readFile(file).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
}
for (const [name, bytes] of generated) {
  const existing = await exists(safePath(root, name));
  if (existing && hash(existing) !== hash(bytes) && previous[name] !== hash(existing)) {
    throw new Error(`Modification locale protegee : ${name}. Sauvegarder ou deplacer le fichier avant de relancer.`);
  }
}
for (const name of Object.keys(previous).filter(name => !generated.has(name))) {
  const existing = await exists(safePath(root, name));
  if (existing && hash(existing) !== previous[name]) throw new Error(`Fichier obsolete modifie : ${name}`);
}
for (const [name, bytes] of generated) {
  const target = safePath(root, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, bytes);
}
for (const name of Object.keys(previous).filter(name => !generated.has(name))) await fs.rm(safePath(root, name), { force: true });
await fs.writeFile(manifestFile, JSON.stringify(Object.fromEntries([...generated].map(([name, bytes]) => [name, hash(bytes)])), null, 2));
await fs.mkdir(path.join(root, 'reports'), { recursive: true });
await fs.writeFile(path.join(root, 'reports', 'migration.json'), JSON.stringify(report, null, 2));
console.log(`Migration terminee : ${report.posts.length} articles, ${report.pages.length} page, ${report.media} medias, ${report.codeBlocks} blocs de code.`);
console.log(`Alternatives d'images a revoir : ${report.emptyAlt.length}. Images externes : ${report.externalImages.length}.`);
console.log(`Medias indisponibles signales explicitement : ${report.unavailableMedia.length}.`);
console.log(`URL configuree : ${config.url}${config.baseurl}`);
