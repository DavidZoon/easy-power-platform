import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { preview } from './preview.mjs';

const { server, url } = await preview(0);
const browser = await chromium.launch();
try {
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
  console.log('Integrations : aucun appel avant accord, refus, acceptation, Consent API v2, retrait et Giscus au clic : OK.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
