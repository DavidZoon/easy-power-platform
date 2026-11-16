import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ExcelJS from 'exceljs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from './preview.mjs';
import { generateSvgLibrary, svgImageExpression } from '../assets/js/svg-library.js';

const { server, url } = await preview(0);
const toolUrl = url + 'outils/bibliothecaire-svg/';
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#6750a4"/></svg>';
const upload = (name, source = svg) => ({ name, mimeType: 'image/svg+xml', buffer: Buffer.from(source) });
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.svgCopied = null;
    window.rejectSvgCopy = false;
    Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async value => {
        if (window.rejectSvgCopy) throw new Error('Clipboard denied for test');
        window.svgCopied = value;
      }
    } });
  });
  const page = await context.newPage();
  const errors = [];
  const remoteRequests = [];
  const excelRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(url).origin) remoteRequests.push(request.url());
    if (request.url().endsWith('/exceljs.min.js')) excelRequests.push(request.url());
  });
  await page.goto(toolUrl);
  await page.waitForFunction(() => !document.querySelector('[data-svg-library]').disabled);
  assert.equal(await page.locator('h1').textContent(), 'Bibliothécaire SVG');
  const cards = page.locator('.svg-card');
  const source = page.locator('#svg-source');
  const output = page.locator('#svg-output');
  const add = page.locator('#svg-add');
  const exportButton = page.locator('#svg-export');
  const importStatus = page.locator('#svg-import-status');
  const excelStatus = page.locator('#svg-excel-status');
  const names = () => cards.locator('input').evaluateAll(inputs => inputs.map(input => input.value));
  const entries = () => cards.locator('img').evaluateAll(images => images.map(image => ({
    name: image.closest('li').querySelector('input').value,
    svg: decodeURIComponent(image.src.slice(image.src.indexOf(',') + 1))
  })));
  const paste = async value => {
    await page.locator('[name="svg-source-mode"][value="code"]').check();
    await source.fill(value);
    await add.click();
    await page.waitForFunction(() => !document.querySelector('#svg-sources').disabled);
  };
  assert(await exportButton.isDisabled());
  assert(await page.locator('#svg-copy-library').isDisabled());
  await add.click();
  assert.match(await importStatus.textContent(), /au moins un fichier/);

  const xmlCases = await page.evaluate(async () => {
    const { normalizeSvg } = await import(new URL('../../assets/js/svg-library.js', location.href));
    const good = [
      `<svg><text aria-label="L'image &quot;citée&quot;">L'été &amp; "Bonjour" &lt;image&gt;</text></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g"><stop offset="0" stop-color="red"/></linearGradient><path id="p" d="M0 0h24v24z"/></defs><style>.a { fill: url("#g"); }</style><use href="#p" class="a"/></svg>`,
      `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><!-- note --><text><![CDATA[A < B & C]]></text></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="M0 0"/></defs><use xlink:href="#a"/></svg>`
    ];
    const bad = [
      '', '<svg>', '<html/>', '<svg xmlns="urn:other"/>',
      '<!DOCTYPE svg [<!ENTITY x "x">]><svg>&x;</svg>',
      '<?xml-stylesheet href="https://example.test/style.css"?><svg/>',
      '<svg><script>alert(1)</script></svg>', '<svg onload="alert(1)"/>',
      '<svg><foreignObject><div/></foreignObject></svg>',
      '<svg><animate attributeName="href" to="https://example.test"/></svg>',
      '<svg><image href="https://example.test/image.svg"/></svg>',
      '<svg><image href="data:image/svg+xml,%3Csvg%3E"/></svg>',
      '<svg><path fill="url(https://example.test/image.svg#g)"/></svg>',
      '<svg><path fill="u\\72l(https://example.test/image.svg#g)"/></svg>',
      '<svg><style>@import "https://example.test/style.css";</style></svg>',
      '<svg><style>path{fill:u/**/rl(https://example.test/image.svg#g)}</style></svg>',
      '<svg><style>path{fill:u\\72l(https://example.test/image.svg#g)}</style></svg>',
      '<svg><style>svg{background:image-set("https://example.test/a.png" 1x)}</style></svg>',
      '<svg xml:base="https://example.test"><use href="#a"/></svg>',
      '<svg><path style="fill:url(&#104;ttps://example.test/x)"/></svg>'
    ];
    const normalized = good.map(normalizeSvg);
    return {
      normalized,
      valid: normalized.every(value => !new DOMParser().parseFromString(value, 'image/svg+xml').querySelector('parsererror')),
      texts: normalized.map(value => new DOMParser().parseFromString(value, 'image/svg+xml').documentElement.textContent),
      label: new DOMParser().parseFromString(normalized[0], 'image/svg+xml').querySelector('text').getAttribute('aria-label'),
      rejected: bad.map(source => {
        try { normalizeSvg(source); return false; }
        catch (error) { return error instanceof RangeError && Boolean(error.message); }
      })
    };
  });
  assert(xmlCases.valid);
  assert(xmlCases.rejected.every(Boolean), 'Toutes les entrées non autonomes ou actives doivent être refusées');
  assert.equal(xmlCases.texts[0], 'L’été & "Bonjour" <image>'.replace('’', "'"));
  assert.equal(xmlCases.texts[2], 'A < B & C');
  assert.equal(xmlCases.label, 'L\'image "citée"');
  assert.match(xmlCases.normalized[0], /aria-label='L&apos;image "citée"'/);

  await page.locator('#svg-files').setInputFiles([
    upload('Logo.svg'), upload('logo.SVG'), upload('Invalide.svg', '<svg>'), upload('pas-un-svg.txt')
  ]);
  assert.equal(await cards.count(), 0, 'Le choix de fichiers ne doit pas ajouter automatiquement');
  assert.equal(await page.locator('#svg-pending li').count(), 4);
  await add.click();
  await page.waitForFunction(() => !document.querySelector('#svg-sources').disabled);
  assert.deepEqual(await names(), ['Logo', 'logo_2']);
  assert.equal(await page.locator('#svg-import-errors li').count(), 2);
  assert.equal(await page.locator('#svg-pending li').count(), 2, 'Les sources refusées restent disponibles');
  assert.match(await importStatus.textContent(), /2 image\(s\) ajoutée/);
  await page.locator('#svg-clear-files').click();

  await page.locator('#svg-drop-zone').evaluate((zone, svg) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File([svg], 'Etoile.svg', { type: 'image/svg+xml' }));
    zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
  }, svg);
  assert.equal(await cards.count(), 2);
  await add.click();
  await page.waitForFunction(() => !document.querySelector('#svg-sources').disabled);
  assert.deepEqual(await names(), ['Logo', 'logo_2', 'Etoile']);
  await paste(xmlCases.normalized[0]);
  assert.deepEqual(await names(), ['Logo', 'logo_2', 'Etoile', 'Image1']);
  assert.equal(await source.inputValue(), '');
  await paste(svg);
  assert.equal((await names()).at(-1), 'Image2');
  await paste('<svg onload="window.hacked=true"/>');
  assert.equal(await cards.count(), 5);
  assert.match(await page.locator('#svg-import-errors').textContent(), /Attribut interdit/);
  assert.notEqual(await source.inputValue(), '');
  await source.fill('');
  assert.equal(await page.locator('.tool-content > svg, .svg-preview > svg').count(), 0, 'Aucun SVG utilisateur injecté');
  assert(await cards.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
  assert.equal(await page.evaluate(() => window.hacked), undefined);

  await page.locator('#svg-library-name').fill("Ma bibliothèque d'été");
  await cards.first().locator('input').fill("L'image");
  const allEntries = await entries();
  assert.equal(await output.inputValue(), generateSvgLibrary("Ma bibliothèque d'été", allEntries));
  assert.match(await page.locator('#svg-image-example').inputValue(), /EncodeUrl\('Ma bibliothèque d''été'\.'L''image'\)/);
  await page.locator('[name="svg-locale"][value="en"]').check();
  assert.equal(await output.inputValue(), generateSvgLibrary("Ma bibliothèque d'été", allEntries, 'en'));
  await page.locator('#svg-copy-library').click();
  assert.equal(await page.evaluate(() => window.svgCopied), await output.inputValue());
  await cards.first().locator('.svg-card-copy').click();
  assert.equal(await page.evaluate(() => window.svgCopied), allEntries[0].svg);
  await page.locator('#svg-copy-mode').selectOption('image');
  await cards.first().locator('.svg-card-copy').click();
  assert.equal(await page.evaluate(() => window.svgCopied), svgImageExpression(allEntries[0].svg));
  await page.evaluate(() => { window.rejectSvgCopy = true; });
  await cards.first().locator('.svg-card-copy').click();
  assert.match(await page.locator('#svg-gallery-status').textContent(), /échoué.*manuellement/);
  assert.equal(await page.locator('#svg-manual').inputValue(), svgImageExpression(allEntries[0].svg));
  assert(await page.locator('#svg-manual').evaluate(input => document.activeElement === input && input.selectionEnd === input.value.length));
  await page.locator('#svg-copy-library').click();
  assert.match(await page.locator('#svg-output-status').textContent(), /échoué.*manuellement/);
  assert(await output.evaluate(input => document.activeElement === input && input.selectionEnd === input.value.length));
  await page.evaluate(() => { window.rejectSvgCopy = false; });

  await cards.nth(1).locator('input').fill("l'IMAGE");
  assert.equal(await cards.locator('[aria-invalid="true"]').count(), 2);
  assert(await exportButton.isDisabled());
  assert.equal(await output.inputValue(), '');
  await cards.nth(1).locator('input').fill('Deuxième');
  await page.locator('#svg-library-name').fill('');
  assert(await exportButton.isDisabled());
  await page.locator('#svg-library-name').fill('MaBibliotheque');
  assert.equal(excelRequests.length, 0, 'ExcelJS ne doit pas être chargé avant l’export');

  await page.route('**/exceljs.min.js', route => route.abort());
  await exportButton.click();
  await page.waitForFunction(() => !document.querySelector('#svg-export').disabled);
  assert.match(await excelStatus.textContent(), /Échec.*charger/);
  assert((await output.inputValue()).length > 0);
  await page.unroute('**/exceljs.min.js');
  const downloadPromise = page.waitForEvent('download');
  await exportButton.click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'MaBibliotheque.xlsx');
  const workbook = await new ExcelJS.Workbook().xlsx.load(await fs.readFile(await download.path()));
  const sheet = workbook.getWorksheet(1);
  const downloadedEntries = await entries();
  assert.equal(sheet.getTables().length, 1, 'Tableau structuré attendu dans le fichier téléchargé');
  assert.equal(sheet.getTables()[0].table.tableRef, `A1:E2`);
  assert.equal(sheet.rowCount, 2);
  assert.deepEqual(sheet.getRow(1).values.slice(1), downloadedEntries.map(image => image.name));
  assert.deepEqual(sheet.getRow(2).values.slice(1), downloadedEntries.map(image => image.svg));
  await page.waitForFunction(() => !document.querySelector('#svg-export').disabled);

  const longSvg = `<svg xmlns="http://www.w3.org/2000/svg"><text>${'a'.repeat(32768)}</text></svg>`;
  await paste(longSvg);
  assert(await exportButton.isDisabled());
  assert.match(await excelStatus.textContent(), /32 767/);
  assert((await output.inputValue()).includes('a'.repeat(32768)));
  await cards.last().locator('.svg-card-remove').click();
  assert(!(await exportButton.isDisabled()));

  for (const [size, height] of [['small', 128], ['medium', 192], ['large', 272]]) {
    await page.locator(`[data-svg-size="${size}"]`).click();
    assert.equal(await page.locator(`[data-svg-size="${size}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal((await cards.first().locator('.svg-preview').boundingBox()).height, height);
  }
  for (const theme of ['dark', 'light']) {
    await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Débordement ${theme}, ${width}`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(results.violations.map(({ id, nodes }) => ({ id, count: nodes.length })), [], `Accessibilité ${theme}, ${width}`);
    }
    assert(await cards.first().locator('.svg-card-copy').evaluate(button =>
      getComputedStyle(button).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'L’icône de copie doit avoir un fond opaque sur le damier');
  }
  await cards.first().locator('.svg-card-copy').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => window.svgCopied), svgImageExpression(downloadedEntries[0].svg));
  assert.deepEqual(remoteRequests, [], 'Les SVG ne doivent déclencher aucune requête externe');
  assert.deepEqual(errors, [], 'Aucune erreur JavaScript');
  await page.reload();
  await page.waitForFunction(() => !document.querySelector('[data-svg-library]').disabled);
  assert.equal(await cards.count(), 0, 'La bibliothèque ne doit pas être persistée');
  await context.close();

  const noClipboard = await browser.newContext();
  await noClipboard.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
  const manualPage = await noClipboard.newPage();
  await manualPage.goto(toolUrl);
  await manualPage.waitForFunction(() => !document.querySelector('[data-svg-library]').disabled);
  await manualPage.locator('[name="svg-source-mode"][value="code"]').check();
  await manualPage.locator('#svg-source').fill(svg);
  await manualPage.locator('#svg-add').click();
  await manualPage.locator('.svg-card-copy').click();
  assert(await manualPage.locator('#svg-manual').isVisible());
  assert.match(await manualPage.locator('#svg-gallery-status').textContent(), /manuellement/);
  await noClipboard.close();

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(toolUrl);
  assert(await staticPage.locator('noscript').isVisible());
  assert(await staticPage.locator('#svg-files').isDisabled());
  await noScript.close();
  console.log('Bibliothécaire SVG : imports additifs, XML sûr, noms, copies, FR/EN, vrai tableau XLSX téléchargé, limites, confidentialité, responsive et accessibilité : OK.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
