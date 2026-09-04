/* ============================================================
   Journey timeline — pinned scroll section.
   Ported from design_handoff/Journey Timeline v3.dc.html.
   Split color pairing (the chosen scheme). Dwell-plateau then
   smoothstep crossfade. Final-milestone weight edge case is
   short-circuited (see weight()).
   ============================================================ */
(function () {
  'use strict';

  var spacer = document.getElementById('tl-spacer');
  if (!spacer) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Timeline is data-driven: add an entry and the section grows automatically.
  // `group` is the academic-year separator each entry sits under (newest first).
  // Entries stay in newest-first order; keep each group's entries contiguous.
  // NOTE: the group labels below are a best guess — adjust to match reality.
  var ENTRIES = [
    { group: 'Senior Year',    date: '2026 — Present', title: 'GMG x 2K Mentorship Program', desc: "Paired with mentors from 2K's Engineering Grad Program." },
    { group: 'Senior Year',    date: '2025 — Present', title: 'Website Team Lead — GamesCrafters', desc: "Led a full UI overhaul of the group's interactable games research website." },
    { group: 'Junior Year',    date: '2023', title: 'GMG College Scholarship Recipient', desc: '2023 scholarship recipient supporting continued work in game development.' },
    { group: 'Sophomore Year', date: '2023 — 2024', title: 'CS184: Computer Graphics', desc: 'Rasterizer, MeshEdit, PathTracer, Cloth Simulation, and "Snowfall."' },
    { group: 'Sophomore Year', date: 'Sophomore Year', title: 'Title Info — Org', desc: 'Description of responsibilities and duties.' },
    { group: 'Freshman Year',  date: 'Freshman Year', title: 'iD Tech — Job Info', desc: 'Description of responsibilities, duties.' }
  ];

  var N = ENTRIES.length;
  var MILESTONE_SCROLL = 94;   // vh per milestone
  var PAD = 0.35;              // settle room (bands of lead-in / lead-out)
  var TRANS = 0.3;            // transitionShare — crossfade slice of each band

  // Split pairing (chosen scheme)
  var PAL = { mark: '#7a9b8e', index: '#7a9b8e', corner: '#7a9b8e', tick: '#8f7fd1', dot: '#b287b0' };

  // element handles
  var track   = document.getElementById('tl-track');
  var layout  = document.getElementById('tl-layout');
  var marker  = document.getElementById('tl-marker');
  var well    = document.getElementById('tl-well');
  var indexEl = document.getElementById('tl-index');
  var capDate = document.getElementById('tl-capdate');
  var capEl   = document.getElementById('tl-caption');
  var capTitle = capEl ? capEl.querySelector('.c-title') : null;
  var capNote  = capEl ? capEl.querySelector('.c-note') : null;
  var railFill = document.querySelector('#tl-rail .fill');
  var rail     = document.getElementById('tl-rail');
  var hud      = document.getElementById('tl-hud');
  var cue      = document.getElementById('tl-cue'); // scroll cue in the intro

  function p2(n) { return String(n).padStart(2, '0'); }

  // ---------- build steps (with academic-year separators) ----------
  var stepEls = [];
  var lastGroup = null;
  ENTRIES.forEach(function (e, i) {
    if (e.group && e.group !== lastGroup) {
      var sep = document.createElement('div');
      sep.className = 'tl-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.innerHTML = '<span class="tl-sep-line"></span><span class="tl-sep-label">' + e.group + '</span>';
      track.appendChild(sep);
      lastGroup = e.group;
    }
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'step';
    b.setAttribute('data-step', String(i));
    b.innerHTML =
      '<span class="dot"></span>' +
      '<div class="s-date">' + e.date + '</div>' +
      '<div class="s-title">' + e.title + '</div>' +
      '<div class="s-desc">' + e.desc + '</div>';
    b.addEventListener('click', function () { jump(i); });
    track.appendChild(b);
    stepEls.push(b);
  });

  // ---------- build frames ----------
  var frameEls = [];
  ENTRIES.forEach(function (e) {
    var f = document.createElement('div');
    f.className = 'frame';
    f.innerHTML = '<span>' + e.title + ' — image</span>';
    well.insertBefore(f, well.firstChild); // keep crop marks on top
    frameEls.push(f);
  });

  // ---------- build rail ticks ----------
  var tickEls = [];
  if (rail) {
    ENTRIES.forEach(function (e, i) {
      var t = document.createElement('div');
      t.className = 'tick';
      t.style.top = (((i + 0.5) / N) * 100).toFixed(2) + '%';
      rail.appendChild(t);
      tickEls.push(t);
    });
  }

  // apply the palette bits that don't change
  var diamond = document.querySelector('.ledger-head .diamond');
  if (diamond) diamond.style.background = PAL.mark;
  if (indexEl) indexEl.style.color = PAL.index;
  document.querySelectorAll('.image-well .crop').forEach(function (c) { c.style.background = PAL.corner; });

  // reduced motion: drop transitions but keep scroll-driven state
  if (reduce) {
    var noTrans = document.createElement('style');
    noTrans.textContent = '.step,.frame,.active-marker,.caption,.ledger-head .cap-date{transition:none!important}';
    document.head.appendChild(noTrans);
  }

  // ---------- spacer height ----------
  spacer.style.height = Math.round((N + 2 * PAD) * MILESTONE_SCROLL + 100) + 'vh';

  // ---------- state ----------
  var stepRows = [];
  var fit = 1;
  var progress = 0;
  var approaching = true;

  function measure() {
    // rows
    var rows = [];
    stepEls.forEach(function (el) { rows.push({ top: el.offsetTop, height: el.offsetHeight }); });
    stepRows = rows;
    // fit-to-viewport
    if (layout && layout.offsetHeight) {
      var raw = Math.min(
        1,
        (window.innerHeight - 40) / layout.offsetHeight,
        (window.innerWidth - 24) / layout.offsetWidth
      );
      var f = Math.max(0.5, Number(raw.toFixed(4)));
      if (Math.abs(f - fit) > 0.002) { fit = f; layout.style.transform = 'scale(' + fit + ')'; }
    }
  }

  function bandPosition() {
    var t = progress * (N + 2 * PAD) - PAD;
    return Math.max(0, Math.min(N - 0.0001, t));
  }

  function jump(i) {
    var p = (i + (1 - TRANS) / 2 + PAD) / (N + 2 * PAD);
    var dist = spacer.offsetHeight - window.innerHeight;
    var top = spacer.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.round(top + p * dist), behavior: reduce ? 'auto' : 'smooth' });
  }

  function render() {
    var t = bandPosition();
    var base = Math.floor(t);
    var local = t - base;
    var raw = local <= 1 - TRANS ? 0 : (local - (1 - TRANS)) / TRANS;
    var mix = raw * raw * (3 - 2 * raw); // smoothstep
    var next = Math.min(N - 1, base + 1);
    var active = mix > 0.5 ? next : base;

    // Edge case: in the final band next === base; hold the last milestone
    // at full weight instead of letting the weighting drive it to 0.
    function weight(j) {
      if (next === base) return j === base ? 1 : 0;
      if (j === base) return 1 - mix;
      if (j === next) return mix;
      return 0;
    }

    // steps
    stepEls.forEach(function (el, i) {
      var w = weight(i);
      el.style.opacity = (0.3 + 0.7 * w).toFixed(3);
      el.style.transform = 'translateX(' + (w * 3).toFixed(2) + 'px)';
      var dot = el.firstChild;
      var on = w > 0.5;
      dot.style.background = on ? PAL.dot : '#453c68';
      dot.style.boxShadow = on ? '0 0 10px rgba(201,188,240,.5)' : 'none';
      dot.style.transform = 'rotate(45deg) scale(' + (0.85 + 0.25 * w).toFixed(3) + ')';
    });

    // frames
    frameEls.forEach(function (el, i) {
      var w = weight(i);
      el.style.opacity = w.toFixed(3);
      el.style.transform = 'scale(' + (0.988 + 0.012 * w).toFixed(4) + ')';
      el.style.zIndex = (i === next && next !== base) ? 3 : i === base ? 2 : 1;
    });

    // marker (measured offsets; stage carries a scale transform)
    var row = stepRows[active] || { top: active * 92, height: 88 };
    if (marker) { marker.style.top = row.top.toFixed(1) + 'px'; marker.style.height = row.height.toFixed(1) + 'px'; }

    // caption + ledger
    var cur = ENTRIES[active];
    var bell = 1 - Math.abs(2 * mix - 1);
    if (capTitle) capTitle.textContent = cur.title;
    if (capNote) capNote.textContent = cur.desc;
    if (capDate) capDate.textContent = cur.date;
    if (indexEl) indexEl.textContent = p2(active + 1) + ' / ' + p2(N);
    var capOpacity = (1 - 0.9 * bell).toFixed(3);
    if (capEl) capEl.style.opacity = capOpacity;
    if (capDate) capDate.style.opacity = capOpacity;

    // rail
    if (railFill) railFill.style.height = (progress * 100).toFixed(2) + '%';
    tickEls.forEach(function (t2, i) {
      t2.style.background = i === active ? PAL.tick : 'rgba(143,127,209,.3)';
    });

    // hud + cue
    if (hud) hud.style.opacity = (progress > 0.01 && progress < 0.99) ? '0.45' : '0';
    if (hud) hud.textContent = 'milestone ' + p2(active + 1) + ' / ' + p2(N) + ' · ' + MILESTONE_SCROLL + 'vh each';
    if (cue) cue.style.opacity = (approaching && progress < 0.03) ? '0.65' : '0';
  }

  function onScroll() {
    var r = spacer.getBoundingClientRect();
    var dist = r.height - window.innerHeight;
    var p = dist > 0 ? -r.top / dist : 0;
    progress = Math.max(0, Math.min(1, p));
    approaching = r.top > 0.45 * window.innerHeight;
    render();
  }

  var ticking = false;
  function onScrollThrottled() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }

  window.addEventListener('scroll', onScrollThrottled, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function () { measure(); });
    if (layout) ro.observe(layout);
    if (track) ro.observe(track);
  }

  measure();
  onScroll();
  window.addEventListener('load', function () { measure(); onScroll(); });
  setTimeout(function () { measure(); onScroll(); }, 400);
})();
