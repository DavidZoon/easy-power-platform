import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { preview } from './preview.mjs';

const { server, url } = await preview(0);
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route('**/*', route =>
    new URL(route.request().url()).origin === new URL(url).origin ? route.continue() : route.abort());
  const manifest = JSON.parse(await fs.readFile('_data/migration.json', 'utf8'));
  const post = manifest.posts.at(-1).permalink.slice(1);
  const paths = ['', 'articles/', 'categories/', 'liens-utiles/', 'about/', 'outils/', 'search/', post];
  await page.goto(url + 'outils/');
  paths.push(...await page.locator('.tool-card').evaluateAll(links => links.map(link => link.href)));
  let headings = 0;
  let buttons = 0;
  for (const pathname of paths) {
    for (const theme of ['light', 'dark']) {
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(new URL(pathname, url).href);
        await page.locator('html').evaluate((element, theme) => { element.dataset.theme = theme; }, theme);
        const label = `${pathname || '/'} ${theme} ${width}`;
        const expectedH1 = pathname === post
          ? Math.min(40.96, Math.max(25.6, width * .032))
          : Math.min(46.08, Math.max(25.6, width * .0344));
        const actualH1 = await page.locator('h1').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
        assert(Math.abs(actualH1 - expectedH1) < .1, `Titre principal compact : ${label}`);
        const toggle = await page.locator('button.theme-toggle').boundingBox();
        assert(Math.abs(toggle.height - 35.2) < .1, `Bascule compacte : ${label}`);
        for (const button of await page.locator('.share-button').all()) {
          assert(Math.abs((await button.boundingBox()).height - 36.8) < .1, `Partage compact : ${label}`);
        }
        const dimensions = await page.locator('button, .button, .share-button').evaluateAll(elements =>
          elements.filter(element => element.getClientRects().length && !element.matches('.harmony-wheel'))
            .map(element => {
              const style = getComputedStyle(element);
              const bounds = element.getBoundingClientRect();
              return { height: bounds.height, width: bounds.width, font: parseFloat(style.fontSize) };
            }));
        assert(dimensions.every(button => button.height >= 24 && button.width >= 24), `Cibles utilisables : ${label}`);
        const primary = await page.locator('.button').evaluateAll(elements =>
          elements.filter(element => element.getClientRects().length
            && !element.matches('#harmony-eyedropper, .harmony-copy, .theme-remove, .theme-color-open, #json-fullscreen'))
            .map(element => ({
              lineHeight: parseFloat(getComputedStyle(element).lineHeight),
              fontSize: parseFloat(getComputedStyle(element).fontSize)
            })));
        assert(primary.every(button => Math.abs(button.lineHeight / button.fontSize - 1.32) < .01),
          `Interligne compact, y compris les boutons multilignes : ${label}`);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `Pas de debordement horizontal : ${label}`);
        headings += await page.locator('h1,h2,h3,h4,h5,h6').count();
        buttons += dimensions.length;
      }
    }
  }
  console.log(`Dimensions compactes : ${headings} titres et ${buttons} boutons, deux themes et trois largeurs : OK.`);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
