(() => {
  'use strict';
  try {
    const saved = localStorage.getItem('epp-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch (error) {
    console.warn('Préférence de thème indisponible :', error);
  }
})();
