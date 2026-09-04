/* ============================================================
   Organizations — ledger index + flashcard stack.
   Ported from design_handoff/Organizations.dc.html.
   Idle showcase walks the list; clicking a row takes over and
   the cycle resumes 14s after the visitor stops interacting.
   Active card never animates opacity (masks the outgoing card).
   Fill-in prompts are shown as designed; nothing is invented.
   ============================================================ */
(function () {
  'use strict';

  var mount = document.getElementById('orgs');
  if (!mount) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileMq = window.matchMedia('(max-width: 900px)');

  var B = 'public/organizations/';
  var TBD = null;
  var ORGS = [
    { name: 'GamesCrafters', short: 'GamesCrafters', logo: B + 'GamesCrafters-Logo.png',
      site: 'https://gamescrafters.berkeley.edu/', role: 'Website Team Lead', joined: '2025 — Present',
      how: 'Joined the research group at Berkeley and moved onto the website team, then took the lead.',
      what: "Led a full UI overhaul of the group's interactable games research website." },
    { name: 'Girls Make Games', short: 'Girls Make Games', logo: B + 'girls-make-games.png',
      site: 'https://girlsmakegames.com/', role: 'Scholarship Recipient · 2K Mentee', joined: '2023 — Present',
      how: 'Applied to the GMG College Scholarship and was selected in 2023.',
      what: "2023 scholarship recipient; now in the GMG x 2K Mentorship Program, paired with mentors from 2K's Engineering Grad Program." },
    { name: 'America On Tech', short: 'America On Tech', logo: B + 'america-on-tech.png',
      site: 'https://www.americaontech.org/', role: TBD, joined: TBD, how: TBD, what: TBD },
    { name: 'AI 4 ALL', short: 'AI 4 ALL', logo: B + 'ai4all.png',
      site: 'https://ai-4-all.org/', role: TBD, joined: TBD, how: TBD, what: TBD },
    { name: 'Cal Marginalized Genders in Gaming', short: 'CMGG', logo: B + 'cal-marginalized-genders-gaming.png',
      site: TBD, role: TBD, joined: TBD, how: TBD, what: TBD },
    { name: 'ColorStack', short: 'ColorStack', logo: B + 'color-stack.png',
      site: 'https://www.colorstack.org/', role: TBD, joined: TBD, how: TBD, what: TBD },
    { name: 'Cal Alumni Association African American Initiative', short: 'the CAA', logo: B + 'cal-alumni-african-american.png',
      site: 'https://alumni.berkeley.edu/', role: TBD, joined: TBD, how: TBD, what: TBD },
    { name: 'Hispanic Scholarship Fund', short: 'HSF', logo: B + 'hispanic-scholar-fund.png',
      site: 'https://www.hsf.net/', role: TBD, joined: TBD, how: TBD, what: TBD },
    { name: 'UC Berkeley SSS STEM Scholar & Grant Recipient', short: 'SSS STEM', logo: B + 'uc-berkeley-sss-stem.png',
      site: TBD, role: TBD, joined: TBD, how: TBD, what: TBD }
  ];

  var N = ORGS.length;
  var CYCLE = 3200, LEAD = 900, RESUME = 14000;
  function p2(n) { return String(n).padStart(2, '0'); }

  var index = mount.querySelector('.org-index');
  var stack = mount.querySelector('.org-stack');
  var grid = mount.querySelector('.orgs-grid');

  var PROMPTS = {
    role: 'add your role here',
    joined: 'add the year you joined',
    how: 'add how you found or were selected for this',
    what: 'add a line or two on your work with them'
  };

  var rowEls = [], cardEls = [];

  ORGS.forEach(function (o, i) {
    // index row
    var row = document.createElement('button');
    row.type = 'button';
    row.className = 'org-row';
    row.innerHTML =
      '<span class="logo-slot"><img src="' + o.logo + '" alt="' + esc(o.name) + ' logo"></span>' +
      '<span><span class="r-name">' + esc(o.name) + '</span>' +
      '<span class="r-role" style="display:block">' + esc(o.role || 'role to add') + '</span></span>' +
      '<span class="r-year">' + esc(o.joined || '—') + '</span>';
    row.addEventListener('click', function () { select(i); });
    index.appendChild(row);
    rowEls.push(row);

    // detail card
    var card = document.createElement('div');
    card.className = 'org-card';
    card.innerHTML =
      '<div class="oc-head"><span class="diamond"></span><span class="index">' + p2(i + 1) + ' / ' + p2(N) + '</span><span class="rule"></span></div>' +
      '<div class="oc-title"><span class="logo-slot"><img src="' + o.logo + '" alt="' + esc(o.name) + ' logo"></span><h2>' + esc(o.name) + '</h2></div>' +
      '<div class="oc-rows">' +
        rowHtml('Role', o.role, PROMPTS.role) +
        rowHtml('Joined', o.joined, PROMPTS.joined) +
        rowHtml('How I joined', o.how, PROMPTS.how) +
        rowHtml('What I do', o.what, PROMPTS.what) +
      '</div>' +
      '<div class="oc-link">' +
        (o.site
          ? '<a href="' + o.site + '" target="_blank" rel="noopener">visit ' + esc(o.short) + ' &#8594;</a>'
          : '<span class="noprompt">add the organization\'s link</span>') +
      '</div>';
    stack.appendChild(card);
    cardEls.push(card);
  });

  function rowHtml(label, value, prompt) {
    var has = !!value;
    return '<div class="oc-row"><span class="label">' + label + '</span>' +
      '<span class="value' + (has ? '' : ' prompt') + '">' + esc(has ? value : prompt) + '</span></div>';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var active = 0, prev = null, cycling = true;
  var cycleTimer = null, leadTimer = null, resumeTimer = null;

  function apply() {
    rowEls.forEach(function (r, i) { r.classList.toggle('active', i === active); });
    cardEls.forEach(function (c, i) {
      c.classList.toggle('active', i === active);
      c.classList.toggle('prev', i === prev && prev !== active);
    });
  }

  function advance() {
    prev = active;
    active = (active + 1) % N;
    apply();
  }
  function startCycle() {
    stopCycle();
    if (reduce || mobileMq.matches) return;
    leadTimer = setTimeout(advance, LEAD);
    cycleTimer = setInterval(advance, CYCLE);
  }
  function stopCycle() {
    if (cycleTimer) clearInterval(cycleTimer);
    if (leadTimer) clearTimeout(leadTimer);
    cycleTimer = leadTimer = null;
  }
  function select(i) {
    stopCycle();
    if (resumeTimer) clearTimeout(resumeTimer);
    if (i !== active) { prev = active; active = i; }
    cycling = false;
    apply();
    if (!reduce && !mobileMq.matches) {
      resumeTimer = setTimeout(function () { cycling = true; startCycle(); }, RESUME);
    }
  }

  function applyMobile() {
    var m = mobileMq.matches;
    if (grid) grid.classList.toggle('stacked', m);
    if (m) { stopCycle(); }
    else if (cycling) { startCycle(); }
  }
  mobileMq.addEventListener('change', applyMobile);

  apply();
  applyMobile();
  if (!mobileMq.matches) startCycle();
})();
