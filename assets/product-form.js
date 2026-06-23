/**
 * Iymnn Beauty — Product Form (Variant Selection)
 */
(function() {
  'use strict';

  const productHero = document.querySelector('[data-product-hero]');
  if (!productHero) return;

  const jsonEl = document.querySelector('[data-product-json]');
  if (!jsonEl) return;

  const product = JSON.parse(jsonEl.textContent);
  const variantIdInput = productHero.querySelector('[data-variant-id]');
  const addToCartBtn = productHero.querySelector('[data-add-to-cart]');
  const priceEl = productHero.querySelector('[data-product-price]');

  function getCurrentOptions() {
    const options = [];
    // From swatch selectors
    productHero.querySelectorAll('[data-swatch-input]:checked').forEach(input => {
      options[input.closest('[data-swatch-selector]').dataset.optionIndex] = input.value;
    });
    // From select dropdowns
    productHero.querySelectorAll('[data-option-select]').forEach(select => {
      options[select.dataset.optionIndex] = select.value;
    });
    return options;
  }

  function findVariant(options) {
    return product.variants.find(v => {
      return options.every((opt, i) => v['option' + (i + 1)] === opt);
    });
  }

  function updateVariant() {
    const options = getCurrentOptions();
    const variant = findVariant(options);

    if (!variant) {
      if (addToCartBtn) {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Unavailable';
      }
      return;
    }

    // Update hidden input
    if (variantIdInput) variantIdInput.value = variant.id;

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);

    // Update price
    if (priceEl) {
      let priceHTML = '<div class="price">';
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        priceHTML += '<span class="price__regular price__sale">' + IymnnBeauty.formatMoney(variant.price) + '</span>';
        priceHTML += '<span class="price__compare">' + IymnnBeauty.formatMoney(variant.compare_at_price) + '</span>';
        priceHTML += '<span class="price__badge">Sale</span>';
      } else {
        priceHTML += '<span class="price__regular">' + IymnnBeauty.formatMoney(variant.price) + '</span>';
      }
      priceHTML += '</div>';
      priceEl.innerHTML = priceHTML;
    }

    // Update button state
    if (addToCartBtn) {
      if (variant.available) {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = 'Add to Cart';
      } else {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Sold Out';
      }
    }

    // Update gallery for variant
    if (variant.featured_image) {
      const mainImage = productHero.querySelector('[data-product-main-image]');
      if (mainImage) {
        mainImage.src = variant.featured_image.src.replace(/(\.\w+)$/, '_800x$1');
      }
    }

    IymnnBeauty.emit('variant:changed', { variant, product });
  }

  // Listen for changes
  productHero.addEventListener('change', function(e) {
    if (e.target.matches('[data-swatch-input], [data-option-select]')) {
      updateVariant();
    }
  });
})();
