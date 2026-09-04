/* ============================================================
   Site shell — starfields, nav visibility, and the two
   shared-window background crossfades (hero -> side margins,
   side margins -> footer). One system, not three effects.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- starfields ---------- */
  function makeStars(container, count, sparkleRatio, faint) {
    if (!container) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var sparkle = !faint && sparkleRatio > 0 && Math.random() < sparkleRatio;
      var size = sparkle ? (Math.random() * 1.2 + 2.1) : (Math.random() * 1.5 + 0.5);
      var s = document.createElement('div');
      s.className = 'star';
      s.style.width = size.toFixed(2) + 'px';
      s.style.height = size.toFixed(2) + 'px';
      s.style.top = (Math.random() * 100).toFixed(2) + '%';
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      var dur = sparkle ? (Math.random() * 3 + 7) : (Math.random() * 4 + 4);
      if (faint) dur = Math.random() * 3 + 7;
      s.style.animationDuration = dur.toFixed(2) + 's';
      s.style.animationDelay = (Math.random() * 6).toFixed(2) + 's';
      if (sparkle) s.style.boxShadow = '0 0 5px rgba(238,233,255,0.7)';
      if (reduce) { s.style.animation = 'none'; s.style.opacity = faint ? '0.08' : '0.5'; }
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  makeStars(document.querySelector('.hero-stars'), 90, 0, false);
  makeStars(document.querySelector('.side-stars.left'), 64, 0.06, false);
  makeStars(document.querySelector('.side-stars.right'), 64, 0.06, false);
  makeStars(document.querySelector('.footer-stars'), 46, 0.06, false);
  makeStars(document.querySelector('.stage-stars'), 16, 0, true);

  /* ---------- element handles ---------- */
  var heroZone   = document.querySelector('.hero-zone');
  var fluid      = document.getElementById('fluid-canvas');
  var fluidFb    = null; // css fallback, resolved lazily
  var heroStars  = document.querySelector('.hero-stars');
  var sideL      = document.querySelector('.side-stars.left');
  var sideR      = document.querySelector('.side-stars.right');
  var footerStars = document.querySelector('.footer-stars');
  var footer     = document.querySelector('.site-footer');
  var nav        = document.querySelector('.site-nav');
  var toggle     = document.querySelector('.nav-toggle');

  var hasHero = !!heroZone;

  /* ---------- measurements ---------- */
  var heroH = 0, footerTop = 0, vh = window.innerHeight;
  function measure() {
    vh = window.innerHeight;
    if (heroZone) heroH = heroZone.offsetHeight;
    if (footer) footerTop = footer.offsetTop;
  }

  /* ---------- nav visibility ---------- */
  var navOverride = null;   // null = use automatic rule; true/false = explicit
  var idleHidden = false;
  var idleTimer = null;

  function armIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      idleHidden = true;
      applyNav();
    }, 90000);
  }
  function wake() {
    if (idleHidden) { idleHidden = false; applyNav(); }
    armIdle();
  }

  function baseVisible(y) {
    if (navOverride !== null) return navOverride;
    if (hasHero) return y > 0.6 * heroH;
    return true;
  }
  function applyNav() {
    if (!nav) return;
    var y = window.scrollY || 0;
    var vis = idleHidden ? false : baseVisible(y);
    nav.classList.toggle('visible', vis);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var y = window.scrollY || 0;
      var cur = nav && nav.classList.contains('visible');
      navOverride = !cur;
      idleHidden = false;
      applyNav();
      armIdle();
    });
  }

  /* ---------- background crossfades ---------- */
  function setOpacity(el, v) { if (el) el.style.opacity = String(v); }

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  function updateBg(y) {
    // Crossfade 1 — hero -> side margins (share one window: hero's last 40%)
    var heroLayer, sideFromHero;
    if (hasHero && heroH > 0) {
      var startFade = 0.6 * heroH;
      var endFade = heroH;
      heroLayer = clamp01((endFade - y) / (endFade - startFade));
      sideFromHero = clamp01((y - startFade) / (endFade - startFade));
    } else {
      heroLayer = 0;
      sideFromHero = 1; // secondary pages: side stars visible from the top
    }

    // Crossfade 2 — side margins -> footer, window ends before footer on screen
    var footerProg = 0;
    if (footer && footerTop > 0) {
      var fEnd = footerTop - vh;
      var fStart = fEnd - 0.5 * vh;
      footerProg = clamp01((y - fStart) / (fEnd - fStart));
    }

    var sideOpacity = sideFromHero * (1 - footerProg);

    if (fluid) setOpacity(fluid, heroLayer);
    if (!fluidFb) fluidFb = document.querySelector('[data-fluid]');
    if (fluidFb) setOpacity(fluidFb, heroLayer);
    setOpacity(heroStars, heroLayer);
    setOpacity(sideL, sideOpacity);
    setOpacity(sideR, sideOpacity);
    setOpacity(footerStars, footerProg);
  }

  /* ---------- toggle dim + main scroll handler ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      if (toggle) toggle.classList.toggle('dim', y > 40);
      applyNav();
      updateBg(y);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  ['mousemove', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, wake, { passive: true });
  });

  // initial paint (allow layout + fonts to settle)
  measure();
  updateBg(window.scrollY || 0);
  applyNav();
  armIdle();
  window.addEventListener('load', function () { measure(); onScroll(); });
  setTimeout(function () { measure(); onScroll(); }, 400);
})();
