/**
 * Iymnn Beauty — Recently Viewed Products
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'iymnn-beauty-recently-viewed';
  const MAX_ITEMS = 10;

  function getViewed() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveViewed(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch {}
  }

  // Track current product
  const section = document.querySelector('[data-recently-viewed]');
  if (section) {
    const handle = section.dataset.productHandle;
    if (handle) {
      let viewed = getViewed();
      viewed = viewed.filter(h => h !== handle);
      viewed.unshift(handle);
      if (viewed.length > MAX_ITEMS) viewed = viewed.slice(0, MAX_ITEMS);
      saveViewed(viewed);
    }
  }

  // Render recently viewed
  const grid = document.querySelector('[data-recently-viewed-grid]');
  if (!grid || !section) return;

  const viewed = getViewed();
  const currentHandle = section.dataset.productHandle;
  const handles = viewed.filter(h => h !== currentHandle);

  if (handles.length < 2) return;

  const limit = parseInt(section.dataset.limit || section.closest('section')?.querySelector('[data-recently-viewed]')?.dataset?.limit) || 4;
  const toFetch = handles.slice(0, limit);

  Promise.all(
    toFetch.map(handle =>
      fetch('/products/' + handle + '.js')
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    )
  ).then(products => {
    const valid = products.filter(Boolean);
    if (valid.length < 2) return;

    let html = '';
    valid.forEach(p => {
      const img = p.featured_image ? p.featured_image.replace(/(\.\w+)$/, '_600x$1') : '';
      html += '<div class="product-card">';
      html += '<div class="product-card__image-wrap">';
      if (img) html += '<img src="' + img + '" alt="' + (p.title || '').replace(/"/g, '&quot;') + '" loading="lazy" class="product-card__image" style="aspect-ratio:4/5;object-fit:cover;width:100%;height:100%">';
      html += '</div>';
      html += '<div class="product-card__info">';
      if (p.vendor) html += '<div class="product-card__tag">' + p.vendor + '</div>';
      html += '<h3 class="product-card__name"><a href="/products/' + p.handle + '">' + p.title + '</a></h3>';
      html += '<div class="product-card__price"><span>' + IymnnBeauty.formatMoney(p.price) + '</span></div>';
      html += '</div></div>';
    });

    grid.innerHTML = html;
    section.closest('section').style.display = 'block';
  });
})();
