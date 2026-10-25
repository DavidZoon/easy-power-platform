import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import assert from 'node:assert/strict';
import { parseStringPromise } from 'xml2js';

const root = path.resolve(process.argv[2] || '_site');
const manifest = JSON.parse(await fs.readFile('_data/migration.json', 'utf8'));
const home = load(await fs.readFile(path.join(root, 'index.html'), 'utf8'));
const canonical = new URL(home('link[rel="canonical"]').attr('href'));
const base = canonical.pathname.replace(/\/$/, '');
const failures = [];
const files = [];
async function walk(dir) {
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) await walk(file); else files.push(file);
  }
}
await walk(root);
for (const forbidden of ['node_modules', '.migration', 'vendor', 'scripts', 'test', 'reports', '.github']) {
  assert(!files.some(file => path.relative(root, file).split(path.sep).includes(forbidden)), `Dossier prive publie : ${forbidden}`);
}
assert(!files.some(file => /WordPress.*\.xml$|\.tar$|Gemfile|package-lock/.test(file)), 'Export ou outils publies');
const cache = new Map();
let postCount = 0;
async function targetFor(url) {
  let pathname = decodeURIComponent(url.pathname);
  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) return null;
  pathname = pathname.slice(base.length);
  let file = path.resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) return null;
  const stat = await fs.stat(file).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
  if (!stat) return null;
  if (stat.isDirectory()) file = path.join(file, 'index.html');
  return await fs.access(file).then(() => file, () => null);
}
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = await fs.readFile(file, 'utf8');
  const $ = load(html);
  if ($('article.post').length) postCount++;
  const relative = path.relative(root, file);
  if ($('article.post').length) {
    const postUrl = $('link[rel="canonical"]').attr('href');
    const shareLinks = $('.share-links a').toArray();
    if (shareLinks.length !== 5) failures.push(`${relative}: boutons de partage manquants`);
    for (const element of shareLinks) {
      const url = new URL($(element).attr('href'));
      const value = url.searchParams.get('url') || url.searchParams.get('u') || url.searchParams.get('body') || url.searchParams.get('text') || '';
      if (!value.includes(postUrl)) failures.push(`${relative}: URL de partage incorrecte`);
    }
    if (!$('.newsletter a[target="_blank"]').length) failures.push(`${relative}: lien d'abonnement manquant`);
    if ($('.newsletter-frame[src]').length) failures.push(`${relative}: formulaire charge avant action`);
  }
  if ($('h1').length !== 1) failures.push(`${relative}: attendu exactement un h1, obtenu ${$('h1').length}`);
  if (!$('title').text() || !$('meta[name="description"]').attr('content')) failures.push(`${relative}: metadonnees incompletes`);
  if (!$('html').attr('lang')) failures.push(`${relative}: langue manquante`);
  if (/MIGRATION(?:TOKEN|LINK)\d+END/.test(html)) failures.push(`${relative}: jeton de migration non resolu`);
  const pageUrl = new URL(`${base}/${relative.split(path.sep).join('/').replace(/index\.html$/, '')}`, canonical.origin);
  for (const element of $('a[href],img[src],script[src],link[href]').toArray()) {
    const value = $(element).attr(element.tagName === 'a' || element.tagName === 'link' ? 'href' : 'src');
    if (!value || /^(mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    const url = new URL(value, pageUrl);
    if (url.origin !== canonical.origin) continue;
    const target = await targetFor(url);
    if (!target) { failures.push(`${relative}: cible manquante ${value}`); continue; }
    if (url.hash && target.endsWith('.html')) {
      if (!cache.has(target)) cache.set(target, load(await fs.readFile(target, 'utf8')));
      const id = decodeURIComponent(url.hash.slice(1));
      if (!cache.get(target)('[id]').toArray().some(el => el.attribs.id === id)) failures.push(`${relative}: ancre manquante ${value}`);
    }
  }
  for (const image of $('img').toArray()) {
    if (!Object.hasOwn(image.attribs, 'alt')) failures.push(`${relative}: image sans attribut alt`);
    if (!image.attribs.width || !image.attribs.height) failures.push(`${relative}: dimensions image manquantes`);
  }
}
const index = JSON.parse(await fs.readFile(path.join(root, 'search.json'), 'utf8'));
assert.equal(index.length, postCount, 'Tous les articles doivent etre recherchables');
assert.equal(new Set(index.map(post => post.url)).size, index.length, 'URL de recherche dupliquee');
for (const post of manifest.posts) {
  const target = await targetFor(new URL(base + post.permalink, canonical.origin));
  if (!target) failures.push(`Permalien WordPress perdu : ${post.permalink}`);
}
for (const filename of ['sitemap.xml', 'feed.xml', 'robots.txt']) assert(files.includes(path.join(root, filename)), `${filename} absent`);
const rss = await fs.readFile(path.join(root, 'feed.xml'), 'utf8');
assert(rss.includes('<feed'), 'Flux Atom invalide');
const atom = (await parseStringPromise(rss)).feed;
assert.equal(atom.$.xmlns, 'http://www.w3.org/2005/Atom');
assert.equal(atom.entry.length, Math.min(20, postCount), 'Nombre incorrect d’articles dans le flux');
assert.equal(new Set(atom.entry.map(entry => entry.id[0])).size, atom.entry.length, 'Identifiants Atom dupliques');
for (const entry of atom.entry) {
  assert(!Number.isNaN(Date.parse(entry.updated[0])), 'Date de mise a jour Atom invalide');
  assert(!Number.isNaN(Date.parse(entry.published[0])), 'Date de publication Atom invalide');
  const article = new URL(entry.link.find(link => link.$.rel === 'alternate').$.href);
  assert.equal(entry.id[0], article.href.replace(/\/$/, ''), 'Identifiant Atom modifie');
  assert.equal(entry.summary[0].$.type, 'html');
  const summary = load(entry.summary[0]._, null, false);
  assert(summary('p').last().text().trim().length > 0, 'Resume newsletter absent');
  assert.equal(summary('img').length, 1, 'Image principale absente du resume');
  const image = new URL(summary('img').attr('src'));
  assert.equal(image.origin, canonical.origin, 'Origine image newsletter incorrecte');
  assert(image.pathname.startsWith(`${base}/assets/`), 'Image newsletter sans baseurl');
  assert(image.pathname.endsWith('.jpg'), 'Image newsletter non JPEG');
  assert(await targetFor(image), `Image newsletter introuvable : ${image.href}`);
  assert.equal(entry.content[0]._, entry.summary[0]._, 'Contenu et resume newsletter differents');
  assert(!summary('script, pre, iframe').length, 'Contenu complet ou actif dans le resume');
}
const tagPage = load(await fs.readFile(path.join(root, 'tags', 'index.html'), 'utf8'));
const tagCounts = tagPage('.tag-cloud .count').map((i, el) => Number(tagPage(el).attr('data-count'))).get();
assert(tagCounts.length > 0 && tagCounts.every((count, i) => i === 0 || tagCounts[i - 1] >= count), 'Tags non tries par popularite');
const { parse: parseYaml } = await import('yaml');
const hierarchy = parseYaml(await fs.readFile('_data/category_hierarchy.yml', 'utf8')) || {};
const categoryPage = load(await fs.readFile(path.join(root, 'categories', 'index.html'), 'utf8'));
const cardOf = name => categoryPage('.taxonomy-card').filter((i, el) => categoryPage(el).find('h2').text().trim() === name);
for (const [child, parent] of Object.entries(hierarchy)) {
  const linked = cardOf(parent).length ? cardOf(parent) : categoryPage(`.subcategory-list a`).filter((i, a) => categoryPage(a).find('span').first().text() === parent).closest('li');
  assert(linked.find('.subcategory-list a span, .nested a span').filter((i, el) => categoryPage(el).text() === child).length, `${child} doit etre sous ${parent}`);
  assert(!cardOf(child).length, `${child} ne doit pas etre une categorie racine`);
}
const posts = new Map();
for (const href of categoryPage('.taxonomy-card a, .subcategory-list a').map((i, a) => categoryPage(a).attr('href')).get()) {
  const page = load(await fs.readFile(path.join(root, decodeURIComponent(href.slice(base.length)), 'index.html'), 'utf8'));
  posts.set(page('h1').text().replace(/^Catégorie : /, '').trim(), { page, urls: new Set(page('.post-list .post-card h2 a, .post-list .post-card h3 a').map((i, a) => page(a).attr('href')).get()) });
}
for (const [child, parent] of Object.entries(hierarchy)) {
  assert(posts.get(parent).page('.breadcrumb').length, `Fil d'Ariane absent : ${parent}`);
  assert(posts.get(child).page('.breadcrumb li').map((i, li) => posts.get(child).page(li).text().trim()).get().includes(parent), `Fil d'Ariane de ${child}`);
  for (const url of posts.get(child).urls) assert(posts.get(parent).urls.has(url), `${parent} doit inclure les articles de ${child}`);
}
console.log(`${files.length} fichiers controles, ${manifest.posts.length} articles, ${index.length} entrees de recherche.`);
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exitCode = 1;
} else console.log('Liens internes, permaliens, images, SEO et exclusions : OK.');
