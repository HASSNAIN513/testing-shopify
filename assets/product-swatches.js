/**
 * Iymnn Beauty — Product Swatches
 */
(function() {
  'use strict';

  document.addEventListener('click', function(e) {
    const swatchItem = e.target.closest('[data-swatch-item]');
    if (!swatchItem) return;

    const selector = swatchItem.closest('[data-swatch-selector]');
    if (!selector) return;

    // Update selected state
    selector.querySelectorAll('[data-swatch-item]').forEach(s => s.classList.remove('is-selected'));
    swatchItem.classList.add('is-selected');

    // Update label
    const label = selector.querySelector('[data-swatch-selected-label]');
    if (label) label.textContent = swatchItem.dataset.value;

    // Show/hide notify form for sold-out
    const notify = selector.querySelector('[data-swatch-notify]');
    if (notify) {
      notify.style.display = swatchItem.classList.contains('is-soldout') ? 'block' : 'none';
    }
  });
})();
