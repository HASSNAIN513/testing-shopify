/**
 * Iymnn Beauty — Cart Drawer
 * AJAX cart operations with drawer UI
 */
(function() {
  'use strict';

  const drawer = document.querySelector('[data-cart-drawer]');
  const overlay = document.querySelector('[data-cart-overlay]');
  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  // Toggle events
  document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openDrawer();
    });
  });
  document.querySelectorAll('[data-cart-close]').forEach(btn => btn.addEventListener('click', closeDrawer));
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer(); });

  // Update cart count badges
  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count], [data-cart-count-drawer]').forEach(el => {
      el.textContent = el.hasAttribute('data-cart-count-drawer') ? '(' + count + ')' : count;
    });
  }

  // Refresh cart drawer HTML
  async function refreshDrawer() {
    try {
      const response = await fetch('/?section_id=cart-drawer');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newDrawer = doc.querySelector('[data-cart-drawer]');
      if (newDrawer) {
        drawer.innerHTML = newDrawer.innerHTML;
        bindDrawerEvents();
      }
      const cart = await IymnnBeauty.cart.get();
      updateCartCount(cart.item_count);
      IymnnBeauty.emit('cart:updated', cart);
    } catch (err) {
      console.error('Cart refresh error:', err);
    }
  }

  function bindDrawerEvents() {
    // Close buttons
    drawer.querySelectorAll('[data-cart-close]').forEach(btn => btn.addEventListener('click', closeDrawer));

    // Remove buttons
    drawer.querySelectorAll('[data-remove-item]').forEach(btn => {
      btn.addEventListener('click', async function() {
        const key = this.dataset.lineKey;
        await IymnnBeauty.cart.change(key, 0);
        refreshDrawer();
      });
    });

    // Quantity changes
    drawer.querySelectorAll('[data-quantity-input]').forEach(input => {
      const lineKey = input.dataset.lineItemKey;
      if (!lineKey) return;
      const field = input.querySelector('[data-quantity-field]');
      const minusBtn = input.querySelector('[data-quantity-minus]');
      const plusBtn = input.querySelector('[data-quantity-plus]');

      if (minusBtn) minusBtn.addEventListener('click', () => updateQty(-1));
      if (plusBtn) plusBtn.addEventListener('click', () => updateQty(1));
      if (field) field.addEventListener('change', () => {
        IymnnBeauty.cart.change(lineKey, parseInt(field.value) || 0).then(refreshDrawer);
      });

      function updateQty(delta) {
        const newVal = Math.max(0, parseInt(field.value || 0) + delta);
        field.value = newVal;
        IymnnBeauty.cart.change(lineKey, newVal).then(refreshDrawer);
      }
    });
  }

  bindDrawerEvents();

  // Quick Add buttons
  document.addEventListener('click', async function(e) {
    const quickAdd = e.target.closest('[data-quick-add]');
    if (!quickAdd) return;
    e.preventDefault();
    const variantId = quickAdd.dataset.variantId;
    if (!variantId) return;

    quickAdd.disabled = true;
    quickAdd.innerHTML = '<span class="loading-spinner" style="width:16px;height:16px;"></span>';

    try {
      await IymnnBeauty.cart.add([{ id: parseInt(variantId), quantity: 1 }]);
      await refreshDrawer();
      openDrawer();
    } catch (err) {
      console.error('Quick add error:', err);
    } finally {
      quickAdd.disabled = false;
    }
  });

  // Add to Cart form submission
  document.addEventListener('submit', async function(e) {
    const form = e.target.closest('[data-product-form]');
    if (!form) return;
    e.preventDefault();

    const submitBtn = form.querySelector('[data-add-to-cart]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner" style="width:16px;height:16px;display:inline-block;"></span>';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch('/cart/add.js', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Add to cart failed');
      await refreshDrawer();
      openDrawer();
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
})();
