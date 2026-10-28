(() => {
  'use strict';
  try {
    const saved = localStorage.getItem('epp-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch (error) {
    console.warn('Préférence de thème indisponible :', error);
  }
  try {
    const allowed = {
      text: ['large', 'xlarge'], line: ['large', 'xlarge'], letter: ['large', 'xlarge'], width: ['narrow'],
      font: ['lexend', 'atkinson', 'opendyslexic'], contrast: ['more'], underline: ['on'], motion: ['reduce'], tint: ['cream']
    };
    const saved = JSON.parse(localStorage.getItem('epp-a11y') || '{}');
    for (const [name, values] of Object.entries(allowed)) {
      if (values.includes(saved[name])) document.documentElement.setAttribute(`data-a11y-${name}`, saved[name]);
    }
  } catch (error) {
    console.warn('Préférences d’accessibilité indisponibles :', error);
  }
})();
