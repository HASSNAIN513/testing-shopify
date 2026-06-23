/**
 * Iymnn Beauty — Disclosure / Accordion
 */
(function() {
  'use strict';

  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-accordion-trigger]');
    if (!trigger) return;

    const item = trigger.closest('[data-accordion-item]');
    if (!item) return;

    const accordion = item.closest('[data-accordion]');
    const isOpen = item.classList.contains('is-open');
    const content = item.querySelector('.accordion__content');

    // Close others in same accordion
    if (accordion) {
      accordion.querySelectorAll('[data-accordion-item].is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          const openContent = openItem.querySelector('.accordion__content');
          if (openContent) openContent.style.maxHeight = '0';
          const openTrigger = openItem.querySelector('[data-accordion-trigger]');
          if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Toggle current
    if (isOpen) {
      item.classList.remove('is-open');
      if (content) content.style.maxHeight = '0';
      trigger.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('is-open');
      if (content) content.style.maxHeight = content.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  // Keyboard support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openItems = document.querySelectorAll('[data-accordion-item].is-open');
      openItems.forEach(item => {
        item.classList.remove('is-open');
        const content = item.querySelector('.accordion__content');
        if (content) content.style.maxHeight = '0';
        const trigger = item.querySelector('[data-accordion-trigger]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();
