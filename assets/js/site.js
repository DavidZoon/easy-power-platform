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
