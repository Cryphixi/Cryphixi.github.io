/* ============================================================
   Timeline: a vertical spine that draws as you scroll, a star per
   entry, entries alternating sides. Data-driven: add to ENTRIES
   (newest first) and the page grows. Year groups get a mono label
   (keep each group contiguous).

   Entry fields:
     group    - academic-year label (keep same-group entries contiguous)
     date     - shown in mono above the title
     title    - milestone title
     desc     - one-line description
     img      - optional path to a single photo/screenshot (public/timeline/...)
     images   - optional array of paths; more than one crossfades in a slow
                slideshow (~1 min per image, looping)
     video    - optional { id: '<YouTube video id>' }: shows the video's
                thumbnail with a play control; click swaps in the real embed
     noImage / fluidThumb - no picture for this milestone (text only)
     logo     - true renders `img` on a light plate, scaled to fit in full
     logoDark - like `logo`, but on a dark plate, for white line-art marks
     fit      - true scales `img` (or every slide) to fit in full instead of
                filling the frame edge to edge
     note     - optional extra line shown under the description
     links    - optional array of {label, url}
   ============================================================ */
(function () {
  'use strict';
  var AO = window.AO, reduce = AO.reduce;
  var tlist = document.getElementById('tlist');
  if (!tlist) return;

  var T = 'public/timeline/';
  var O = 'public/organizations/';
  var SLIDE_DWELL = 60000; // ~1 minute per image in a multi-photo slideshow

  // Order matters: this is Allena's timeline, newest first.
  var ENTRIES = [
    // ---- Senior Year 2026 ----
    { group: 'Senior Year · 2026', date: '2026', title: 'CS180: Intro to Computer Vision & Computational Photography', desc: 'Computer vision and computational photography coursework.', img: T + 'cs180.png', fit: true },
    { group: 'Senior Year · 2026', date: '2026', title: 'CS160: User Interface Design and Development', desc: 'User interface design and development coursework.', img: T + 'cs160.png', fit: true },
    { group: 'Senior Year · 2026', date: '2026', title: 'Girls Make Games Fellowship: Counselor', desc: 'Counselor for the Girls Make Games fellowship Summer 2026.', img: T + 'gmg-counselor.png', fit: true },
    { group: 'Senior Year · 2026', date: '2026', title: 'Girls Make Games Mentorship', desc: 'Mentorship program provided through GMG Scholarship. Projects: Canopy and Menses.', img: T + 'gmg-mentorship-logo.png', logo: true },

    // ---- Junior Year 2025 ----
    { group: 'Junior Year · 2025', date: '2025', title: 'GamesCrafters: Frontend Web Developer', desc: 'Frontend web developer. Led the GamesmanUni UI overhaul.', img: T + 'gc-frontend-dan.jpg',
      note: 'A picture with me and Dan Garcia!',
      links: [{ label: 'View live website', url: 'https://nyc.cs.berkeley.edu/uni/' }] },
    { group: 'Junior Year · 2025', date: '2025', title: 'CS184: Computer Graphics', desc: 'Rasterizer, MeshEdit, PathTracer, Cloth Simulation, and "Snowfall."', img: T + 'cs184.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'Game Developers Conference 2026', desc: 'Attended through the Girls Make Games scholarship.', img: T + 'gdc26.jpg',
      note: 'Had the privilege to meet the amazing Darren Korb!' },
    { group: 'Junior Year · 2025', date: '2025', title: 'AI4ALL Machine Learning Fellowship', desc: 'Machine learning fellowship. Project: LevelForger.', img: O + 'ai4all.png', logo: true },
    { group: 'Junior Year · 2025', date: '2025', title: 'America On Tech: Data Science Fellowship', desc: 'Year-long data science fellowship.', img: O + 'america-on-tech.png', logo: true },
    { group: 'Junior Year · 2025', date: '2025', title: 'Inheritance Lines', desc: 'Narrative-driven game exploring what gets passed down versus what is taken.', img: T + 'inheritance-lines-cover.png', fit: true },
    { group: 'Junior Year · 2025', date: '2025', title: 'Grace Hopper Celebration: Fall 2025', desc: 'Attended through the UC Berkeley EECS scholarship.', img: T + 'ghc25.jpg' },
    { group: 'Junior Year · 2025', date: '2025', title: 'GamesCrafters: Game Developer', desc: 'Game developer. Strongly solved Orbito and brought it online.', img: T + 'gc-orbito.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'Cal Marginalized Genders in Gaming: Website Designer', desc: 'Website designer for CMGG.', img: T + 'cmgg-webdev.png', fit: true },
    { group: 'Junior Year · 2025', date: '2025', title: 'CalSTEM Work', desc: 'Joined a team advocating for accessible STEM education.', img: T + 'calstem-pulse.png', fit: true,
      note: 'Also taught a Learn Basic Tech course on Retrieval-Augmented Generation.',
      links: [{ label: 'View course', url: 'https://www.learnbasictech.org/courses/retrieval-augmented-generation' }] },
    { group: 'Junior Year · 2025', date: '2025', title: 'CS61C: Computer Architecture', desc: 'Machine structures and computer architecture.', fluidThumb: true },

    // ---- Sophomore Year 2024 ----
    { group: 'Sophomore Year · 2024', date: '2024', title: 'EOP SSS STEM Scholar', desc: 'Scholarship recipient.', img: T + 'sss-stem-scholar.jpg' },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'CS70: Discrete Mathematics', desc: 'Discrete mathematics and probability theory.', fluidThumb: true },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'Game Developers Conference 2025', desc: 'Attended through the Girls Make Games scholarship.', img: T + 'gdc25.jpg' },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'Kaiser Permanente: Internship', desc: 'Summer internship at Kaiser Permanente.', img: T + 'kaiser-permanente-logo.png', logo: true },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'Joined EOP SSS STEM Scholars', desc: 'Joined the EOP SSS STEM Scholars program.', img: T + 'sss-stem-scholar.jpg' },

    // ---- Freshman Year 2023 ----
    { group: 'Freshman Year · 2023', date: '2023', title: 'CS61B: Data Structures', desc: 'Data structures and algorithms.', fluidThumb: true },
    { group: 'Freshman Year · 2023', date: '2023', title: 'Codify: HotSpot UI/UX Lead', desc: 'UI/UX lead for HotSpot.', img: T + 'codify-berkeley-logo.png', logoDark: true },
    { group: 'Freshman Year · 2023', date: '2023', title: 'CS61A: Structure and Interpretation of Computer Programs', desc: 'Introduction to computer science.', fluidThumb: true },

    // ---- Before UC Berkeley ----
    { group: 'High School Senior', date: '2022 to 2023', title: 'Accenture: Internship', desc: 'High school internship at Accenture.', img: T + 'accenture-logo.png', logo: true },
    { group: 'High School Senior', date: '2022 to 2023', title: 'Girls Make Games Scholarship Recipient', desc: '2023 scholarship recipient supporting continued work in game development.',
      images: [T + 'gmg-scholar/shot1.png', T + 'gmg-scholar/shot2.png', T + 'gmg-scholar/shot3.png'],
      links: [{ label: 'View announcement', url: 'https://www.gmgsf.org/2023-college-scholarship-winners' }] },
    { group: 'High School Senior', date: '2022 to 2023', title: 'African American Initiative Scholarship Recipient', desc: 'Cal Alumni Association African American Initiative scholarship.', img: O + 'cal-alumni-african-american.png', logo: true },
    { group: 'High School Senior', date: '2022 to 2023', title: 'America On Tech', desc: 'Joined America On Tech.',
      images: [T + 'aot-joined/photo.jpeg', T + 'aot-joined/nightview-screenshot.png'], fit: true,
      links: [{ label: 'View Night View', url: 'https://cryphixi.github.io/NIght-View/' }] },
    { group: 'High School Senior', date: '2022 to 2023', title: 'Founded Alexander Hamilton Senior High E-Sports Team', desc: "Founded and led the school's first Esports team.",
      video: { id: 'dAiiObRnN5M' } }
  ];

  function p2(n) { return String(n).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- pictures, each in a 1px frame ---------- */
  function picture(e) {
    var img = function (src, cls) { return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + src + '" alt="' + esc(e.title) + '" loading="lazy">'; };
    if (e.video) return '<div class="frame rv video" data-video="' + e.video.id + '"><img src="https://img.youtube.com/vi/' + e.video.id + '/hqdefault.jpg" alt="' + esc(e.title) + ', video thumbnail" loading="lazy"><button class="vplay" type="button" aria-label="Play video"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 3.5L14 9L6 14.5Z"/></svg></button></div>';
    if (e.images && e.images.length > 1) return '<div class="frame rv slides' + (e.fit ? ' fit' : '') + '">' + e.images.map(function (s, k) { return img(s, 'slide' + (k ? '' : ' show')); }).join('') + '</div>';
    var one = e.images && e.images.length === 1 ? e.images[0] : e.img;
    if (one) return '<div class="frame rv' + (e.logo ? ' logo' : e.logoDark ? ' logo-dark' : e.fit ? ' fit' : '') + '">' + img(one) + '</div>';
    return '';   // fluidThumb / noImage: this milestone has no picture
  }

  /* ---------- build the list: year labels, then entries alternating sides ---------- */
  var html = '', lastGroup = null;
  ENTRIES.forEach(function (e, i) {
    if (e.group && e.group !== lastGroup) { html += '<li class="tlg mono">' + esc(e.group) + '</li>'; lastGroup = e.group; }
    html += '<li class="tli ' + (i % 2 ? 'r' : 'l') + '" id="t' + (i + 1) + '"><div class="tx haze"><span class="mono when rv">' + esc(e.date) + '</span><h3 class="rv">' + esc(e.title) + '</h3><p class="rv">' + esc(e.desc) + '</p>' +
      (e.note ? '<p class="note rv">' + esc(e.note) + '</p>' : '') +
      (e.links && e.links.length ? '<div class="lk mono rv">' + e.links.map(function (l) { return '<a href="' + l.url + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>'; }).join('') + '</div>' : '') +
      '</div>' + picture(e) + '</li>';
  });
  tlist.innerHTML = html;
  var els = [].slice.call(tlist.querySelectorAll('.tli'));
  var items = AO.reveal(els);
  AO.reveal(document.querySelectorAll('.tlend'));

  // video: the thumbnail swaps to a live embed on click
  tlist.addEventListener('click', function (ev) {
    var b = ev.target.closest('.vplay'); if (!b) return; var f = b.parentNode, id = f.getAttribute('data-video');
    var iframe = document.createElement('iframe'); iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1'; iframe.title = f.querySelector('img').alt.replace(', video thumbnail', '');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'; iframe.allowFullscreen = true;
    f.innerHTML = ''; f.appendChild(iframe);
  });
  // multi-image slideshow: a slow crossfade on a loop
  if (!reduce) [].forEach.call(tlist.querySelectorAll('.slides'), function (f) {
    var s = [].slice.call(f.querySelectorAll('.slide')), cur = 0;
    setInterval(function () { s[cur].classList.remove('show'); cur = (cur + 1) % s.length; s[cur].classList.add('show'); }, SLIDE_DWELL);
  });

  /* ---------- stepper: a pinned dot rail, click to jump ---------- */
  var stepper = document.getElementById('stepper');
  stepper.innerHTML = ENTRIES.map(function (e, i) { return '<button type="button" aria-label="Go to ' + esc(e.title) + '"><i></i><span>' + p2(i + 1) + '</span></button>'; }).join('');
  var steps = [].slice.call(stepper.children);
  steps.forEach(function (b, i) { b.addEventListener('click', function () { var r = els[i].getBoundingClientRect(); scrollTo({ top: scrollY + r.top - innerHeight * .35, behavior: reduce ? 'auto' : 'smooth' }); }); });

  /* ---------- overview mode: a compact dated list ---------- */
  var ovb = document.getElementById('ovb'), spineKey = '';
  ovb.addEventListener('click', function () { var on = !document.body.classList.contains('ov'); document.body.classList.toggle('ov', on); ovb.setAttribute('aria-pressed', String(on)); spineKey = ''; });

  /* ---------- spine: a hairline that draws as you scroll, a star per entry ---------- */
  var spine = document.getElementById('spine'), spAll = spine.querySelector('.sp-all'), spOn = spine.querySelector('.sp-on'), spDots = spine.querySelector('.sp-dots');
  var spLen = 0, spShown = 0, dots = [];
  function spineBuild() {
    var br = spine.getBoundingClientRect(); if (!br.width) return;
    var key = Math.round(br.width) + 'x' + Math.round(br.height); if (key === spineKey) return; spineKey = key;
    var mob = innerWidth <= 760, cx = mob ? 14 : br.width / 2;
    var pts = els.map(function (el, i) { var r = el.getBoundingClientRect(); return [cx + (mob ? 0 : (i % 2 ? 14 : -14)), r.top - br.top + 22]; });
    var d = 'M' + cx + ' 0'; pts.forEach(function (p) { d += ' L' + p[0] + ' ' + p[1]; }); d += ' L' + cx + ' ' + br.height;
    spAll.setAttribute('d', d); spOn.setAttribute('d', d);
    var frac = spLen ? spShown / spLen : 0; spLen = spOn.getTotalLength(); spShown = frac * spLen;
    spOn.style.strokeDasharray = spLen; spOn.style.strokeDashoffset = spLen - spShown;
    spDots.innerHTML = pts.map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 === 0 ? 4 : 2.8) + '" style="opacity:' + (items[i].tt > 0 ? 1 : 0) + '"/>'; }).join('');
    dots = [].slice.call(spDots.children);
  }
  AO.onFrame(function () {
    if (document.body.classList.contains('ov')) return;
    spineBuild();
    var vh = innerHeight, br = spine.getBoundingClientRect(), head = vh * .78 - br.top;
    if (spLen) { var frac = AO.clamp(head / Math.max(1, br.height), 0, 1); spShown = reduce ? spLen : Math.max(spShown, frac * spLen); spOn.style.strokeDashoffset = spLen - spShown; }
    var cur = 0;
    items.forEach(function (o, i) { if (o.r && o.r.top < vh * .5) cur = i; if (dots[i] && o.tt > 0) dots[i].style.opacity = 1; });
    steps.forEach(function (b, i) { b.classList.toggle('on', i === cur); });
  });
})();
