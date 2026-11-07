(function () {
  'use strict';

  /**
   * Generic open/close controller for trigger + panel pairs
   * (waffle menu, notifications, user menu). Only one menu stays
   * open at a time and Escape/outside-click always closes.
   */
  var menus = [];

  function registerMenu(triggerId, panelId) {
    var trigger = document.getElementById(triggerId);
    var panel = document.getElementById(panelId);
    if (!trigger || !panel) return;

    var entry = { trigger: trigger, panel: panel };
    menus.push(entry);

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      closeAllMenus();
      if (!isOpen) openMenu(entry);
    });

    panel.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  function openMenu(entry) {
    entry.trigger.setAttribute('aria-expanded', 'true');
    entry.panel.hidden = false;
    var firstItem = entry.panel.querySelector('a, button, input');
    if (firstItem) firstItem.focus({ preventScroll: true });
  }

  function closeMenu(entry) {
    entry.trigger.setAttribute('aria-expanded', 'false');
    entry.panel.hidden = true;
  }

  function closeAllMenus() {
    menus.forEach(closeMenu);
  }

  document.addEventListener('click', closeAllMenus);

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var openEntry = menus.find(function (m) { return !m.panel.hidden; });
    closeAllMenus();
    if (openEntry) openEntry.trigger.focus();
  });

  registerMenu('waffleBtn', 'wafflePanel');
  registerMenu('notifBtn', 'notifPanel');
  registerMenu('userBtn', 'userPanel');

  /**
   * "Ver todos" toggles the extra product items hidden inside the
   * waffle panel, matching the Olivelas pattern of a progressive-disclosure
   * product grid.
   */
  var verTodosBtn = document.getElementById('verTodosBtn');
  if (verTodosBtn) {
    var extraItems = Array.prototype.slice.call(document.querySelectorAll('[data-extra-item]'));
    var labelSpan = verTodosBtn.querySelector('span');

    verTodosBtn.addEventListener('click', function () {
      var expanded = verTodosBtn.getAttribute('aria-expanded') === 'true';
      extraItems.forEach(function (item) {
        item.hidden = expanded;
      });
      verTodosBtn.setAttribute('aria-expanded', String(!expanded));
      if (labelSpan) labelSpan.textContent = expanded ? 'Ver todos' : 'Ver menos';
    });
  }

  /**
   * Sidebar collapsible group (e.g. "Seguro imobiliário").
   */
  var segToggle = document.getElementById('segSeguroToggle');
  var segSub = document.getElementById('segSeguroSub');
  if (segToggle && segSub) {
    segSub.classList.add('is-open');
    segToggle.addEventListener('click', function () {
      var expanded = segToggle.getAttribute('aria-expanded') === 'true';
      segToggle.setAttribute('aria-expanded', String(!expanded));
      segSub.classList.toggle('is-open', !expanded);
    });
  }

  /**
   * Mobile sidebar toggle.
   */
  var sidebarToggle = document.getElementById('sidebarToggle');
  var sidebar = document.getElementById('sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      var isOpen = sidebar.classList.toggle('is-open');
      sidebarToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
})();
