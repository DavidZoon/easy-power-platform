(() => {
  'use strict';
  const panel = document.querySelector('[data-clarity-id]');
  const key = 'epp-clarity-consent-v1';
  let clarityLoaded = false;
  function loadClarity() {
    if (clarityLoaded) return true;
    const id = panel.dataset.clarityId;
    if (!/^[a-z0-9]+$/i.test(id)) {
      panel.querySelector('[data-consent-status]').textContent = 'Identifiant Clarity invalide. La mesure d’audience reste désactivée.';
      panel.hidden = false;
      console.error('Identifiant Clarity invalide');
      return false;
    }
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    const script = document.createElement('script');
    script.src = `https://www.clarity.ms/tag/${id}`;
    script.async = true;
    script.onerror = () => {
      console.error('Chargement Microsoft Clarity impossible');
      panel.hidden = false;
      panel.querySelector('[data-consent-status]').textContent = 'Microsoft Clarity n’a pas pu être chargé. Vous pouvez refuser la mesure d’audience.';
    };
    document.head.append(script);
    clarityLoaded = true;
    return true;
  }
  if (panel) {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(key)); }
    catch (error) { console.warn('Consentement non lisible :', error); }
    if (!saved || !Number.isFinite(saved.expires) || saved.expires < Date.now() || !['granted', 'denied'].includes(saved.value)) panel.hidden = false;
    else if (saved.value === 'granted') loadClarity();
    document.querySelectorAll('[data-consent-open]').forEach(button => button.addEventListener('click', () => {
      panel.hidden = false;
      panel.querySelector('button').focus();
    }));
    panel.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
      const value = button.dataset.consent;
      try {
        localStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + 180 * 86400000 }));
      } catch (error) {
        console.warn('Consentement non enregistré :', error);
        panel.querySelector('[data-consent-status]').textContent = 'Le choix ne peut pas être enregistré. La mesure reste désactivée pour cette visite.';
        return;
      }
      if (value === 'granted') {
        if (!loadClarity()) return;
      } else if (clarityLoaded) {
        window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
        window.clarity('consent', false);
        location.reload();
      }
      panel.hidden = true;
    }));
  }
  const newsletterButton = document.querySelector('[data-newsletter-load]');
  if (newsletterButton) {
    const newsletter = newsletterButton.closest('.newsletter');
    const frame = newsletter.querySelector('[data-newsletter-src]');
    const status = newsletter.querySelector('[data-newsletter-status]');
    newsletterButton.hidden = false;
    newsletterButton.addEventListener('click', () => {
      newsletterButton.hidden = true;
      status.textContent = 'Chargement de Microsoft Forms. Si le formulaire ne s’affiche pas, utilisez le lien direct.';
      frame.addEventListener('load', () => {
        status.textContent = 'Si le formulaire ne s’affiche pas ci-dessous, ouvrez-le avec le lien direct.';
      }, { once: true });
      frame.addEventListener('error', () => {
        status.textContent = 'Impossible de charger le formulaire. Utilisez le lien direct vers Microsoft Forms.';
      }, { once: true });
      frame.src = frame.dataset.newsletterSrc;
      frame.hidden = false;
    });
  }
  const comments = document.querySelector('[data-giscus-repo]');
  if (comments) {
    const button = comments.querySelector('[data-comments-load]');
    button.addEventListener('click', () => {
      const values = ['giscusRepo', 'giscusRepoId', 'giscusCategory', 'giscusCategoryId'];
      const status = comments.querySelector('[data-comments-status]');
      if (values.some(key => !comments.dataset[key])) {
        status.textContent = 'Les commentaires ne sont pas encore configurés.';
        return;
      }
      button.disabled = true;
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      const data = {
        repo: comments.dataset.giscusRepo, 'repo-id': comments.dataset.giscusRepoId,
        category: comments.dataset.giscusCategory, 'category-id': comments.dataset.giscusCategoryId,
        mapping: 'pathname', strict: '1', 'reactions-enabled': '1', 'emit-metadata': '0',
        'input-position': 'top', lang: 'fr', theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
        loading: 'lazy'
      };
      Object.entries(data).forEach(([key, value]) => script.setAttribute(`data-${key}`, value));
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = () => { button.hidden = true; };
      script.onerror = () => { status.textContent = 'Impossible de charger Giscus. Réessayez.'; button.disabled = false; script.remove(); };
      comments.querySelector('.giscus').append(script);
    });
    document.addEventListener('epp-theme-change', event => {
      const frame = comments.querySelector('iframe.giscus-frame');
      if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme: event.detail } } }, 'https://giscus.app');
    });
  }
})();
