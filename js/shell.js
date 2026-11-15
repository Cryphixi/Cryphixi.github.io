/* ============================================================
   Shell: everything every page shares.
   Nav (with phone menu), settings icons, theme, the watercolor
   background (blooms + wet brush simulation), sound, text arrival,
   and the footer. Pages register their own blooms and frame work
   through window.AO. The contact address comes from js/contact.js.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement, body = document.body;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var darkMq = matchMedia('(prefers-color-scheme: dark)');
  var PAGE = body.getAttribute('data-page') || '';
  var CONTACT = window.AO_CONTACT || {};
  var MAIL = CONTACT.email || '';
  var LINKS = {
    linkedin: 'https://www.linkedin.com/in/allena-oglivie/',
    github: 'https://github.com/Cryphixi',
    handshake: 'https://app.joinhandshake.com/profiles/allenaoglivie'
  };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  var AO = window.AO = {
    reduce: reduce, clamp: clamp, lerp: lerp, MAIL: MAIL, LINKS: LINKS,
    vw: innerWidth, vh: innerHeight, lastMove: 0,
    cam: function () { return { x: 0, y: window.scrollY }; },   // Home overrides: its world scrolls sideways
    frames: [], sources: [], themeFns: [], col: {}
  };
  AO.onFrame = function (fn) { AO.frames.push(fn); };
  AO.onTheme = function (fn) { AO.themeFns.push(fn); };
  AO.addSource = function (fn) { AO.sources.push(fn); };
  // the address as text with a Copy button, or a visible placeholder until js/contact.js is filled in
  AO.mailHTML = function () {
    return MAIL ? '<span class="js-mail">' + MAIL + '</span> <button class="mono pf-copy js-copy" type="button">Copy</button>' : '<span class="ph">[ADD EMAIL]</span>';
  };

  /* ---------- Theme: follow the system until the visitor chooses ---------- */
  var isDark = AO.isDark = function () {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : darkMq.matches;
  };
  function hex(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.slice(i, i + 2), 16) / 255; }); }
  AO.hex = hex;
  AO.rgba = function (h, a) { var c = hex(h); return 'rgba(' + c.map(function (v) { return Math.round(v * 255); }).join(',') + ',' + a + ')'; };
  function readCols() {
    var cs = getComputedStyle(root);
    ['paper', 'ink', 'soft', 'pa', 'pb', 'pc', 'pd'].forEach(function (n) { AO.col[n] = cs.getPropertyValue('--' + n).trim(); });
  }
  function themeChanged() { readCols(); AO.themeFns.forEach(function (f) { f(); }); }
  readCols();
  darkMq.addEventListener('change', themeChanged);
  AO.setTheme = function (dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    store.set('ao-theme', dark ? 'dark' : 'light');
    themeChanged();
  };

  /* ---------- Nav, phone menu, footer markup ---------- */
  var NAV = [['Work', 'index.html#work', 'work'], ['Timeline', 'timeline.html', 'timeline'], ['Projects', 'projects.html', 'projects'], ['Connect', 'connect.html', 'connect'], ['Resume', 'resume.html', 'resume']];
  var links = function () {
    return NAV.map(function (n) { return '<a class="pg" href="' + n[1] + '" data-nav="' + n[2] + '"' + (n[2] === PAGE ? ' aria-current="page"' : '') + '>' + n[0] + '</a>'; }).join('');
  };
  var sets = '<span class="sets" role="group" aria-label="Settings">' +
    '<button class="ico js-snd" type="button"><svg viewBox="0 0 20 20" aria-hidden="true"><path/></svg></button>' +
    '<button class="ico js-theme" type="button"><svg viewBox="0 0 20 20" aria-hidden="true"><g class="rays"></g><path class="bd"/><circle class="dot e1" r=".7"/><circle class="dot e2" r=".7"/><path class="sm"/></svg></button></span>';

  var cv = document.createElement('canvas'); cv.id = 'wc'; cv.setAttribute('aria-hidden', 'true');
  body.insertBefore(cv, body.firstChild);

  var header = document.createElement('header'); header.className = 'nav';
  header.innerHTML = '<a class="brand" href="index.html" aria-label="Allena Oglivie, home"></a>' +
    '<nav class="mono" aria-label="Pages">' + links() + '</nav>' + sets +
    '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><svg viewBox="0 0 22 22" aria-hidden="true"><path class="m1" d="M3 6H19"/><path class="m2" d="M3 11H19"/><path class="m3" d="M3 16H19"/></svg></button>';
  var shade = document.createElement('div'); shade.className = 'menu-shade';
  var menu = document.createElement('div'); menu.className = 'menu'; menu.id = 'menu';
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Menu');
  menu.innerHTML = '<a class="pg" href="index.html" data-nav="home"' + (PAGE === 'home' ? ' aria-current="page"' : '') + '>Home</a>' + links() + sets;
  body.appendChild(header); body.appendChild(shade); body.appendChild(menu);

  var footer = document.createElement('footer'); footer.className = 'pfoot'; footer.id = 'pfoot';
  footer.innerHTML = '<div class="pf-in">' +
    '<svg class="pf-hz" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20H1000"/><path class="tk" d="M100 14V26M200 17V23M300 14V26M400 17V23M500 10V30M600 17V23M700 14V26M800 17V23M900 14V26"/></svg>' +
    '<p class="mono soft" style="margin:0">End of the page</p>' +
    '<h2 class="pf-big">Let\'s chat</h2>' +
    '<div class="pf-cols">' +
      '<div class="haze on"><p class="mono pf-h">Contact</p>' +
        '<p class="pf-mail">' + AO.mailHTML() + '</p>' +
        '<a href="' + LINKS.linkedin + '" target="_blank" rel="noopener">LinkedIn</a><a href="' + LINKS.github + '" target="_blank" rel="noopener">GitHub</a><a href="' + LINKS.handshake + '" target="_blank" rel="noopener">Handshake</a></div>' +
      '<div class="haze on"><p class="mono pf-h">Pages</p><a href="index.html">Home</a><a href="timeline.html">Timeline</a><a href="projects.html">Projects</a><a href="connect.html">Connect</a><a href="resume.html">Resume</a></div>' +
      '<div class="haze on"><p class="mono pf-h">Portfolio</p><span class="pf-note">Coming soon</span></div>' +
    '</div>' +
    '<div class="pf-base mono"><div class="pf-logo" role="img" aria-label="Allena Oglivie"></div><span>&copy; 2026 Allena Oglivie</span><button type="button" class="mono pf-top">Back to top &#8593;</button></div>' +
    '</div>';
  body.appendChild(footer);

  AO.wireCopy = function (scope) {
    [].forEach.call(scope.querySelectorAll('.js-copy'), function (btn) {
      btn.addEventListener('click', function () {
        var done = function (label) { btn.textContent = label; setTimeout(function () { btn.textContent = 'Copy'; }, 1800); };
        (navigator.clipboard ? navigator.clipboard.writeText(MAIL) : Promise.reject()).then(function () { done('Copied'); }, function () {
          var m = btn.parentNode.querySelector('.js-mail');
          if (m) { var r = document.createRange(); r.selectNodeContents(m); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
          done('Selected');
        });
      });
    });
  };
  AO.wireCopy(footer);
  footer.querySelector('.pf-top').addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* phone menu: Esc and outside tap close it, focus stays inside while open */
  var mbtn = header.querySelector('.menu-btn');
  function setMenu(open) {
    menu.classList.toggle('open', open); shade.classList.toggle('open', open);
    mbtn.setAttribute('aria-expanded', String(open)); mbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { var f = menu.querySelector('a'); f && f.focus(); } else if (menu.contains(document.activeElement)) mbtn.focus();
  }
  AO.closeMenu = function () { setMenu(false); };
  mbtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  shade.addEventListener('click', function () { setMenu(false); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.key !== 'Tab') return;
    var f = [mbtn].concat([].slice.call(menu.querySelectorAll('a,button')));
    var i = f.indexOf(document.activeElement), n = e.shiftKey ? i - 1 : i + 1;
    e.preventDefault(); f[(n + f.length) % f.length].focus();
  });
  addEventListener('resize', function () { if (innerWidth > 760 && menu.classList.contains('open')) setMenu(false); });

  /* ---------- Sound: a harmonic-series drone, a soft ding per click, a hum at the end ---------- */
  var snd = AO.snd = (function () {
    var F0 = 110;   // every pitch below is a whole-number or just-interval ratio of it
    var ctx = null, on = false, master, bus, humG, started = false, pref = store.get('ao-sound'), wasEnd = false, fns = [];
    function build() {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      bus = ctx.createGain(); bus.connect(master);
      var dl = ctx.createDelay(1); dl.delayTime.value = .31; var fb = ctx.createGain(); fb.gain.value = .3; var wet = ctx.createGain(); wet.gain.value = .2;
      bus.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master);
      // bed: partials 1, 3/2, 2, 3 of F0, each as two sines a fraction of a hertz apart so they beat slowly
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 850;
      var breathe = ctx.createGain(); breathe.gain.value = .8; lp.connect(breathe); breathe.connect(bus);
      var lfo = ctx.createOscillator(); lfo.frequency.value = .045; var lfoG = ctx.createGain(); lfoG.gain.value = .2; lfo.connect(lfoG); lfoG.connect(breathe.gain); lfo.start();
      [[1, .05], [1.5, .022], [2, .018], [3, .007]].forEach(function (pg, i) {
        [0, 1].forEach(function (k) { var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = F0 * pg[0] + (k ? .11 * (i + 1) : 0); var gg = ctx.createGain(); gg.gain.value = pg[1] / 2; o.connect(gg); gg.connect(lp); o.start(); });
      });
      // very quiet pink noise through a soft band-pass
      var len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), b0 = 0, b1 = 0, b2 = 0;
      for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; b0 = .99765 * b0 + w * .099046; b1 = .963 * b1 + w * .2965164; b2 = .57 * b2 + w * 1.0526913; d[i] = (b0 + b1 + b2 + w * .1848) * .11; }
      var ns = ctx.createBufferSource(); ns.buffer = buf; ns.loop = true; var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 480; bp.Q.value = .5;
      var ng = ctx.createGain(); ng.gain.value = .022; ns.connect(bp); bp.connect(ng); ng.connect(bus); ns.start();
      // end hum: triangle partials 2, 3, 4 through a closed-mouth low-pass, with a 4.6 Hz vibrato
      humG = ctx.createGain(); humG.gain.value = 0; var hlp = ctx.createBiquadFilter(); hlp.type = 'lowpass'; hlp.frequency.value = 520; hlp.Q.value = 2; hlp.connect(humG); humG.connect(bus);
      var vib = ctx.createOscillator(); vib.frequency.value = 4.6; var vibG = ctx.createGain(); vibG.gain.value = 1.4; vib.connect(vibG); vib.start();
      [[2, .5], [3, .3], [4, .15]].forEach(function (pg) { var o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = F0 * pg[0]; vibG.connect(o.frequency); var gg = ctx.createGain(); gg.gain.value = pg[1]; o.connect(gg); gg.connect(hlp); o.start(); });
      return true;
    }
    // every change of volume is a fade: in when the music starts or the page arrives, out when it leaves
    function fade(to, tc, fromZero) {
      var t = ctx.currentTime, g = master.gain;
      g.cancelScheduledValues(t); g.setValueAtTime(fromZero ? 0 : g.value, t); g.setTargetAtTime(to, t, tc);
    }
    function set(v) {
      on = v;
      if (on) { if (!ctx && !build()) { on = false; } else { ctx.resume(); fade(.9, .8); } }
      else if (ctx) fade(0, .25);
      store.set('ao-sound', on ? 'on' : 'off'); wasEnd = false;
      fns.forEach(function (f) { f(on); });
    }
    var SCALE = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2];   // a just scale on F0 x 4
    var lastNote = -1;
    function ding() {
      if (!on || !ctx || ctx.state !== 'running') return;
      var n; do { n = Math.floor(Math.random() * SCALE.length); } while (n === lastNote); lastNote = n;   // a random note, never the same twice in a row
      var t = ctx.currentTime, f = F0 * 4 * SCALE[n];
      [[1, .09], [2, .025]].forEach(function (mg) { var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f * mg[0]; var e = ctx.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(mg[1], t + .008); e.gain.exponentialRampToValueAtTime(.0001, t + 1.7); o.connect(e); e.connect(bus); o.start(t); o.stop(t + 1.8); });
    }
    // The music starts by itself and fades in, unless the visitor turned it off before. Browsers hold
    // audio back until the first interaction with a site, so if it is held, the first gesture releases it.
    var held = false;
    function begin() {
      if (started || pref === 'off') return; started = true; set(true);
      if (ctx && ctx.state !== 'running') { held = true; ctx.resume().then(function () { if (held && ctx.state === 'running') { held = false; fade(.9, .8, true); } }, function () {}); }
    }
    function release() {
      if (!held || !ctx || !on) return; held = false;
      ctx.resume().then(function () { fade(.9, .8, true); }, function () {});
    }
    begin();
    addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('.js-snd')) return;
      release(); ding();
    }, { capture: true });
    addEventListener('keydown', release, { capture: true });
    addEventListener('touchend', release, { capture: true, passive: true });
    // moving between pages: fade out before leaving; the next page fades in on arrival
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target || a.hasAttribute('download')) return;
      var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
      if (!on || !ctx || ctx.state !== 'running') return;
      e.preventDefault(); fade(0, .07);
      setTimeout(function () { location.href = u.href; }, 300);
    });
    addEventListener('pageshow', function (e) { if (e.persisted && on && ctx) { ctx.resume(); fade(.9, .8, true); } });
    // leaving and returning to the browser tab fades too
    var sleepT = null;
    document.addEventListener('visibilitychange', function () {
      if (!ctx) return; clearTimeout(sleepT);
      if (document.hidden) { fade(0, .12); sleepT = setTimeout(function () { ctx.suspend(); }, 600); }
      else if (on) { ctx.resume(); fade(.9, .8); }
    });
    return {
      isOn: function () { return on; },
      toggle: function () { started = true; held = false; set(!on); if (on) setTimeout(ding, 60); },
      ding: ding,
      onChange: function (f) { fns.push(f); },
      end: function (v) { if (!ctx || !on || v === wasEnd) return; wasEnd = v; humG.gain.setTargetAtTime(v ? .06 : 0, ctx.currentTime, v ? 1.4 : .8); }
    };
  })();

  /* ---------- Settings icons: every hover previews what a click will do ---------- */
  var icons = [];
  function hoverable(btn) {
    var st = { hover: false, supp: false };
    var inn = function () { st.hover = true; }, out = function () { st.hover = false; st.supp = false; };
    btn.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') inn(); }); btn.addEventListener('pointerleave', out);
    btn.addEventListener('focus', function () { if (btn.matches(':focus-visible')) inn(); }); btn.addEventListener('blur', out);
    return st;
  }
  // sound: a flat line when off, a slowly moving sine wave when on
  [].forEach.call(document.querySelectorAll('.js-snd'), function (btn) {
    var path = btn.querySelector('path'), st = hoverable(btn), amp = 0, ph = 0, was = false;
    function label() {
      var on = snd.isOn(), t = on ? 'Sound is on. Turn sound off' : 'Sound is off. Turn sound on';
      btn.setAttribute('aria-label', t); btn.setAttribute('title', t); btn.setAttribute('aria-pressed', String(on));
    }
    function draw() {
      var d = '';
      for (var i = 0; i <= 24; i++) { var u = i / 24, x = 2 + u * 16, y = 10 + amp * 4.6 * Math.sin(u * Math.PI * 2.5 - ph) * Math.sin(Math.PI * u); d += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2); }
      path.setAttribute('d', d);
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); snd.toggle(); st.supp = true; });
    snd.onChange(label); label(); draw();
    icons.push(function (dt) {
      var on = snd.isOn(), hv = st.hover && !st.supp;
      if (hv && !was && on && !reduce) { btn.classList.remove('flash'); void btn.offsetWidth; btn.classList.add('flash'); }
      was = hv;
      var target = on ? (hv ? 0 : .8) : (hv ? 1 : 0), speed = on ? 1.3 : 5;
      if (reduce) { if (amp !== target) { amp = target; ph = 0; draw(); } return; }
      if (amp === target && amp === 0) return;
      amp = Math.abs(target - amp) < .01 ? target : amp + (target - amp) * Math.min(1, dt * 7);
      ph += dt * speed; draw();
    });
  });
  // theme: a tiny sun with a face in light mode, a crescent moon with a face in dark mode
  [].forEach.call(document.querySelectorAll('.js-theme'), function (btn) {
    var st = hoverable(btn), bd = btn.querySelector('.bd'), e1 = btn.querySelector('.e1'), e2 = btn.querySelector('.e2'), sm = btn.querySelector('.sm'), rays = btn.querySelector('.rays');
    var r = '';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; r += '<path d="M' + (10 + Math.cos(a) * 6.5).toFixed(2) + ' ' + (10 + Math.sin(a) * 6.5).toFixed(2) + 'L' + (10 + Math.cos(a) * 8.8).toFixed(2) + ' ' + (10 + Math.sin(a) * 8.8).toFixed(2) + '"/>'; }
    rays.innerHTML = r; rays.style.transformOrigin = '10px 10px';
    var m = isDark() ? 1 : 0, drawn = -1;
    function label() {
      var t = isDark() ? 'Dark mode is on. Switch to light mode' : 'Light mode is on. Switch to dark mode';
      btn.setAttribute('aria-label', t); btn.setAttribute('title', t);
    }
    function draw() {
      if (m === drawn) return; drawn = m;
      var e = m * m * (3 - 2 * m), R = lerp(4.5, 6.6, e), rb = 5.6, ux = .751, uy = -.66, d = lerp(R + rb, 4.2, e), O = 10, f = function (v) { return v.toFixed(2); };
      if (e < .002) bd.setAttribute('d', 'M' + f(O - R) + ' ' + O + 'A' + f(R) + ' ' + f(R) + ' 0 1 1 ' + f(O + R) + ' ' + O + 'A' + f(R) + ' ' + f(R) + ' 0 1 1 ' + f(O - R) + ' ' + O + 'Z');
      else {
        // the sun's disc minus a sliding bite: one closed outline that becomes the crescent
        var a = (d * d + R * R - rb * rb) / (2 * d), h = Math.sqrt(Math.max(0, R * R - a * a)), px = -uy, py = ux;
        var x1 = O + a * ux + h * px, y1 = O + a * uy + h * py, x2 = O + a * ux - h * px, y2 = O + a * uy - h * py;
        bd.setAttribute('d', 'M' + f(x1) + ' ' + f(y1) + 'A' + f(R) + ' ' + f(R) + ' 0 ' + (a > 0 ? 1 : 0) + ' 1 ' + f(x2) + ' ' + f(y2) + 'A' + rb + ' ' + rb + ' 0 ' + (a - d > 0 ? 1 : 0) + ' 0 ' + f(x1) + ' ' + f(y1) + 'Z');
      }
      rays.style.opacity = clamp(1 - e * 1.7, 0, 1); rays.style.transform = 'scale(' + (1 - e * .45) + ') rotate(' + (e * 40) + 'deg)';
      e1.setAttribute('cx', f(lerp(8.5, 6.1, e))); e1.setAttribute('cy', f(lerp(9.4, 10.5, e)));
      e2.setAttribute('cx', f(lerp(11.5, 8.2, e))); e2.setAttribute('cy', f(lerp(9.4, 10.9, e))); e2.style.opacity = clamp(1 - e * 2, 0, 1);
      var sx = lerp(8.6, 6.3, e), sy = lerp(11.1, 12.9, e), w = lerp(2.8, 2.1, e), tilt = e * .55;
      sm.setAttribute('d', 'M' + f(sx) + ' ' + f(sy) + 'Q' + f(sx + w / 2 - tilt) + ' ' + f(sy + 1.5 + tilt) + ' ' + f(sx + w) + ' ' + f(sy + tilt * 1.4));
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); AO.setTheme(!isDark()); st.supp = true; });
    AO.onTheme(label); label(); draw();
    icons.push(function (dt) {
      var base = isDark() ? 1 : 0, target = st.hover && !st.supp ? 1 - base : base;
      if (m === target) return;
      if (reduce) m = target; else { var s = dt / .34; m = target > m ? Math.min(target, m + s) : Math.max(target, m - s); }
      draw();
    });
  });

  /* ---------- Watercolor: one fixed WebGL2 canvas behind everything ---------- */
  var VS = '#version 300 es\nin vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }';
  var NOISE = 'float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }\n' +
    'float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }\n';
  var FS = '#version 300 es\nprecision highp float;\nout vec4 o;\n' +
    'uniform vec2 uView, uSimOff, uSimSz; uniform float uK, uCam, uCamY, uDark, uN, uSimOn;\n' +
    'uniform vec3 uP, uA, uB, uC, uD, uE;\nuniform vec4 uBl[40];\nuniform sampler2D uSim;\n' + NOISE +
    'float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+17.; a*=.5; } return s; }\n' +
    'void main(){\n' +
    '  vec2 V = vec2(gl_FragCoord.x, uView.y*uK - gl_FragCoord.y) / uK;\n' +
    '  vec2 W = V + vec2(uCam, uCamY);\n' +
    // paper: soft fibres plus fine tooth
    '  float fib = fbm(W*vec2(.05,.012));\n' +
    '  float tooth = hash(floor(W*1.3));\n' +
    '  vec3 col = uP * (1. - mix(.035, -.02, uDark)*fib) + (tooth-.5)*mix(.018,.02,uDark);\n' +
    // shared wobble fields, so every bloom has a ragged, wet edge
    '  float n1 = fbm(W*.0055 + 3.), n2 = fbm(W*.0055 + 41.), gran = fbm(W*.09);\n' +
    '  vec3 lightMul = vec3(1.), darkAdd = vec3(0.);\n' +
    '  for (int i = 0; i < 40; i++) {\n' +
    '    if (float(i) >= uN) break;\n' +
    '    vec4 b = uBl[i];\n' +
    '    float h = hash(vec2(float(i)*1.7, 9.2)) * 6.283;\n' +
    '    float warp = (n1 - .5)*cos(h) + (n2 - .5)*sin(h);\n' +
    '    float dd = length(V - b.xy) / max(b.z, 1.) + warp*.9;\n' +
    '    if (dd > 1.15) continue;\n' +
    '    float body = smoothstep(1., .45, dd);\n' +
    '    float edge = smoothstep(.7, .96, dd) * (1. - smoothstep(.96, 1.02, dd));\n' +   // pigment pools at the drying edge
    '    float ci = floor(b.w), s = fract(b.w) / .9;\n' +
    '    float pig = clamp((body*.42 + edge*.55) * (.7 + .6*gran) * s, 0., 1.);\n' +
    '    vec3 pc = ci < .5 ? uA : ci < 1.5 ? uB : ci < 2.5 ? uC : ci < 3.5 ? uD : uE;\n' +
    '    lightMul *= mix(vec3(1.), pc, pig);\n' +                                         // pigments multiply, like glazing
    '    darkAdd += pc * pig * .42;\n' +
    '  }\n' +
    // the brush: water, suspended pigment and settled pigment from the simulation
    '  if (uSimOn > .5) {\n' +
    '    vec2 jit = (vec2(n1, n2) - .5) * 5. + (vec2(vnoise(W*.11), vnoise(W*.11 + 31.)) - .5) * 3.;\n' +
    '    vec4 sm = texture(uSim, (V + uSimOff + jit) / uSimSz);\n' +
    '    float sp = clamp((sm.b + sm.g*.85) * (.62 + .76*gran), 0., 1.) * .8;\n' +
    '    vec3 spc = mix(uA, uB, clamp(sm.a, 0., 1.));\n' +
    '    lightMul *= mix(vec3(1.), spc, sp) * (1. - .05*clamp(sm.r, 0., 1.));\n' +
    '    darkAdd += spc * sp * .5 + vec3(.012)*clamp(sm.r, 0., 1.);\n' +
    '  }\n' +
    '  col = mix(col * lightMul, col + darkAdd, uDark);\n' +
    '  o = vec4(col, 1.);\n}';
  /* Brush simulation on a low-resolution ping-pong texture:
     r water, g pigment suspended in the water, b pigment settled into the paper, a hue (0 lilac, 1 blue).
     Water creeps outward over the paper grain until it thins, carrying pigment with it; it evaporates,
     and the pigment it leaves behind pools where the wet edge stopped. */
  var FS_SIM = '#version 300 es\nprecision highp float;\nout vec4 o;\n' +
    'uniform sampler2D uT; uniform ivec2 uShift, uSz; uniform ivec4 uE0, uE1; uniform float uPx, uPhys, uDt; uniform vec2 uOrg;\n' +
    'uniform int uNW, uND; uniform vec4 uW[12], uWP[12], uPrev, uDs[24], uDP[24]; uniform float uPrevR;\n' + NOISE +
    'float grain(vec2 w){ return .6*vnoise(w*.045) + .4*vnoise(w*.13 + 7.); }\n' +
    'vec4 F(ivec2 q){ if(q.x<0||q.y<0||q.x>=uSz.x||q.y>=uSz.y) return vec4(0.); return texelFetch(uT,q,0); }\n' +
    'float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-4),0.,1.); return length(pa-ba*h); }\n' +
    'bool inR(ivec2 p, ivec4 r){ return p.x>=r.x && p.y>=r.y && p.x<r.z && p.y<r.w; }\n' +
    'void main(){\n' +
    '  ivec2 ip = ivec2(gl_FragCoord.xy), q = ip + uShift;\n' +
    '  vec2 wp = (vec2(ip) + .5)*uPx + uOrg;\n' +
    '  vec4 c = F(q);\n' +
    '  float w = c.r, g = c.g, b = c.b, hu = c.a, gr = grain(wp);\n' +
    '  if (uPhys > .5) {\n' +
    '    const float thr = .07;\n' +
    '    float oc = .13*(.35 + 1.3*gr)*max(w - thr, 0.);\n' +
    '    float gout = oc/max(w, 1e-3)*g;\n' +
    '    float inW = 0., inG = 0., inH = 0.;\n' +
    '    for (int i = 0; i < 4; i++) {\n' +
    '      ivec2 off = i==0 ? ivec2(1,0) : i==1 ? ivec2(-1,0) : i==2 ? ivec2(0,1) : ivec2(0,-1);\n' +
    '      vec4 n = F(q + off);\n' +
    '      float on = .13*(.35 + 1.3*grain(wp + vec2(off)*uPx))*max(n.r - thr, 0.);\n' +
    '      float gn = on/max(n.r, 1e-3)*n.g;\n' +
    '      inW += on; inG += gn; inH += gn*n.a;\n' +
    '    }\n' +
    '    float keep = max(g - 4.*gout, 0.), den = keep + b + inG;\n' +
    '    if (den > 1e-4) hu = (hu*(keep + b) + inH)/den;\n' +
    '    w = w + inW - 4.*oc; g = keep + inG;\n' +
    '    w = max(w - uDt*.3, 0.);\n' +
    '    float rate = w < .03 ? 1. : uDt*(.08 + .55*(1. - gr));\n' +                    // settles faster into the valleys of the grain
    '    float dep = g*clamp(rate, 0., 1.); g -= dep; b += dep;\n' +
    '  }\n' +
    // wet deposit: the union of this frame's brush segments, minus what last frame's segment already laid down
    '  float f = 0.; vec4 fp = vec4(0.);\n' +
    '  for (int i = 0; i < 12; i++) { if (i >= uNW) break; vec4 pr = uWP[i]; float fi = smoothstep(pr.x, pr.x*.45, sdSeg(wp, uW[i].xy, uW[i].zw)); if (fi > f) { f = fi; fp = pr; } }\n' +
    '  if (f > 0.) {\n' +
    '    if (uPrevR > 0.) f = max(0., f - smoothstep(uPrevR, uPrevR*.45, sdSeg(wp, uPrev.xy, uPrev.zw)));\n' +
    '    f *= .8 + .4*vnoise(wp*.14);\n' +                                              // bristle streaks
    '    float ag = f*fp.z, den = g + b + ag;\n' +
    '    if (den > 1e-4) hu = (hu*(g + b) + fp.w*ag)/den;\n' +
    '    w = min(w + f*fp.y, 1.4); g = min(g + ag, 1.6);\n' +
    '  }\n' +
    // dry replay: strokes painted earlier, laid back down as they scroll into view again
    '  if (uND > 0 && (inR(ip, uE0) || inR(ip, uE1))) {\n' +
    '    float m = 0.; vec4 mp = vec4(0.); float wob = (vnoise(wp*.021) - .5)*.4;\n' +
    '    for (int i = 0; i < 24; i++) { if (i >= uND) break; vec4 pr = uDP[i]; float dn = sdSeg(wp, uDs[i].xy, uDs[i].zw)/pr.x + wob;\n' +
    '      float fi = smoothstep(1., .5, dn)*.75 + smoothstep(.7, .94, dn)*(1. - smoothstep(.94, 1.03, dn))*.5; if (fi > m) { m = fi; mp = pr; } }\n' +
    '    if (m > 0.) { float ad = m*mp.y*(.7 + .6*gr), den = g + b + ad; if (den > 1e-4) hu = (hu*(g + b) + mp.z*ad)/den; b = min(b + ad, 1.3); }\n' +
    '  }\n' +
    '  o = vec4(w, g, min(b, 1.3), hu);\n}';

  var paint = [];     // world-space blooms dropped by clicks
  AO.bloom = function (x, y, r, c, s, d, delay) { paint.push({ x: x, y: y, r: r, c: c, s: s, t: performance.now() + (delay || 0), d: d || 2600 }); while (paint.length > 26) paint.shift(); };
  var strokes = [];   // world-space brush segments, kept so strokes stay fixed in the world
  var queue = [];     // segments waiting for the next simulation step
  var wc = null;
  (function () {
    var gl = null;
    try { gl = cv.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false }); } catch (e) {}
    if (!gl) return;
    function mk(t, s) { var x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(x)); return x; }
    function program(fs) {
      var p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
      var L = {}; p.u = function (n) { return n in L ? L[n] : (L[n] = gl.getUniformLocation(p, n)); }; return p;
    }
    var pMain = program(FS), pSim = program(FS_SIM);
    if (!pMain) return;
    var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var buf = new Float32Array(160);
    var phone = function () { return innerWidth <= 760; };

    /* brush simulation state */
    var floatOK = !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
    var sim = null, PX = 4, simCx = 0, simCy = 0, full = true, lastWet = -1e9, prevSeg = null, prevT = 0;
    function target(w, h, flt) {
      var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, flt ? gl.RGBA16F : gl.RGBA8, w, h, 0, gl.RGBA, flt ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      var fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok ? { t: t, fb: fb } : null;
    }
    function simBuild() {
      if (!pSim) return;
      if (sim) { [sim.a, sim.b].forEach(function (x) { gl.deleteTexture(x.t); gl.deleteFramebuffer(x.fb); }); sim = null; }
      PX = phone() ? 6 : 4;   // lower simulation resolution on phones
      var w = Math.max(2, Math.ceil((cv.clientWidth || innerWidth) / PX)), h = Math.max(2, Math.ceil((cv.clientHeight || innerHeight) / PX));
      var a = target(w, h, floatOK), b = a && target(w, h, floatOK);
      if (!b && floatOK) { floatOK = false; a = target(w, h, false); b = a && target(w, h, false); }
      if (!b) return;
      sim = { a: a, b: b, w: w, h: h }; full = true;
    }
    var W4 = new Float32Array(48), WP4 = new Float32Array(48), D4 = new Float32Array(96), DP4 = new Float32Array(96);
    function pass(o) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, sim.b.fb); gl.viewport(0, 0, sim.w, sim.h); gl.useProgram(pSim);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sim.a.t); gl.uniform1i(pSim.u('uT'), 0);
      gl.uniform2i(pSim.u('uShift'), o.dx || 0, o.dy || 0); gl.uniform2i(pSim.u('uSz'), sim.w, sim.h);
      gl.uniform1f(pSim.u('uPx'), PX); gl.uniform1f(pSim.u('uPhys'), o.phys ? 1 : 0); gl.uniform1f(pSim.u('uDt'), o.dt || 0);
      gl.uniform2f(pSim.u('uOrg'), simCx * PX, simCy * PX);
      var wet = o.wet || [], dry = o.dry || [];
      wet.forEach(function (s, i) { W4.set([s.x0, s.y0, s.x1, s.y1], i * 4); WP4.set([s.r, s.w, s.p, s.h], i * 4); });
      dry.forEach(function (s, i) { D4.set([s.x0, s.y0, s.x1, s.y1], i * 4); DP4.set([s.r * 1.25, s.p, s.h, 0], i * 4); });
      gl.uniform1i(pSim.u('uNW'), wet.length); gl.uniform1i(pSim.u('uND'), dry.length);
      gl.uniform4fv(pSim.u('uW'), W4); gl.uniform4fv(pSim.u('uWP'), WP4); gl.uniform4fv(pSim.u('uDs'), D4); gl.uniform4fv(pSim.u('uDP'), DP4);
      var pv = o.prev; gl.uniform4f(pSim.u('uPrev'), pv ? pv.x0 : 0, pv ? pv.y0 : 0, pv ? pv.x1 : 0, pv ? pv.y1 : 0); gl.uniform1f(pSim.u('uPrevR'), pv ? pv.r : 0);
      var e0 = o.e0 || [0, 0, 0, 0], e1 = o.e1 || [0, 0, 0, 0];
      gl.uniform4i(pSim.u('uE0'), e0[0], e0[1], e0[2], e0[3]); gl.uniform4i(pSim.u('uE1'), e1[0], e1[1], e1[2], e1[3]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      var t = sim.a; sim.a = sim.b; sim.b = t;
    }
    function hits(s, r) {   // does a stroke touch a rectangle given in simulation texels?
      if (!r || r[2] <= r[0] || r[3] <= r[1]) return false;
      var m = s.r * 1.8, x0 = (simCx + r[0]) * PX - m, y0 = (simCy + r[1]) * PX - m, x1 = (simCx + r[2]) * PX + m, y1 = (simCy + r[3]) * PX + m;
      return Math.max(s.x0, s.x1) >= x0 && Math.min(s.x0, s.x1) <= x1 && Math.max(s.y0, s.y1) >= y0 && Math.min(s.y0, s.y1) <= y1;
    }
    function simStep(now, dt) {
      if (!sim) return;
      var cam = AO.cam(), sx = Math.round(cam.x / PX), sy = Math.round(cam.y / PX), dx = sx - simCx, dy = sy - simCy;
      var fresh = queue.splice(0, 12); queue.length = 0;
      var active = now - lastWet < 8000;
      if (!dx && !dy && !fresh.length && !active && !full) return;
      simCx = sx; simCy = sy;
      var W = sim.w, H = sim.h, e0 = null, e1 = null;
      if (full || Math.abs(dx) >= W || Math.abs(dy) >= H) { e0 = [0, 0, W, H]; if (full) { dx = W; dy = H; } full = false; }
      else {
        if (dx) e0 = dx > 0 ? [W - dx, 0, W, H] : [0, 0, -dx, H];
        if (dy) { var xa = dx < 0 ? -dx : 0, xb = dx > 0 ? W - dx : W; e1 = dy > 0 ? [xa, H - dy, xb, H] : [xa, 0, xb, -dy]; }
      }
      var back = (e0 || e1) ? strokes.filter(function (s) { return hits(s, e0) || hits(s, e1); }) : [];
      var wet = reduce ? [] : fresh, prev = prevSeg && now - prevT < 120 ? prevSeg : null;
      pass({ dx: dx, dy: dy, phys: active && !reduce, dt: Math.min(.033, dt), wet: wet, prev: prev, dry: back.slice(0, 24), e0: e0, e1: e1 });
      for (var i = 24; i < back.length; i += 24) pass({ dry: back.slice(i, i + 24), e0: e0, e1: e1 });
      if (reduce && fresh.length) pass({ dry: fresh, e0: [0, 0, W, H] });   // reduced motion: strokes appear already dry
      if (fresh.length) {
        lastWet = now; prevSeg = fresh[fresh.length - 1]; prevT = now;
        fresh.forEach(function (s) { strokes.push(s); }); while (strokes.length > 600) strokes.shift();
      }
    }

    wc = {
      resize: function () {
        var k = Math.min(devicePixelRatio || 1, 2) * (phone() ? .42 : .55);
        cv.width = Math.max(2, Math.round((cv.clientWidth || innerWidth) * k)); cv.height = Math.max(2, Math.round((cv.clientHeight || innerHeight) * k));
        simBuild();
      },
      draw: function (now, dt) {
        var vw = AO.vw, vh = AO.vh, cam = AO.cam(), n = 0;
        simStep(now, dt);
        var add = function (x, y, r, s, ci) {
          if (n >= 40 || r < 1) return; if (x + r * 1.4 < 0 || x - r * 1.4 > vw || y + r * 1.4 < 0 || y - r * 1.4 > vh) return;
          var c = ci == null ? (s > 0 ? 0 : 1) : ci; buf.set([x, y, r, c + Math.min(.999, Math.abs(s)) * .9], n * 4); n++;
        };
        AO.sources.forEach(function (f) { f(add, now, cam); });
        paint.forEach(function (q) { var a = reduce ? 1 : clamp((now - q.t) / q.d, 0, 1), e = 1 - Math.pow(1 - a, 3); if (a > 0) add(q.x - cam.x, q.y - cam.y, q.r * (.35 + .65 * e), q.c * q.s); });
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height); gl.useProgram(pMain);
        var u = pMain.u, c = AO.col;
        gl.uniform2f(u('uView'), vw, vh); gl.uniform1f(u('uK'), cv.width / vw); gl.uniform1f(u('uCam'), cam.x); gl.uniform1f(u('uCamY'), cam.y); gl.uniform1f(u('uDark'), isDark() ? 1 : 0);
        gl.uniform3fv(u('uP'), hex(c.paper)); gl.uniform3fv(u('uA'), hex(c.pa)); gl.uniform3fv(u('uB'), hex(c.pb)); gl.uniform3fv(u('uC'), hex(c.pc)); gl.uniform3fv(u('uD'), hex(c.pd)); gl.uniform3fv(u('uE'), hex(c.soft));
        gl.uniform1f(u('uN'), n); gl.uniform4fv(u('uBl'), buf);
        gl.uniform1f(u('uSimOn'), sim ? 1 : 0);
        if (sim) {
          gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sim.a.t); gl.uniform1i(u('uSim'), 0);
          gl.uniform2f(u('uSimOff'), cam.x - simCx * PX, cam.y - simCy * PX); gl.uniform2f(u('uSimSz'), sim.w * PX, sim.h * PX);
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); wc = null; });
    wc.resize();
  })();
  if (!wc) cv.style.display = 'none';   // no WebGL2: flat paper

  /* ---------- The pointer is a wet brush: drag to paint, click to drop a bloom ---------- */
  var NO_TOUCH = 'a,button,input,textarea,select,iframe,label,.play,.panel,.hl,.menu,.nav,.tabs,.sys,.sky2,[data-nopaint]';
  var TEXT = 'p,h1,h2,h3,h4,li,dd,dt,span';
  var alt = 1, hue = 1, drag = null;
  function seg(x0, y0, x1, y1, speed) {
    var cam = AO.cam(), base = AO.vw <= 760 ? 11 : 15, r = base * clamp(1.25 - speed * .00045, .6, 1.25);
    queue.push({ x0: x0 + cam.x, y0: y0 + cam.y, x1: x1 + cam.x, y1: y1 + cam.y, r: r, w: .95, p: .5, h: hue });
    if (queue.length > 12) queue.splice(0, queue.length - 12);
  }
  function begin(x, y, target, canPaint) {
    if (body.classList.contains('open') || (target.closest && target.closest(NO_TOUCH))) return null;
    hue = 1 - hue;
    return { x: x, y: y, lx: x, ly: y, t: performance.now(), moved: 0, paint: canPaint };
  }
  function move(d, x, y) {
    var dist = Math.hypot(x - d.lx, y - d.ly); if (dist < 2) return;
    var now = performance.now(), speed = dist / Math.max(1, now - d.t) * 1000;
    d.moved += dist; if (d.paint && wc) seg(d.lx, d.ly, x, y, speed);
    d.lx = x; d.ly = y; d.t = now;
  }
  function end(d, x, y) {
    if (d.moved > 8) return;
    var cam = AO.cam(); alt = -alt;
    AO.bloom(x + cam.x, y + cam.y, 120 + Math.random() * 60, alt, .85, 2600);
  }
  addEventListener('pointermove', function (e) { AO.lastMove = performance.now(); if (drag && e.pointerType !== 'touch') move(drag, e.clientX, e.clientY); }, { passive: true });
  addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    drag = begin(e.clientX, e.clientY, e.target, !(e.target.closest && e.target.closest(TEXT)));
  });
  addEventListener('mousedown', function (e) { if (drag && drag.paint && e.button === 0) e.preventDefault(); });   // painting, not selecting
  addEventListener('pointerup', function (e) { if (drag && e.pointerType !== 'touch') { end(drag, e.clientX, e.clientY); drag = null; } });
  addEventListener('pointercancel', function () { drag = null; });
  // touch: the finger paints while it scrolls; a tap drops a bloom
  var td = null;
  addEventListener('touchstart', function (e) { var t = e.touches[0]; td = e.touches.length === 1 ? begin(t.clientX, t.clientY, e.target, true) : null; }, { passive: true });
  addEventListener('touchmove', function (e) { AO.lastMove = performance.now(); if (td) move(td, e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  addEventListener('touchend', function () { if (td) { end(td, td.lx, td.ly); td = null; } }, { passive: true });
  addEventListener('touchcancel', function () { td = null; }, { passive: true });

  /* ---------- Text arrival on vertical pages: the bloom grows first, then the text wipes in ---------- */
  var items = [];
  AO.reveal = function (els) {
    var out = [].map.call(els, function (el) {
      return { el: el, hz: el.classList.contains('haze') ? [el] : [].slice.call(el.querySelectorAll('.haze')), rv: [].slice.call(el.querySelectorAll('.rv')), tb: 0, tt: 0, hov: 0, on: 0,
        bloom: !el.hasAttribute('data-nobloom'), ci: el.hasAttribute('data-ci') ? +el.getAttribute('data-ci') : null };
    });
    out.forEach(function (o) { items.push(o); o.i = items.filter(function (x) { return x.bloom; }).length - 1; });
    return out;
  };
  function revealFrame(now, dt) {
    var vh = AO.vh;
    items.forEach(function (o) {
      if (!o.el.offsetParent) return; var r = o.el.getBoundingClientRect(); o.r = r;
      var b = clamp((vh * 1.05 - r.top) / (vh * .35), 0, 1), t = clamp((vh * .82 - r.top) / (vh * .3), 0, 1);
      o.tb = reduce ? (r.top < vh ? 1 : o.tb) : Math.max(o.tb, b); o.tt = reduce ? (r.top < vh ? 1 : o.tt) : Math.max(o.tt, t);
      if (o.tt > .02 && !o.on) { o.on = 1; o.hz.forEach(function (h) { h.classList.add('on'); }); }
      if (o.tt !== o.last) {
        o.last = o.tt; var n = o.rv.length, d = Math.min(.16, .6 / Math.max(1, n));
        o.rv.forEach(function (el, k) { el.style.setProperty('--t', clamp((o.tt - k * d) / (1 - (n - 1) * d), 0, 1).toFixed(3)); });
      }
      if (!reduce && now - AO.lastMove < 260 && r.top < vh && r.bottom > 0) o.hov = Math.min(2.2, o.hov + dt * .05);
    });
  }
  AO.addSource(function (add) {
    var vw = AO.vw, vh = AO.vh, sz = Math.min(vw, vh * 1.3), mob = vw <= 760;
    if (body.classList.contains('ov')) return;   // the compact overview stays calm
    items.forEach(function (o) {
      if (!o.bloom || o.tb <= 0 || !o.r || !o.el.offsetParent) return;
      var r = o.r, e = 1 - Math.pow(1 - o.tb, 3), i = o.i;
      if (r.bottom < -vh || r.top > vh * 2) return;
      var x = mob ? vw * .75 : (i % 2 ? vw * .27 : vw * .73), y = r.top + Math.min(r.height * .5, vh * .5);
      add(x, y, sz * (i % 3 === 0 ? .3 : .22) * e * (1 + .3 * o.hov), (i % 2 ? -1 : 1) * (.5 + .4 * e), o.ci);
    });
  });

  /* ---------- Footer: the watercolor tide rises, with two extra pigments only here ---------- */
  var footG = 0;
  AO.addSource(function (add, now) {
    var r = footer.getBoundingClientRect(), vw = AO.vw, vh = AO.vh; if (!r.height || r.top > vh) return;
    var g = clamp((vh - r.top) / (vh * .85), 0, 1); footG = reduce ? 1 : Math.max(footG, g); if (footG <= 0) return;
    var e = 1 - Math.pow(1 - footG, 3), t = reduce ? 0 : now / 1000, sz = Math.min(vw, vh * 1.3);
    for (var i = 0; i < 7; i++) {
      var ci = [0, 2, 1, 3, 0, 2, 1][i], x = vw * (i + .5) / 7 + Math.sin(t * .07 + i) * vw * .02, y = r.bottom - vh * (.08 + .12 * ((i * 37) % 5) / 5);
      add(x, y, sz * (.18 + .06 * ((i * 13) % 4)) * e * (1 + .05 * Math.sin(t * .2 + i * 1.7)), .5 + .45 * e, ci);
    }
  });

  /* ---------- One frame loop for everything (the browser pauses it while the tab is hidden) ---------- */
  // measure the canvas itself: it is exactly the viewport, even where innerWidth is not
  function measure() { AO.vw = cv.clientWidth || innerWidth; AO.vh = cv.clientHeight || innerHeight; }
  measure();
  addEventListener('resize', function () { measure(); wc && wc.resize(); });
  var last = 0;
  function frame(now) {
    var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    measure();
    AO.frames.forEach(function (f) { f(now, dt); });
    revealFrame(now, dt);
    icons.forEach(function (f) { f(dt); });
    snd.end(footer.getBoundingClientRect().top < AO.vh * .7);
    if (wc) wc.draw(now, dt);
    requestAnimationFrame(frame);
  }
  AO.reveal(document.querySelectorAll('.phead'));
  requestAnimationFrame(frame);   // page scripts load right after this one and register before the first frame
})();
