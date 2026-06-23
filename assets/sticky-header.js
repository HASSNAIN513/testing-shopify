/**
 * Iymnn Beauty — Sticky Header
 * Adds 'is-scrolled' class based on scroll position
 */
(function() {
  'use strict';
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(function() {
        if (lastScrollY > 24) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
