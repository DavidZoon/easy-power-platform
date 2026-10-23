(() => {
  'use strict';
  const button = document.querySelector('.theme-toggle');
  function currentTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  }
  function update() {
    const dark = currentTheme() === 'dark';
    button.textContent = dark ? 'Thème clair' : 'Thème sombre';
    button.setAttribute('aria-label', dark ? 'Activer le thème clair' : 'Activer le thème sombre');
    button.setAttribute('aria-pressed', String(!dark));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#272836' : '#f7f7fc';
  }
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => {
      document.documentElement.dataset.theme = currentTheme() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('epp-theme', currentTheme()); }
      catch (error) { console.warn('Préférence de thème non enregistrée :', error); }
      update();
      document.dispatchEvent(new CustomEvent('epp-theme-change', { detail: currentTheme() }));
    });
    update();
  }
  // Old anchors of split articles (e.g. #notification-toaster) lead to the new article.
  const anchor = decodeURIComponent(location.hash.slice(1));
  const moved = anchor && [...document.querySelectorAll('[data-redirect]')].find(element => element.id === anchor);
  if (moved) location.replace(moved.dataset.redirect);
})();
