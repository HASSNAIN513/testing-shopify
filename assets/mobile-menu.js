/**
 * Iymnn Beauty — Mobile Menu Drawer
 */
(function() {
  'use strict';
  const menu = document.querySelector('[data-mobile-menu]');
  const overlay = document.querySelector('[data-mobile-menu-overlay]');
  const toggleBtns = document.querySelectorAll('[data-mobile-menu-toggle]');
  const closeBtns = document.querySelectorAll('[data-mobile-menu-close]');

  if (!menu) return;

  function open() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    toggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    const firstFocusable = menu.querySelector('a, button, input');
    if (firstFocusable) firstFocusable.focus();
  }

  function close() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    toggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  }

  toggleBtns.forEach(btn => btn.addEventListener('click', open));
  closeBtns.forEach(btn => btn.addEventListener('click', close));
  if (overlay) overlay.addEventListener('click', close);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
})();
