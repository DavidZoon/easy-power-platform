import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { parseStringPromise } from 'xml2js';
import { parse } from 'yaml';

const source = process.argv[2] || 'easypowerplatform.WordPress.2026-10-22.xml';
const tree = await parseStringPromise(await fs.readFile(source, 'utf8'));
const items = tree.rss.channel[0].item;
const manifest = JSON.parse(await fs.readFile('_data/migration.json', 'utf8'));
const published = items.filter(item => item['wp:post_type'][0] === 'post' && item['wp:status'][0] === 'publish');
assert.equal(manifest.posts.length, published.length);
let blocks = 0;
for (const entry of [...manifest.posts, ...manifest.pages]) {
  const item = items.find(item => item['wp:post_id'][0] === entry.id);
  const original = load(item['content:encoded'][0], null, false);
  const built = load(await fs.readFile(path.join('_site', decodeURIComponent(entry.permalink), 'index.html'), 'utf8'));
  const markdown = await fs.readFile(entry.file, 'utf8');
  const frontmatter = parse(markdown.match(/^---\n([\s\S]+?)\n---/)[1]);
  const values = domain => (item.category || []).filter(term => term.$.domain === domain).map(term => term._);
  assert.equal(frontmatter.title, item.title[0].trim(), `Titre : ${entry.id}`);
  assert.equal(frontmatter.permalink, new URL(item.link[0]).pathname, `Permalien : ${entry.id}`);
  if (item['wp:post_type'][0] === 'post') {
    assert.deepEqual(frontmatter.categories, values('category'), `Categories : ${entry.id}`);
    assert.deepEqual(frontmatter.tags, values('post_tag'), `Tags : ${entry.id}`);
    assert.equal(new Date(frontmatter.date).getTime(), new Date(item.pubDate[0]).getTime(), `Date : ${entry.id}`);
    assert(frontmatter.image && frontmatter.card_image, `Image mise en avant : ${entry.id}`);
  }
  const before = original('pre').toArray().map(el => original(el).text().trim());
  const after = built('.prose pre').toArray().map(el => built(el).text().trim());
  assert.deepEqual(after, before, `Code modifie : ${entry.id}`);
  blocks += before.length;
}
const wpCategories = tree.rss.channel[0]['wp:category'] || [];
const wpName = slug => wpCategories.find(term => term['wp:category_nicename'][0] === slug)?.['wp:cat_name'][0];
const hierarchy = parse(await fs.readFile('_data/category_hierarchy.yml', 'utf8')) || {};
for (const [child, parent] of Object.entries(hierarchy)) {
  const term = wpCategories.find(term => term['wp:cat_name'][0] === child);
  assert(term, `Categorie absente de WordPress : ${child}`);
  assert.equal(wpName(term['wp:category_parent']?.[0]), parent, `Parent de ${child}`);
}
console.log(`Migration verifiee : ${published.length} articles, titres/dates/taxonomies/permaliens/images, ${Object.keys(hierarchy).length} relations de categories et ${blocks} blocs de code identiques a WordPress.`);
