/* ============================================================
   Class pages: a second row of mono tabs under the nav, one per
   assignment. Clicking a tab scrolls to its section; scrolling
   updates the active tab.
   ============================================================ */
(function () {
  'use strict';
  var AO = window.AO, secs = [].slice.call(document.querySelectorAll('.csec[data-tab]'));
  if (!secs.length) return;
  var tabs = document.createElement('nav'); tabs.className = 'tabs mono'; tabs.setAttribute('aria-label', 'Assignments');
  tabs.innerHTML = '<a class="pg" href="projects.html" style="margin-right:10px">&#8592; Projects</a>' + secs.map(function (s) { return '<a class="pg tab" href="#' + s.id + '">' + s.getAttribute('data-tab') + '</a>'; }).join('');
  document.body.appendChild(tabs);
  var links = [].slice.call(tabs.querySelectorAll('.tab'));
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); history.replaceState(null, '', '#' + secs[i].id);
      scrollTo({ top: scrollY + secs[i].getBoundingClientRect().top - 118, behavior: AO.reduce ? 'auto' : 'smooth' });
    });
  });
  AO.reveal(secs);
  var cur = -1;
  AO.onFrame(function () {
    var at = 0; secs.forEach(function (s, i) { if (s.getBoundingClientRect().top < innerHeight * .45) at = i; });
    if (at === cur) return; cur = at;
    links.forEach(function (a, i) { if (i === at) { a.setAttribute('aria-current', 'true'); if (a.scrollIntoView && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = a.offsetLeft - 60; } else a.removeAttribute('aria-current'); });
  });
})();
