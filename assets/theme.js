/**
 * Iymnn Beauty — Theme Global
 * Event bus, utilities, and AJAX cart API
 */
(function() {
  'use strict';

  window.IymnnBeauty = window.IymnnBeauty || {};

  /* === Event Bus === */
  const events = {};
  window.IymnnBeauty.on = function(event, callback) {
    if (!events[event]) events[event] = [];
    events[event].push(callback);
  };
  window.IymnnBeauty.off = function(event, callback) {
    if (!events[event]) return;
    events[event] = events[event].filter(cb => cb !== callback);
  };
  window.IymnnBeauty.emit = function(event, data) {
    if (!events[event]) return;
    events[event].forEach(cb => cb(data));
  };

  /* === Utilities === */
  window.IymnnBeauty.debounce = function(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  window.IymnnBeauty.formatMoney = function(cents) {
    const format = window.IymnnBeauty.moneyFormat || '${{amount}}';
    const value = (cents / 100).toFixed(2);
    return format
      .replace('{{amount}}', value)
      .replace('{{amount_no_decimals}}', Math.round(cents / 100))
      .replace('{{amount_with_comma_separator}}', value.replace('.', ','));
  };

  window.IymnnBeauty.fetchJSON = async function(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  /* === Cart API === */
  const CartAPI = {
    async get() {
      return IymnnBeauty.fetchJSON('/cart.js');
    },
    async add(items) {
      return IymnnBeauty.fetchJSON('/cart/add.js', {
        method: 'POST',
        body: JSON.stringify({ items: Array.isArray(items) ? items : [items] })
      });
    },
    async update(updates) {
      return IymnnBeauty.fetchJSON('/cart/update.js', {
        method: 'POST',
        body: JSON.stringify({ updates })
      });
    },
    async change(line, quantity) {
      return IymnnBeauty.fetchJSON('/cart/change.js', {
        method: 'POST',
        body: JSON.stringify(typeof line === 'string' ? { id: line, quantity } : { line, quantity })
      });
    },
    async clear() {
      return IymnnBeauty.fetchJSON('/cart/clear.js', { method: 'POST' });
    }
  };
  window.IymnnBeauty.cart = CartAPI;

  /* === Init on DOM Ready === */
  document.addEventListener('DOMContentLoaded', function() {
    IymnnBeauty.emit('theme:init');
  });
})();
