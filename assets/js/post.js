(() => {
  'use strict';
  const content = document.querySelector('#post-content');
  if (!content) return;
  content.querySelectorAll('pre').forEach(pre => {
    const element = pre.querySelector('code') || pre;
    const classes = `${element.className} ${pre.parentElement.className}`;
    const language = classes.match(/language-([\w-]+)/)?.[1];
    if (language) pre.dataset.language = language;
    pre.tabIndex = 0;
    pre.setAttribute('role', 'region');
    pre.setAttribute('aria-label', `Extrait de code${language ? ` ${language}` : ''}`);
  });
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
