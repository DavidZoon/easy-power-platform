import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { parse } from 'yaml';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';

const tools = parse(await fs.readFile('_data/tools.yml', 'utf8'));
const terms = parse(await fs.readFile('_data/taxonomies.yml', 'utf8'));
const parents = parse(await fs.readFile('_data/category_hierarchy.yml', 'utf8'));
const { server, url } = await preview(0);
const base = new URL(url).pathname.replace(/\/$/, '');
const documentAt = async pathname => load(await fs.readFile(path.join('_site', pathname, 'index.html'), 'utf8'));
const ancestors = name => {
  const result = [name];
  while (parents[name] && !result.includes(parents[name])) {
    name = parents[name];
    result.push(name);
  }
  return result;
};
const countText = (posts, tools) => `${posts} article${posts === 1 ? '' : 's'} · ${tools} outil${tools === 1 ? '' : 's'}`;
let browser;
try {
  for (const type of ['categories', 'tags']) {
    const index = await documentAt(type);
    for (const term of terms[type]) {
      const pathname = `${type}/${term.slug}`;
      // The migration snapshot also contains retired terms and redirects.
      if (!index(`a[href="${base}/${pathname}/"]`).length) continue;
      const $ = await documentAt(pathname);
      const expected = tools.filter(tool => tool[type].some(name =>
        type === 'categories' ? ancestors(name).includes(term.name) : name === term.name));
      const links = $('.taxonomy-tools .taxonomy-tool-card h2 a').map((i, element) => $(element).attr('href')).get();
      assert.deepEqual(links, expected.map(tool => base + tool.url), `${type} : ${term.name}`);
      assert.equal(new Set(links).size, links.length, 'Aucun doublon entre affectations et sous-catégories');
      assert.equal($('.taxonomy-tools').length, expected.length ? 1 : 0);
      assert.equal($('.taxonomy-tools .tool-taxonomies').length, expected.length, 'Une seule liste de taxonomies par outil');
      assert.equal($('.taxonomy-tools .card-meta').length, 0, 'Pas de date ni de temps de lecture pour les outils');
      const postCount = $('.post-gallery .post-card:not(.taxonomy-tool-card)').length;
      const summary = $('.taxonomy-summary').text().replace(/\s+/g, ' ').trim();
      assert(summary.startsWith(countText(postCount, expected.length)), `Compteurs archive : ${term.name}, ${summary}`);
      const indexLink = index(`a[href="${base}/${pathname}/"]`).first();
      assert.equal(indexLink.length, 1, `Terme présent dans l’index : ${term.name}`);
      const count = type === 'tags' ? indexLink.find('.count').text()
        : indexLink.closest('.taxonomy-card').find('h2 a').attr('href') === indexLink.attr('href')
          ? indexLink.closest('.taxonomy-card').children('.count').text() : indexLink.find('.count').text();
      const expectedText = type === 'tags' ? countText(postCount, expected.length) : countText(postCount, expected.length).replace(' · ', ' ');
      assert.equal(count.replace(/\s+/g, ' ').trim(), expectedText, `Compteurs index : ${term.name}`);
      if (type === 'categories') {
        const sidebarCount = $(`.sidebar a[href="${base}/${pathname}/"] .count`).text().replace(/\s+/g, ' ').trim();
        assert.equal(sidebarCount, expectedText, `Compteurs barre latérale : ${term.name}`);
        const capsules = $(`.sidebar a[href="${base}/${pathname}/"] .taxonomy-count-capsule`);
        assert.equal(capsules.length, 2);
        assert.equal(capsules.find('svg[aria-hidden="true"][fill="currentColor"]').length, 2);
        assert.deepEqual(capsules.map((i, element) => $(element).attr('title')).get(), [
          `${postCount} article${postCount === 1 ? '' : 's'}`, `${expected.length} outil${expected.length === 1 ? '' : 's'}`
        ]);
      }
      for (const tool of expected) {
        const card = $(`.taxonomy-tools h2 a[href="${base + tool.url}"]`).closest('.taxonomy-tool-card');
        assert.equal(card.find('h2').text(), tool.name);
        assert.equal(card.find('.sr-only').text(), 'Outil');
        assert(card.find('.tool-taxonomies a').length > 0);
        assert.equal(card.find('.tool-card-action').length, 0);
        assert.equal(card.find('.card-image .tool-card-ribbon svg[aria-hidden="true"]').length, 1);
        assert.equal(card.find('.card-image img').attr('src'), base + tool.image);
      }
      if (expected.length) {
        const section = $('.post-list').children().toArray();
        assert(section.indexOf($('.taxonomy-tools')[0]) < section.indexOf($('#taxonomy-posts-heading').parent()[0]), 'Outils avant les articles');
      }
    }
  }
  for (const tool of tools) {
    const $ = await documentAt(tool.url);
    const nav = $('nav.tool-taxonomies');
    assert.equal(nav.length, 1);
    for (const type of ['categories', 'tags']) {
      for (const name of tool[type]) {
        const term = terms[type].find(term => term.name === name);
        assert(term, `Terme existant : ${name}`);
        assert.equal(nav.find(`a[href="${base}/${type}/${term.slug}/"]`).text(), name);
      }
    }
  }
  browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const category = terms.categories.find(term => term.name === 'Power Apps');
  const tag = terms.tags.find(term => term.name === 'Design');
  for (const pathname of [`categories/${category.slug}/`, `tags/${tag.slug}/`, 'categories/', 'tags/']) {
    await page.goto(url + pathname);
    for (const theme of ['light', 'dark']) {
      await page.locator('html').evaluate((element, value) => { element.dataset.theme = value; }, theme);
      for (const width of [1920, 900, 390, 320]) {
        await page.setViewportSize({ width, height: 1080 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Débordement : ${pathname}, ${width}`);
        for (const card of await page.locator('.taxonomy-tool-card').all()) {
          const image = await card.locator('.card-image').boundingBox();
          const ribbon = await card.locator('.tool-card-ribbon').boundingBox();
          assert(image && ribbon && Math.abs(image.height - 160) < 1, 'Même hauteur d’image que les articles');
          assert(Math.abs(ribbon.y - image.y) < 1 && Math.abs(ribbon.x + ribbon.width - image.x - image.width) < 1, 'Ruban superposé au coin supérieur droit');
        }
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        assert.deepEqual(result.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Accessibilité : ${pathname}, ${theme}, ${width}`);
      }
    }
  }
  await page.goto(url + `categories/${category.slug}/`);
  const firstTool = page.locator('.taxonomy-tools .taxonomy-tool-card h2 a').first();
  const target = await firstTool.getAttribute('href');
  await firstTool.focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(new URL(target, url).href);
  assert.equal(await page.locator('nav.tool-taxonomies').count(), 1);
  await context.close();
  console.log('Taxonomies : outils par tag/catégorie et parents, compteurs distincts, liens, clavier, responsive et accessibilité : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
