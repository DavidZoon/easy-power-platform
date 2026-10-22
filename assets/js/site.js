(() => {
  'use strict';
  const button = document.querySelector('.theme-toggle');
  const preference = matchMedia('(prefers-color-scheme: dark)');
  function currentTheme() {
    return document.documentElement.dataset.theme || (preference.matches ? 'dark' : 'light');
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
    preference.addEventListener('change', update);
    update();
  }
})();
