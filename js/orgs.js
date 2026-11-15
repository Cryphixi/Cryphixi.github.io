/* ============================================================
   Organizations: a constellation of supporters. Each organization
   is a star placed by the year I joined (earliest lower left,
   newest upper right). Selecting a star opens a reading card.
   The idle showcase steps through the stars until the visitor
   interacts, and resumes 14s after they stop.
   Edit the ORGS array to change roles and links.
   ============================================================ */
(function () {
  'use strict';
  var AO = window.AO, reduce = AO.reduce;
  var sky = document.getElementById('osky');
  if (!sky) return;
  var mobileMq = window.matchMedia('(max-width: 860px)');

  var B = 'public/organizations/';
  var ORGS = [
    { name: 'GamesCrafters', short: 'GamesCrafters', logo: B + 'GamesCrafters-Logo.png',
      site: 'https://gamescrafters.berkeley.edu/', role: 'Website Team Lead', joined: '2025 to Present',
      how: 'Joined the research group at Berkeley and moved onto the website team, then took the lead of the UI maintenance.',
      what: "Led a full UI overhaul of the group's interactable games research website, GamesmanUni." },
    { name: 'Girls Make Games', short: 'Girls Make Games', logo: B + 'girls-make-games.png',
      site: 'https://girlsmakegames.com/', role: 'Scholarship Recipient · 2K Mentee · Camp Counselor 2026', joined: '2023 to Present',
      how: 'Applied to the GMG College Scholarship and was selected in 2023.',
      what: "2023 scholarship recipient; now in the GMG x 2K Mentorship Program, paired with mentors from 2K's Engineering Grad Program. Joined as a summer camp counselor 2026 to teach a teen cohort." },
    { name: 'America On Tech', short: 'America On Tech', logo: B + 'america-on-tech.png',
      site: 'https://www.americaontech.org/', role: 'Tech Flex Leaders Alumni, Data Science Fellow Alumni', joined: '2022', how: 'Learned Website Development in High School Senior year.', what: 'Continued to be a part of the community as panelist, and joined the Data Science Fellowship.' },
    { name: 'AI 4 ALL', short: 'AI 4 ALL', logo: B + 'ai4all.png',
      site: 'https://ai-4-all.org/', role: 'Fellow', joined: 'Fall 2025 Cohort', how: 'Applied to a rigorous program that teaches ML, AI, and human ethics to bridge them together.', what: 'For my capstone project I created a ML model LevelForger. The input, games from the 80s to output customizable levels with similar style to the games.' },
    { name: 'Cal Marginalized Genders in Gaming', short: 'CMGG', logo: B + 'cal-marginalized-genders-gaming.png',
      site: 'https://tr.ee/GpnBPVxVMv', role: 'Webmaster', joined: '2023', how: 'A fun community that creates a safe space for marginalized genders to have fun gaming! Anyone can join and make friends there.', what: 'Applied to be a part of the board to help design and develop the website.' },
    { name: 'ColorStack', short: 'ColorStack', logo: B + 'color-stack.png',
      site: 'https://www.colorstack.org/', role: 'Member', joined: '2024', how: 'A national slack community to advance students in the technology and STEM space.', what: 'Attended online career fairs and expanded my network here!' },
    { name: 'Cal Alumni Association African American Initiative', short: 'the CAA', logo: B + 'cal-alumni-african-american.png',
      site: 'https://alumni.berkeley.edu/', role: 'Scholarship Recipient', joined: '2023', how: 'A scholarship for new UC Berkeley admits that supports students through to graduation.', what: 'Received $8,000 annually.' },
    { name: 'Hispanic Scholarship Fund', short: 'HSF', logo: B + 'hispanic-scholar-fund.png',
      site: 'https://www.hsf.net/', role: 'Scholarship Recipient', joined: '2025', how: 'National program that supports Hispanic and Latine students.', what: 'Attend local networking events.' },
    { name: 'UC Berkeley SSS STEM Scholar & Grant Recipient', short: 'SSS STEM', logo: B + 'uc-berkeley-sss-stem.png',
      site: 'https://eop.berkeley.edu/services-programs/eop-stem', role: 'SSS STEM Scholar, Grant Recipient', joined: '2024', how: 'Throughout their time at UC Berkeley, TRIO SSS-STEM Scholars receive academic advising, which includes guidance on establishing individualized success plans, assistance with course selection, and support with study skills and strategies. TRIO SSS-STEM Scholars also benefit from regular one-on-one check-ins with their assigned TRIO SSS-STEM Counselor, as well as mentoring and tutoring. Additionally, TRIO SSS-STEM Scholars have access to dedicated study and community spaces.', what: 'This program really help make a community I can rely on in Berkeley. I joined as a sophomore and each year the counselor supported me with any problem I ask them.' }
  ];

  var N = ORGS.length, CYCLE = 3200, LEAD = 900, RESUME = 14000;
  function p2(n) { return String(n).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var year = function (o) { var m = /\d{4}/.exec(o.joined || ''); return m ? +m[0] : 9999; };

  /* ---------- place the stars by year joined: earliest lower left, newest upper right ---------- */
  var order = ORGS.map(function (_, i) { return i; }).sort(function (a, b) { return year(ORGS[a]) - year(ORGS[b]) || a - b; });
  var pos = [];
  order.forEach(function (oi, k) { pos[oi] = { x: 9 + k * (82 / (N - 1)), y: 84 - k * (66 / (N - 1)) + (k % 2 ? -9 : 9) * (k === 0 || k === N - 1 ? .3 : 1), k: k }; });
  var svg = sky.querySelector('svg');
  var line = 'M' + order.map(function (oi) { return pos[oi].x.toFixed(1) + ' ' + pos[oi].y.toFixed(1); }).join(' L');
  var years = '', seen = {};
  order.forEach(function (oi) { var y = year(ORGS[oi]); if (seen[y]) return; seen[y] = 1; years += '<path class="ax" d="M' + pos[oi].x.toFixed(1) + ' ' + (pos[oi].y + 4).toFixed(1) + 'V97"/><text x="' + pos[oi].x.toFixed(1) + '" y="100" text-anchor="middle" style="font-size:2.6px;letter-spacing:.3px">' + y + '</text>'; });
  svg.innerHTML = '<path class="ax" d="M2 97H98"/>' + years + '<path class="th" d="' + line + '" pathLength="1"/>';
  var stars = ORGS.map(function (o, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ostar' + (pos[i].k % 2 ? ' up' : '');
    b.style.left = pos[i].x + '%'; b.style.top = pos[i].y + '%'; b.setAttribute('aria-label', o.name + ', joined ' + o.joined);
    b.innerHTML = '<i></i><span>' + esc(o.short) + '</span>';
    b.addEventListener('click', function () { select(i); });
    sky.appendChild(b); return b;
  });

  /* ---------- reading card ---------- */
  var card = document.getElementById('ocard');
  function cardHTML(o, i) {
    var row = function (l, v) { return v ? '<dt class="mono">' + l + '</dt><dd>' + esc(v) + '</dd>' : ''; };
    return '<div class="top mono"><span>' + p2(pos[i].k + 1) + ' / ' + p2(N) + '</span><span class="rule"></span></div>' +
      '<div class="plate"><img src="' + o.logo + '" alt="' + esc(o.name) + ' logo"></div><h3>' + esc(o.name) + '</h3>' +
      '<dl>' + row('Role', o.role) + row('Joined', o.joined) + row('How I joined', o.how) + row('What I do', o.what) + '</dl>' +
      (o.site ? '<a class="mono visit" href="' + o.site + '" target="_blank" rel="noopener">Visit ' + esc(o.short) + '</a>' : '');
  }
  var active = -1, swapT = null;
  function apply(i, quick) {
    if (i === active) return; active = i;
    stars.forEach(function (s, k) { s.classList.toggle('on', k === i); s.setAttribute('aria-pressed', String(k === i)); });
    clearTimeout(swapT);
    if (quick || reduce) { card.innerHTML = cardHTML(ORGS[i], i); card.classList.remove('out'); return; }
    card.classList.add('out'); swapT = setTimeout(function () { card.innerHTML = cardHTML(ORGS[active], active); card.classList.remove('out'); }, 240);
  }

  /* ---------- idle showcase: walk the stars in order until the visitor interacts ---------- */
  var cycleTimer = null, leadTimer = null, resumeTimer = null;
  function advance() { apply(order[(pos[active].k + 1) % N]); }
  function stopCycle() { clearInterval(cycleTimer); clearTimeout(leadTimer); cycleTimer = leadTimer = null; }
  function startCycle() { stopCycle(); if (reduce || mobileMq.matches) return; leadTimer = setTimeout(advance, LEAD); cycleTimer = setInterval(advance, CYCLE); }
  function select(i) {
    stopCycle(); clearTimeout(resumeTimer); apply(i);
    if (!reduce && !mobileMq.matches) resumeTimer = setTimeout(startCycle, RESUME);
  }
  mobileMq.addEventListener('change', function () { if (mobileMq.matches) stopCycle(); else startCycle(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopCycle(); else if (!resumeTimer) startCycle(); });

  /* ---------- list view ---------- */
  document.getElementById('orglist').innerHTML = order.map(function (i) {
    var o = ORGS[i];
    return '<div class="row"><div class="plate"><img src="' + o.logo + '" alt="' + esc(o.name) + ' logo" loading="lazy"></div>' +
      '<div><h3>' + esc(o.name) + '</h3><p>' + esc(o.role) + '</p><p class="mono">' + esc(o.joined) + '</p></div>' +
      '<div><p><b>How I joined.</b> ' + esc(o.how) + '</p><p><b>What I do.</b> ' + esc(o.what) + '</p>' + (o.site ? '<a class="mono ul" href="' + o.site + '" target="_blank" rel="noopener">Visit ' + esc(o.short) + '</a>' : '') + '</div></div>';
  }).join('');
  var vb = document.getElementById('orgview');
  vb.addEventListener('click', function () {
    var on = !document.body.classList.contains('orglist-on'); document.body.classList.toggle('orglist-on', on);
    vb.setAttribute('aria-pressed', String(on)); vb.textContent = on ? 'See as a constellation' : 'See as a list';
    if (on) stopCycle(); else startCycle();
  });

  /* ---------- socials: the address with its copy button ---------- */
  var mail = document.getElementById('socMail');
  if (mail) { mail.innerHTML = AO.mailHTML(); AO.wireCopy(mail); }

  // the thread between the stars draws itself as the constellation scrolls in
  var th = svg.querySelector('.th'), drawn = 0;
  th.style.strokeDasharray = 1; th.style.strokeDashoffset = reduce ? 0 : 1;
  AO.onFrame(function () {
    if (reduce || drawn >= 1) return;
    var r = sky.getBoundingClientRect(), t = AO.clamp((innerHeight * .85 - r.top) / (innerHeight * .5), 0, 1);
    if (t > drawn) { drawn = t; th.style.strokeDashoffset = 1 - drawn; }
  });

  AO.reveal(document.querySelectorAll('#socials, #orgs'));
  apply(order[0], true);
  startCycle();
})();
