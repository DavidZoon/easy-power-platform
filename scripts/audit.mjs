import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import net from 'node:net';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { preview } from './preview.mjs';

await fs.mkdir('reports', { recursive: true });
const { server, url } = await preview(0);
const browser = await chromium.launch();
const manifest = JSON.parse(await fs.readFile('_data/migration.json', 'utf8'));
const summary = { testedAt: new Date().toISOString(), accessibility: [], lighthouse: [], behavior: [] };
let chrome;
try {
  const context = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const requests = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(url).origin) requests.push(request.url()); });
  await page.goto(url);
  assert.equal(await page.locator('.post-card').count(), 8);
  await page.getByRole('button', { name: 'Activer le thème clair' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  summary.behavior.push('Theme clair/sombre persistant');
  await page.goto(`${url}search/?q=délégation`);
  await page.waitForFunction(() => !document.querySelector('#search-status').textContent.includes('cours'));
  assert((await page.locator('#search-results li').count()) > 0);
  await page.locator('#search-input').fill('<script>alert(1)</script>');
  await page.locator('#local-search button').click();
  await page.waitForFunction(() => document.querySelector('#search-status').textContent.startsWith('0 résultat'));
  summary.behavior.push('Recherche accentuee, absence de resultats et affichage texte sur entree HTML');
  await page.goto(`${url}page/2/`);
  assert.equal(await page.locator('.post-card').count(), 8);
  summary.behavior.push('Pagination');
  const sample = manifest.posts.find(post => post.id === '221');
  const latest = manifest.posts.at(-1);
  const allPages = ['', 'page/2/', 'articles/', 'categories/', 'tags/', 'about/', 'search/', 'privacy/', '404.html', sample.permalink.slice(1), latest.permalink.slice(1)];
  for (const theme of ['dark', 'light']) {
    await context.addInitScript(value => localStorage.setItem('epp-theme', value), theme);
    for (const pathname of allPages) {
      await page.goto(url + pathname);
      await page.setViewportSize({ width: 390, height: 844 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Debordement mobile : ${pathname}`);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      summary.accessibility.push({ path: pathname || '/', theme, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
      if (result.violations.length) console.error('Axe:', pathname, theme, result.violations.map(v => v.id));
    }
  }
  await page.goto(url + sample.permalink.slice(1));
  assert(await page.locator('.toc').isVisible());
  assert((await page.locator('#toc-list a').count()) > 0);
  assert((await page.locator('.language-powerfx .nf').count()) > 0, 'Coloration Power Fx absente');
  summary.behavior.push('Sommaire et coloration Power Fx');
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const post of manifest.posts) {
    await page.goto(url + post.permalink.slice(1));
    const layout = await page.evaluate(() => {
      const grid = document.querySelector('.article-grid').getBoundingClientRect();
      const main = document.querySelector('.article-main').getBoundingClientRect();
      return { offset: main.left - grid.left, width: main.width, toc: !document.querySelector('.toc').hidden };
    });
    assert(layout.offset > 200 && layout.width > 500, `Contenu mal place (${JSON.stringify(layout)}) : ${post.permalink}`);
  }
  summary.behavior.push('Contenu des articles dans la colonne principale, avec ou sans sommaire');
  await context.addInitScript(() => localStorage.setItem('epp-theme', 'dark'));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(url);
  await page.screenshot({ path: 'reports/home-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'reports/home-mobile.png', fullPage: true });
  assert.deepEqual(errors, [], 'Erreurs JavaScript');
  assert.deepEqual(requests, [], 'Requetes externes inattendues');
  summary.behavior.push('Aucun appel externe par defaut, aucune erreur JavaScript');
  await context.close();
  const portProbe = net.createServer();
  await new Promise(resolve => portProbe.listen(0, '127.0.0.1', resolve));
  const debugPort = portProbe.address().port;
  await new Promise(resolve => portProbe.close(resolve));
  chrome = await launch({ port: debugPort, chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox'] });
  for (const pathname of ['', latest.permalink.slice(1)]) {
    const result = await lighthouse(url + pathname, {
      port: chrome.port, output: 'html', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
    });
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)]));
    summary.lighthouse.push({ path: pathname || '/', scores, failedAudits: Object.values(result.lhr.audits).filter(a => a.score !== null && a.score < 1).map(a => ({ id: a.id, title: a.title, displayValue: a.displayValue })) });
    await fs.writeFile(`reports/lighthouse-${pathname ? 'article' : 'home'}.html`, result.report);
    await fs.writeFile(`reports/lighthouse-${pathname ? 'article' : 'home'}.json`, JSON.stringify(result.lhr));
    console.log('Lighthouse mobile:', pathname || '/', scores);
  }
  assert(summary.accessibility.every(result => result.violations.length === 0), 'Violations axe detectees');
  assert(summary.lighthouse.every(result => Object.values(result.scores).every(score => score > 95)), 'Objectif Lighthouse > 95 non atteint');
  console.log('Validation navigateur, accessibilite et Lighthouse : OK.');
} finally {
  await fs.writeFile('reports/audit.json', JSON.stringify(summary, null, 2));
  await browser.close();
  if (chrome) await chrome.kill();
  await new Promise(resolve => server.close(resolve));
}
