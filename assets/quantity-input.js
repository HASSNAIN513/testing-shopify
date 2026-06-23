/**
 * Iymnn Beauty — Quantity Input Stepper
 */
(function() {
  'use strict';

  document.addEventListener('click', function(e) {
    const minus = e.target.closest('[data-quantity-minus]');
    const plus = e.target.closest('[data-quantity-plus]');
    if (!minus && !plus) return;

    const wrap = (minus || plus).closest('[data-quantity-input]');
    if (!wrap) return;

    const field = wrap.querySelector('[data-quantity-field]');
    if (!field) return;

    const min = parseInt(field.min) || 0;
    const max = parseInt(field.max) || 99;
    let value = parseInt(field.value) || 1;

    if (minus) value = Math.max(min, value - 1);
    if (plus) value = Math.min(max, value + 1);

    field.value = value;
    field.dispatchEvent(new Event('change', { bubbles: true }));

    // Update button states
    const minusBtn = wrap.querySelector('[data-quantity-minus]');
    const plusBtn = wrap.querySelector('[data-quantity-plus]');
    if (minusBtn) minusBtn.disabled = value <= min;
    if (plusBtn) plusBtn.disabled = value >= max;
  });
})();
