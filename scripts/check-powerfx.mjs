import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { chromium } from 'playwright';
import { preview } from './preview.mjs';

const { server, url } = await preview(0);
let browser;
try {
  browser = await chromium.launch();
  const manifest = JSON.parse(await fs.readFile('_data/migration.json', 'utf8'));
  let toolbar;
  let articleUrl;
  for (const post of manifest.posts) {
    const html = await fs.readFile(path.join('_site', post.permalink, 'index.html'), 'utf8');
    const $ = load(html);
    const block = $('[data-powerfx]').first();
    if (!block.length) continue;
    assert.equal(block.find('[data-powerfx-control][hidden]').length, 1);
    toolbar = $.html(block);
    articleUrl = url + post.permalink.slice(1);
    break;
  }
  assert(toolbar, 'Toolbar Power Fx absente du site construit');
  const source = 'Set(x, 1.5); Notify("texte , ; 1.5")\n';
  const localized = 'Set(x; 1,5);; Notify("texte , ; 1.5")\n';
  const fixtureUrl = `${url}__powerfx-test/`;
  for (const locale of ['fr-FR', 'en-US', 'de-CH']) {
    const context = await browser.newContext({ locale, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.route(fixtureUrl, route => {
      const $ = load(`<main id="post-content" class="prose" data-toc="false">${toolbar}</main>`);
      const block = $('[data-powerfx]');
      block.find('pre code').empty().append('<span class="nf">Set</span>(x, <span class="mf">1.5</span>); Notify(<span class="s2">"texte , ; 1.5"</span>)\n');
      const ambiguous = block.clone();
      ambiguous.find('pre code').text('[1,2]');
      const explicit = ambiguous.clone().attr('data-powerfx', 'semicolon');
      block.after(ambiguous, explicit);
      return route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Test Power Fx</title><link rel="stylesheet" href="${url}assets/css/main.css"></head><body>${$('body').html()}<script type="module" src="${url}assets/js/post.js"></script></body></html>` });
    });
    await page.addInitScript(() => {
      window.copiedCode = null;
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.copiedCode = text; } } });
    });
    await page.goto(fixtureUrl);
    const block = page.locator('[data-powerfx]').nth(0);
    await block.locator('[data-powerfx-control]').waitFor({ state: 'visible' });
    const code = block.locator('pre code');
    assert.equal(await code.textContent(), locale === 'fr-FR' ? localized : source);
    assert.equal(await code.locator('.s2').textContent(), '"texte , ; 1.5"');
    assert.equal(await code.locator('.nf').textContent(), 'Set', 'Coloration perdue');
    const select = block.locator('select');
    assert.equal(await select.evaluate(element => element.labels[0].textContent.includes('Séparateur d’arguments')), true);
    await select.focus();
    await page.keyboard.press('Home');
    assert.equal(await code.textContent(), source, 'Selection virgule au clavier');
    await page.keyboard.press('End');
    assert.equal(await code.textContent(), localized, 'Selection point-virgule au clavier');
    for (let i = 0; i < 3; i++) {
      await block.locator('select').selectOption('semicolon');
      assert.equal(await code.textContent(), localized);
      await block.locator('.code-copy').click();
      assert.equal(await page.evaluate(() => window.copiedCode), localized.trimEnd());
      await block.locator('select').selectOption('comma');
      assert.equal(await code.textContent(), source, 'Conversion cumulative');
    }
    const ambiguous = page.locator('[data-powerfx]').nth(1);
    assert(await ambiguous.locator('select').isDisabled());
    assert(await ambiguous.locator('[role="status"]').isVisible());
    assert.equal(await ambiguous.locator('pre code').textContent(), '[1,2]');
    const explicit = page.locator('[data-powerfx]').nth(2);
    assert.equal(await explicit.locator('pre code').textContent(), locale === 'fr-FR' ? '[1,2]' : '[1.2]');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Debordement mobile');
    await context.close();
  }
  const context = await browser.newContext({ locale: 'fr-FR' });
  const page = await context.newPage();
  await page.goto(articleUrl);
  await page.locator('[data-powerfx-control]').first().waitFor({ state: 'visible' });
  assert(await page.locator('.code-copy').first().isVisible(), 'Copie non initialisee sur un vrai article');
  await context.close();
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(articleUrl);
  assert(await staticPage.locator('[data-powerfx-control]').first().isHidden(), 'Selecteur visible sans JavaScript');
  assert((await staticPage.locator('[data-powerfx] pre code').first().textContent()).length > 0, 'Code absent sans JavaScript');
  await noScript.close();
  console.log('Power Fx : defauts regionaux, conversion, coloration, ambiguite, copie et mobile : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
