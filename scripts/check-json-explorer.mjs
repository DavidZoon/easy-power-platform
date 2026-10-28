import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';

const { server, url } = await preview(0);
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.copiedJson = '';
    window.rejectJsonCopy = false;
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async value => {
      if (window.rejectJsonCopy) throw new Error('Test de refus');
      window.copiedJson = value;
    } } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url + 'outils/explorateur-json/');
  await page.waitForFunction(() => !document.querySelector('[data-json-explorer]').disabled);
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  const input = page.locator('#json-source');
  const explore = page.locator('#json-explore');
  const dialog = page.locator('#json-dialog');
  const output = page.locator('#json-expression');
  await page.locator('#json-example').click();
  assert(await dialog.isVisible());
  assert.equal(await page.locator('#json-function').inputValue(), 'triggerOutputs');
  assert.equal(await page.locator('#json-scope').inputValue(), 'outputs');
  assert(await page.locator('#json-action-field').isHidden());
  const example = JSON.parse(await input.inputValue());
  assert.equal(example.statusCode, 200);
  assert.equal(example.body.missing, null);
  assert.deepEqual(example.body.emptyArray, []);
  await page.getByRole('button', { name: 'Afficher le diagramme', exact: true }).click();
  await page.locator('.json-key').filter({ hasText: /^firstname$/ }).click();
  assert.equal(await output.inputValue(), "triggerOutputs()?['body/customer/firstname']");
  assert.equal(await page.locator('#json-result-heading').count(), 0);
  assert.equal(await page.locator('#json-zoom-in + .json-output-row #json-expression').count(), 1);
  await page.setViewportSize({ width: 1920, height: 1080 });
  const zoomBox = await page.locator('#json-zoom-in').boundingBox();
  const expressionBox = await output.boundingBox();
  assert(expressionBox.x > zoomBox.x + zoomBox.width && Math.abs(expressionBox.y - zoomBox.y) < 5,
    'Expression à droite du zoom + sur écran large');
  await input.fill('{');
  await explore.click();
  assert.match(await page.locator('#json-status').textContent(), /JSON invalide/);
  assert(await dialog.isHidden());
  const data = '{"value":[{"firstname":"David","customer":{"age":0}},{"firstname":"Marie"}],"empty":[],"null":null,"unsafe":"<img src=x onerror=alert(1)>"}';
  await input.fill(data);
  await explore.click();
  assert(await dialog.isVisible());
  assert.equal(await page.locator('#json-function').inputValue(), 'body');
  await page.locator('#json-function').selectOption('outputs');
  await page.locator('#json-action').fill('List_rows');
  await page.getByRole('button', { name: 'Afficher le diagramme', exact: true }).click();
  assert.equal(await page.locator('.json-card').count(), 5);
  await page.waitForFunction(() => document.querySelectorAll('.json-connections path').length === 4);
  const rootBox = await page.locator('.json-card').first().boundingBox();
  const childBox = await page.locator('.json-card').nth(1).boundingBox();
  assert(childBox.x > rootBox.x + rootBox.width, 'Cartes enfants à droite, sans imbrication visuelle');
  assert.equal(await page.locator('.json-connections text').count(), 4);
  assert.equal(await page.locator('#json-diagram img').count(), 0, 'Pas de HTML interprété');
  const first = page.locator('.json-key').filter({ hasText: /^firstname$/ }).first();
  const beforeSelection = await first.locator('..').boundingBox();
  await first.click();
  assert.equal(await output.inputValue(), "outputs('List_rows')?['body/value'][0]['firstname']");
  const toolbar = page.locator('.json-selection-tools');
  async function checkSelectionTools() {
    const jsonIcon = toolbar.getByRole('button', { name: 'Chemin JSON', exact: true }).locator('[aria-hidden]');
    assert(await jsonIcon.evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const rects = [...range.getClientRects()];
      const button = element.parentElement.getBoundingClientRect();
      return rects.length === 1 && rects[0].left >= button.left && rects[0].right <= button.right;
    }), 'Le pictogramme {...} tient sur une seule ligne dans le bouton');
    let overlaps = 0;
    for (const interaction of ['hover', 'focus']) {
      await page.mouse.move(0, 0);
      for (const button of await toolbar.locator('button').all()) {
        if (interaction === 'hover') await button.hover();
        else {
          await page.keyboard.press('Tab');
          await button.focus();
        }
        const tooltip = button.locator('.json-copy-tooltip');
        assert(await tooltip.isVisible());
        overlaps += await tooltip.evaluate(element => {
          const bounds = element.getBoundingClientRect();
          let checked = 0;
          for (const sibling of element.parentElement.parentElement.children) {
            if (sibling === element.parentElement) continue;
            const other = sibling.getBoundingClientRect();
            const left = Math.max(bounds.left, other.left);
            const right = Math.min(bounds.right, other.right);
            const top = Math.max(bounds.top, other.top);
            const bottom = Math.min(bounds.bottom, other.bottom);
            if (left >= right || top >= bottom) continue;
            element.style.pointerEvents = 'auto';
            const topmost = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
            element.style.removeProperty('pointer-events');
            if (topmost !== element) throw new Error('Un bouton recouvre le tooltip');
            checked++;
          }
          return checked;
        });
        await button.evaluate(element => element.blur());
      }
    }
    assert(overlaps > 0, 'Vérification effective de la superposition des tooltips et des boutons');
  }
  assert.equal(await toolbar.locator('button').count(), 3);
  assert.equal(await toolbar.evaluate(element => element.parentElement.id), 'json-diagram');
  await page.waitForFunction(() => document.querySelector('.json-selection-tools').style.left !== '');
  const afterSelection = await first.locator('..').boundingBox();
  assert.equal(beforeSelection.height, afterSelection.height, 'La sélection ne modifie pas la hauteur de la carte');
  const iconButtons = toolbar.locator('button');
  const iconBoxes = await Promise.all([0, 1, 2].map(index => iconButtons.nth(index).boundingBox()));
  assert(iconBoxes[1].y < iconBoxes[0].y && iconBoxes[1].y < iconBoxes[2].y, 'Disposition en arc');
  assert(iconBoxes.every(box => box.width === 40 && box.height === 40 && box.y + box.height <= afterSelection.y), 'Boutons compacts au-dessus du champ');
  assert(await iconButtons.first().evaluate(element => getComputedStyle(element).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'Fond opaque');
  await checkSelectionTools();
  const fullscreen = page.locator('#json-fullscreen');
  await fullscreen.click();
  await page.waitForFunction(() => document.fullscreenElement?.id === 'json-diagram-panel');
  assert.equal(await fullscreen.getAttribute('aria-pressed'), 'true');
  assert(await page.locator('#json-fullscreen-expand').isHidden());
  assert(await page.locator('#json-fullscreen-reduce').isVisible());
  assert(await output.isVisible());
  const panelBox = await page.locator('#json-diagram-panel').boundingBox();
  assert.equal(panelBox.width, 1920);
  assert.equal(panelBox.height, 1080);
  await fullscreen.click();
  await page.waitForFunction(() => !document.fullscreenElement);
  assert.equal(await fullscreen.getAttribute('aria-pressed'), 'false');
  await fullscreen.click();
  await page.waitForFunction(() => document.fullscreenElement);
  await page.evaluate(() => document.exitFullscreen());
  await page.waitForFunction(() => document.querySelector('#json-fullscreen').getAttribute('aria-pressed') === 'false');
  await toolbar.getByRole('button', { name: 'Chemin JSON', exact: true }).click();
  assert.equal(await page.evaluate(() => window.copiedJson), '$["value"][0]["firstname"]');
  await toolbar.getByRole('button', { name: 'Nom du champ', exact: true }).click();
  assert.equal(await page.evaluate(() => window.copiedJson), 'firstname');
  await page.locator('#json-copy').click();
  assert.equal(await page.evaluate(() => window.copiedJson), await output.inputValue());
  await page.evaluate(() => { window.rejectJsonCopy = true; });
  await toolbar.getByRole('button', { name: 'Expression Power Automate', exact: true }).click();
  assert.match(await page.locator('#json-copy-status').textContent(), /échoué/);
  assert(await output.evaluate(element => document.activeElement === element && element.selectionEnd === element.value.length));
  await page.evaluate(() => { window.rejectJsonCopy = false; });
  await page.locator('#json-collapse').click();
  assert.equal(await page.locator('.json-card[open]').count(), 0);
  await page.waitForFunction(() => document.querySelectorAll('.json-connections path').length === 0);
  await page.locator('#json-expand').click();
  assert.equal(await page.locator('.json-card[open]').count(), 5);
  await page.waitForFunction(() => document.querySelectorAll('.json-connections path').length === 4);
  await page.locator('#json-zoom-in').click();
  assert.equal(await page.locator('#json-zoom').textContent(), '110 %');
  await page.locator('#json-zoom-out').click();
  for (let count = 0; count < 10; count++) {
    if (await page.locator('#json-zoom-out').isEnabled()) await page.locator('#json-zoom-out').click();
  }
  assert.equal(await page.locator('#json-zoom').textContent(), '50 %');
  assert(await page.locator('#json-zoom-out').isDisabled());
  for (let count = 0; count < 10; count++) await page.locator('#json-zoom-in').click();
  assert.equal(await page.locator('#json-zoom').textContent(), '150 %');
  await page.waitForFunction(() => {
    const diagram = document.querySelector('#json-diagram');
    const path = diagram.querySelector('.json-connections path');
    const numbers = path.getAttribute('d').match(/-?[\d.]+/g).map(Number);
    const start = diagram.querySelector('.json-node-group > .json-card .json-field:last-child').getBoundingClientRect();
    return numbers.every(Number.isFinite) && start.width > 0;
  });
  assert(await page.locator('#json-zoom-in').isDisabled());
  for (let count = 0; count < 5; count++) await page.locator('#json-zoom-out').click();
  for (const source of ['triggerBody', 'triggerOutputs', 'item', 'items', 'body', 'outputs']) {
    await explore.click();
    await page.locator('#json-function').selectOption(source);
    const named = ['items', 'body', 'outputs'].includes(source);
    assert.equal(await page.locator('#json-action-field').isVisible(), named);
    if (named) await page.locator('#json-action').fill('Action');
    const scoped = ['triggerOutputs', 'outputs'].includes(source);
    assert.equal(await page.locator('#json-scope-field').isVisible(), scoped);
    if (scoped) await page.locator('#json-scope').selectOption('outputs');
    await page.getByRole('button', { name: 'Afficher le diagramme', exact: true }).click();
    await page.locator('.json-value').filter({ hasText: /^"David"$/ }).click();
    assert((await output.inputValue()).startsWith(`${source}(`));
    if (scoped) assert(!(await output.inputValue()).includes('body/'));
  }
  await explore.click();
  await page.keyboard.press('Escape');
  assert(await dialog.isHidden());
  assert(await explore.evaluate(element => document.activeElement === element));
  // Pasting, rather than typing, opens the configuration automatically.
  await input.evaluate(element => {
    element.value = '{"name":"paste"}';
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('paste', { bubbles: true }));
  });
  await dialog.waitFor({ state: 'visible' });
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, theme) => { element.dataset.theme = theme; }, theme);
    for (const width of [1920, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1080 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const modalAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(modalAxe.violations.map(item => item.id), [], `Modal ${theme} ${width}`);
    }
  }
  await page.locator('#json-cancel').click();
  await input.fill(data);
  await explore.click();
  await page.getByRole('button', { name: 'Afficher le diagramme', exact: true }).click();
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, theme) => { element.dataset.theme = theme; }, theme);
    for (const width of [1920, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1080 });
      await first.click();
      await checkSelectionTools();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(axe.violations.map(item => item.id), [], `Diagramme ${theme} ${width}`);
    }
  }
  await input.fill('false');
  assert.equal(await page.locator('.json-card').count(), 0, 'Une modification invalide le diagramme précédent');
  assert.equal(await output.inputValue(), '');
  await input.fill('{"":"empty","a/b":{"l\'été":null}}');
  await explore.click();
  await page.getByRole('button', { name: 'Afficher le diagramme', exact: true }).click();
  const emptyKey = page.locator('.json-key').filter({ hasText: /^\(nom vide\)$/ });
  await emptyKey.focus();
  await page.keyboard.press('Enter');
  assert.equal(await output.inputValue(), "body('Action')?['']");
  await page.locator('.json-key').filter({ hasText: /^l'été$/ }).click();
  assert.equal(await output.inputValue(), "body('Action')?['a/b']?['l''été']");
  await input.fill('false');
  await explore.click();
  await page.getByRole('button', { name: 'Afficher le diagramme', exact: true }).click();
  await page.locator('.json-value').click();
  assert.equal(await output.inputValue(), "body('Action')");
  await input.fill('{"body":{"name":"David"},"statusCode":200}');
  await explore.click();
  assert.equal(await page.locator('#json-function').inputValue(), 'outputs');
  assert.equal(await page.locator('#json-scope').inputValue(), 'outputs');
  await page.locator('#json-function').selectOption('triggerOutputs');
  await page.getByRole('button', { name: 'Afficher le diagramme', exact: true }).click();
  await explore.click();
  assert.equal(await page.locator('#json-function').inputValue(), 'triggerOutputs', 'Choix manuel conservé pour le même JSON');
  await page.locator('#json-cancel').click();
  assert.deepEqual(errors, []);
  assert.deepEqual(requests, [], 'Aucune transmission réseau pendant l’utilisation');
  await context.close();
  console.log('Explorateur JSON : diagramme, six sources, copie, modal, erreurs, responsive, confidentialité et accessibilité : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
