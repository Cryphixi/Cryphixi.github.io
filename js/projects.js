/* ============================================================
   Projects: Allena's logo grown into a system. The star sits at
   the centre, each category is a tilted orbit, each project is a
   planet. Scrolling turns the orbits; whichever planet reaches the
   front opens in the reading panel.
   ============================================================ */
(function () {
  'use strict';
  var AO = window.AO, reduce = AO.reduce;
  var IMG = 'public/projects/';
  // ci: which watercolor pigment blooms behind the active planet (0 lilac, 1 blue, 2 teal, 4 ink wash)
  var CATS = [
    { k: 'classes', name: 'UC Berkeley Upper Division Class Projects', short: 'Classes', col: 'var(--box-blue)', a: 430, b: 140, rot: -9, ci: 1 },
    { k: 'games', name: 'Game development', short: 'Games', col: 'var(--box-black)', a: 175, b: 330, rot: 20, ci: 4 },
    { k: 'ml', name: 'AI / ML', short: 'AI / ML', col: 'var(--box-lilac)', a: 330, b: 215, rot: -34, ci: 0 },
    { k: 'tools', name: 'Community tools', short: 'Tools', col: 'var(--box-teal)', a: 240, b: 92, rot: 31, ci: 2 }
  ];
  // The current site's words, unchanged except obvious typo fixes. A link with no url is shown as "Coming soon".
  var P = [
    { c: 0, t: 'CS184: Computer Graphics', d: 'Rasterizer, MeshEdit, PathTracer and Cloth Simulation, plus the "Snowfall" final project.', img: IMG + 'cs184.webp', l: [['View coursework (all four HW)', 'cs184.html'], ['View Snowfall final project', 'https://c-herbert.github.io/cs184-final-project-webpage/']] },
    { c: 0, t: 'CS180: Computer Vision', d: "Project webpages from Berkeley's computational photography and vision coursework.", img: IMG + 'cs180.webp', fit: 1, l: [['View project pages', 'cs180.html']] },
    { c: 0, t: 'CS160: User Interface Design', d: 'Interface design coursework, from research through built prototype.', img: IMG + 'cs160.webp', fit: 1, l: [['View project', 'cs160.html']] },
    { c: 1, t: 'Inheritance Lines', d: 'Narrative-driven game exploring the illusion of choice in a historical setting.', img: IMG + 'inheritance.webp', l: [['View project', ''], ['View design doc', 'https://drive.google.com/file/d/1NoOqXFaJ92TeLSkbu1OXNY7ylpODPRWU/view?usp=sharing']] },
    { c: 1, t: 'Menses Mortis', d: 'Want to know what it is like to fight against adaptive NPCs?', img: null, l: [['View project', ''], ['View game design doc', 'https://docs.google.com/document/d/1OoOVOumWwJHKuHzXbsAstZZdh1TOY2M6wKxtw_hIfpM/edit?usp=sharing']] },
    { c: 2, t: 'Canopy', d: "Taking game designer's brainstorms into an engineer-ready NPC behavior spec! Try it by clicking the link below.", img: IMG + 'canopy.webp', l: [['View project', 'https://canopy-beta-eight.vercel.app/']] },
    { c: 2, t: 'LevelForger', d: 'VAE-based procedural level generator. The contribution is the ML architecture.', img: IMG + 'levelforger.webp', l: [['Watch video demo', 'https://drive.google.com/file/d/1J-tvLDZik0Ndo22orOdVE75lj6V-oRY5/view?usp=drive_link'], ['View slideshow', 'https://drive.google.com/file/d/1oB_wB_Gk1ETjU6nDyGEFOg6IzMcThxC0/view?usp=sharing']] },
    { c: 3, t: 'BALL x PIT Evolution Tracker', fav: 1, d: "A fan-made evolution and passive tracker with a team-builder matchmaker. Built out of personal need, I REALLY love this game. Now used daily by the game's Reddit and Discord community!", img: IMG + 'ballxpit.webp', l: [['View tracker', 'https://cryphixi.github.io/ballxpit-tracker']] }
  ];
  var N = P.length, p2 = function (n) { return String(n).padStart(2, '0'); };
  var linkHTML = function (l) {
    if (!l[1]) return '<span>' + l[0] + ' · Coming soon</span>';
    return /^https?:/.test(l[1]) ? '<a href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + '</a>' : '<a href="' + l[1] + '">' + l[0] + '</a>';
  };
  var runway = document.getElementById('runway'), svg = document.getElementById('sys'), NS = 'http://www.w3.org/2000/svg';
  runway.style.height = (N * 62 + 100) + 'vh';

  /* ---------- build: orbits, the star from the logo, planets ---------- */
  var C = 500;    // planets read at t=0, the right-hand end of each orbit
  CATS.forEach(function (c, ci) { c.items = []; P.forEach(function (p, i) { if (p.c === ci) c.items.push(i); }); c.phi = 0; });
  P.forEach(function (p, i) { var c = CATS[p.c], j = c.items.indexOf(i); p.t0 = c.items.length > 1 ? -j * (2 * Math.PI / c.items.length) : 0; });
  var h = '<defs>' + P.map(function (p, i) { return '<clipPath id="cp' + i + '"><circle r="1"/></clipPath>'; }).join('') + '</defs>';
  // orbit geometry: back half (behind the star and every planet) and front half (in front of the star, still behind planets)
  var ePt = function (c, t) { var r = c.rot * Math.PI / 180, x0 = c.a * Math.cos(t), y0 = c.b * Math.sin(t); return [C + x0 * Math.cos(r) - y0 * Math.sin(r), C + x0 * Math.sin(r) + y0 * Math.cos(r)]; };
  var half = function (c, t0, t1) { var d = ''; for (var k = 0; k <= 60; k++) { var p = ePt(c, t0 + (t1 - t0) * k / 60); d += (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); } return d; };
  var colOf = function (c) { return c.k === 'games' ? 'var(--games-line)' : c.col; };
  h += '<g id="backs">' + CATS.map(function (c, ci) { return '<g class="og" data-o="' + ci + '"><path class="orbit back" d="' + half(c, Math.PI, 2 * Math.PI) + '" style="stroke:' + colOf(c) + '"/></g>'; }).join('') + '</g>';
  // a four-point star with a thin cross, after the logo's star
  h += '<path class="star" d="M500 380 C506 470 514 488 600 500 C514 512 506 530 500 620 C494 530 486 512 400 500 C486 488 494 470 500 380Z"/><path d="M500 340V660M330 500H690" style="stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;opacity:.5"/>';
  h += '<g id="fronts">' + CATS.map(function (c, ci) { return '<g class="og" data-o="' + ci + '"><path class="orbit" d="' + half(c, 0, Math.PI) + '" style="stroke:' + colOf(c) + '"/></g>'; }).join('') + '</g>';
  h += '<g id="hits">' + CATS.map(function (c, ci) { return '<path class="hit" data-o="' + ci + '" tabindex="0" role="button" aria-label="' + c.name + ' orbit, ' + c.items.length + ' projects" d="' + half(c, 0, 2 * Math.PI) + '"/>'; }).join('') + '</g>';
  h += '<g id="planets"></g><g id="labels"></g><circle class="reticle" id="ret" r="0"/>';
  svg.innerHTML = h;
  var gPl = svg.querySelector('#planets'), gLab = svg.querySelector('#labels'), ret = svg.querySelector('#ret'); ret.style.strokeDasharray = '2 6';
  var shown = -1;
  var planetEls = P.map(function (p, i) {
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'planet'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', p.t);
    g.innerHTML = '<circle class="halo" r="1" style="stroke:' + colOf(CATS[p.c]) + '"/><circle class="rim" r="1"/>' +
      (p.img ? '<image href="' + p.img + '" x="-1" y="-1" width="2" height="2" preserveAspectRatio="xMidYMid slice" clip-path="url(#cp' + i + ')"/>' : '<path d="M-.6 .1 L0 -.6 L.6 .1 M-.4 .45 H.4" style="fill:none;stroke:var(--soft);stroke-width:1;vector-effect:non-scaling-stroke"/>') + '<text x="0" y="0" text-anchor="middle"></text>';
    g.addEventListener('click', function () { go(i); }); g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); } });
    gPl.appendChild(g);
    return { g: g, rim: g.querySelector('.rim'), halo: g.querySelector('.halo'), im: g.querySelector('image'), pth: g.querySelector('path'), tx: g.querySelector('text'), cp: svg.querySelector('#cp' + i + ' circle') };
  });
  var ogs = CATS.map(function (c, ci) { return [].slice.call(svg.querySelectorAll('.og[data-o="' + ci + '"]')); });
  [].forEach.call(svg.querySelectorAll('.hit'), function (hp) {
    var ci = +hp.dataset.o, c = CATS[ci];
    // click an orbit: its first project, or the next one on it if you are already there
    var act = function () { var cur = c.items.indexOf(shown); go(cur < 0 ? c.items[0] : c.items[(cur + 1) % c.items.length]); };
    var hov = function (on) { return function () { ogs[ci].forEach(function (g) { g.classList.toggle('hov', on); }); }; };
    hp.addEventListener('click', act); hp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    hp.addEventListener('pointerenter', hov(true)); hp.addEventListener('pointerleave', hov(false)); hp.addEventListener('focus', hov(true)); hp.addEventListener('blur', hov(false));
  });
  var labEls = CATS.map(function (c) {
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'olab'); g.innerHTML = '<rect height="26" style="fill:' + c.col + '"/><text y="17.5" x="10">' + c.short + '</text>'; gLab.appendChild(g);
    return { g: g, rect: g.querySelector('rect'), text: g.querySelector('text'), w: 0 };
  });

  /* ---------- legend and list ---------- */
  var legend = document.getElementById('legend');
  CATS.forEach(function (c) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mono'; b.style.background = c.col; b.innerHTML = c.short + ' <b>' + p2(c.items.length) + '</b>';
    b.setAttribute('aria-label', c.name + ', ' + c.items.length + ' projects'); b.addEventListener('click', function () { go(c.items[0]); }); legend.appendChild(b); c.btn = b;
  });
  document.getElementById('list').innerHTML = CATS.map(function (c) {
    return '<div class="grp"><h2 class="mono"><span class="box" style="background:' + c.col + '">' + c.name + '</span></h2>' + c.items.map(function (i) {
      var p = P[i]; return '<div class="row"><h3>' + p.t + '</h3><p>' + p.d + (p.fav ? ' <span class="mono badge">Community favorite</span>' : '') + '</p><span class="mono lk p-links">' + p.l.map(linkHTML).join('') + '</span></div>';
    }).join('') + '</div>';
  }).join('');
  var vb = document.getElementById('viewbtn');
  vb.addEventListener('click', function () { var on = !document.body.classList.contains('listmode'); document.body.classList.toggle('listmode', on); vb.setAttribute('aria-pressed', String(on)); vb.textContent = on ? 'See as a system' : 'See as a list'; });

  /* ---------- reading panel ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var pw = $('pw'), pcat = $('pcat'), pidx = $('pidx'), pframe = $('pframe'), ptitle = $('ptitle'), pdesc = $('pdesc'), plinks = $('plinks'), prog = $('oprog');
  prog.innerHTML = '<button class="step" id="prevB" type="button" aria-label="Previous project"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 9L7 4L12 9"/></svg></button>' +
    P.map(function (p, i) { return '<button class="seg" type="button" title="' + p2(i + 1) + ' ' + p.t + '" aria-label="Go to ' + p.t + '"></button>'; }).join('') +
    '<button class="step" id="nextB" type="button" aria-label="Next project"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 5L7 10L12 5"/></svg></button>';
  var segs = [].slice.call(prog.querySelectorAll('.seg')), prevB = $('prevB'), nextB = $('nextB');
  segs.forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
  prevB.addEventListener('click', function () { go(Math.max(0, shown - 1)); });
  nextB.addEventListener('click', function () { go(Math.min(N - 1, shown + 1)); });
  var wipeT = 0, bloomT = 0;
  function fill(i) {
    var p = P[i], c = CATS[p.c];
    pcat.textContent = c.short; pcat.style.background = c.col; pidx.textContent = p2(i + 1) + ' / ' + p2(N);
    pframe.innerHTML = p.img ? '<img src="' + p.img + '" alt="' + p.t + '" class="' + (p.fit ? 'fit' : '') + '">' : '<div class="none"><svg viewBox="0 0 100 60" aria-hidden="true"><path d="M10 50 L50 10 L90 50 M25 56 H75"/></svg><span class="sr">No image yet</span></div>';
    ptitle.textContent = p.t; pdesc.innerHTML = p.d + (p.fav ? ' <span class="mono badge">Community favorite</span>' : '');
    plinks.innerHTML = p.l.map(linkHTML).join('');
    segs.forEach(function (e, k) { e.classList.toggle('on', k <= i); });
    prevB.disabled = i === 0; nextB.disabled = i === N - 1;
    wipeT = performance.now();
  }
  function show(i) {
    if (i === shown) return; var first = shown < 0; shown = i; bloomT = performance.now();
    if (first || reduce) { fill(i); return; }
    // each arrival plays the ding at the planet's position
    var r = planetEls[i].g.getBoundingClientRect(); AO.snd.ding((r.left + r.width / 2) / innerWidth);
    pw.classList.add('out'); setTimeout(function () { fill(shown); pw.classList.remove('out'); }, 260);
  }

  /* ---------- scroll turns the system ---------- */
  var runTop = function () { return runway.getBoundingClientRect().top + scrollY; };
  function go(i) {
    if (document.body.classList.contains('listmode')) return;
    scrollTo({ top: runTop() + (i / (N - 1)) * (runway.offsetHeight - innerHeight), behavior: reduce ? 'auto' : 'smooth' });
  }
  var s = 0, pos = [], lastDraw = 0;
  AO.onFrame(function (now) {
    if (document.body.classList.contains('listmode')) return;
    var span = runway.offsetHeight - innerHeight, pr = AO.clamp((scrollY - runTop()) / Math.max(1, span), 0, 1);
    var target = pr * (N - 1); s = reduce ? target : s + (target - s) * .12;
    var act = Math.round(s); show(act);
    if (pframe.firstChild && pframe.firstChild.style) pframe.firstChild.style.setProperty('--w', reduce ? 1 : AO.clamp((now - wipeT) / 500, 0, 1));
    CATS.forEach(function (c, ci) {
      // each orbit turns so that its project nearest the reading position sits at the front
      var its = c.items, tPhi = 0, last = its[its.length - 1];
      if (s <= its[0]) tPhi = -P[its[0]].t0 + (its[0] - s) * .35;
      else if (s >= last) tPhi = -P[last].t0 - (s - last) * .35;
      else for (var k = 0; k < its.length - 1; k++) if (s >= its[k] && s <= its[k + 1]) { var f = (s - its[k]) / (its[k + 1] - its[k]); tPhi = -(P[its[k]].t0 * (1 - f) + P[its[k + 1]].t0 * f); }
      c.phi = tPhi + (reduce ? 0 : Math.sin(now / 9000 + ci) * .04);   // very slow idle drift
      var on = P[act].c === ci; ogs[ci].forEach(function (g) { g.classList.toggle('on', on); }); c.btn.classList.toggle('on', on);
    });
    var R = function (a) { return a * Math.PI / 180; };
    pos = P.map(function (p) {
      var c = CATS[p.c], t = p.t0 + c.phi, x0 = c.a * Math.cos(t), y0 = c.b * Math.sin(t), r = R(c.rot);
      return { x: C + x0 * Math.cos(r) - y0 * Math.sin(r), y: C + x0 * Math.sin(r) + y0 * Math.cos(r), z: Math.sin(t) };
    });
    // draw back to front
    var order = P.map(function (_, i) { return i; }).sort(function (a, b) { return pos[a].z - pos[b].z; });
    if (order.join() !== lastDraw) { lastDraw = order.join(); order.forEach(function (i) { gPl.appendChild(planetEls[i].g); }); }
    P.forEach(function (p, i) {
      var e = planetEls[i], q = pos[i], isA = i === act, depth = .75 + .25 * (q.z + 1) / 2, rad = (isA ? 54 : 24) * depth;
      e.g.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ')'); e.g.classList.toggle('on', isA);
      e.rim.setAttribute('r', rad); e.halo.setAttribute('r', rad + 9);
      if (e.im) { e.im.setAttribute('x', -rad); e.im.setAttribute('y', -rad); e.im.setAttribute('width', rad * 2); e.im.setAttribute('height', rad * 2); e.cp.setAttribute('r', rad - 1); }
      else e.pth.setAttribute('transform', 'scale(' + rad + ')');
      e.g.style.opacity = (isA ? 1 : .35 + .45 * depth).toFixed(2);
      e.tx.textContent = isA ? '' : p2(i + 1); e.tx.setAttribute('y', -rad - 8);
    });
    var a = pos[act]; ret.setAttribute('cx', a.x); ret.setAttribute('cy', a.y); ret.setAttribute('r', (68 + (reduce ? 0 : Math.sin(now / 600) * 3)).toFixed(1));
    // category tags ride the far left of each orbit
    CATS.forEach(function (c, ci) {
      var l = labEls[ci], r = R(c.rot), x = C - c.a * Math.cos(r), y = C - c.a * Math.sin(r);
      if (!l.w) { l.w = l.text.getComputedTextLength() + 20; l.rect.setAttribute('width', l.w); }
      l.g.setAttribute('transform', 'translate(' + (x - l.w / 2).toFixed(1) + ' ' + (y - 13).toFixed(1) + ')'); l.g.style.opacity = P[act].c === ci ? 1 : .45;
    });
  });

  // a bloom in the category colour behind the active planet
  AO.addSource(function (add, now) {
    if (shown < 0 || document.body.classList.contains('listmode')) return;
    var st = runway.getBoundingClientRect(); if (st.bottom < 0 || st.top > innerHeight) return;
    var r = planetEls[shown].g.getBoundingClientRect(), k = reduce ? 1 : AO.clamp((now - bloomT) / 1400, 0, 1), e = 1 - Math.pow(1 - k, 3), sz = Math.min(innerWidth, innerHeight * 1.3);
    var x = r.left + r.width / 2, y = r.top + r.height / 2, ci = CATS[P[shown].c].ci;
    add(x, y, sz * .26 * (.35 + .65 * e), .55 + .35 * e, ci);
    add(x - sz * .2, y + sz * .14, sz * .13 * e, .5 * e, ci);
  });

  addEventListener('keydown', function (e) {
    if (document.body.classList.contains('listmode') || e.target.closest('input,textarea') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(N - 1, shown + 1)); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(0, shown - 1)); }
  });
})();
