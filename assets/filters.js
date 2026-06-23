/**
 * Iymnn Beauty — Collection Filters
 */
(function() {
  'use strict';

  // Sort select
  document.addEventListener('change', function(e) {
    if (!e.target.matches('[data-sort-select]')) return;
    const url = new URL(window.location);
    url.searchParams.set('sort_by', e.target.value);
    window.location.href = url.toString();
  });

  // Filter toggle (mobile)
  document.addEventListener('click', function(e) {
    const toggle = e.target.closest('[data-filter-toggle]');
    if (!toggle) return;
    const sidebar = document.querySelector('[data-filter-sidebar]');
    if (!sidebar) return;
    const isVisible = sidebar.style.display !== 'none';
    sidebar.style.display = isVisible ? 'none' : 'block';
    toggle.setAttribute('aria-expanded', !isVisible);
  });

  // Filter checkbox changes
  document.addEventListener('change', function(e) {
    if (!e.target.matches('[data-filter-input]')) return;
    // Build URL from all active filters
    const url = new URL(window.location);
    const params = new URLSearchParams();
    document.querySelectorAll('[data-filter-input]').forEach(input => {
      if (input.type === 'checkbox' && input.checked) {
        params.append(input.name, input.value);
      } else if (input.type === 'number' && input.value) {
        params.set(input.name, input.value);
      }
    });
    // Preserve sort
    const sort = url.searchParams.get('sort_by');
    if (sort) params.set('sort_by', sort);
    window.location.href = window.location.pathname + '?' + params.toString();
  });

  // Product tabs
  document.addEventListener('click', function(e) {
    const tab = e.target.closest('[data-tab-trigger]');
    if (!tab) return;
    const index = tab.dataset.tabIndex;
    const container = tab.closest('section');
    if (!container) return;
    container.querySelectorAll('[data-tab-trigger]').forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    container.querySelectorAll('[data-tab-panel]').forEach(p => p.classList.remove('is-active'));
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    const panel = container.querySelector('[data-tab-panel][data-tab-index="' + index + '"]');
    if (panel) panel.classList.add('is-active');
  });
})();
