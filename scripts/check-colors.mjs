import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';
import { bestTextColor, createPalette, hexToHsl, powerFxRgba } from '../assets/js/color-harmonizer.js';

const { server, url } = await preview(0);
const toolUrl = url + 'outils/harmoniseur-de-couleurs/';
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => {
    window.copiedColors = null;
    window.rejectCopy = false;
    window.pickMode = 'success';
    Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async text => {
        if (window.rejectCopy) throw new Error('Clipboard denied for test');
        window.copiedColors = text;
      }
    } });
    window.EyeDropper = class {
      async open() {
        if (window.pickMode === 'abort') throw new DOMException('Cancelled', 'AbortError');
        if (window.pickMode === 'error') throw new Error('Picking failed for test');
        return { sRGBHex: '#12ab34' };
      }
    };
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(toolUrl);
  await page.waitForFunction(() => !document.querySelector('[data-color-harmonizer]').disabled);
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  const hex = page.locator('#harmony-hex');
  const type = page.locator('#harmony-type');
  const status = page.locator('#harmony-status');
  const paletteValues = () => page.locator('[id$="-hex"][readonly]').evaluateAll(inputs => inputs.map(input => input.value));
  assert(await page.locator('#harmony-arc-control').isHidden());
  await type.selectOption('analogous');
  assert(await page.locator('#harmony-arc-control').isVisible());
  for (const mode of ['geometric', 'ui']) {
    await page.locator('#harmony-mode').selectOption(mode);
    for (const arc of ['30', '90', '120']) {
      await page.locator('#harmony-arc').fill(arc);
      assert.deepEqual(await paletteValues(), createPalette('#6750A4', 'analogous', mode, Number(arc)));
      assert.match(await page.locator('#harmony-arc-label').textContent(), new RegExp(`^${arc}°`));
    }
  }
  await type.selectOption('triadic');
  assert(await page.locator('#harmony-arc-control').isHidden());
  await type.selectOption('analogous');
  assert.equal(await page.locator('#harmony-arc').inputValue(), '120');
  await page.locator('#harmony-arc').fill('60');
  await page.locator('#harmony-mode').selectOption('geometric');
  await page.setViewportSize({ width: 1920, height: 1080 });
  const largeWheel = await page.locator('#harmony-wheel').boundingBox();
  assert.equal(largeWheel.width, 320);
  assert.equal(largeWheel.height, 320);
  await page.locator('[data-color-harmonizer]').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  for (const selector of ['.harmony-settings > section:first-child', '.harmony-settings > section:nth-child(2)', '#harmony-palette']) {
    assert(await page.locator(selector).evaluate(element => {
      const box = element.getBoundingClientRect();
      return box.top >= 0 && box.bottom <= innerHeight;
    }), `Visible simultanément sur grand écran : ${selector}`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.equal(await page.locator('h1').textContent(), 'Harmoniseur de couleurs');
  assert.equal(await page.locator('.harmony-color').count(), 5);
  assert.equal(await page.locator('.harmony-color input[readonly]').count(), 15);
  for (const harmony of ['monochromatic', 'analogous', 'complementary', 'split', 'triadic', 'tetradic', 'square']) {
    await type.selectOption(harmony);
    assert.deepEqual(await paletteValues(), createPalette('#6750A4', harmony));
    for (const [index, color] of (await paletteValues()).entries()) {
      const text = bestTextColor(color);
      assert.equal(await page.locator(`#harmony-color-${index}-text`).inputValue(), text.hex);
      const badge = page.locator(`#harmony-color-${index}-contrast`);
      assert.equal(await badge.getAttribute('data-level'), text.level);
      assert.equal(await badge.textContent(), `${text.level} · ${text.ratio.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}:1`);
      assert.equal(await badge.evaluate(element => getComputedStyle(element).backgroundColor), text.level === 'AAA' ? 'rgb(220, 252, 231)' : 'rgb(219, 234, 254)');
      assert.equal(await page.locator(`[data-swatch="${index}"]`).evaluate(element => element.style.color), text.hex === '#000000' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
      const point = page.locator('.harmony-marker').nth(index);
      assert.equal(await point.textContent(), String(index + 1));
      const position = hexToHsl(color);
      const expectedLeft = 50 + Math.sin(position.h * Math.PI / 180) * position.s / 2;
      const expectedTop = 50 - Math.cos(position.h * Math.PI / 180) * position.s / 2;
      const coordinates = await point.evaluate(element => ({ left: parseFloat(element.style.left), top: parseFloat(element.style.top) }));
      assert(Math.abs(coordinates.left - expectedLeft) < 0.01);
      assert(Math.abs(coordinates.top - expectedTop) < 0.01);
    }
  }
  for (const harmony of ['monochromatic', 'analogous', 'complementary', 'split', 'triadic', 'tetradic', 'square']) {
    await type.selectOption(harmony);
    await page.locator('#harmony-mode').selectOption('ui');
    const expected = createPalette('#6750A4', harmony, 'ui');
    assert.deepEqual(await paletteValues(), expected);
    assert((await page.locator('#harmony-advice').textContent()).length > 20);
    for (const [index, color] of expected.entries()) {
      assert.equal(await page.locator(`#harmony-color-${index}-text`).inputValue(), bestTextColor(color).hex);
      assert.equal(await page.locator(`#harmony-color-${index}-rgba`).inputValue(), powerFxRgba(color));
    }
    await page.locator('#harmony-copy-all').click();
    assert.equal(await page.evaluate(() => window.copiedColors), expected.map(color => `${color}\t${powerFxRgba(color)}`).join('\n'));
    await page.locator('#harmony-mode').selectOption('geometric');
    assert.deepEqual(await paletteValues(), createPalette('#6750A4', harmony));
  }
  await hex.fill('#f00');
  assert.equal((await paletteValues())[0], '#FF0000');
  assert.equal(await page.locator('#harmony-color-0-rgba').inputValue(), 'RGBA(255; 0; 0; 1)');
  const beforeInvalid = await paletteValues();
  await hex.fill('#oops');
  assert.equal(await hex.getAttribute('aria-invalid'), 'true');
  assert(await page.locator('#harmony-hex-error').isVisible());
  assert.deepEqual(await paletteValues(), beforeInvalid);
  await hex.fill('#00FF00');
  assert.equal(await hex.getAttribute('aria-invalid'), null);
  await page.locator('#harmony-locale').selectOption('en');
  assert.equal(await page.locator('#harmony-color-0-rgba').inputValue(), 'RGBA(0, 255, 0, 1)');
  await page.getByRole('button', { name: 'Copier RGBA() — couleur 1', exact: true }).click();
  assert.equal(await page.evaluate(() => window.copiedColors), 'RGBA(0, 255, 0, 1)');
  await page.getByRole('button', { name: 'Copier HEX — couleur 1', exact: true }).locator('svg rect').click();
  assert.equal(await page.evaluate(() => window.copiedColors), '#00FF00');
  await page.getByRole('button', { name: 'Copier texte — couleur 1', exact: true }).click();
  assert.equal(await page.evaluate(() => window.copiedColors), '#000000');
  await page.locator('#harmony-copy-all').click();
  assert.equal(await page.evaluate(() => window.copiedColors), (await paletteValues()).map(color => `${color}\t${powerFxRgba(color, 'en')}`).join('\n'));
  await page.evaluate(() => { window.rejectCopy = true; });
  await page.locator('#harmony-copy-all').click();
  assert.match(await status.textContent(), /échoué/);
  assert(await page.locator('#harmony-color-0-hex').evaluate(element => document.activeElement === element && element.selectionEnd === element.value.length));
  await page.evaluate(() => { window.rejectCopy = false; });

  await page.locator('#harmony-picker').fill('#0000ff');
  assert.equal((await paletteValues())[0], '#0000FF');
  const wheel = page.locator('#harmony-wheel');
  await wheel.scrollIntoViewIfNeeded();
  const box = await wheel.boundingBox();
  await wheel.click({ position: { x: box.width / 2, y: 2 } });
  const selected = (await paletteValues())[0];
  const hsl = hexToHsl(selected);
  assert(hsl.h < 1 && hsl.s > 95, 'Le haut de la roue doit sélectionner un rouge saturé');
  await wheel.press('ArrowRight');
  assert.notEqual((await paletteValues())[0], selected, 'Le clavier doit agir sur la roue');
  assert.equal(await page.locator('#harmony-hue, #harmony-saturation').count(), 0);
  await hex.fill('#008000');
  await page.locator('#harmony-lightness').fill('50');
  assert.equal((await paletteValues())[0], '#00FF00');
  await wheel.scrollIntoViewIfNeeded();
  const dragBox = await wheel.boundingBox();
  await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + 3);
  await page.mouse.down();
  await page.mouse.move(dragBox.x + dragBox.width - 3, dragBox.y + dragBox.height / 2, { steps: 5 });
  await page.mouse.up();
  assert(Math.abs(hexToHsl((await paletteValues())[0]).h - 90) < 2, 'Le glisser doit ajuster la couleur en temps réel');

  await page.locator('#harmony-eyedropper').click();
  assert.equal((await paletteValues())[0], '#12AB34');
  await page.evaluate(() => { window.pickMode = 'abort'; });
  await page.locator('#harmony-eyedropper').click();
  assert.equal((await paletteValues())[0], '#12AB34');
  assert.match(await status.textContent(), /annulé/);
  await page.evaluate(() => { window.pickMode = 'error'; });
  await page.locator('#harmony-eyedropper').click();
  assert.match(await status.textContent(), /échoué/);
  assert(!(await page.locator('#harmony-eyedropper').isDisabled()));
  assert.deepEqual(requests, [], 'Aucune requête pendant le calcul et la copie');
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const copyButtons = await page.locator('.harmony-copy').evaluateAll(buttons => buttons.map(button => {
        const box = button.getBoundingClientRect();
        return {
          width: box.width, height: box.height, radius: getComputedStyle(button).borderRadius,
          title: button.title, label: button.getAttribute('aria-label'),
          icon: Boolean(button.querySelector('svg[aria-hidden="true"]')),
          text: button.textContent.trim(), after: getComputedStyle(button, '::after').content
        };
      }));
      assert.equal(copyButtons.length, 15);
      for (const button of copyButtons) {
        assert(Math.abs(button.width - 35.2) < .1);
        assert(Math.abs(button.height - 35.2) < .1);
        assert.equal(button.radius, '50%');
        assert.equal(button.title, button.label);
        assert(button.icon);
        assert.equal(button.text, '');
        assert(['none', 'normal'].includes(button.after));
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Débordement ${theme}, ${width}`);
      const controls = await Promise.all(['#harmony-picker', '#harmony-hex', '#harmony-eyedropper'].map(selector => page.locator(selector).boundingBox()));
      assert(controls.every(box => Math.abs(box.y + box.height / 2 - controls[0].y - controls[0].height / 2) < 2), `Contrôles sur la même ligne ${theme}, ${width}`);
      assert.equal((await page.locator('#harmony-eyedropper').textContent()).trim(), '');
      assert.equal(await page.locator('#harmony-eyedropper svg').count(), 1);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(result.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Accessibilité ${theme}, ${width}`);
    }
  }
  assert.deepEqual(errors, []);
  await context.close();
  const fallback = await browser.newContext();
  await fallback.addInitScript(() => {
    window.EyeDropper = undefined;
    Object.defineProperty(navigator, 'clipboard', { value: undefined });
  });
  const fallbackPage = await fallback.newPage();
  await fallbackPage.goto(toolUrl);
  await fallbackPage.waitForFunction(() => !document.querySelector('[data-color-harmonizer]').disabled);
  assert(await fallbackPage.locator('#harmony-eyedropper').isDisabled());
  assert.match(await fallbackPage.locator('#harmony-eyedropper-help').textContent(), /pas prise en charge/);
  assert(await fallbackPage.locator('#harmony-copy-all').isDisabled());
  assert.match(await fallbackPage.locator('#harmony-status').textContent(), /manuellement/);
  await fallback.close();
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(toolUrl);
  assert(await staticPage.locator('noscript').isVisible());
  assert(await staticPage.locator('#harmony-picker').isDisabled());
  await noScript.close();
  console.log('Harmoniseur : sept harmonies, HEX/RGBA, roue et clavier, pipette, copie et erreurs, aucun envoi réseau, responsive et accessibilité : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
