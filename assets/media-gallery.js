/**
 * Iymnn Beauty — Product Media Gallery
 */
(function() {
  'use strict';

  const gallery = document.querySelector('[data-product-gallery]');
  if (!gallery) return;

  const mainImage = gallery.querySelector('[data-product-main-image]');
  const thumbnails = gallery.querySelectorAll('[data-thumbnail]');

  // Thumbnail click
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      thumbnails.forEach(t => t.classList.remove('is-active'));
      this.classList.add('is-active');
      if (mainImage) {
        mainImage.src = this.dataset.fullSrc;
        if (this.dataset.srcset) mainImage.srcset = this.dataset.srcset;
      }
    });
  });

  // Image zoom on hover (desktop)
  if (mainImage && window.innerWidth >= 1024) {
    const wrap = mainImage.parentElement;
    wrap.addEventListener('mouseenter', function() {
      mainImage.style.transition = 'none';
      mainImage.style.transformOrigin = '0 0';
    });
    wrap.addEventListener('mousemove', function(e) {
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImage.style.transform = 'scale(1.8)';
      mainImage.style.transformOrigin = x + '% ' + y + '%';
    });
    wrap.addEventListener('mouseleave', function() {
      mainImage.style.transition = 'transform 0.3s ease';
      mainImage.style.transform = 'scale(1)';
    });
  }

  // Touch swipe (mobile)
  if (mainImage && 'ontouchstart' in window) {
    let startX = 0;
    let currentIndex = 0;
    const images = Array.from(thumbnails);

    mainImage.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    mainImage.addEventListener('touchend', function(e) {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < images.length - 1) currentIndex++;
        else if (diff < 0 && currentIndex > 0) currentIndex--;
        if (images[currentIndex]) images[currentIndex].click();
      }
    }, { passive: true });
  }

  // Listen for variant changes
  IymnnBeauty.on('variant:changed', function(data) {
    if (data.variant && data.variant.featured_image) {
      const variantImageId = data.variant.featured_image.id;
      thumbnails.forEach(thumb => {
        if (parseInt(thumb.dataset.imageId) === variantImageId) {
          thumb.click();
        }
      });
    }
  });
})();
