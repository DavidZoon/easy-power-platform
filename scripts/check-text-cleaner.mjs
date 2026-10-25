import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';

const { server, url } = await preview(0);
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await context.addInitScript(() => {
    window.copiedText = null;
    Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async text => { window.copiedText = text; }
    } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url + 'outils/nettoyeur-de-texte/');
  const tool = page.locator('[data-text-cleaner]');
  await page.waitForFunction(() => !document.querySelector('[data-text-cleaner]').disabled);
  const input = page.locator('#cleaner-input');
  const output = page.locator('#cleaner-output');
  const boxes = page.locator('[data-option][type="checkbox"]');
  const selects = page.locator('[data-option]:is(select)');
  assert.equal(await boxes.locator(':scope:checked').count(), 0);
  assert.equal(await output.getAttribute('readonly'), '');
  assert.equal(await page.getByText('Collez votre texte, choisissez les nettoyages', { exact: false }).count(), 0);

  const source = '  Héllo,   MONDE !  \n\n  Héllo,   MONDE !  ';
  await input.fill(source);
  assert.equal(await output.inputValue(), source);
  await page.locator('#cleaner-case').selectOption('upper');
  await page.locator('#cleaner-select-all').click();
  assert.equal(await boxes.locator(':scope:checked').count(), await boxes.count());
  assert.equal(await page.locator('#cleaner-case').inputValue(), 'upper');
  assert.equal(await page.locator('#cleaner-tabs').inputValue(), 'keep');
  assert.equal(await output.inputValue(), 'HELLO MONDE');
  assert.equal(await input.inputValue(), source);
  await page.locator('#cleaner-copy').click();
  assert.equal(await page.evaluate(() => window.copiedText), 'HELLO MONDE');
  await page.locator('#cleaner-reset').click();
  assert.equal(await boxes.locator(':scope:checked').count(), 0);
  assert((await selects.evaluateAll(controls => controls.map(control => control.value))).every(value => value === 'keep'));
  assert.equal(await output.inputValue(), source);

  await input.fill('');
  await input.evaluate(element => {
    const data = new DataTransfer();
    data.setData('text/plain', 'Une ligne\r\nUne autre\rFin');
    element.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
  });
  await page.locator('#cleaner-copy').click();
  assert.equal(await page.evaluate(() => window.copiedText), 'Une ligne\r\nUne autre\rFin');

  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, value) => { element.dataset.theme = value; }, theme);
    for (const width of [1920, 1440, 900, 390, 320]) {
      await page.setViewportSize({ width, height: 1080 });
      await tool.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Débordement : ${theme}, ${width}`);
      const options = await page.locator('.cleaner-options').boundingBox();
      const textGrid = await page.locator('.text-cleaner .converter-grid').boundingBox();
      assert(options.y >= textGrid.y + textGrid.height, 'Options sous les deux textes');
      if (width === 1920) {
        for (const selector of ['#cleaner-input', '#cleaner-output', '.cleaner-options', '#cleaner-reset', '#cleaner-select-all']) {
          assert(await page.locator(selector).evaluate(element => {
            const box = element.getBoundingClientRect();
            return box.top >= 0 && box.bottom <= innerHeight;
          }), `Visible intégralement en Full HD : ${selector}`);
        }
        const reset = await page.locator('#cleaner-reset').boundingBox();
        const all = await page.locator('#cleaner-select-all').boundingBox();
        assert(Math.abs(reset.y - all.y) < 1 && all.x > reset.x, 'Actions côte à côte');
        assert.equal((await input.boundingBox()).height, 180);
      }
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(result.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Accessibilité : ${theme}, ${width}`);
    }
  }
  assert.deepEqual(errors, []);
  await context.close();
  console.log('Nettoyeur : sélection et réinitialisation, texte source préservé, copie CR/CRLF, Full HD, responsive et accessibilité : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
