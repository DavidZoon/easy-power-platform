import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parse } from 'yaml';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';

const { server, url } = await preview(0);
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.copiedCode = null;
    window.rejectCopy = false;
    Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async text => {
        if (window.rejectCopy) throw new Error('Clipboard denied for test');
        window.copiedCode = text;
      }
    } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url + 'outils/');
  const tools = parse(await fs.readFile('_data/tools.yml', 'utf8'));
  assert.equal(await page.locator('nav a[aria-current="page"]').textContent(), 'Outils');
  assert.equal(await page.locator('.tool-card').count(), tools.length);
  assert.equal(await page.locator('[data-powerfx-converter], .tools-list details').count(), 0);
  assert.equal(await page.locator('script[src$="/tools.js"]').count(), 0, 'Le catalogue ne doit pas charger le convertisseur');
  for (const [index, tool] of tools.entries()) {
    const card = page.locator('.tool-card').nth(index);
    assert.equal(await card.locator('h2').textContent(), tool.name);
    assert.equal(await card.locator('p').textContent(), tool.description);
    const image = card.locator('img');
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => element.decode());
    assert(await image.evaluate(element => element.naturalWidth > 0), 'Illustration absente');
    assert((await image.getAttribute('src')).endsWith(tool.image));
    await card.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(new URL(tool.url.replace(/^\//, ''), url).href);
    assert.equal(await page.locator('h1').textContent(), tool.name);
    await page.getByRole('link', { name: '← Tous les outils', exact: true }).click();
    await page.waitForURL(url + 'outils/');
  }
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Catalogue : débordement ${theme}, ${width}`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Catalogue : accessibilité ${theme}, ${width}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  const converterUrl = url + 'outils/convertisseur-power-fx/';
  await page.goto(converterUrl);
  const input = page.locator('#powerfx-input');
  const output = page.locator('#powerfx-output');
  const status = page.locator('#powerfx-conversion-status');
  const copy = page.locator('#powerfx-copy');
  const format = page.locator('#powerfx-source-format');
  await page.waitForFunction(() => !document.querySelector('[data-powerfx-converter]').disabled);
  assert.equal(await page.locator('.tool-content details').count(), 0);
  assert(await copy.isDisabled());
  assert(await output.getAttribute('readonly') !== null);
  const requests = [];
  page.on('request', request => requests.push(request.url()));

  const english = 'Set(x, 1.5); Notify("texte , ; 1.5", NotificationType.Success)\n// garder , ;\nSet(y, $"Total {Sum(1.5, 2)}")';
  const french = 'Set(x; 1,5);; Notify("texte , ; 1.5"; NotificationType.Success)\n// garder , ;\nSet(y; $"Total {Sum(1,5; 2)}")';
  for (const [source, target, detected, label] of [
    ['Navigate(home; ScreenTransition.Fade)', 'Navigate(home, ScreenTransition.Fade)', 'FR', 'EN'],
    [english, french, 'EN', 'FR'],
    [french, english, 'FR', 'EN'],
    ['Set(x, "<img src=x onerror=alert(1)>")', 'Set(x; "<img src=x onerror=alert(1)>")', 'EN', 'FR']
  ]) {
    await input.fill(source);
    assert.equal(await output.inputValue(), target);
    assert.equal(await input.inputValue(), source, 'Le code source ne doit pas être réécrit');
    assert.equal(await page.locator('#powerfx-detected').textContent(), `Format détecté : ${detected}`);
    assert.equal(await page.locator('#powerfx-output-label').textContent(), `Conversion au format ${label}`);
    for (const [index, text] of [source, target].entries()) {
      const preview = page.locator('.code-editor pre').nth(index);
      assert.equal(await preview.getAttribute('aria-hidden'), 'true');
      assert.equal(await preview.textContent(), text + '\n', 'Coloration sans perte de texte');
      assert(await preview.locator('.nf').count() > 0, 'Fonctions non colorees');
    }
  }
  assert.equal(await page.locator('.tool-content img').count(), 0, 'Code interprété comme HTML');
  await copy.click();
  assert.equal(await page.evaluate(() => window.copiedCode), await output.inputValue());
  assert.match(await status.textContent(), /copié/);
  await page.evaluate(() => { window.rejectCopy = true; });
  await copy.click();
  assert.match(await status.textContent(), /échoué/);
  assert(await output.evaluate(element => document.activeElement === element && element.selectionEnd === element.value.length));

  for (const text of ['[1,2]', 'Set(x; 1.5)', 'Set(x, "unfinished']) {
    await input.fill(text);
    assert.equal(await output.inputValue(), '');
    assert(await copy.isDisabled());
    assert.match(await status.textContent(), /ambiguë, mixte ou incomplète/);
  }
  await input.fill('[1,2]');
  await format.selectOption('comma');
  assert.equal(await output.inputValue(), '[1;2]');
  await format.selectOption('semicolon');
  assert.equal(await output.inputValue(), '[1.2]');
  await format.selectOption('auto');
  assert.equal(await output.inputValue(), '');
  await input.fill('ThisItem.Value + 1');
  assert.equal(await output.inputValue(), 'ThisItem.Value + 1');
  assert.match(await status.textContent(), /identique/);
  await input.fill('');
  assert.equal(await output.inputValue(), '');
  assert(await copy.isDisabled());
  assert.equal(await status.textContent(), '');
  const longCode = Array.from({ length: 100 }, (_, index) =>
    `Set(value${index}, "${'long text '.repeat(20)}"); // ${index}`).join('\n');
  await input.fill(longCode);
  for (const [origin, top] of [[input, 160], [output, 320], [input, 0]]) {
    await origin.evaluate((element, value) => { element.scrollTop = value; }, top);
    await page.waitForFunction(value => {
      const input = document.querySelector('#powerfx-input');
      const output = document.querySelector('#powerfx-output');
      return input.scrollTop === value && output.scrollTop === value;
    }, top);
    for (const field of [input, output]) {
      assert(await field.evaluate(element => {
        const code = element.parentElement.querySelector('code');
        return code.style.transform === `translate(${-element.scrollLeft}px, ${-element.scrollTop}px)`;
      }), 'Coloration desynchronisee du defilement');
    }
  }
  await input.evaluate(element => { element.scrollLeft = 120; });
  await page.waitForFunction(() => document.querySelector('.code-editor code').style.transform.startsWith('translate(-120px,'));
  await output.evaluate(element => { element.style.height = '450px'; });
  const bottom = await input.evaluate(element => {
    element.scrollTop = element.scrollHeight;
    return element.scrollTop;
  });
  await page.waitForFunction(() => {
    const output = document.querySelector('#powerfx-output');
    return output.scrollTop === output.scrollHeight - output.clientHeight;
  });
  await page.waitForTimeout(100);
  assert.equal(await input.evaluate(element => element.scrollTop), bottom, 'Le champ partenaire ne doit pas annuler le defilement en fin de texte');
  await output.evaluate(element => { element.style.height = ''; });
  await input.evaluate(element => { element.style.height = '520px'; });
  const sizes = await page.locator('.code-editor').evaluateAll(editors => editors.map(editor => {
    const box = editor.getBoundingClientRect();
    const field = editor.querySelector('textarea').getBoundingClientRect();
    return Math.round(box.height - field.height);
  }));
  assert.deepEqual(sizes, [0, 0], 'Les champs doivent remplir leur bloc apres redimensionnement');
  assert(Math.abs((await input.boundingBox()).height - (await output.boundingBox()).height) < 2, 'Hauteurs des deux champs differentes');
  await input.evaluate(element => { element.style.height = ''; });
  await input.fill('Set(x, "unfinished');
  assert.equal(await page.locator('.code-editor pre').first().textContent(), 'Set(x, "unfinished\n');
  await input.fill('');
  assert.deepEqual(requests, [], 'La conversion ne doit émettre aucune requête');
  assert.deepEqual(errors, []);

  await input.fill(english);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Débordement : ${theme}, ${width}`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Accessibilité : ${theme}, ${width}`);
      const boxes = await Promise.all([input, output].map(locator => locator.boundingBox()));
      assert(width === 1440 ? Math.abs(boxes[0].y - boxes[1].y) < 2 : boxes[1].y > boxes[0].y + boxes[0].height, 'Disposition des champs');
    }
    await page.emulateMedia({ forcedColors: 'active' });
    assert.equal(await input.evaluate(element => getComputedStyle(element).color === 'rgba(0, 0, 0, 0)'), false);
    assert.equal(await page.locator('.code-editor pre').first().evaluate(element => getComputedStyle(element).visibility), 'hidden');
    await page.emulateMedia({ forcedColors: 'none' });
  }
  await context.close();

  const noClipboard = await browser.newContext();
  await noClipboard.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
  const manualPage = await noClipboard.newPage();
  await manualPage.goto(converterUrl);
  await manualPage.waitForFunction(() => !document.querySelector('[data-powerfx-converter]').disabled);
  await manualPage.locator('#powerfx-input').fill('Set(x, 1)');
  assert.equal(await manualPage.locator('#powerfx-output').inputValue(), 'Set(x; 1)');
  assert(await manualPage.locator('#powerfx-copy').isDisabled());
  assert.match(await manualPage.locator('[role="status"]').textContent(), /copiez-le manuellement/);
  await noClipboard.close();

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(url + 'outils/');
  await staticPage.locator('.tool-card').first().click();
  await staticPage.waitForURL(converterUrl);
  assert(await staticPage.locator('noscript').isVisible());
  assert(await staticPage.locator('#powerfx-input').isDisabled());
  await noScript.close();
  console.log('Outils : catalogue illustré, navigation clavier et sans JS, EN/FR, ambiguïté, copie, erreurs, aucun envoi réseau, responsive et accessibilité clair/sombre : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
