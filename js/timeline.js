/* ============================================================
   Journey timeline — scrolling milestone list + sticky polaroid.
   Data-driven: add to ENTRIES (newest first) and the section grows.
   Academic-year separators render between groups (keep each group
   contiguous). The polaroid on the right follows the active entry.

   Entry fields:
     group    - academic-year separator label (keep same-group entries contiguous)
     date     - shown in the polaroid header only (not repeated per-entry in the list)
     title    - milestone title
     desc     - one-line description
     img      - optional path to a real photo/screenshot (public/timeline/...)
     noImage  - optional; true renders a deliberately blank photo slot (no placeholder text)
     note     - optional extra italic line shown under the description in the polaroid
     links    - optional array of {label, url} shown as "label ->" under the caption
   ============================================================ */
(function () {
  'use strict';

  var section = document.getElementById('tl-section');
  if (!section) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var T = 'public/timeline/';
  var O = 'public/organizations/';

  // Order matters — this is Allena's timeline, newest first.
  var ENTRIES = [
    // ---- Senior Year 2026 ----
    { group: 'Senior Year · 2026', date: '2026', title: 'Learn Basic Tech — Course Instructor', desc: 'Teaching a course on Retrieval-Augmented Generation.',
      links: [{ label: 'View course', url: 'https://www.learnbasictech.org/courses/retrieval-augmented-generation' }] },
    { group: 'Senior Year · 2026', date: '2026', title: 'CS180: Intro to Computer Vision & Computational Photography', desc: 'Computer vision and computational photography coursework.', img: T + 'cs180.png' },
    { group: 'Senior Year · 2026', date: '2026', title: 'CS160: User Interface Design and Development', desc: 'User interface design and development coursework.', img: T + 'cs160.png' },
    { group: 'Senior Year · 2026', date: '2026', title: 'Girls Make Games Fellowship — Counselor', desc: 'Counselor for the Girls Make Games fellowship.', img: T + 'gmg-counselor.png' },
    { group: 'Senior Year · 2026', date: '2026', title: 'Girls Make Games Mentorship', desc: 'Mentorship program. Projects: Canopy and Menses.', img: T + 'gmg-mentorship-logo.png' },

    // ---- Junior Year 2025 ----
    { group: 'Junior Year · 2025', date: '2025', title: 'GamesCrafters — Frontend Web Developer', desc: 'Frontend web developer. Led the GamesmanUni UI overhaul.', img: T + 'gc-frontend-dan.jpg',
      note: 'A picture with me and Dan Garcia!',
      links: [{ label: 'View live website', url: 'https://nyc.cs.berkeley.edu/uni/' }] },
    { group: 'Junior Year · 2025', date: '2025', title: 'CS184: Computer Graphics', desc: 'Rasterizer, MeshEdit, PathTracer, Cloth Simulation, and "Snowfall."', img: T + 'cs184.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'Game Developers Conference 2026', desc: 'Attended through the Girls Make Games scholarship.', img: T + 'gdc26.jpg',
      note: 'Had the privilege to meet the amazing Darren Korb!' },
    { group: 'Junior Year · 2025', date: '2025', title: 'AI4ALL Machine Learning Fellowship', desc: 'Machine learning fellowship. Project: LevelForger.', img: O + 'ai4all.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'America On Tech — Data Science Fellowship', desc: 'Year-long data science fellowship.', img: O + 'america-on-tech.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'Inheritance Lines', desc: 'Narrative-driven game exploring what gets passed down.', img: T + 'inheritance-lines-cover.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'Grace Hopper Celebration — Fall 2025', desc: 'Attended through the UC Berkeley EECS scholarship.', img: T + 'ghc25.jpg' },
    { group: 'Junior Year · 2025', date: '2025', title: 'GamesCrafters — Game Developer', desc: 'Game developer. Strongly solved Orbito and brought it online.', img: T + 'gc-orbito.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'Cal Marginalized Genders in Gaming — Website Designer', desc: 'Website designer for CMGG.', img: T + 'cmgg-webdev.png' },
    { group: 'Junior Year · 2025', date: '2025', title: 'GMG College Scholarship Recipient', desc: '2023 scholarship recipient supporting continued work in game development.',
      links: [{ label: 'View announcement', url: 'https://www.gmgsf.org/2023-college-scholarship-winners' }] },
    { group: 'Junior Year · 2025', date: '2025', title: 'CS61C: Computer Architecture', desc: 'Machine structures and computer architecture.', noImage: true },

    // ---- Sophomore Year 2024 ----
    { group: 'Sophomore Year · 2024', date: '2024', title: 'EOP SSS STEM Scholar', desc: 'Scholarship recipient.', img: T + 'sss-stem-scholar.jpg' },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'CS70: Discrete Mathematics', desc: 'Discrete mathematics and probability theory.', noImage: true },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'Game Developers Conference 2025', desc: 'Attended through the Girls Make Games scholarship.', img: T + 'gdc25.jpg' },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'Kaiser Permanente — Internship', desc: 'Summer internship at Kaiser Permanente.' },
    { group: 'Sophomore Year · 2024', date: '2024', title: 'Joined EOP SSS STEM Scholars', desc: 'Joined the EOP SSS STEM Scholars program.', img: T + 'sss-stem-scholar.jpg' },

    // ---- Freshman Year 2023 ----
    { group: 'Freshman Year · 2023', date: '2023', title: 'CS61B: Data Structures', desc: 'Data structures and algorithms.' },
    { group: 'Freshman Year · 2023', date: '2023', title: 'Codify — HotSpot UI/UX Lead', desc: 'UI/UX lead for HotSpot.' },
    { group: 'Freshman Year · 2023', date: '2023', title: 'CS61A: Structure and Interpretation of Computer Programs', desc: 'Introduction to computer science.' },

    // ---- Before UC Berkeley ----
    { group: 'High School Senior', date: '2022 — 2023', title: 'Accenture — Internship', desc: 'High school internship at Accenture.' },
    { group: 'High School Senior', date: '2022 — 2023', title: 'Girls Make Games Scholarship Recipient', desc: 'Awarded the Girls Make Games scholarship.', img: O + 'girls-make-games.png' },
    { group: 'High School Senior', date: '2022 — 2023', title: 'African American Initiative Scholarship Recipient', desc: 'Cal Alumni Association African American Initiative scholarship.', img: O + 'cal-alumni-african-american.png' },
    { group: 'High School Senior', date: '2022 — 2023', title: 'America On Tech', desc: 'Joined America On Tech.',
      links: [{ label: 'View Night View', url: 'https://cryphixi.github.io/NIght-View/' }] }
  ];

  var N = ENTRIES.length;
  function p2(n) { return String(n).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var track    = document.getElementById('tl-track');
  var well     = document.getElementById('tl-well');
  var indexEl  = document.getElementById('tl-index');
  var capDate  = document.getElementById('tl-capdate');
  var capEl    = document.getElementById('tl-caption');
  var capTitle = capEl ? capEl.querySelector('.c-title') : null;
  var capNote  = capEl ? capEl.querySelector('.c-note') : null;
  var capPhotoNote = capEl ? capEl.querySelector('.c-photo-note') : null;
  var capLinks = capEl ? capEl.querySelector('.c-links') : null;
  var railFill = document.querySelector('#tl-rail .fill');
  var hud      = document.getElementById('tl-hud');
  var cue      = document.getElementById('tl-cue');

  // ---------- build list (steps + year separators) ----------
  var stepEls = [], frameEls = [];
  var lastGroup = null;
  ENTRIES.forEach(function (e, i) {
    if (e.group && e.group !== lastGroup) {
      var sep = document.createElement('div');
      sep.className = 'tl-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.innerHTML = '<span class="tl-sep-line"></span><span class="tl-sep-label">' + esc(e.group) + '</span>';
      track.appendChild(sep);
      lastGroup = e.group;
    }
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'step';
    b.setAttribute('data-step', String(i));
    b.innerHTML =
      '<span class="dot"></span>' +
      '<div class="s-title">' + esc(e.title) + '</div>' +
      '<div class="s-desc">' + esc(e.desc) + '</div>';
    b.addEventListener('click', function () { jumpTo(b); });
    track.appendChild(b);
    stepEls.push(b);

    var f = document.createElement('div');
    f.className = 'frame';
    if (e.img) {
      f.innerHTML = '<img src="' + e.img + '" alt="' + esc(e.title) + '" loading="lazy">';
    } else if (e.noImage) {
      f.classList.add('frame-blank');
    } else {
      f.innerHTML = '<span>' + esc(e.title) + ' — image</span>';
    }
    well.insertBefore(f, well.firstChild); // keep crop marks on top
    frameEls.push(f);
  });

  if (reduce) {
    var noTrans = document.createElement('style');
    noTrans.textContent = '.step,.frame,.caption,.ledger-head .cap-date{transition:none!important}';
    document.head.appendChild(noTrans);
  }

  // ---------- click-to-jump: align the step's top with the same
  // reference line onScroll uses to pick the active step, so a click
  // lands on that exact milestone instead of the one after it. ----------
  function jumpTo(el) {
    var ref = window.innerHeight * 0.42;
    var rect = el.getBoundingClientRect();
    var targetY = window.scrollY + rect.top - ref + 1;
    window.scrollTo({ top: Math.max(0, Math.round(targetY)), behavior: reduce ? 'auto' : 'smooth' });
  }

  // ---------- active state ----------
  var active = -1;
  function setActive(i) {
    if (i === active) return;
    active = i;
    stepEls.forEach(function (el, k) { el.classList.toggle('active', k === i); });
    frameEls.forEach(function (el, k) {
      el.style.opacity = k === i ? '1' : '0';
      el.style.transform = 'scale(' + (k === i ? 1 : 0.988) + ')';
      el.style.zIndex = k === i ? 2 : 1;
    });
    var e = ENTRIES[i];
    if (capTitle) capTitle.textContent = e.title;
    if (capNote) capNote.textContent = e.desc;
    if (capDate) capDate.textContent = e.date;
    if (indexEl) indexEl.textContent = p2(i + 1) + ' / ' + p2(N);
    if (hud) hud.textContent = 'milestone ' + p2(i + 1) + ' / ' + p2(N);
    if (capPhotoNote) {
      if (e.note) { capPhotoNote.textContent = e.note; capPhotoNote.hidden = false; }
      else { capPhotoNote.textContent = ''; capPhotoNote.hidden = true; }
    }
    if (capLinks) {
      capLinks.innerHTML = '';
      if (e.links && e.links.length) {
        e.links.forEach(function (l) {
          var a = document.createElement('a');
          a.href = l.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = l.label + ' →';
          capLinks.appendChild(a);
        });
        capLinks.hidden = false;
      } else {
        capLinks.hidden = true;
      }
    }
  }

  function onScroll() {
    var ref = window.innerHeight * 0.42;
    var idx = 0;
    for (var i = 0; i < stepEls.length; i++) {
      if (stepEls[i].getBoundingClientRect().top <= ref) idx = i; else break;
    }
    setActive(idx);

    var r = section.getBoundingClientRect();
    var dist = r.height - window.innerHeight;
    var p = dist > 0 ? Math.max(0, Math.min(1, -r.top / dist)) : 0;
    if (railFill) railFill.style.height = (p * 100).toFixed(2) + '%';

    var inView = r.top < window.innerHeight && r.bottom > 0;
    if (hud) hud.style.opacity = inView ? '0.45' : '0';
    if (cue) cue.style.opacity = (r.top > window.innerHeight * 0.2) ? '0.65' : '0';
  }

  var ticking = false;
  function onScrollThrottled() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }

  window.addEventListener('scroll', onScrollThrottled, { passive: true });
  window.addEventListener('resize', onScrollThrottled);
  setActive(0);
  onScroll();
  window.addEventListener('load', onScroll);
})();
