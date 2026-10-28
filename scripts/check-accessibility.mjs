import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { preview } from './preview.mjs';

const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const { server, url } = await preview(0);
const origin = new URL(url).origin;
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const external = [];
  page.on('request', request => { if (new URL(request.url()).origin !== origin) external.push(request.url()); });
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const manifest = JSON.parse(await fs.readFile('_data/migration.json', 'utf8'));
  const post = new URL(manifest.posts.at(-1).permalink.slice(1), url).href;
  const html = page.locator('html');
  const toggle = page.locator('.a11y-toggle');
  const panel = page.locator('#a11y-panel');
  const attr = name => html.getAttribute(`data-a11y-${name}`);
  async function checkRows(label) {
    const rows = await panel.locator('.a11y-choice, .a11y-field').evaluateAll(elements =>
      elements.map(element => {
        const [title, control] = [...element.children].map(child => child.getBoundingClientRect());
        return {
          aligned: Math.abs(title.y + title.height / 2 - control.y - control.height / 2) < 1,
          beside: title.right <= control.left,
          fits: element.scrollWidth <= element.clientWidth + 1
        };
      }));
    assert.equal(rows.length, 6);
    assert(rows.every(row => row.aligned && row.beside && row.fits), `Libellés et contrôles sur la même ligne : ${label}`);
    assert(await panel.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Menu sans débordement interne : ${label}`);
  }

  await page.goto(post);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const theme = await page.locator('.theme-toggle').boundingBox();
  const button = await toggle.boundingBox();
  assert(button.x > theme.x + theme.width - 1, 'Le bouton Accessibilité est à droite du bouton thème');
  assert(Math.abs(button.y + button.height / 2 - theme.y - theme.height / 2) < 1, 'Boutons alignés');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');

  await toggle.click();
  assert(await panel.isVisible(), 'Le menu s’ouvre');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement.name), 'a11y-text', 'Le focus entre dans le menu');
  for (const width of [1920, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await checkRows(`standard, ${width}px`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const infoButton = panel.getByRole('button', { name: 'À propos de ce menu' });
  const credit = panel.locator('#a11y-credit');
  await infoButton.hover();
  assert(await credit.isVisible(), 'Crédit visible au survol');
  await credit.hover();
  assert(await credit.isVisible(), 'Le crédit reste visible au survol de son lien');
  assert.equal(await credit.getByRole('link').getAttribute('href'), 'https://nelsonboruchowitch.com/index.html');
  await panel.locator('h2').hover();
  assert(await credit.isHidden(), 'Le crédit se ferme en quittant le survol');
  await infoButton.click();
  await panel.locator('h2').hover();
  assert(await credit.isVisible(), 'Le clic maintient le crédit ouvert');
  await page.keyboard.press('Tab');
  assert(await credit.getByRole('link').evaluate(element => element === document.activeElement), 'Portfolio accessible au clavier');
  await page.keyboard.press('Escape');
  assert(await credit.isHidden(), 'Échap ferme le crédit');
  assert(await panel.isVisible(), 'Le menu reste ouvert après fermeture du crédit');
  assert(await infoButton.evaluate(element => element === document.activeElement), 'Focus rendu au bouton information');
  await page.keyboard.press('Enter');
  assert(await credit.isVisible(), 'Crédit ouvert au clavier');
  const creditAxe = await new AxeBuilder({ page }).include('#a11y-panel').withTags(tags).analyze();
  assert.deepEqual(creditAxe.violations.map(v => v.id), [], 'Encart de crédit accessible');
  await page.keyboard.press('Enter');
  assert(await credit.isHidden(), 'Un second clic ferme le crédit');
  for (const theme of ['dark', 'light']) {
    await html.evaluate((element, value) => { element.dataset.theme = value; }, theme);
    const axe = await new AxeBuilder({ page }).include('#a11y-panel').withTags(tags).analyze();
    assert.deepEqual(axe.violations.map(v => v.id), [], `Menu accessible en thème ${theme}`);
  }
  await page.keyboard.press('Escape');
  assert(await panel.isHidden(), 'Échap ferme le menu');
  assert(await toggle.evaluate(element => element === document.activeElement), 'Le focus revient au bouton');
  await toggle.click();
  await page.mouse.click(5, 900);
  assert(await panel.isHidden(), 'Un clic extérieur ferme le menu');

  await toggle.click();
  const baseSize = await html.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  const prose = page.locator('#post-content');
  const baseWidth = (await prose.boundingBox()).width;
  await panel.locator('[name="a11y-text"][value="xlarge"]').check();
  assert.equal(await attr('text'), 'xlarge');
  assert(Math.abs(await html.evaluate(element => parseFloat(getComputedStyle(element).fontSize)) - baseSize * 1.25) < .1, 'Texte agrandi');
  await panel.locator('[name="a11y-line"][value="xlarge"]').check();
  assert.equal(await attr('line'), 'xlarge');
  const paragraph = page.locator('#post-content p').first();
  const lineRatio = await paragraph.evaluate(element => parseFloat(getComputedStyle(element).lineHeight) / parseFloat(getComputedStyle(element).fontSize));
  assert(Math.abs(lineRatio - 2.15) < .02, 'Interlignage augmenté');
  await panel.locator('[name="a11y-letter"][value="large"]').check();
  assert.equal(await attr('letter'), 'large');
  assert(await paragraph.evaluate(element => parseFloat(getComputedStyle(element).letterSpacing) > 0), 'Lettres espacées');
  const slider = panel.getByRole('slider', { name: 'Taille des éléments' });
  const controlHeight = () => page.locator('.theme-toggle').evaluate(element => element.getBoundingClientRect().height);
  await panel.locator('[name="a11y-text"][value=""]').check();
  assert.equal(await slider.inputValue(), '32', 'Taille des éléments à 32 px par défaut');
  assert(Math.abs(await controlHeight() - 32) < .5, 'Boutons à 32 px par défaut');
  assert.deepEqual([await slider.getAttribute('min'), await slider.getAttribute('max')], ['28', '50']);
  await slider.focus();
  await page.keyboard.press('Home');
  assert(Math.abs(await controlHeight() - 28) < .5, 'Taille minimale 28 px');
  await page.keyboard.press('End');
  assert(Math.abs(await controlHeight() - 50) < .5, 'Taille maximale 50 px');
  assert.equal(await slider.getAttribute('aria-valuetext'), '50 pixels');
  assert.equal(await panel.locator('.a11y-range output').textContent(), '50 px');
  const panelControls = await panel.locator('.a11y-close, .a11y-info-toggle, select, .a11y-reset').evaluateAll(elements =>
    elements.map(element => element.getBoundingClientRect().height));
  assert(panelControls.every(height => Math.abs(height - 50) < .5), 'Les contrôles du menu suivent la taille');
  await slider.fill('40');
  assert(Math.abs(await controlHeight() - 40) < .5, 'Taille intermédiaire appliquée');
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('epp-a11y'))).control, 40, 'Taille enregistrée');
  await panel.locator('[name="a11y-text"][value="xlarge"]').check();
  await panel.locator('[name="a11y-width"][value="narrow"]').check();
  assert.equal(await attr('width'), 'narrow');
  assert((await prose.boundingBox()).width < baseWidth, 'Largeur de lecture réduite');
  for (const font of ['lexend', 'atkinson', 'opendyslexic']) {
    await panel.locator('#a11y-font').selectOption(font);
    assert.equal(await attr('font'), font);
    await page.evaluate(() => document.fonts.ready);
  }
  assert(await page.evaluate(() => document.fonts.check('16px OpenDyslexic')), 'Police auto-hébergée chargée');
  for (const name of ['contrast', 'underline', 'motion', 'tint']) await panel.locator(`[name="a11y-${name}"]`).check();
  assert.equal(await attr('tint'), 'cream');
  assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'), '#fbf3df');
  assert.equal(await page.locator('#post-content a').first().evaluate(element => getComputedStyle(element).textDecorationLine), 'underline');
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--bg').trim()), '#fbf3df');
  const allAxe = await new AxeBuilder({ page }).withTags(tags).analyze();
  assert.deepEqual(allAxe.violations.map(v => v.id), [], 'Page accessible avec toutes les options');
  await panel.locator('[name="a11y-tint"]').uncheck();
  for (const theme of ['dark', 'light']) {
    await html.evaluate((element, value) => { element.dataset.theme = value; }, theme);
    const contrastAxe = await new AxeBuilder({ page }).withTags(tags).analyze();
    assert.deepEqual(contrastAxe.violations.map(v => v.id), [], `Contraste renforcé accessible en thème ${theme}`);
  }
  await panel.locator('[name="a11y-tint"]').check();

  await page.reload();
  const saved = { text: 'xlarge', line: 'xlarge', letter: 'large', width: 'narrow', font: 'opendyslexic', contrast: 'more', underline: 'on', motion: 'reduce', tint: 'cream' };
  for (const [name, value] of Object.entries(saved)) assert.equal(await attr(name), value, `Préférence ${name} conservée`);
  assert(Math.abs(await controlHeight() - 40) < .5, 'Taille des éléments conservée sans flash');
  await toggle.click();
  assert(await panel.locator('[name="a11y-tint"]').isChecked(), 'Interrupteurs synchronisés');
  assert.equal(await panel.locator('#a11y-font').inputValue(), 'opendyslexic');
  for (const width of [1920, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Pas de débordement à ${width}px`);
    const box = await panel.boundingBox();
    assert(box.x >= 0 && box.x + box.width <= width + 1, `Menu visible à ${width}px`);
    await checkRows(`texte agrandi et OpenDyslexic, ${width}px`);
    await infoButton.click();
    const creditBox = await credit.boundingBox();
    assert(creditBox.x >= 0 && creditBox.x + creditBox.width <= width + 1, `Crédit visible à ${width}px`);
    assert(await credit.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Crédit sans débordement à ${width}px`);
    await page.keyboard.press('Escape');
  }
  await panel.getByRole('button', { name: 'Réinitialiser' }).click();
  assert.equal(await slider.inputValue(), '32', 'Curseur réinitialisé');
  assert(Math.abs(await controlHeight() - 32) < .5, 'Taille des éléments réinitialisée');
  assert.equal(await page.evaluate(() => [...document.documentElement.attributes].filter(a => a.name.startsWith('data-a11y-')).length), 0);
  assert.equal(await page.evaluate(() => localStorage.getItem('epp-a11y')), null);
  assert.equal(await panel.locator('[name="a11y-text"][value=""]').isChecked(), true);
  assert.deepEqual(external, [], 'Aucune requête externe');
  console.log('Menu Accessibilité : ouverture, réglages, persistance, polices locales, axe et responsive : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
