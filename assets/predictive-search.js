/**
 * Iymnn Beauty — Predictive Search
 */
(function() {
  'use strict';

  const searchEl = document.querySelector('[data-predictive-search]');
  if (!searchEl) return;

  const input = searchEl.querySelector('[data-predictive-input]');
  const results = searchEl.querySelector('[data-predictive-results]');
  const loading = searchEl.querySelector('[data-predictive-loading]');
  const closeBtn = searchEl.querySelector('[data-predictive-close]');

  function open() {
    searchEl.classList.add('is-open');
    searchEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 100);
  }

  function close() {
    searchEl.classList.remove('is-open');
    searchEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  }

  document.querySelectorAll('[data-search-toggle]').forEach(btn => {
    btn.addEventListener('click', function(e) { e.preventDefault(); open(); });
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  const search = IymnnBeauty.debounce(async function(query) {
    if (query.length < 2) { results.innerHTML = ''; return; }
    if (loading) loading.style.display = 'block';

    try {
      const url = window.IymnnBeauty.routes.predictive_search_url || '/search/suggest';
      const response = await fetch(url + '?q=' + encodeURIComponent(query) + '&resources[type]=product,collection,page&resources[limit]=4&section_id=predictive-search');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newResults = doc.querySelector('[data-predictive-results]');
      if (newResults) {
        results.innerHTML = newResults.innerHTML;
      } else {
        // Fallback: render from JSON
        const jsonResp = await fetch('/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product&resources[limit]=4');
        const data = await jsonResp.json();
        let html = '';
        if (data.resources && data.resources.results && data.resources.results.products) {
          data.resources.results.products.forEach(p => {
            html += '<a href="' + p.url + '" class="predictive-search__result">';
            if (p.image) html += '<img src="' + p.image + '" alt="" class="predictive-search__result-image" loading="lazy">';
            html += '<div><p class="predictive-search__result-name">' + p.title + '</p>';
            html += '<p class="predictive-search__result-price">' + IymnnBeauty.formatMoney(p.price) + '</p></div></a>';
          });
        }
        results.innerHTML = html || '<p style="padding: 20px; text-align: center; color: var(--color-muted-foreground);">No results found</p>';
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      if (loading) loading.style.display = 'none';
    }
  }, 300);

  if (input) input.addEventListener('input', function() { search(this.value.trim()); });
})();
