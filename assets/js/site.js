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
    const cream = document.documentElement.dataset.a11yTint === 'cream';
    document.querySelector('meta[name="theme-color"]').content = cream ? '#fbf3df' : dark ? '#272836' : '#f7f7fc';
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
  const a11yButton = document.querySelector('.a11y-toggle');
  const a11yPanel = document.querySelector('#a11y-panel');
  if (a11yButton && a11yPanel) {
    const names = ['text', 'line', 'letter', 'width', 'font', 'contrast', 'underline', 'motion', 'tint'];
    const status = a11yPanel.querySelector('[data-a11y-status]');
    const info = a11yPanel.querySelector('.a11y-info');
    const infoButton = info.querySelector('.a11y-info-toggle');
    const credit = info.querySelector('.a11y-credit');
    let creditPinned = false;
    function showCredit(visible) {
      credit.hidden = !visible;
      infoButton.setAttribute('aria-expanded', String(visible));
      if (!visible) creditPinned = false;
    }
    infoButton.addEventListener('click', () => {
      creditPinned = !creditPinned;
      showCredit(creditPinned);
    });
    info.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') showCredit(true);
    });
    info.addEventListener('pointerleave', () => {
      if (!creditPinned && !info.contains(document.activeElement)) showCredit(false);
    });
    info.addEventListener('focusout', event => {
      if (!info.contains(event.relatedTarget)) showCredit(false);
    });
    const state = {};
    const controlInput = a11yPanel.querySelector('#a11y-control');
    const controlOutput = a11yPanel.querySelector('.a11y-range output');
    function showControl(value) {
      controlInput.value = value;
      controlInput.setAttribute('aria-valuetext', `${value} pixels`);
      controlOutput.textContent = `${value} px`;
    }
    function apply() {
      for (const name of names) {
        if (state[name]) document.documentElement.setAttribute(`data-a11y-${name}`, state[name]);
        else document.documentElement.removeAttribute(`data-a11y-${name}`);
      }
      if (state.control) document.documentElement.style.setProperty('--control-h', `${state.control}px`);
      else document.documentElement.style.removeProperty('--control-h');
      if (button) update();
      document.dispatchEvent(new CustomEvent('epp-a11y-change', { detail: { ...state } }));
    }
    function sync() {
      for (const name of names) {
        const value = document.documentElement.getAttribute(`data-a11y-${name}`) || '';
        state[name] = value;
        for (const input of a11yPanel.querySelectorAll(`[name="a11y-${name}"]`)) {
          if (input.type === 'radio' || input.type === 'checkbox') input.checked = input.value === value;
          else input.value = value;
        }
      }
      const control = parseInt(document.documentElement.style.getPropertyValue('--control-h'), 10);
      state.control = control >= 28 && control <= 50 && control !== 32 ? control : '';
      showControl(state.control || 32);
    }
    function save(message) {
      try {
        const values = Object.fromEntries(Object.entries(state).filter(([, value]) => value));
        if (Object.keys(values).length) localStorage.setItem('epp-a11y', JSON.stringify(values));
        else localStorage.removeItem('epp-a11y');
        status.textContent = message;
      } catch (error) {
        console.warn('Préférences d’accessibilité non enregistrées :', error);
        status.textContent = 'Préférence appliquée, mais non enregistrée par le navigateur.';
      }
    }
    function close(restoreFocus = false) {
      showCredit(false);
      a11yPanel.hidden = true;
      a11yButton.setAttribute('aria-expanded', 'false');
      if (restoreFocus) a11yButton.focus();
    }
    function open() {
      a11yPanel.hidden = false;
      a11yButton.setAttribute('aria-expanded', 'true');
      a11yPanel.querySelector('input:checked').focus();
    }
    sync();
    a11yButton.hidden = false;
    a11yButton.addEventListener('click', () => {
      if (a11yPanel.hidden) open();
      else close();
    });
    a11yPanel.querySelector('.a11y-close').addEventListener('click', () => close(true));
    controlInput.addEventListener('input', () => {
      const value = Number(controlInput.value);
      state.control = value === 32 ? '' : value;
      showControl(value);
      apply();
    });
    controlInput.addEventListener('change', () => save('Taille des éléments : ' + controlInput.value + ' pixels.'));
    a11yPanel.addEventListener('change', event => {
      const name = (event.target.name || '').replace(/^a11y-/, '');
      if (!names.includes(name)) return;
      state[name] = event.target.type === 'checkbox' && !event.target.checked ? '' : event.target.value;
      apply();
      save('Préférence de lecture appliquée.');
    });
    a11yPanel.querySelector('.a11y-reset').addEventListener('click', () => {
      for (const name of names) state[name] = '';
      state.control = '';
      apply();
      sync();
      save('Préférences de lecture réinitialisées.');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !credit.hidden) {
        if (info.contains(document.activeElement)) infoButton.focus();
        showCredit(false);
        return;
      }
      if (event.key === 'Escape' && !a11yPanel.hidden) close(true);
    });
    document.addEventListener('click', event => {
      if (!info.contains(event.target)) showCredit(false);
      if (!a11yPanel.hidden && !event.target.closest('.a11y-menu')) close();
    });
    a11yPanel.addEventListener('focusout', event => {
      if (event.relatedTarget && !event.relatedTarget.closest('.a11y-menu')) close();
    });
  }
  // Cards show at most two lines of tags; extra tags are hidden behind "…".
  const MAX_TAG_LINES = 2;
  function clampTags(container) {
    container.querySelector(':scope > .chip-more')?.remove();
    const tags = [...container.querySelectorAll(':scope > .chip.tag')];
    tags.forEach(tag => { tag.hidden = false; });
    const lineOf = tag => Math.round(tag.offsetTop);
    const lines = [...new Set(tags.map(lineOf))].sort((a, b) => a - b);
    if (lines.length <= MAX_TAG_LINES) return;
    const lastLine = lines[MAX_TAG_LINES - 1];
    tags.forEach(tag => { if (lineOf(tag) > lastLine) tag.hidden = true; });
    const more = document.createElement('span');
    more.className = 'chip tag chip-more';
    more.innerHTML = '<span aria-hidden="true">…</span><span class="sr-only"></span>';
    const update = () => {
      const hidden = tags.filter(tag => tag.hidden);
      more.title = hidden.map(tag => tag.textContent.trim()).join(', ');
      more.lastChild.textContent = `et ${hidden.length} autre${hidden.length > 1 ? 's' : ''} tag${hidden.length > 1 ? 's' : ''}`;
    };
    update();
    container.append(more);
    // Make room for "…" on the last allowed line.
    let visible = tags.filter(tag => !tag.hidden);
    while (lineOf(more) > lastLine && visible.length > 1) {
      visible.pop().hidden = true;
      update();
    }
  }
  const tagContainers = [...document.querySelectorAll('.post-card .chips, .tool-card + .tool-taxonomies')]
    .filter(container => container.querySelector(':scope > .chip.tag'));
  if (tagContainers.length) {
    const widths = new WeakMap();
    const observer = new ResizeObserver(entries => {
      for (const { target, contentRect } of entries) {
        if (widths.get(target) === contentRect.width) continue;
        widths.set(target, contentRect.width);
        clampTags(target);
      }
    });
    tagContainers.forEach(container => observer.observe(container));
  }
  // Old anchors of split articles (e.g. #notification-toaster) lead to the new article.
  const anchor = decodeURIComponent(location.hash.slice(1));
  const moved = anchor && [...document.querySelectorAll('[data-redirect]')].find(element => element.id === anchor);
  if (moved) location.replace(moved.dataset.redirect);
})();
