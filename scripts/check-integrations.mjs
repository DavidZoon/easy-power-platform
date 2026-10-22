import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { preview } from './preview.mjs';

const { server, url } = await preview(0);
const browser = await chromium.launch();
try {
  const manifest = JSON.parse(await fs.readFile('_data/migration.json', 'utf8'));
  for (const pathname of ['', manifest.posts.at(-1).permalink.slice(1)]) {
    const integrationPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const externalCalls = [];
    await integrationPage.route('https://forms.cloud.microsoft/**', route => {
      externalCalls.push('forms');
      return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="fr"><title>Abonnement</title><h1>Formulaire de test</h1></html>' });
    });
    await integrationPage.route('https://giscus.app/**', route => {
      externalCalls.push('giscus');
      return route.fulfill({ contentType: 'text/javascript', body: '/* Giscus test */' });
    });
    await integrationPage.goto(url + pathname);
    assert.deepEqual(externalCalls, [], 'Aucun appel externe avant action');
    const canonical = await integrationPage.locator('link[rel="canonical"]').getAttribute('href');
    const links = integrationPage.locator('.share-links a');
    assert.equal(await links.count(), 5);
    for (const link of await links.all()) {
      const href = new URL(await link.getAttribute('href'));
      const param = href.searchParams.get('url') || href.searchParams.get('u') || href.searchParams.get('body') || href.searchParams.get('text');
      assert(param.includes(canonical), `URL de partage incorrecte : ${href}`);
    }
    assert.equal(await integrationPage.locator('.newsletter-frame').getAttribute('src'), null);
    await integrationPage.locator('[data-newsletter-load]').click();
    await integrationPage.waitForFunction(() => document.querySelector('[data-newsletter-status]').textContent.startsWith('Si le formulaire'));
    assert.deepEqual(externalCalls, ['forms']);
    assert.equal(await integrationPage.locator('.newsletter-frame').getAttribute('src'), 'https://forms.cloud.microsoft/e/zdZVJ9fLx7?embed=true');
    assert(await integrationPage.locator('.newsletter-frame').isVisible());
    assert(await integrationPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Debordement du formulaire mobile');
    if (pathname) {
      const comments = integrationPage.locator('[data-giscus-repo]');
      assert.equal(await comments.getAttribute('data-giscus-repo'), 'DavidZoon/easy-power-platform');
      await integrationPage.locator('[data-comments-load]').click();
      await integrationPage.waitForFunction(() => document.querySelector('[data-comments-load]').hidden);
      assert.deepEqual(externalCalls, ['forms', 'giscus']);
      const script = integrationPage.locator('script[src="https://giscus.app/client.js"]');
      assert.equal(await script.getAttribute('data-repo-id'), 'R_kgDOVTQcTA');
      assert.equal(await script.getAttribute('data-category-id'), 'DIC_kwDOVTQcTM4DJVUi');
      assert.equal(await script.getAttribute('data-mapping'), 'pathname');
    }
    await integrationPage.close();
  }
  const page = await browser.newPage();
  const calls = [];
  await page.route('https://www.clarity.ms/**', route => {
    calls.push('clarity');
    return route.fulfill({ contentType: 'text/javascript', body: '/* consent test */' });
  });
  await page.route('https://giscus.app/**', route => {
    calls.push('giscus');
    return route.fulfill({ contentType: 'text/javascript', body: '/* click-to-load test */' });
  });
  await page.goto(url);
  await page.evaluate(() => {
    localStorage.removeItem('epp-clarity-consent-v1');
    const section = document.createElement('section');
    section.innerHTML = `<button data-consent-open>Préférences</button>
      <section data-clarity-id="test123" hidden>
        <button data-consent="granted">Accepter</button>
        <button data-consent="denied">Refuser</button><p data-consent-status></p>
      </section>
      <section data-giscus-repo="owner/repo" data-giscus-repo-id="id" data-giscus-category="Comments" data-giscus-category-id="category">
        <button data-comments-load>Commentaires</button><p data-comments-status></p><div class="giscus"></div>
      </section>`;
    document.body.append(section);
  });
  await page.addScriptTag({ url: `${url}assets/js/integrations.js` });
  assert(await page.locator('[data-clarity-id]').isVisible());
  assert.deepEqual(calls, []);
  await page.locator('[data-consent="denied"]').click();
  assert.deepEqual(calls, []);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('epp-clarity-consent-v1')).value), 'denied');
  await page.locator('[data-consent-open]').click();
  await page.locator('[data-consent="granted"]').click();
  await page.waitForFunction(() => !!document.querySelector('script[src^="https://www.clarity.ms/"]'));
  await page.waitForLoadState('networkidle');
  assert.deepEqual(calls, ['clarity']);
  const consent = await page.evaluate(() => Array.from(window.clarity.q[0]));
  assert.deepEqual(consent, ['consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' }]);
  await page.locator('[data-comments-load]').click();
  await page.waitForLoadState('networkidle');
  assert.deepEqual(calls, ['clarity', 'giscus']);
  await page.locator('[data-consent-open]').click();
  await Promise.all([page.waitForEvent('load'), page.locator('[data-consent="denied"]').click()]);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('epp-clarity-consent-v1')).value), 'denied');
  assert.deepEqual(calls, ['clarity', 'giscus']);
  await page.evaluate(() => {
    localStorage.setItem('epp-clarity-consent-v1', JSON.stringify({ value: 'granted' }));
    const section = document.createElement('section');
    section.innerHTML = `<section data-clarity-id="invalid/id" hidden>
      <button data-consent="granted">Accepter</button><button data-consent="denied">Refuser</button>
      <p data-consent-status></p></section>`;
    document.body.append(section);
  });
  await page.addScriptTag({ url: `${url}assets/js/integrations.js` });
  assert(await page.locator('[data-clarity-id]').isVisible(), 'Un consentement sans expiration ne doit pas etre accepte');
  await page.locator('[data-consent="granted"]').click();
  assert(await page.locator('[data-consent-status]').isVisible());
  assert.match(await page.locator('[data-consent-status]').textContent(), /invalide/);
  assert.deepEqual(calls, ['clarity', 'giscus']);
  console.log('Integrations : consentement Clarity, Giscus et Forms au clic, liens de partage et formulaire mobile : OK.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
