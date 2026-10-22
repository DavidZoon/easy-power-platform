(() => {
  'use strict';
  const form = document.querySelector('#local-search');
  if (!form) return;
  const input = form.querySelector('input');
  const status = document.querySelector('#search-status');
  const results = document.querySelector('#search-results');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
  let indexPromise;
  let request = 0;
  async function search() {
    const version = ++request;
    const query = input.value.trim().slice(0, 200);
    results.replaceChildren();
    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!query) { status.textContent = 'Saisissez un sujet pour rechercher dans les articles.'; return; }
    status.textContent = 'Recherche en cours…';
    try {
      if (!indexPromise) {
        indexPromise = fetch(form.dataset.index).then(response => {
          if (!response.ok) throw new Error(`Index : HTTP ${response.status}`);
          return response.json();
        }).then(posts => posts.map(post => ({
          ...post, titleText: normalize(post.title),
          topics: normalize([...post.categories, ...post.tags].join(' ')), bodyText: normalize(post.body)
        })));
      }
      const index = await indexPromise;
      if (version !== request) return;
      const tokens = normalize(query).split(/\s+/).filter(Boolean);
      const matches = index.map(post => ({
        post, score: tokens.every(token => `${post.titleText} ${post.topics} ${post.bodyText}`.includes(token))
          ? tokens.reduce((score, token) => score + (post.titleText.includes(token) ? 10 : 0) + (post.topics.includes(token) ? 5 : 0) + 1, 0) : 0
      })).filter(match => match.score > 0).sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date));
      status.textContent = `${matches.length} résultat${matches.length > 1 ? 's' : ''} pour « ${query} ».`;
      for (const { post } of matches) {
        const item = document.createElement('li');
        const title = document.createElement('h2');
        const anchor = document.createElement('a');
        const safeUrl = new URL(post.url, location.origin);
        if (safeUrl.origin !== location.origin) throw new Error('URL externe dans l’index');
        anchor.href = safeUrl.href;
        anchor.textContent = post.title;
        const excerpt = document.createElement('p');
        excerpt.textContent = post.excerpt;
        title.append(anchor);
        item.append(title, excerpt);
        results.append(item);
      }
    } catch (error) {
      indexPromise = undefined;
      if (version === request) status.textContent = 'Impossible de charger la recherche. Réessayez ou consultez la page Articles.';
      console.error('Recherche locale :', error);
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); search(); });
  input.value = (new URLSearchParams(location.search).get('q') || '').slice(0, 200);
  if (input.value) search();
})();
