/* ============================================================
   Home: one sticky stage. Vertical scroll moves the camera
   sideways through seven chapters of a thin-line world. The
   world starts colourless; watercolor blooms in as you travel.
   ============================================================ */
(function () {
  'use strict';
  var AO = window.AO, reduce = AO.reduce, clamp = AO.clamp, rgba = AO.rgba;
  var scroller = document.getElementById('scroller'), track = document.getElementById('track');
  var chs = [].slice.call(track.querySelectorAll('.ch')), N = chs.length;
  var NAMES = ['Arrival', 'About', 'GamesmanUni', 'Orbito', 'BALL x PIT', 'LevelForger', 'The rest'];
  var prog = document.getElementById('prog'), fill = document.getElementById('fill');
  var vw = innerWidth, vh = innerHeight, cam = 0;

  /* ---------- Scroll through, not down ---------- */
  var go = function (i) { scrollTo({ top: i * vw, behavior: reduce ? 'auto' : 'smooth' }); };
  var ticks = NAMES.map(function (n, i) {
    var b = document.createElement('button'); b.type = 'button'; b.style.left = (i / (N - 1) * 100) + '%';
    b.innerHTML = '<i></i><span>' + String(i).padStart(2, '0') + ' ' + n + '</span>'; b.setAttribute('aria-label', 'Go to ' + n);
    if (i === 0) b.className = 'first'; if (i === N - 1) b.className = 'last';
    b.addEventListener('click', function () { go(i); }); prog.appendChild(b); return b;
  });
  var stage = track.parentNode;
  // one chapter is exactly 100vw wide and the stage one viewport tall: measure those, not innerWidth
  function size() { vw = chs[0].getBoundingClientRect().width || innerWidth; vh = stage.clientHeight || innerHeight; scroller.style.height = ((N - 1) * vw + vh) + 'px'; }
  size(); addEventListener('resize', size);
  // the world scrolls sideways along the stage, then down into the footer
  AO.cam = function () { var max = (N - 1) * vw, y = window.scrollY; return { x: clamp(y, 0, max), y: Math.max(0, y - max) }; };
  track.addEventListener('focusin', function (e) { var c = e.target.closest('.ch'); if (c) { var i = +c.dataset.ch; if (Math.abs(scrollY - i * vw) > 4) scrollTo({ top: i * vw }); } });
  // "Work" goes to the case chapters
  var workLinks = [].slice.call(document.querySelectorAll('[data-nav="work"]'));
  workLinks.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); AO.closeMenu(); go(2); }); });
  // Arriving on Home always starts at Arrival (only the Work link lands on the cases). The browser must not
  // restore an old scroll position, and nothing may scroll the stage itself sideways.
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  function land() { stage.scrollLeft = 0; stage.scrollTop = 0; scrollTo(0, location.hash === '#work' ? 2 * vw : 0); }
  land(); addEventListener('pageshow', land); addEventListener('hashchange', land);
  stage.addEventListener('scroll', function () { stage.scrollLeft = 0; stage.scrollTop = 0; });
  document.getElementById('endMail').innerHTML = AO.mailHTML(); AO.wireCopy(document.getElementById('endMail'));

  var reveal = new Float32Array(N), hov = new Float32Array(N), textP = new Float32Array(N);

  /* ---------- Watercolor tied to the journey (x, y: fraction of the chapter; c: 1 lilac, -1 blue) ---------- */
  var STORY = [
    { ch: 1, x: .66, y: .3, r: .34, c: 1 }, { ch: 1, x: .18, y: .72, r: .16, c: 1 },
    { ch: 2, x: .28, y: .52, r: .36, c: 1 }, { ch: 2, x: .86, y: .2, r: .12, c: 1 },
    { ch: 3, x: .72, y: .48, r: .34, c: -1 }, { ch: 3, x: .12, y: .8, r: .16, c: 1 },
    { ch: 4, x: .3, y: .5, r: .34, c: 1 }, { ch: 4, x: .44, y: .24, r: .18, c: -1 },
    { ch: 5, x: .7, y: .52, r: .36, c: -1 }, { ch: 5, x: .88, y: .86, r: .16, c: 1 },
    { ch: 6, x: .62, y: .4, r: .5, c: 1 }, { ch: 6, x: .88, y: .72, r: .42, c: -1 }, { ch: 6, x: .4, y: .86, r: .28, c: -1 }
  ];
  AO.addSource(function (add, now, c) {
    var sz = Math.min(vw, vh * 1.3);
    STORY.forEach(function (s) {
      var g = reveal[s.ch]; if (g <= 0) return; var e = 1 - Math.pow(1 - g, 3);
      add((s.ch + s.x) * vw - c.x, s.y * vh - c.y, s.r * sz * e * (1 + .32 * hov[s.ch]), s.c * (.55 + .45 * e) * (1 + .12 * Math.min(1, hov[s.ch])));
    });
  });

  function hiDPI(c) { var r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); c.width = r.width * d; c.height = r.height * d; var x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); return { x: x, w: r.width, h: r.height }; }

  /* ---------- 01 GamesmanUni: 107 stars, the ones near you light up ---------- */
  var gu = (function () {
    var c = document.getElementById('guC'), g = null, pts = [], mx = -1e4, my = -1e4;
    function setup() {
      g = hiDPI(c); pts = []; var R = Math.min(g.w, g.h) * .44;
      for (var i = 0; i < 107; i++) { var a = i * 2.39996, r = R * Math.sqrt((i + .5) / 107); pts.push({ x: g.w / 2 + Math.cos(a) * r, y: g.h / 2 + Math.sin(a) * r * .86, c: (i * 7) % 4 }); }
    }
    new ResizeObserver(setup).observe(c);
    var at = function (e) { var r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    c.addEventListener('pointermove', at); c.addEventListener('pointerdown', at);
    c.addEventListener('pointerleave', function () { mx = my = -1e4; });
    return { draw: function (rv) {
      if (!g) return; var x = g.x; x.clearRect(0, 0, g.w, g.h);
      var ink = AO.col.ink, A = AO.col.pa, B = AO.col.pb, shown = Math.floor(107 * rv), i, j, p, q;
      x.lineWidth = 1; x.strokeStyle = rgba(ink, .14);
      for (i = 0; i < shown; i++) { p = pts[i]; for (j = i + 1; j < Math.min(shown, i + 3); j++) { q = pts[j]; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke(); } }
      for (i = 0; i < shown; i++) {
        p = pts[i]; var d = Math.hypot(p.x - mx, p.y - my), near = d < 90;
        if (near) { x.strokeStyle = rgba(p.c % 2 ? B : A, .7 * (1 - d / 90)); x.beginPath(); x.moveTo(mx, my); x.lineTo(p.x, p.y); x.stroke(); }
        x.fillStyle = near ? (p.c % 2 ? B : A) : rgba(ink, .55); x.beginPath(); x.arc(p.x, p.y, near ? 3.2 : 1.6, 0, 7); x.fill();
      }
    } };
  })();

  /* ---------- 02 Orbito: thin-line board, place then orbit ---------- */
  (function () {
    var svg = document.getElementById('orbS'), NS = 'http://www.w3.org/2000/svg', st = document.getElementById('orbState'), goB = document.getElementById('orbGo');
    var C = function (i) { return 65 + i * 90; };
    var outer = [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3], [3, 2], [3, 1], [3, 0], [2, 0], [1, 0]], inner = [[1, 1], [1, 2], [2, 2], [2, 1]];
    var h = '<rect x="20" y="20" width="360" height="360" style="stroke:var(--line);fill:none"/><path d="M65 65H335V335H65Z M155 155H245V245H155Z" style="fill:none;stroke:var(--faint);stroke-dasharray:3 6"/>';
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) h += '<circle class="cell" data-r="' + r + '" data-c="' + c + '" cx="' + C(c) + '" cy="' + C(r) + '" r="30" style="fill:transparent;stroke:var(--faint);cursor:pointer"/>';
    svg.innerHTML = h;
    var board = {}, ms = [], pl = 0, ph = 0, key = function (r, c) { return r + ',' + c; };
    var put = function (m) { m.el.style.transform = 'translate(' + C(m.c) + 'px,' + C(m.r) + 'px)'; };
    svg.addEventListener('click', function (e) {
      var cell = e.target.closest('.cell'); if (!cell || ph) return; var r = +cell.dataset.r, c = +cell.dataset.c; if (board[key(r, c)]) return;
      var el = document.createElementNS(NS, 'g'); el.style.transition = reduce ? 'none' : 'transform .6s cubic-bezier(.5,0,.3,1)'; el.style.pointerEvents = 'none';
      var col = pl ? 'var(--pb)' : 'var(--pa)';
      el.innerHTML = '<circle r="22" style="fill:none;stroke:' + col + ';stroke-width:1.2"/><circle r="7" style="fill:' + col + '"/>';
      svg.appendChild(el); var m = { r: r, c: c, el: el }; ms.push(m); board[key(r, c)] = m; put(m);
      ph = 1; st.textContent = 'Phase 2 · orbit'; goB.classList.add('ready');
    });
    goB.addEventListener('click', function () {
      var nx = {};
      ms.forEach(function (m) {
        var same = function (p) { return p[0] === m.r && p[1] === m.c; }, ring = outer, i = outer.findIndex(same); if (i < 0) { ring = inner; i = inner.findIndex(same); }
        var p = ring[(i - 1 + ring.length) % ring.length]; m.r = p[0]; m.c = p[1]; nx[key(m.r, m.c)] = m; put(m);
      });
      Object.keys(board).forEach(function (k) { delete board[k]; }); Object.assign(board, nx);
      if (ms.length >= 16) { ms.forEach(function (m) { m.el.remove(); }); ms.length = 0; Object.keys(board).forEach(function (k) { delete board[k]; }); }
      ph = 0; pl ^= 1; st.textContent = 'Phase 1 · place'; goB.classList.remove('ready');
    });
  })();

  /* ---------- 03 BALL x PIT: line circles that merge and evolve ---------- */
  var pit = (function () {
    var c = document.getElementById('pitC'), g = null, balls = [];
    new ResizeObserver(function () { g = hiDPI(c); }).observe(c);
    var rad = function (l) { return 12 + l * 8; };
    var addB = function (x) { if (balls.length > 22) balls.shift(); balls.push({ x: x, y: -20, vx: (Math.random() - .5) * 60, vy: 0, l: 0 }); };
    c.addEventListener('pointerdown', function (e) { var r = c.getBoundingClientRect(); addB(e.clientX - r.left); });
    var seeded = false, last = performance.now();
    return { step: function (now, rv) {
      if (!g) return; var dt = Math.min(.033, (now - last) / 1000), i, j; last = now;
      if (rv > .6 && !seeded) { seeded = true; for (i = 0; i < 6; i++) setTimeout(function () { addB(g.w * (.25 + .5 * Math.random())); }, reduce ? 0 : i * 380); }
      var fl = g.h - 8, L = g.w * .12, R = g.w * .88;
      balls.forEach(function (b) {
        b.vy += 1300 * dt; b.x += b.vx * dt; b.y += b.vy * dt; var r = rad(b.l);
        if (b.y > fl - r) { b.y = fl - r; b.vy *= -.42; b.vx *= .96; } if (b.x < L + r) { b.x = L + r; b.vx = Math.abs(b.vx) * .6; } if (b.x > R - r) { b.x = R - r; b.vx = -Math.abs(b.vx) * .6; }
      });
      for (i = 0; i < balls.length; i++) for (j = i + 1; j < balls.length; j++) {
        var a = balls[i], b = balls[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, m = rad(a.l) + rad(b.l);
        if (d < m) {
          if (a.l === b.l && a.l < 4) { a.x = (a.x + b.x) / 2; a.y = (a.y + b.y) / 2; a.vy = -240; a.l++; balls.splice(j, 1); j--; continue; }
          var o = (m - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o;
          var rv2 = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv2 < 0) { var k = rv2 * .6; a.vx += k * nx; a.vy += k * ny; b.vx -= k * nx; b.vy -= k * ny; }
        }
      }
      var x = g.x, ink = AO.col.ink, A = AO.col.pa, B = AO.col.pb; x.clearRect(0, 0, g.w, g.h);
      x.strokeStyle = rgba(ink, .55); x.lineWidth = 1; x.beginPath(); x.moveTo(L, g.h * .2); x.lineTo(L, fl); x.lineTo(R, fl); x.lineTo(R, g.h * .2); x.stroke();
      for (i = 1; i < 6; i++) { x.strokeStyle = rgba(ink, .08); x.beginPath(); x.moveTo(L, fl - i * 34); x.lineTo(R, fl - i * 34); x.stroke(); }
      balls.forEach(function (b) {
        var r = rad(b.l), col = b.l % 2 ? B : A; x.strokeStyle = col; x.lineWidth = 1.2;
        for (var k = 0; k <= b.l; k++) { x.beginPath(); x.arc(b.x, b.y, r - k * 5, 0, 7); x.stroke(); }
        x.fillStyle = col; x.beginPath(); x.arc(b.x, b.y, 2.2, 0, 7); x.fill();
      });
    } };
  })();

  /* ---------- 04 LevelForger: wireframe level, scan to validate ---------- */
  var lfAuto = (function () {
    var c = document.getElementById('lfC'), stamp = document.getElementById('lfStamp'), btn = document.getElementById('lfGo');
    var CW = 20, RW = 8, g = null, lvl = null, shown = 0, scan = -1, busy = false;
    function draw() {
      if (!g) return; var x = g.x, ink = AO.col.ink, A = AO.col.pa, B = AO.col.pb, i; x.clearRect(0, 0, g.w, g.h);
      var s = Math.min(g.w / CW, (g.h - 40) / RW), ox = (g.w - s * CW) / 2, oy = (g.h - s * RW) / 2;
      x.lineWidth = 1; x.strokeStyle = rgba(ink, .1);
      for (i = 0; i <= CW; i++) { x.beginPath(); x.moveTo(ox + i * s, oy); x.lineTo(ox + i * s, oy + RW * s); x.stroke(); }
      for (i = 0; i <= RW; i++) { x.beginPath(); x.moveTo(ox, oy + i * s); x.lineTo(ox + CW * s, oy + i * s); x.stroke(); }
      if (!lvl) return;
      for (var cc = 0; cc < shown; cc++) for (var r = 0; r < lvl.g[cc]; r++) {
        var top = r === lvl.g[cc] - 1; x.strokeStyle = top ? A : rgba(ink, .6); x.lineWidth = top ? 1.4 : 1; x.strokeRect(ox + cc * s + 3, oy + (RW - 1 - r) * s + 3, s - 6, s - 6);
        if (top) { x.beginPath(); x.moveTo(ox + cc * s + 3, oy + (RW - 1 - r) * s + 3); x.lineTo(ox + cc * s + s - 3, oy + (RW - r) * s - 3); x.stroke(); }
      }
      if (scan >= 0) { x.strokeStyle = B; x.lineWidth = 1.2; x.beginPath(); x.moveTo(ox + (scan + .5) * s, oy - 10); x.lineTo(ox + (scan + .5) * s, oy + RW * s + 10); x.stroke(); }
      if (lvl.bad >= 0 && scan >= lvl.bad) { x.strokeStyle = B; x.setLineDash([3, 4]); x.strokeRect(ox + lvl.bad * s, oy, s, RW * s); x.setLineDash([]); }
    }
    new ResizeObserver(function () { g = hiDPI(c); draw(); }).observe(c);
    AO.onTheme(draw);
    function gen() { var a = [], h = 2; for (var i = 0; i < CW; i++) { if (i > 2 && i < CW - 2 && Math.random() < .2) { a.push(0); continue; } h = Math.max(1, Math.min(5, h + (Math.random() < .5 ? -1 : 1) * (Math.random() < .55 ? 1 : Math.random() < .5 ? 2 : 0))); a.push(h); } return a; }
    function bad(a) { var gap = 0, prev = a[0]; for (var i = 1; i < a.length; i++) { if (!a[i]) { gap++; if (gap > 2) return i; continue; } if (a[i] - prev > 2) return i; gap = 0; prev = a[i]; } return -1; }
    function run() {
      if (busy) return; busy = true; var a = gen(); lvl = { g: a, bad: bad(a) }; shown = 0; scan = -1; stamp.textContent = 'Generating';
      var t1 = setInterval(function () {
        shown++; draw();
        if (shown >= CW) {
          clearInterval(t1); stamp.textContent = 'Validating';
          var t2 = setInterval(function () {
            scan++; draw();
            if ((lvl.bad >= 0 && scan >= lvl.bad) || scan >= CW - 1) {
              clearInterval(t2);
              if (lvl.bad >= 0) { stamp.textContent = 'Unplayable · retrying'; setTimeout(function () { busy = false; run(); }, 1000); }
              else { stamp.textContent = 'Playable'; scan = -1; draw(); busy = false; }
            }
          }, reduce ? 0 : 60);
        }
      }, reduce ? 0 : 50);
    }
    btn.addEventListener('click', run);
    return function () { if (!lvl) run(); };
  })();

  /* ---------- Colour boxes: click either one to try the next colour ---------- */
  var HL = ['#0b0a10', '#7b5be0', '#1f55d4', '#0f6f78', '#3b2f8f', '#24222f'];
  [].forEach.call(document.querySelectorAll('[data-hl]'), function (el) {
    var i = +el.dataset.hl; el.style.setProperty('--hl', HL[i]);
    el.addEventListener('click', function (e) { e.stopPropagation(); i = (i + 1) % HL.length; el.style.setProperty('--hl', HL[i]); });
  });

  /* ---------- Arrival: an armillary of great circles turning around a tilted axis ---------- */
  var sky = (function () {
    var cvs = document.getElementById('sky'), g = null, lastDraw = 0;
    function sz() { var r = cvs.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cvs.width = r.width * d; cvs.height = r.height * d; g = { x: cvs.getContext('2d'), w: r.width, d: d }; lastDraw = 0; }
    new ResizeObserver(sz).observe(cvs);
    var nz = function (v) { var l = Math.hypot(v[0], v[1], v[2]); return v.map(function (a) { return a / l; }); };
    var cr = function (a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; };
    var rotA = function (v, k, a) { var c = Math.cos(a), s = Math.sin(a), d = k[0] * v[0] + k[1] * v[1] + k[2] * v[2], x = cr(k, v); return [0, 1, 2].map(function (i) { return v[i] * c + x[i] * s + k[i] * d * (1 - c); }); };
    var AX = nz([Math.sin(.41), Math.cos(.41), 0]);
    var RINGS = [{ n: nz([-.24, 1, .18]), a: .7, bead: 1 }, { n: nz([.5, 1, -.35]), a: .45, bead: 2 }, { n: nz([1, .05, .2]), a: .3 }, { n: nz([0, .2, 1]), a: .22 }];
    return { draw: function (now) {
      if (!g || !g.w) return; if (now - lastDraw < 33 && lastDraw) return; if (reduce && lastDraw) return; lastDraw = now;   // about 30fps
      var x = g.x, W = g.w, c = W / 2, R = W * .47, ink = AO.col.ink, t = reduce ? 0 : now / 1000, ang = t * 2 * Math.PI / 90, view = .32;   // one turn per 90 s
      x.setTransform(g.d, 0, 0, g.d, 0, 0); x.clearRect(0, 0, W, W);
      var P = function (v) { var w = rotA(rotA(v, AX, ang), [1, 0, 0], view); return [c + w[0] * R, c - w[1] * R, w[2]]; };
      var p1 = P(AX.map(function (a) { return a * 1.06; })), p2 = P(AX.map(function (a) { return -a * 1.06; }));
      x.strokeStyle = rgba(ink, .25); x.lineWidth = 1; x.setLineDash([2, 5]); x.beginPath(); x.moveTo(p1[0], p1[1]); x.lineTo(p2[0], p2[1]); x.stroke(); x.setLineDash([]);
      RINGS.forEach(function (r, ri) {
        var u = nz(cr(r.n, Math.abs(r.n[0]) < .9 ? [1, 0, 0] : [0, 1, 0])), v = cr(r.n, u);
        var pt = function (s) { return P([0, 1, 2].map(function (i) { return u[i] * Math.cos(s) + v[i] * Math.sin(s); })); };
        var prev = pt(0);
        for (var k = 1; k <= 160; k++) { var q = pt(k / 160 * Math.PI * 2), z = (prev[2] + q[2]) / 2; x.strokeStyle = rgba(ink, r.a * (z > 0 ? 1 : .3)); x.lineWidth = z > 0 ? 1.1 : 1; x.beginPath(); x.moveTo(prev[0], prev[1]); x.lineTo(q[0], q[1]); x.stroke(); prev = q; }
        if (r.bead) for (var b = 0; b < r.bead + 1; b++) { var qb = pt(t * (.18 + .07 * ri) + b * 2.1); x.fillStyle = rgba(ink, qb[2] > 0 ? .85 : .3); x.beginPath(); x.arc(qb[0], qb[1], qb[2] > 0 ? 3.2 : 2, 0, 7); x.fill(); }
      });
      // degree ticks around the rim, like a graduated ring
      x.strokeStyle = rgba(ink, .3);
      for (var k = 0; k < 72; k++) { var a = k / 72 * Math.PI * 2, l = k % 6 ? 5 : 11; x.beginPath(); x.moveTo(c + Math.cos(a) * R, c + Math.sin(a) * R); x.lineTo(c + Math.cos(a) * (R - l), c + Math.sin(a) * (R - l)); x.stroke(); }
    }, redraw: function () { lastDraw = 0; } };
  })();
  AO.onTheme(sky.redraw);

  /* ---------- Case pop-up ---------- */
  var T = 'public/timeline/';
  var CASES = [
    { k: '01 · GamesCrafters · UC Berkeley', t: 'GamesmanUni Redesign', o: 'Redesigning a research platform of 107 games and puzzles so new players find what they want without getting lost.', m: 'Website Lead · 2025 to present', img: [T + 'gc-frontend-dan.jpg'] },
    { k: '02 · GamesCrafters', t: 'Orbito: Designing a Two-Phase Turn', o: 'Turning a rotating physical board game into a click interface that still feels real, on top of a solver covering 20M+ positions.', m: 'Co-developer · Fall 2025', img: [T + 'gc-orbito.png'] },
    { k: '03 · Personal project', t: 'BALL x PIT Evolution Tracker', o: 'A player tool the community built on: Pit Crew uses my tracker as its foundation.', m: 'Personal project · [ADD TIMEFRAME]', img: [T + 'ballxpitTracker_thumbnail.png', T + 'ballxpitTracker_2thumbnail.png'] },
    { k: '04 · AI4ALL', t: 'LevelForger', o: 'A generative model for game levels, with a validation pipeline that cut unplayable levels from 30% to 5%.', m: 'AI4ALL · [ADD ROLE]', img: ['public/projects/levelforger.webp'] }
  ];
  var panel = document.getElementById('panel'), opener = null, cur = 0;
  var pK = document.getElementById('pK'), pT = document.getElementById('pT'), pO = document.getElementById('pO'), pM = document.getElementById('pM'), pN = document.getElementById('pN'), pX = document.getElementById('pX'), pS = document.getElementById('pS');
  /* Liquid glass refraction (Chromium only): a displacement map that bends the backdrop at the panel's edges, like a thick lens */
  var isChromium = !!(navigator.userAgentData && navigator.userAgentData.brands.some(function (b) { return /Chromium/.test(b.brand); })) || /Chrome\/\d/.test(navigator.userAgent);
  var lgKey = '';
  function glassMap() {
    if (!isChromium || reduce) return;
    var w = Math.round(panel.offsetWidth), h = Math.round(panel.offsetHeight), key = w + 'x' + h; if (!w || !h || key === lgKey) return; lgKey = key;
    var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'), img = x.createImageData(w, h), d = img.data, bw = Math.min(46, Math.min(w, h) * .12);
    for (var y = 0; y < h; y++) for (var X = 0; X < w; X++) {
      var dl = X, dr = w - 1 - X, dt = y, db = h - 1 - y, m = Math.min(dl, dr, dt, db), nx = 0, ny = 0;
      if (m < bw) {
        var k = Math.pow(1 - m / bw, 2.2);
        if (m === dl) nx = -k; else if (m === dr) nx = k; if (m === dt) ny = -k; else if (m === db) ny = k;
        // round the lens toward the corners so it reads as one piece of glass
        var cx = Math.max(0, bw - Math.min(dl, dr)), cy = Math.max(0, bw - Math.min(dt, db));
        if (cx > 0 && cy > 0) { var sx = dl < dr ? -1 : 1, sy = dt < db ? -1 : 1, l = Math.hypot(cx, cy) || 1, kk = Math.pow(Math.min(1, l / bw), 2.2); nx = sx * cx / l * kk; ny = sy * cy / l * kk; }
      }
      var i = (y * w + X) * 4; d[i] = 128 + nx * 127; d[i + 1] = 128 + ny * 127; d[i + 2] = 128; d[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    var fe = document.getElementById('lgMap'); fe.setAttribute('href', c.toDataURL()); fe.setAttribute('width', w); fe.setAttribute('height', h);
    panel.classList.add('lg');
  }
  addEventListener('resize', function () { if (panel.classList.contains('show')) glassMap(); });
  var ph = function (t) { return t.replace(/\[([A-Z ]+)\]/g, '<span class="ph">[$1]</span>'); };
  function open(i) {
    cur = i; var c = CASES[i]; opener = opener || document.activeElement;
    pK.textContent = c.k; pT.textContent = c.t; pO.textContent = c.o; pM.innerHTML = ph(c.m); pN.innerHTML = 'Next · ' + CASES[(i + 1) % 4].t + ' <i></i>';
    pS.innerHTML = [0, 1, 2].map(function (k) { return '<div>' + (c.img[k] ? '<img src="' + c.img[k] + '" alt="' + c.t + ', image ' + (k + 1) + '" loading="lazy">' : '[ADD IMAGE]') + '</div>'; }).join('');
    panel.classList.add('show'); panel.setAttribute('aria-hidden', 'false'); document.body.classList.add('open'); pX.focus();
    requestAnimationFrame(function () { requestAnimationFrame(glassMap); });
    // two blooms spread behind the panel
    var cm = AO.cam(), s = Math.min(vw, vh);
    AO.bloom(cm.x + vw * .5, cm.y + vh * .5, s * .55, i % 2 ? -1 : 1, .9, 1800);
    AO.bloom(cm.x + vw * .68, cm.y + vh * .62, s * .32, i % 2 ? 1 : -1, .7, 2000, 200);
  }
  function close() { panel.classList.remove('show'); panel.setAttribute('aria-hidden', 'true'); document.body.classList.remove('open'); opener && opener.focus(); opener = null; }
  [].forEach.call(document.querySelectorAll('[data-open]'), function (b) { b.addEventListener('click', function () { open(+b.dataset.open); }); });
  pX.addEventListener('click', close); pN.addEventListener('click', function () { var n = 2 + (cur + 1) % 4; close(); go(n); });
  addEventListener('keydown', function (e) {
    if (!panel.classList.contains('show')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') { var f = [pX, pN], i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });

  /* ---------- Text arrival, parallax and the constellation thread ---------- */
  var depthEls = [].map.call(document.querySelectorAll('[data-depth]'), function (el) { return { el: el, d: +el.dataset.depth, ch: +el.closest('.ch').dataset.ch }; });
  var rvEls = [], hazes = [];
  chs.forEach(function (c, ci) {
    if (ci === 0) return;
    [].forEach.call(c.querySelectorAll('.ttl'), function (t) { if (!t.querySelector('span')) t.innerHTML = '<span style="display:inline-block">' + t.innerHTML + '</span>'; });
    [].forEach.call(c.querySelectorAll('.stmt,.ttl,.info,.tb'), function (h) { h.classList.add('haze'); hazes.push({ el: h, ch: ci }); });
    var list = [].slice.call(c.querySelectorAll('.stmt > *,.ttl > span,.info > *,.tb > *,.play .hint,.play .ctl'));
    list.forEach(function (el, k) { el.classList.add('rv'); rvEls.push({ el: el, ch: ci, k: k, n: list.length, t: -1 }); });
  });
  // constellation nodes, as fractions of each chapter; the line stays once drawn
  var NODES = [[0, .88, .2], [0, .97, .42], [1, .055, .2], [1, .37, .52], [1, .61, .14], [1, .71, .62], [2, .16, .12], [2, .46, .88], [2, .9, .2], [3, .58, .1], [3, .96, .86], [4, .08, .86], [4, .47, .13], [4, .93, .8], [5, .6, .88], [5, .9, .14], [6, .5, .16], [6, .82, .58], [6, .96, .36]];
  var BRANCH = [[2, 4], [3, 5], [6, 8], [11, 13], [16, 18]];
  var thSvg = document.getElementById('thread'), thPath = document.getElementById('thPath'), thBr = document.getElementById('thBr'), thDots = document.getElementById('thDots');
  var thPts = [], thCum = [], thLen = 0, thShown = 0, thKey = '';
  function thBuild() {
    thKey = vw + 'x' + vh; thSvg.setAttribute('width', N * vw); thSvg.style.width = N * vw + 'px'; thSvg.setAttribute('height', vh);
    thPts = NODES.map(function (n) { return [(n[0] + n[1]) * vw, n[2] * vh]; }); thCum = [0];
    for (var i = 1; i < thPts.length; i++) thCum.push(thCum[i - 1] + Math.hypot(thPts[i][0] - thPts[i - 1][0], thPts[i][1] - thPts[i - 1][1]));
    var frac = thLen ? thShown / thLen : 0; thLen = thCum[thCum.length - 1]; thShown = frac * thLen;
    thPath.setAttribute('d', 'M' + thPts.map(function (p) { return p.join(' '); }).join(' L')); thPath.style.strokeDasharray = thLen;
    thBr.setAttribute('d', BRANCH.map(function (b) { return 'M' + thPts[b[0]].join(' ') + ' L' + thPts[b[1]].join(' '); }).join(' '));
    thDots.innerHTML = thPts.map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="0"/>'; }).join('');
  }
  function thread() {
    if (thKey !== vw + 'x' + vh) thBuild();
    var head = cam + vw * .78, L = 0;   // the line's head runs at about 78% of the viewport
    for (var i = 1; i < thPts.length; i++) {
      var a = thPts[i - 1], b = thPts[i]; if (head >= b[0]) { L = thCum[i]; continue; }
      if (head > a[0]) L = thCum[i - 1] + (thCum[i] - thCum[i - 1]) * clamp((head - a[0]) / Math.max(1, b[0] - a[0]), 0, 1);
      break;
    }
    if (reduce) { var nxt = NODES.findIndex(function (n) { return n[0] > Math.round(cam / vw); }); L = Math.max(L, thCum[(nxt < 0 ? thPts.length : nxt) - 1] || L); }
    thShown = Math.max(thShown, L); thPath.style.strokeDashoffset = thLen - thShown;
    thBr.style.opacity = Math.min(1, thShown / thLen * 1.5);
    [].forEach.call(thDots.children, function (c, i) { if (thCum[i] <= thShown + 1 && c.getAttribute('r') === '0') c.setAttribute('r', i % 3 === 0 ? '4' : '2.6'); });
  }

  /* ---------- Frame ---------- */
  AO.onFrame(function (now, dt) {
    var max = (N - 1) * vw;
    cam = clamp(scrollY, 0, max);
    track.style.transform = 'translate3d(' + (-cam) + 'px,0,0)';
    for (var i = 0; i < N; i++) {
      var rel = (cam - i * vw) / vw, r = clamp((rel + .95) / .5, 0, 1), tp = clamp((rel + .5) / .5, 0, 1);
      reveal[i] = reduce ? (rel > -.8 ? 1 : reveal[i]) : Math.max(reveal[i], r);
      textP[i] = reduce ? (rel > -.8 ? 1 : textP[i]) : Math.max(textP[i], tp);
    }
    var at = Math.round(cam / vw), open = document.body.classList.contains('open');
    if (!reduce && now - AO.lastMove < 260 && !open && scrollY <= max + 4) hov[at] = Math.min(2.2, hov[at] + dt * .06);
    hazes.forEach(function (h) { if (!h.on && textP[h.ch] > .02) { h.on = 1; h.el.classList.add('on'); } });
    rvEls.forEach(function (o) { var d = Math.min(.14, .6 / o.n), t = clamp((textP[o.ch] - o.k * d) / (1 - (o.n - 1) * d), 0, 1); if (t !== o.t) { o.t = t; o.el.style.setProperty('--t', t.toFixed(3)); } });
    thread();
    if (!reduce) depthEls.forEach(function (o) { var rel = (cam - o.ch * vw) / vw; if (Math.abs(rel) < 1.2) o.el.style.setProperty('--px', (-rel * vw * o.d).toFixed(1) + 'px'); });
    fill.style.width = (cam / max * 100) + '%';
    ticks.forEach(function (t, i) { t.classList.toggle('on', i === at); });
    var inWork = at >= 2 && at <= 5;
    workLinks.forEach(function (a) { if (inWork) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    if (reveal[2] > 0 && Math.abs(cam - 2 * vw) < vw * 1.1) gu.draw(reveal[2]);
    if (reveal[4] > 0 && Math.abs(cam - 4 * vw) < vw * 1.1) pit.step(now, reveal[4]);
    if (reveal[5] > .7 && lfAuto) { lfAuto(); lfAuto = null; }
    if (cam < vw * 1.05) sky.draw(now);
  });

  // the arrival ring draws itself in over about 2.6 s
  if (!reduce) {
    var ring = document.querySelector('.c0 .ring'), t0 = performance.now(); ring.style.setProperty('--r', 0);
    (function intro(now) { var k = Math.min(1, (now - t0) / 2600); ring.style.setProperty('--r', 1 - Math.pow(1 - k, 3)); if (k < 1) requestAnimationFrame(intro); })(t0);
  }
})();
