import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';
import { sampleGetItems } from '../assets/js/odata.js';

const { server, url } = await preview(0);
const toolUrl = url + 'outils/filtre-odata-sharepoint/';
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
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
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(toolUrl);
  assert.equal(await page.locator('h1').textContent(), 'Constructeur de filtre OData SharePoint pour Power Automate');
  assert.equal(await page.locator('script[src$="/tools.js"]').count(), 0, 'Le convertisseur Power Fx ne doit pas être chargé');
  await page.waitForFunction(() => !document.querySelector('#odata-json').disabled);
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  const json = page.locator('#odata-json');
  const output = page.locator('#odata-output');
  const status = page.locator('#odata-status');
  const jsonStatus = page.locator('#odata-json-status');
  const copy = page.locator('#odata-copy');
  const focused = () => page.evaluate(() => document.activeElement?.id || document.activeElement?.dataset.focus);
  assert(await copy.isDisabled());
  assert.equal(await status.textContent(), '');
  assert.match(await page.locator('#odata-builder').textContent(), /après l’analyse/);

  await json.fill('{ invalide');
  await page.waitForFunction(() => document.querySelector('#odata-json-status').textContent.includes('JSON valide'));
  assert.equal(await json.getAttribute('aria-invalid'), 'true');
  await json.fill(JSON.stringify(sampleGetItems.body.value));
  await page.waitForFunction(() => document.querySelector('#odata-json-status').textContent.startsWith('2 éléments'));
  assert.equal(await jsonStatus.textContent(), '2 éléments analysés : 11 colonnes filtrables sur 12.');
  assert.equal(await page.locator('#odata-columns-body tr').count(), 12);
  assert.match(await page.locator('#odata-columns-body').textContent(), /Plusieurs lignes de texte.*Non filtrable/);
  assert.equal(await page.locator('#odata-field-1 option').count(), 1 + 16);
  assert.equal(await page.locator('#odata-field-1 option', { hasText: 'Commentaire' }).count(), 0);

  await page.locator('#odata-field-1').focus();
  await page.selectOption('#odata-field-1', 'Statut');
  assert.equal(await focused(), 'odata-field-1', 'Le focus doit rester sur le champ après le rendu');
  assert.deepEqual(await page.locator('#odata-operator-1 option').allTextContents(), ['Est égal à', 'N’est pas égal à', 'Commence par', 'Contient', 'Ne contient pas de données', 'Contient des données']);
  assert.equal(await page.locator('#odata-value-1').getAttribute('list'), 'odata-values-7');
  assert.deepEqual(await page.locator('#odata-values-7 option').evaluateAll(options => options.map(option => option.value)), ['En cours', 'Terminé']);
  assert.equal(await page.locator('#odata-value-1').inputValue(), 'En cours');
  assert.equal(await output.inputValue(), "Statut eq 'En cours'", 'La valeur par défaut doit être incluse dès la sélection du champ');
  await page.selectOption('#odata-operator-1', 'ne');
  assert.equal(await output.inputValue(), "Statut ne 'En cours'", 'Changer uniquement l’opérateur doit recalculer le filtre');
  await page.selectOption('#odata-operator-1', 'eq');
  await page.selectOption('#odata-field-1', 'Created');
  assert.equal(await page.locator('#odata-value-1').inputValue(), sampleGetItems.body.value[0].Created);
  assert.equal(await output.inputValue(), `Created eq '${sampleGetItems.body.value[0].Created}'`);
  await page.selectOption('#odata-operator-1', 'gt');
  assert.equal(await output.inputValue(), `Created gt '${sampleGetItems.body.value[0].Created}'`);
  await page.fill('#odata-value-1', '');
  assert.equal(await output.inputValue(), '', 'Une valeur effacée ne doit pas être remplacée pendant la saisie');
  await page.selectOption('#odata-operator-1', 'null');
  assert.equal(await output.inputValue(), 'Created eq null');
  await page.selectOption('#odata-operator-1', 'eq');
  assert.equal(await output.inputValue(), `Created eq '${sampleGetItems.body.value[0].Created}'`, 'Revenir à un opérateur avec valeur doit initialiser sa valeur par défaut');
  await page.selectOption('#odata-field-1', 'Statut');
  await page.locator('#odata-value-1').evaluate(element => {
    element.value = 'Terminé';
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
  assert.equal(await output.inputValue(), "Statut eq 'Terminé'", 'Une valeur validée par change doit aussi être synchronisée');
  await page.fill('#odata-value-1', 'Fournisseur d\'Alex');
  assert.equal(await output.inputValue(), 'Statut eq \'Fournisseur d\'\'Alex\'');
  assert.equal(await status.textContent(), 'Requête de filtre générée.');

  await page.locator('[data-focus="0:add"]').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const groupFocus = await focused();
  assert.match(groupFocus, /^odata-field-\d+$/, 'Ajouter un groupe au clavier doit placer le focus sur son premier champ');
  const groupId = await page.locator('.odata-nested .odata-group').getAttribute('aria-labelledby').then(id => id.match(/\d+/)[0]);
  await page.selectOption(`#odata-logic-${groupId}`, 'or');
  const first = groupFocus.replace('odata-field-', '');
  await page.selectOption(`#odata-field-${first}`, 'Montant');
  await page.selectOption(`#odata-operator-${first}`, 'gt');
  assert.equal(await page.locator(`#odata-value-${first}`).getAttribute('inputmode'), 'decimal');
  await page.fill(`#odata-value-${first}`, '1000,5');
  await page.locator(`[data-focus="${groupId}:add"]`).click();
  await page.locator(`[data-focus="${groupId}:add"] + .odata-menu-list [data-action="add-condition"]`).click();
  const second = (await focused()).replace('odata-field-', '');
  await page.selectOption(`#odata-field-${second}`, 'Urgent');
  assert.equal(await page.locator(`#odata-value-${second}`).evaluate(element => element.tagName), 'SELECT');
  assert.equal(await output.inputValue(), 'Statut eq \'Fournisseur d\'\'Alex\' and (Montant gt 1000.5 or Urgent eq 1)');
  await page.selectOption(`#odata-logic-${groupId}`, 'and');
  assert.equal(await output.inputValue(), 'Statut eq \'Fournisseur d\'\'Alex\' and (Montant gt 1000.5 and Urgent eq 1)');
  await page.selectOption(`#odata-logic-${groupId}`, 'or');
  await page.selectOption('#odata-logic-0', 'or');
  assert.equal(await output.inputValue(), 'Statut eq \'Fournisseur d\'\'Alex\' or (Montant gt 1000.5 or Urgent eq 1)');
  await page.selectOption('#odata-logic-0', 'and');
  await page.selectOption(`#odata-value-${second}`, '0');
  assert.match(await output.inputValue(), /Urgent eq 0\)$/);

  await page.locator(`[data-focus="0:add"]`).click();
  await page.locator(`[data-focus="0:add"] + .odata-menu-list [data-action="add-condition"]`).click();
  const third = (await focused()).replace('odata-field-', '');
  await page.selectOption(`#odata-field-${third}`, 'Created');
  await page.fill(`#odata-value-${third}`, '31/01/2024');
  assert.equal(await page.locator(`#odata-value-${third}`).getAttribute('aria-invalid'), 'true');
  assert(await page.locator(`#odata-value-${third}-error`).isVisible());
  assert.match(await status.textContent(), /1 condition incomplète ou invalide ignorée/);
  await page.fill(`#odata-value-${third}`, '2024-01-31');
  assert.equal(await page.locator(`#odata-value-${third}`).getAttribute('aria-invalid'), 'false');
  assert.match(await output.inputValue(), / and Created eq '2024-01-31'$/);
  assert.match(await page.locator('#odata-warnings').textContent(), /UTC/);
  await page.selectOption(`#odata-operator-${third}`, 'notnull');
  assert.equal(await page.locator(`#odata-value-${third}`).count(), 0);
  assert.match(await output.inputValue(), / and Created ne null$/);

  await page.locator(`#odata-enabled-${third}`).uncheck();
  assert.doesNotMatch(await output.inputValue(), /Created/);
  await page.locator(`#odata-enabled-${third}`).check();
  await page.locator(`#odata-enabled-${groupId}`).uncheck();
  assert.equal(await output.inputValue(), 'Statut eq \'Fournisseur d\'\'Alex\' and Created ne null');
  await page.locator(`#odata-enabled-${groupId}`).check();

  await page.locator(`[data-focus="${third}:menu"]`).click();
  await page.keyboard.press('Escape');
  assert.equal(await focused(), `${third}:menu`);
  assert.equal(await page.locator('.odata-menu[open]').count(), 0);
  await page.locator(`[data-focus="${third}:menu"]`).click();
  await page.locator(`[data-focus="${third}:menu"] + .odata-menu-list [data-action="duplicate"]`).click();
  assert.match(await output.inputValue(), /Created ne null and Created ne null$/);
  const duplicate = (await focused()).replace('odata-field-', '');
  await page.locator(`[data-focus="${duplicate}:menu"]`).click();
  await page.locator(`[data-focus="${duplicate}:menu"] + .odata-menu-list [data-action="remove"]`).click();
  assert.equal(await focused(), '0:add', 'Après suppression, le focus revient sur « Ajouter »');
  await page.locator('[data-focus="1:menu"]').click();
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  assert.equal(await page.locator('.odata-menu[open]').count(), 0, 'Un clic extérieur ferme le menu');
  const expected = 'Statut eq \'Fournisseur d\'\'Alex\' and (Montant gt 1000.5 or Urgent eq 0) and Created ne null';
  assert.equal(await output.inputValue(), expected);

  await copy.click();
  assert.equal(await page.evaluate(() => window.copiedCode), expected);
  assert.match(await status.textContent(), /copiée/);
  await page.evaluate(() => { window.rejectCopy = true; });
  await copy.click();
  assert.match(await status.textContent(), /échoué/);
  assert(await output.evaluate(element => document.activeElement === element && element.selectionEnd === element.value.length));

  await json.fill(JSON.stringify([{ ID: 1, Title: 'x' }]));
  await page.waitForFunction(() => document.querySelector('#odata-json-status').textContent.startsWith('1 élément'));
  assert.equal(await output.inputValue(), '', 'Les champs absents du nouveau JSON doivent être réinitialisés');
  assert.equal(await page.locator('#odata-field-1').inputValue(), '');

  await page.fill('#odata-json', JSON.stringify([{ '<img src=x onerror=alert(1)>': '<img src=x onerror=alert(2)>', Title: '<script>alert(3)</script>' }]));
  await page.waitForFunction(() => document.querySelector('#odata-json-status').textContent.startsWith('1 élément'));
  await page.selectOption('#odata-field-1', 'Title');
  await page.fill('#odata-value-1', '<b>x</b>');
  assert.equal(await page.locator('.odata-tool img, .odata-tool b, .odata-tool script').count(), 0, 'Le JSON ne doit pas être interprété comme HTML');
  assert.equal(await output.inputValue(), 'Title eq \'<b>x</b>\'');

  await page.locator('#odata-reset').click();
  assert.equal(await page.locator('.odata-row').count(), 1);
  assert.equal(await output.inputValue(), '');
  assert.equal(await focused(), `odata-field-${await page.locator('.odata-row select[data-role="field"]').getAttribute('data-node')}`);
  await page.click('#odata-sample');
  assert.match(await jsonStatus.textContent(), /^2 éléments/);
  assert.deepEqual(requests, [], 'Le traitement ne doit émettre aucune requête');

  await page.locator('.odata-row select[data-role="field"]').selectOption('Projet/Title');
  await page.locator('.odata-row input[data-role="value"]').fill('Intranet');
  await page.locator('[data-focus="0:add"]').click();
  await page.locator('[data-focus="0:add"] + .odata-menu-list [data-action="add-group"]').click();
  await page.locator('#odata-columns summary').click();
  assert.match(await page.locator('#odata-warnings').textContent(), /colonne affichée est Title/);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Débordement : ${theme}, ${width}`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Accessibilité : ${theme}, ${width}`);
      const visibleLabels = await page.locator('.odata-row .odata-label').first().evaluate(element => element.getBoundingClientRect().width > 1);
      assert.equal(visibleLabels, width < 900, `Libellés de ligne : ${theme}, ${width}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.odata-row-menu summary').first().click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  assert.deepEqual(results.violations.map(({ id }) => id), [], 'Accessibilité du menu ouvert');
  assert.deepEqual(errors, []);
  await context.close();

  const noClipboard = await browser.newContext();
  await noClipboard.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
  const manualPage = await noClipboard.newPage();
  await manualPage.goto(toolUrl);
  await manualPage.waitForFunction(() => !document.querySelector('#odata-sample').disabled);
  await manualPage.click('#odata-sample');
  await manualPage.selectOption('#odata-field-1', 'ID');
  await manualPage.fill('#odata-value-1', '3');
  assert.equal(await manualPage.locator('#odata-output').inputValue(), 'ID eq 3');
  assert(await manualPage.locator('#odata-copy').isDisabled());
  assert.match(await manualPage.locator('#odata-status').textContent(), /copiez-la manuellement/);
  await noClipboard.close();

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(toolUrl);
  assert(await staticPage.locator('noscript').isVisible());
  assert(await staticPage.locator('#odata-json').isDisabled());
  assert(await staticPage.locator('#odata-sample').isDisabled());
  await noScript.close();
  console.log('Filtre OData : analyse JSON, colonnes SharePoint, groupes ET/OU imbriqués, clavier, validation, échappement, sécurité HTML, copie, aucun envoi réseau, responsive et accessibilité clair/sombre : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
