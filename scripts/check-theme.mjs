import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';
import { generateThemeCode } from '../assets/js/theme-builder.js';
import { generateThemeScreen } from '../assets/js/theme-screen.js';
import { parse } from 'yaml';
import { bestTextColor, createPalette } from '../assets/js/color-harmonizer.js';

const { server, url } = await preview(0);
const toolUrl = url + 'outils/constructeur-de-theme/';
let browser;
try {
  browser = await chromium.launch();
  const bannerContext = await browser.newContext();
  const bannerPage = await bannerContext.newPage();
  const screen = parse(generateThemeScreen('Aperçu', [{ name: 'fond', hex: '#FFFFFF' }])).Screens['Ecran visualiseur de theme'];
  const htmlFormula = screen.Children[0].ctn_ecran.Children[2].FooterContainer1.Children[0].htm_Infos.Properties.HtmlText;
  assert(htmlFormula.startsWith('="') && htmlFormula.endsWith('"'));
  const bannerHtml = htmlFormula.slice(2, -1).replaceAll('""', '"');
  await bannerPage.setContent(`<html lang="fr"><head><title>Bandeau</title></head><body style="margin:0">${bannerHtml}</body></html>`);
  for (const width of [280, 320, 768, 1440]) {
    await bannerPage.setViewportSize({ width, height: 100 });
    const banner = bannerPage.locator('a');
    const box = await banner.boundingBox();
    assert.equal(box.height, 75);
    assert.equal(box.width, width);
    assert(await banner.evaluate(element => [...element.children].every(child =>
      child.getBoundingClientRect().bottom <= element.getBoundingClientRect().bottom)
      && element.scrollWidth === element.clientWidth), `Bandeau sans texte coupé : ${width}px`);
    assert.equal(await banner.getAttribute('href'), 'https://davidzoon.github.io/easy-power-platform/');
  }
  const bannerAxe = await new AxeBuilder({ page: bannerPage }).withRules(['color-contrast']).analyze();
  assert.deepEqual(bannerAxe.violations, []);
  await bannerContext.close();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await context.addInitScript(() => {
    window.copiedTheme = null;
    window.rejectCopy = false;
    Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async value => {
        if (window.rejectCopy) throw new Error('Clipboard denied for test');
        window.copiedTheme = value;
      }
    } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(toolUrl);
  await page.waitForFunction(() => !document.querySelector('[data-theme-builder]').disabled);
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  const source = page.locator('#theme-source');
  const detect = { click: async () => {
    await page.locator('#theme-detect').click();
    if (await page.locator('#theme-text-dialog').isVisible()) await page.locator('#theme-text-no').click();
  } };
  const cards = page.locator('.theme-color');
  const output = page.locator('#theme-code');
  const copy = page.locator('#theme-copy');
  const status = page.locator('#theme-code-status');
  const screenOutput = page.locator('#theme-screen-code');
  const screenCopy = page.locator('#theme-screen-copy');
  const screenStatus = page.locator('#theme-screen-status');
  assert.equal(await page.locator('h1').textContent(), 'Constructeur de thème');
  assert(await copy.isDisabled());
  assert(await screenCopy.isDisabled());
  assert.equal(await screenOutput.inputValue(), '');
  assert.equal(await output.getAttribute('readonly'), '');
  assert(await page.locator('#theme-onstart-warning').isHidden());
  await detect.click();
  assert.match(await page.locator('#theme-detection-status').textContent(), /Collez un texte/);
  for (const box of await page.locator('.theme-formats input').all()) await box.uncheck();
  await source.fill('#F00');
  await detect.click();
  assert.equal(await cards.count(), 0);
  assert.match(await page.locator('#theme-detection-status').textContent(), /Cochez au moins/);

  const formats = {
    powerfx: ['RGBA(255;0;0;1) RGBA(255,0,0,1) ColorValue("#f00") Color.Red', '#FF0000'],
    hex: ['#00f 0x0000FF #0000FFFF', '#0000FF'],
    rgb: ['rgb(0 100% 0%) RGBA(0,255,0,1)', '#00FF00'],
    hsl: ['hsl(180deg 100% 50%)', '#00FFFF'],
    cmyk: ['CMJN(0%; 100%; 0%; 0%)', '#FF00FF'],
    html: ['rebeccapurple', '#663399'],
    ral: ['RAL 5015', '#2874B2']
  };
  for (const [format, [text, hex]] of Object.entries(formats)) {
    const checkbox = page.locator(`.theme-formats input[value="${format}"]`);
    await checkbox.check();
    await source.fill(text);
    await detect.click();
    assert.equal(await cards.count(), 1);
    assert.equal(await cards.locator('.theme-hex').inputValue(), hex);
    await cards.locator('.theme-remove').click();
    await checkbox.uncheck();
  }
  for (const box of await page.locator('.theme-formats input').all()) await box.check();
  const text = '#F00 RGBA(255;0;0;1) rgb(255,0,0) hsl(0,100%,50%) CMJN(0;1;1;0) red RAL3026 #12345680';
  await source.fill(text);
  await detect.click();
  assert.equal(await cards.count(), 2);
  assert.match(await page.locator('#theme-detection-status').textContent(), /6 doublon/);
  const first = cards.nth(0);
  const second = cards.nth(1);
  await first.locator('.theme-color-name').fill('primaire');
  await second.locator('.theme-color-name').fill('accent');
  await page.locator('#theme-name').fill('Ocean');
  await detect.click();
  assert.equal(await cards.count(), 2);
  assert.equal(await first.locator('.theme-color-name').inputValue(), 'primaire');
  assert.equal(await source.inputValue(), text);
  const detectionStatus = page.locator('#theme-detection-status');
  assert.match(await detectionStatus.textContent(), /Couleurs déjà présentes, non ajoutées : primaire \(#FF0000\), accent \(#12345680\)/);
  assert.equal((await detectionStatus.textContent()).match(/primaire \(#FF0000\)/g).length, 1);
  await source.fill('rgb(255,0,0) #F00 #ABCDEF');
  await detect.click();
  assert.equal(await cards.count(), 3);
  assert.match(await detectionStatus.textContent(), /1 couleur\(s\) ajoutée/);
  assert.match(await detectionStatus.textContent(), /Couleurs déjà présentes, non ajoutées : primaire \(#FF0000\)/);
  assert(!(await detectionStatus.textContent()).includes('accent (#12345680)'));
  await cards.last().locator('.theme-remove').click();
  await source.fill('#ABCDEF');
  await detect.click();
  assert(!(await detectionStatus.textContent()).includes('Couleurs déjà présentes'));
  await cards.last().locator('.theme-remove').click();
  await source.fill(text);

  const colors = [{ name: 'primaire', hex: '#FF0000' }, { name: 'accent', hex: '#12345680' }];
  for (const locale of ['fr', 'en']) {
    await page.locator(`[name="theme-locale"][value="${locale}"]`).check();
    for (const target of ['formulas', 'onstart']) {
      await page.locator(`[name="theme-target"][value="${target}"]`).check();
      assert.equal(await output.inputValue(), generateThemeCode('Ocean', colors, locale, target));
      assert.equal(await screenOutput.inputValue(), generateThemeScreen('Ocean', colors, target));
      await screenCopy.click();
      assert.equal(await page.evaluate(() => window.copiedTheme), await screenOutput.inputValue());
      assert.equal(await page.locator('#theme-onstart-warning').isVisible(), target === 'onstart');
      if (target === 'onstart') assert.equal(await page.locator('#theme-onstart-warning a').getAttribute('href'), 'https://learn.microsoft.com/fr-fr/power-apps/maker/canvas-apps/working-with-formulas');
      await copy.click();
      assert.equal(await page.evaluate(() => window.copiedTheme), await output.inputValue());
    }
  }
  await page.evaluate(() => { window.rejectCopy = true; });
  await screenCopy.click();
  assert.match(await screenStatus.textContent(), /échoué/);
  assert(await screenOutput.evaluate(element => document.activeElement === element && element.selectionEnd === element.value.length));
  await copy.click();
  assert.match(await status.textContent(), /échoué/);
  assert(await output.evaluate(element => document.activeElement === element && element.selectionEnd === element.value.length));
  await page.evaluate(() => { window.rejectCopy = false; });

  assert(await first.locator('.theme-color-editor').isHidden());
  await first.locator('.theme-color-open').click();
  assert.equal(await first.locator('.theme-color-open').getAttribute('aria-expanded'), 'true');
  await first.locator('.theme-hex').fill('#badvalue');
  assert(await copy.isDisabled());
  assert(await screenCopy.isDisabled());
  assert.equal(await screenOutput.inputValue(), '');
  assert.equal(await output.inputValue(), '');
  assert.match(await first.locator('.theme-color-error').textContent(), /invalide/);
  await first.locator('.theme-hex').fill('#fff');
  await first.locator('.theme-hex').press('Tab');
  assert.equal(await first.locator('.theme-hex').inputValue(), '#FFFFFF');
  await second.locator('.theme-color-open').click();
  await second.locator('.theme-fx').fill('RGBA(255; 127; 0; 0,5)');
  await second.locator('.theme-fx').press('Tab');
  assert.equal(await second.locator('.theme-hex').inputValue(), '#FF7F0080');
  assert.equal(await second.locator('.theme-alpha').inputValue(), '50');
  assert.equal(await second.locator('.theme-alpha-value').textContent(), '50 %');
  assert.equal(await second.locator('.theme-fx').inputValue(), 'RGBA(255, 127, 0, 0.5)');
  await page.locator('[name="theme-locale"][value="fr"]').check();
  assert.equal(await second.locator('.theme-fx').inputValue(), 'RGBA(255; 127; 0; 0,5)');
  await second.locator('.theme-fx').fill('RGBA(255; 127; 0; 0,5)');
  await second.locator('.theme-fx').press('Tab');
  assert.equal(await second.locator('.theme-fx').inputValue(), 'RGBA(255; 127; 0; 0,5)');
  await page.locator('[name="theme-locale"][value="en"]').check();
  await second.locator('.theme-picker').fill('#0078d4');
  assert.equal(await second.locator('.theme-hex').inputValue(), '#0078D480');
  await second.locator('.theme-alpha').fill('25');
  assert.equal(await second.locator('.theme-hex').inputValue(), '#0078D4BF');
  assert.equal(await second.locator('.theme-fx').inputValue(), 'RGBA(0, 120, 212, 0.75)');
  await second.locator('.theme-alpha').press('Escape');
  assert(await second.locator('.theme-color-editor').isHidden());
  assert.equal(await second.locator('.theme-color-open').getAttribute('aria-expanded'), 'false');
  assert(await second.locator('.theme-color-open').evaluate(element => element === document.activeElement));
  await second.locator('.theme-color-open').press('Enter');
  await second.locator('.theme-hex').fill('#FFFFFF');
  assert(await copy.isDisabled());
  assert.match(await second.locator('.theme-color-error').textContent(), /existe déjà/);
  await first.locator('.theme-remove').click();
  assert.equal(await cards.count(), 1);
  assert.equal(await cards.locator('.theme-hex').inputValue(), '#FFFFFF');
  assert(!(await copy.isDisabled()), 'Suppression du conflit réactive le code');
  await page.locator('#theme-add').click();
  assert.equal(await cards.count(), 2);
  assert.match(await cards.nth(1).locator('.theme-color-name').inputValue(), /^couleur_\d+$/);
  await cards.nth(1).locator('.theme-color-name').fill('ACCENT');
  assert(await copy.isDisabled());
  assert.equal(await cards.locator('.theme-color-name[aria-invalid="true"]').count(), 2);
  await cards.nth(1).locator('.theme-color-name').fill("Bleu d'été");
  assert((await output.inputValue()).includes("'Bleu d''été'"));
  await page.locator('#theme-name').fill('');
  assert(await copy.isDisabled());
  await page.locator('#theme-name').fill("L'été");
  assert((await output.inputValue()).includes("'gblL''été_HEX'"));
  await source.fill('RAL 9999 rgb(999,0,0) #xyz ColorValue(variable) <img src=x onerror=alert(1)> #000000');
  await detect.click();
  assert.equal(await page.locator('#theme-detection-issues li').count(), 4);
  assert.equal(await page.locator('.tool-content img').count(), 0);
  assert.equal(await cards.count(), 2, 'Une couleur déjà ajoutée ne doit pas être dupliquée');

  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, value) => { element.dataset.theme = value; }, theme);
    for (const width of [1920, 1000, 900, 390, 320]) {
      await page.setViewportSize({ width, height: 1080 });
      for (const card of await cards.all()) {
        const controls = await Promise.all(['.theme-color-name', '.theme-color-role', '.theme-color-open', '.theme-remove'].map(selector => card.locator(selector).boundingBox()));
        assert(controls.every(box => Math.abs(box.y - controls[0].y) < 1), `Une seule ligne : ${width}`);
        assert.equal((await card.locator('.theme-remove').textContent()).trim(), '');
        assert.equal(await card.locator('.theme-remove svg[aria-hidden="true"]').count(), 1);
        assert.match(await card.locator('.theme-remove').getAttribute('aria-label'), /^Supprimer la couleur/);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Débordement ${theme}, ${width}`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Accessibilité ${theme}, ${width}`);
      await cards.first().locator('.theme-color-close').click();
      assert(await cards.first().locator('.theme-color-editor').isHidden());
      assert((await cards.first().boundingBox()).height <= 64, `Ligne compacte : ${width}`);
      await cards.first().locator('.theme-color-open').click();
    }
  }
  while (await cards.count()) await cards.first().locator('.theme-remove').click();
  assert.equal(await output.inputValue(), '');
  assert(await copy.isDisabled());
  assert(await page.locator('#theme-empty').isVisible());
  assert(await page.locator('#theme-add').evaluate(element => element === document.activeElement));
  await source.fill(Array.from({ length: 130 }, (_, index) => '#' + (index + 1).toString(16).padStart(6, '0')).join(' '));
  await detect.click();
  assert.equal(await cards.count(), 130, 'Aucune limite arbitraire de taille de palette');
  while (await cards.count()) await cards.first().locator('.theme-remove').click();
  await source.fill('#FFFFFF #000000 #12345680');
  await page.locator('#theme-detect').click();
  assert(await page.locator('#theme-text-dialog').isVisible());
  assert.equal(await cards.locator('.theme-color-role').evaluateAll(controls => controls.every(control => control.value === 'background')), true);
  await page.locator('#theme-text-yes').click();
  assert(await page.locator('#theme-text-dialog').isHidden());
  assert.equal(await cards.count(), 5, 'Le noir et le blanc peuvent exister dans les deux rôles');
  assert.equal(await cards.locator('.theme-color-role').evaluateAll(controls => controls.filter(control => control.value === 'text').length), 2);
  assert.equal(await page.locator('.theme-combination').count(), 2);
  assert.deepEqual(await page.locator('.theme-contrast').allTextContents(), ['AAA · 21,00:1', 'AAA · 21,00:1']);
  assert.match(await page.locator('#theme-combinations-status').textContent(), /semi-transparentes exclues/);
  assert((await output.inputValue()).includes('accessibilité AAA contraste 21.00'));
  assert((await output.inputValue()).includes('couleur_Texte_fondSombre'));
  const backgroundName = await cards.nth(0).locator('.theme-color-name').inputValue();
  assert((await output.inputValue()).includes(`on_${backgroundName}: "#000000"`));
  assert((await output.inputValue()).includes(`ColorValue('gblL''été_HEX'.on_${backgroundName})`));
  for (const locale of ['fr', 'en']) {
    await page.locator(`[name="theme-locale"][value="${locale}"]`).check();
    for (const target of ['formulas', 'onstart']) {
      await page.locator(`[name="theme-target"][value="${target}"]`).check();
      const colorsWithRoles = await cards.evaluateAll(elements => elements.map(element => ({
        name: element.querySelector('.theme-color-name').value,
        hex: element.querySelector('.theme-hex').value,
        role: element.querySelector('.theme-color-role').value
      })));
      assert.equal(await output.inputValue(), generateThemeCode("L'été", colorsWithRoles, locale, target));
    }
  }
  await page.locator('#theme-detect').click();
  assert(await page.locator('#theme-text-dialog').isHidden(), 'Pas de proposition si des textes existent');
  assert.equal(await cards.count(), 5);
  for (const width of [1920, 390, 320]) {
    await page.setViewportSize({ width, height: 1080 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), []);
  }
  await cards.nth(3).locator('.theme-color-name').fill('on_' + backgroundName);
  assert(await copy.isDisabled());
  assert.match(await status.textContent(), /réservé/);
  await cards.nth(3).locator('.theme-color-name').fill('noir');
  await cards.nth(4).locator('.theme-color-role').selectOption('background');
  assert(await copy.isDisabled(), 'Doublon dans un même rôle interdit');
  await cards.nth(4).locator('.theme-color-role').selectOption('text');
  assert(!(await copy.isDisabled()));
  await cards.nth(4).locator('.theme-remove').click();
  assert.equal(await page.locator('.theme-contrast[data-level="Insuffisant"]').count(), 1, 'Noir sur noir : contraste insuffisant');
  await cards.nth(3).locator('.theme-color-open').click();
  await cards.nth(3).locator('.theme-alpha').fill('50');
  assert.equal(await page.locator('.theme-combination').count(), 0, 'Textes transparents exclus');
  assert(!(await output.inputValue()).includes('on_' + backgroundName + ':'));
  while (await cards.count()) await cards.first().locator('.theme-remove').click();
  await source.fill('#F00');
  await page.locator('#theme-detect').click();
  assert(await page.locator('#theme-text-dialog').isVisible());
  await page.keyboard.press('Escape');
  assert(await page.locator('#theme-text-dialog').isHidden());
  assert.equal(await cards.count(), 1, 'Échap ne crée pas de textes');
  await page.locator('#theme-detect').focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('#theme-text-dialog').isVisible());
  const modalResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  assert.deepEqual(modalResults.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), []);
  await page.locator('#theme-text-no').click();
  assert(await page.locator('#theme-detect').evaluate(element => element === document.activeElement));
  while (await cards.count()) await cards.first().locator('.theme-remove').click();
  await source.fill('#595959 #767676 #777777 #BBBBBB');
  await page.locator('#theme-detect').click();
  await page.locator('#theme-text-yes').click();
  await cards.nth(4).locator('.theme-remove').click();
  assert.deepEqual(await page.locator('#theme-combinations h3').allTextContents(), ['AAA', 'AA', 'A', 'Insuffisant']);
  const badgeColors = await page.locator('.theme-contrast').evaluateAll(elements => elements.map(element => getComputedStyle(element).backgroundColor));
  assert.deepEqual(badgeColors, ['rgb(220, 252, 231)', 'rgb(219, 234, 254)', 'rgb(255, 237, 213)', 'rgb(254, 226, 226)']);
  assert.equal(await page.locator('.theme-combination').count(), 4);
  assert((await output.inputValue()).includes('accessibilité A contraste 4.48'));
  assert((await output.inputValue()).includes("⚠️ à n'utiliser qu'avec une grande taille de police"));
  assert((await output.inputValue()).includes('⛔ contraste inaccessible, NE PAS UTILISER'));
  assert.equal((await output.inputValue()).split("⚠️ à n'utiliser qu'avec une grande taille de police").length - 1, 2);
  assert.equal((await output.inputValue()).split('⛔ contraste inaccessible, NE PAS UTILISER').length - 1, 2);
  await source.fill('#000000');
  await detect.click();
  const aaaLabels = await page.locator('.theme-combination-grid').first().locator('.theme-contrast').allTextContents();
  assert.match(aaaLabels[0], /21,00:1/, 'Classement par ratio décroissant au sein d’un niveau');
  for (const width of [1920, 390, 320]) {
    await page.setViewportSize({ width, height: 1080 });
    assert.equal(await page.locator('.theme-contrast-help').getAttribute('open'), null);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    if (width === 1920) {
      const gallery = await page.locator('[aria-labelledby="theme-combinations-heading"]').boundingBox();
      assert(gallery.height <= 500, `Galerie de cinq associations sur quatre niveaux : ${gallery.height}px`);
      const samples = await page.locator('.theme-combination-grid').first().locator('.theme-combination').all();
      const boxes = await Promise.all(samples.map(sample => sample.boundingBox()));
      assert(Math.abs(boxes[0].y - boxes[1].y) < 1, 'Deux associations du même niveau côte à côte');
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })), []);
  }
  assert.deepEqual(requests, [], 'Les données ne doivent jamais être envoyées à un service');
  assert.deepEqual(errors, []);
  const transferPage = await context.newPage();
  for (const [hex, harmony, locale] of [['#6750A4', 'triadic', 'en'], ['#000000', 'monochromatic', 'fr']]) {
    await transferPage.goto(url + 'outils/harmoniseur-de-couleurs/');
    await transferPage.waitForFunction(() => !document.querySelector('[data-color-harmonizer]').disabled);
    await transferPage.locator('#harmony-hex').fill(hex);
    await transferPage.locator('#harmony-hex').press('Tab');
    await transferPage.locator('#harmony-type').selectOption(harmony);
    await transferPage.locator('#harmony-locale').selectOption(locale);
    const expectedBackgrounds = [...new Set(createPalette(hex, harmony))];
    const expectedTexts = [...new Set(expectedBackgrounds.map(color => bestTextColor(color).hex))];
    await transferPage.locator('#harmony-open-theme').click();
    await transferPage.waitForURL(target => target.pathname.endsWith('/outils/constructeur-de-theme/'));
    await transferPage.waitForFunction(() => !document.querySelector('[data-theme-builder]').disabled);
    const importedColors = await transferPage.locator('.theme-color').evaluateAll(elements => elements.map(element => ({
      hex: element.querySelector('.theme-hex').value, role: element.querySelector('.theme-color-role').value,
      name: element.querySelector('.theme-color-name').value
    })));
    assert.deepEqual(importedColors.filter(color => color.role === 'background').map(color => color.hex), expectedBackgrounds);
    assert.deepEqual(importedColors.filter(color => color.role === 'text').map(color => color.hex), expectedTexts);
    assert.equal(await transferPage.locator('[name="theme-locale"]:checked').inputValue(), locale);
    assert.equal(await transferPage.locator('.theme-combination').count(), expectedBackgrounds.length);
    assert(await transferPage.locator('#theme-text-dialog').isHidden());
    assert.equal(await transferPage.locator('#theme-code').inputValue(), generateThemeCode('Mon_theme', importedColors, locale));
    await transferPage.reload();
    await transferPage.waitForFunction(() => !document.querySelector('[data-theme-builder]').disabled);
    assert.equal(await transferPage.locator('.theme-color').count(), expectedBackgrounds.length + expectedTexts.length);
  }
  await transferPage.goto(toolUrl + '#palette=invalid');
  await transferPage.reload();
  await transferPage.waitForFunction(() => !document.querySelector('[data-theme-builder]').disabled);
  assert.equal(await transferPage.locator('.theme-color').count(), 0);
  assert.match(await transferPage.locator('#theme-detection-status').textContent(), /invalide/);
  await context.close();

  const fallback = await browser.newContext();
  await fallback.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
  const manual = await fallback.newPage();
  await manual.goto(toolUrl);
  await manual.waitForFunction(() => !document.querySelector('[data-theme-builder]').disabled);
  await manual.locator('#theme-add').click();
  assert((await manual.locator('#theme-code').inputValue()).includes('ColorValue'));
  assert(await manual.locator('#theme-copy').isDisabled());
  assert.match(await manual.locator('#theme-code-status').textContent(), /manuellement/);
  await fallback.close();
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(toolUrl);
  assert(await staticPage.locator('noscript').isVisible());
  assert(await staticPage.locator('#theme-detect').isDisabled());
  await noScript.close();
  console.log('Constructeur de thème : sept formats, déduplication, édition, quatre sorties Power Fx, copie, aucune requête, responsive et accessibilité : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
