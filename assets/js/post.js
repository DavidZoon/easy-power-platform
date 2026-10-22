(() => {
  'use strict';
  const content = document.querySelector('#post-content');
  if (!content) return;
  content.querySelectorAll('pre').forEach(pre => {
    const label = pre.closest('.code-block')?.querySelector('.code-lang')?.textContent;
    pre.tabIndex = 0;
    pre.setAttribute('role', 'region');
    pre.setAttribute('aria-label', `Extrait de code${label ? ` ${label}` : ''}`);
  });
  if (navigator.clipboard && window.isSecureContext) {
    const status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    content.append(status);
    content.querySelectorAll('.code-copy').forEach(button => {
      let timer;
      button.hidden = false;
      button.addEventListener('click', async () => {
        const code = button.closest('.code-block').querySelector('pre code, pre');
        let message;
        try {
          await navigator.clipboard.writeText(code.textContent.replace(/\n$/, ''));
          button.textContent = 'Copié !';
          button.classList.add('is-copied');
          message = 'Code copié dans le presse-papier';
        } catch {
          button.textContent = 'Échec';
          message = 'La copie a échoué';
        }
        status.textContent = message;
        clearTimeout(timer);
        timer = setTimeout(() => {
          button.textContent = 'Copier';
          button.classList.remove('is-copied');
          status.textContent = '';
        }, 2000);
      });
    });
  }
  content.querySelectorAll('table').forEach(table => {
    if (!table.parentElement.classList.contains('table-scroll')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Tableau de l’article');
      table.before(wrapper);
      wrapper.append(table);
    }
  });
  if (content.dataset.toc === 'false') return;
  const headings = [...content.querySelectorAll('h2,h3')];
  if (!headings.length) return;
  const list = document.querySelector('#toc-list');
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `section-${index + 1}`;
    const item = document.createElement('li');
    if (heading.tagName === 'H3') item.className = 'toc-sub';
    const anchor = document.createElement('a');
    anchor.href = `#${encodeURIComponent(heading.id)}`;
    anchor.textContent = heading.textContent;
    item.append(anchor);
    list.append(item);
  });
  document.querySelector('.toc').hidden = false;
})();
