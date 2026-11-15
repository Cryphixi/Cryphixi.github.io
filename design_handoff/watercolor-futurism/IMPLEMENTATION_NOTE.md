# Portfolio redesign: implementation note (Watercolor Futurism)

Paste this into Claude Code in the `Cryphixi.github.io` repo, and copy this whole folder into the repo at `design_handoff/watercolor-futurism/` so the prototypes sit next to the note.

This is a **UI redesign, not a content rewrite.** Every page keeps the information the current site already has (timeline, projects, organizations, socials, resume, CS180 projects). Only the look, layout and interaction change. The old dark space look is fully replaced.

- **Audience:** HCI master's admissions (Berkeley MDes, UCSD MDes, CMU MHCI) and games and tech recruiters.
- **Design system:** Watercolor Futurism, https://claude.ai/artifact/Ersi9EcYzZkCgNLCRqnxyp. Copies of its tokens and README are in `design-system/`.

## Visual prototypes (build from these)

Open each file in a browser before writing code. Reuse their shaders, maths and interaction logic; replace their placeholder content with the repo's data.

| File in this folder | Live link | Take from it | Ignore in it |
| --- | --- | --- | --- |
| `prototypes/home-drift.html` | https://claude.ai/artifact/VdhN4Fbh5qpEPeugjhxG9x | Home (sideways journey, orbit armillary, constellation thread, text wipe, feathered blur, case pop-up with liquid glass), the WebGL watercolor shader, the footer layout and watercolor tide, the Web Audio sound, nav bold boxes, the vertical page styling of its Timeline view | Its Projects grid view (replaced by the orbit page), its placeholder timeline entries, "Lab" wording, "Say hello" (now "Let's chat"), the half-circle theme icon, the A · O logo stand-in, the round-dab pointer trail, the unused star map code |
| `prototypes/projects-orbit/projects-orbit.html` (with `img/`) | https://claude.ai/artifact/LEt2pnKbdrS1HvivMe6Jg6 | The whole Projects page: orbit system, coloured category orbits, back and front halves, clickable orbits and planets, prev/next, segments, arrow keys, legend, list view, phone layout | Its simplified footer and nav (use the shared ones), the stand-in logo in its header |

`prototypes/projects-lofi.html` is a **rejected** grid study, kept only so you do not rebuild it.

## Priority

- [ ] **Phase 1: the UI update.** Sections 0 to 9. Ship this first.
- [ ] **Phase 2: the hand tracking demo** (section 10). Start only after Phase 1 is live.
- [ ] **Later, not now:** full case study content on Home. Focus on looks first; use the case images already in the repo.

## 0. Ground rules

- [ ] Vanilla static multi-page site on GitHub Pages: separate HTML files, shared `css/` and `js/`, no build step, no framework.
- [ ] Do not invent content or metrics. Reuse the repo's data and wording; fix obvious typos only. Where something is missing, show a visible placeholder like `[ADD IMAGE]` or "Coming soon".
- [ ] Copy rules: no emojis, no em dashes, plain first person.
- [ ] Keep existing URLs working (`cs180.html`, `resume.html`, `organizations.html`, `socials.html`). If a page is merged, leave a redirect at the old URL.
- [ ] Every animated piece respects `prefers-reduced-motion` and has a static fallback.
- [ ] Never hard-code the email address from this note; use the one already on the current site (the prototypes show `[ADD EMAIL]`).

## 1. Design system: Watercolor Futurism

Delicate, thin-line cyber futurism on cool paper, inspired by Gris: light type, fine lines that become art, and watercolor that arrives as you progress.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `paper` | `#f4f4f7` | `#0c0d14` | Ground. Cool, never warm, never pure white. Faint fibre texture in the shader. |
| `ink` | `#24222f` | `#e9e7f3` | Text, full-strength hairlines, star dots, logo tint. |
| `soft` | `#5e5a70` | `#a9a5bd` | Secondary text and mono labels. |
| `line` | `rgba(36,34,47,.55)` | `rgba(233,231,243,.55)` | 1px hairlines. |
| `faint` | `rgba(36,34,47,.16)` | `rgba(233,231,243,.14)` | Guides, dashed orbits, rails, image frames. |
| `pigment-a` | `#9b7fe6` | `#a98cff` | Watercolor lilac. Arrives first. |
| `pigment-b` | `#5d7be0` | `#6f8dff` | Watercolor blue. Arrives later. |
| `pigment-c` | `#4fa9b3` | `#58c1c9` | Footer only: teal. |
| `pigment-d` | `#b583e0` | `#c89bff` | Footer only: orchid. |
| `box-black` | `#0b0a10` | same | Last name box, nav hover and current page, title hovers, Games category. |
| `box-lilac` | `#7b5be0` | same | Kicker box, AI / ML category. |
| `box-blue` | `#1f55d4` | same | Classes category. |
| `box-teal` | `#0f6f78` | same | Community tools category. |
| `box-indigo` | `#3b2f8f` | same | Extra box option. |
| `games-line` | `#0b0a10` | `#e9e7f3` | Games orbit line, so it stays visible in dark mode. |

- [ ] **Type:** sans only. Jost 200 display, Jost 300 body (never lighter), IBM Plex Mono 300 labels. The name is uppercase with wide tracking (about `.32em`; last name about `1.18em`). Labels uppercase, tracked `.18em`.
- [ ] **Strokes:** 1px (max 1.4px). **Corners:** square; only true circles are round.
- [ ] **Theme:** follows the visitor's system setting (`prefers-color-scheme`) until they use the toggle; then remember the choice (localStorage in try/catch). All colours as CSS variables in one `:root` block plus the dark overrides.

## 2. Global structure (every page)

Pages, as separate files:

| File | Page | Scroll |
| --- | --- | --- |
| `index.html` | Home: the interactive portfolio | Sideways (the only one) |
| `timeline.html` | Timeline | Vertical |
| `projects.html` | Projects: the orbit system | Vertical (sticky stage) |
| `cs180.html`, `cs184.html`, `cs160.html` | Class pages | Vertical |
| `connect.html` | Organizations and socials, combined | Vertical |
| `resume.html` | Resume, then Portfolio | Vertical |

- [ ] **Logos (do not redraw):** top left, the minimal mark `public/logo.png` (star with orbits), linking Home. In the footer, the full name logo `public/nameLogo.png`. Both are white line art, so tint them with a CSS mask filled with `var(--ink)`.
- [ ] **Nav (fixed, top):** logo, then Work, Timeline, Projects, Connect, Resume in small mono `soft`. Hover or focus slides a `box-black` box in from the left behind the word and turns the text white; the current page keeps its box. ("Work" goes to the case chapters on Home.)
- [ ] **Settings icons** at the far right after a short hairline divider (section 7).
- [ ] **Phones:** the nav collapses to a small menu button (hairline icon, three lines morphing to a cross). It opens a full-width paper panel with the same links as large thin type, the settings icons, and the bold box on the current page. Esc and outside tap close it; focus is trapped while open.
- [ ] **Background:** one fixed full-screen WebGL2 canvas behind everything (paper texture and watercolor), paused when the tab is hidden. Without WebGL2, show flat `paper`.
- [ ] **Footer:** identical on every page, including Home (section 6).
- [ ] **Watercolor brush:** on every page, dragging paints with real brush physics (section 3.2).

## 3. Home (`index.html`, sideways)

A sticky full-viewport stage; vertical scroll moves the camera sideways through chapters: Arrival, About, four case studies, End. The shared footer follows below the End chapter in normal vertical flow.

- [ ] **Scroll mapping:** stage height `(chapters - 1) * 100vw + 100vh`; track `translateX(-scrollY)`. Focus inside a chapter scrolls to it.
- [ ] **Progress rail (bottom):** one dot per chapter; current is filled; clicking jumps.

### 3.1 Arrival

- [ ] Kicker "Interactive portfolio · 2026 / 27" in a `box-lilac` box. "ALLENA" in thin wide caps, "OGLIVIE" smaller in a `box-black` box. Subline "HCI and game designer". "Scroll to move through" with a nudging hairline arrow. Clicking a box cycles its colour.
- [ ] **Orbits:** the canvas armillary from the prototype: four great circles turning slowly around a tilted dashed axis (one turn per 90 s), fainter behind the sphere, dots travelling on two rings, degree ticks with N, S, E, W, and the static rings drawing in over about 2.6 s. No coordinates anywhere.

### 3.2 Watercolor (the colour arrives)

- [ ] The world starts colourless. Each chapter has 2 or 3 blooms; as a chapter scrolls in, its blooms grow first, then its text arrives. Blooms stay once grown.
- [ ] Pointer movement over a chapter keeps its blooms slowly growing and deepening (cap about 2.2x).
- [ ] **Look:** ragged wet edge from noise warp, darker pigment at the drying edge, granulation, multiply blending in light mode and additive glow in dark (see the prototype's fragment shader).
- [ ] **Real brush physics (required, not the prototype's dabs):** dragging lays a continuous wet stroke. Suggested build: a low-resolution ping-pong texture simulation (water, pigment and a paper height field), where each frame the brush deposits water and pigment along the segment since the last frame, pigment advects and diffuses with the water, water evaporates, and pigment settles into paper grain, darkening at the drying edge. Composite it into the same watercolor shader. A click drops a full bloom. Strokes stay fixed in the world (they scroll with Home's track). Lower the sim resolution on phones.

### 3.3 Constellation thread

- [ ] One SVG hairline through every chapter, about 19 nodes in the margins plus a few faint branches. It draws itself as you travel (head at about 78% of the viewport) and never undraws. A small star appears at each node as the line reaches it.

### 3.4 Text arrival and readability

- [ ] Each text block wipes in left to right (`clip-path` inset plus a small slide), staggered, after the watercolor; the last item must finish fully revealed.
- [ ] **Soft blur** behind every text group: backdrop blur about 14px, `paper` tint about 52%, radial mask so no hard edges. Fades in with the text.
- [ ] Gentle parallax (factors about .04 to .09); each chapter clips its own overflow.

### 3.5 About (copy from the earlier brief, inlined here)

Four statements placed like stars:

- **Who:** HCI and game designer at UC Berkeley, studying CS and Data Science.
- **What I do:** I design technology that adapts to people, using games as my lab: player experience, onboarding, and learnability.
- **Mission (large):** We should not conform to the tools meant to make our lives easier. The tools should conform to us.
- **Now:** Website Lead at GamesCrafters. Applying to HCI master's programs for Fall 2027.

### 3.6 Case study chapters (looks now, full content later)

Order, kicker, outcome line and role:

1. **GamesmanUni Redesign** (GamesCrafters): Redesigning a research platform of 107 games and puzzles so new players find what they want without getting lost. Website Lead · 2025 to present.
2. **Orbito: Designing a Two-Phase Turn** (GamesCrafters): Turning a rotating physical board game into a click interface that still feels real, on top of a solver covering 20M+ positions. Co-developer · Fall 2025.
3. **BALL x PIT Evolution Tracker** (Personal project): A player tool the community built on: Pit Crew uses my tracker as its foundation. Personal project · [ADD TIMEFRAME].
4. **LevelForger** (AI4ALL): A generative model for game levels, with a validation pipeline that cut unplayable levels from 30% to 5%. AI4ALL · [ADD ROLE].

Each chapter has one thin-line interactive piece (build as in the prototype): GamesmanUni 107-node spiral that lights near the pointer; Orbito 4x4 board with place then orbit; BALL x PIT drop and merge; LevelForger generate then validate. Use the existing case images in the repo (for example `gc-orbito.png`, `gc-frontend-dan.jpg`, the BALL x PIT and LevelForger images) in the pop-up image slots.

### 3.7 Case pop-up (liquid glass)

- [ ] Centred panel with hairline inset frame and corner ticks: kicker, title, outcome, role and timeline, three image slots, "Full case study · PDF (Coming soon)", "Next · [next case]". Close button and Esc; focus trapped and returned.
- [ ] Opening: page behind fades to about 18%; two blooms spread behind the panel.
- [ ] Glass: clear refracting rim, milkier centre. Glare gradient over a radial `paper` tint (light 66% centre / 24% edge, dark 86% / 52%), backdrop blur about 9px plus saturate 1.6, inset white rim highlights. Refraction in Chromium only via the prototype's generated edge map in `feDisplacementMap` and `backdrop-filter: url(#lg)` (bevel about 46px, rebuilt on resize). Other browsers get frosted glass.

### 3.8 End chapter

- [ ] "The rest of the story", pointing to the Resume and Portfolio page, GitHub, LinkedIn and email. Then the shared footer below.

## 4. Timeline (`timeline.html`)

- [ ] **Data:** `js/timeline.js` `ENTRIES`, unchanged in wording and order (newest at top, grouped by academic year). Keep every field's meaning: images, slideshows, video, logos (with dark variants), fit, notes, links.
- [ ] Keep the existing intro text, restyled.
- [ ] **Spine:** a vertical hairline that draws as you scroll, with a star per entry; entries alternate sides (on phones, spine left, entries right). Year groups get a mono label.
- [ ] **Entries:** date (mono), title (Jost 200), description, pictures in a 1px `faint` frame. Feathered blur behind text. Per entry, its bloom grows first, then text and pictures wipe in.
- [ ] **Stepper:** a pinned dot rail; click to jump. **Overview mode:** toggle to a compact dated list.

## 5. Projects (`projects.html`): the orbit system

Build from `prototypes/projects-orbit/`. This replaces the old Projects grid and the old Classes, Sites and Games tabs.

- [ ] **Concept:** the logo grown into a system. The four-point star at the centre; each category is a tilted elliptical orbit; each project is a planet showing its own thumbnail.
- [ ] **Data:** the `#projects` section of `index.html`, exact wording, links and images (8 projects: CS184, CS180, CS160, Inheritance Lines, Menses Mortis, Canopy, LevelForger, BALL x PIT, keeping the "community favorite" badge). Class planets link to the class pages (section 5b) instead of external sites.
- [ ] **Category colours everywhere (orbit line, legend button, panel tag):** Classes `box-blue`, Games `box-black` (orbit stroke `games-line`), AI / ML `box-lilac`, Tools `box-teal`.
- [ ] **Depth:** each orbit is drawn as two halves. The back half is drawn before the star and all planets, so it passes behind every image; the front half is drawn after the star but still behind the planets. Planets on the back half are smaller and fainter.
- [ ] **Scroll turns the system:** sticky stage; scroll progress moves through the projects in order, each orbit rotating (eased lerp) so its current project comes to the front beside the panel. The active planet grows, gets a halo in its colour and a dashed reticle; its orbit darkens while the others fade. Very slow idle drift.
- [ ] **Reading panel:** category box, "04 / 08", image in a 1px frame with a wipe, title with black box on hover, description, mono links, badge, then the progress segments. Content swaps with a short fade and slide.
- [ ] **Navigation (must be obvious):**
  - Scroll down for next, up for previous (the hint says so).
  - Prev and next buttons beside the counter.
  - Clickable progress segments, each with the project title as tooltip.
  - Click a planet to go to it. Click an orbit (wide invisible hit path, highlight on hover) to go to that category's first project, or the next one on it if you are already there.
  - Legend buttons jump to a category. Left and right arrow keys.
  - "See as a list": a compact grouped list for scanning and screen readers.
- [ ] **Phones:** system on top (about 42% of the height), panel below, controls kept.
- [ ] Blooms in the category colour behind the active planet; each planet arrival can play the ding at its position. Shared footer at the end.

### 5b. Class pages (`cs180.html`, `cs184.html`, `cs160.html`)

Dedicated pages, not pop-ups, reached from the class planets on Projects (and from the existing links).

- [ ] **Top tabs:** under the main nav, a second row of mono tabs, one per assignment (for example Proj 0, Proj 1, ... or HW1 to HW4). The current tab gets the bold box in the class colour (`box-blue`). Clicking a tab smooth-scrolls to its section; scrolling updates the active tab.
- [ ] **Body:** one vertical section per assignment: mono number, thin title, description, image in a 1px frame, links. Bloom grows then text wipes in, as on Timeline. Shared footer at the end.
- [ ] **CS180:** keep `cs180.html`'s content: Projects 0 to 4 with their existing links and `public/cs180/proj0-4.webp` images, and Project 5 as "Coming soon".
- [ ] **CS184:** the homework currently lives at https://cal-cs184-student.github.io/hw-webpages-Cryphixi/ and the final project (Snowfall) at https://c-herbert.github.io/cs184-final-project-webpage/. Make one tab per homework plus Final; each section links out. Ask Allena for the homework titles and images if they are not in the repo; use `[ADD IMAGE]` meanwhile.
- [ ] **CS160:** the current site only has "Interface design coursework, from research through built prototype." Build the page shell with that line and tabs marked "Coming soon" until Allena adds the work.

## 5c. Connect (`connect.html`): Organizations and socials together

- [ ] **Top:** socials from `socials.html`: LinkedIn, GitHub, Handshake and email (copy button), as mono links with hairline icons. Below them the existing "latest updates" feed, restyled as a short dated list.
- [ ] **Then Organizations:** "The programs and communities that helped me grow." Data from `js/orgs.js` `ORGS`, exact. Concept: a constellation of supporters. Each organization is a star placed by year joined (earliest lower left, newest upper right), with hairlines between ones that led to each other. Selecting a star opens a reading card (logo on a light plate, name, role, joined, how I joined, what I do, visit link). The idle showcase can step through stars until the visitor interacts. "See as a list" view too.
- [ ] Redirect `organizations.html` and `socials.html` to the matching sections (`connect.html#orgs`, `connect.html#socials`).

## 5d. Resume and Portfolio (`resume.html`)

- [ ] **Resume first:** the resume as on the current site (`public/Allena_Oglivie_Resume.pdf`), restyled, with a Download button.
- [ ] **Portfolio next:** a section titled Portfolio with "Coming soon" for the PDF portfolio, in the same style, ready for a link later.
- [ ] Shared footer at the end.

## 6. Footer (identical on every page, Home included)

- [ ] **Watercolor tide:** as it scrolls in, about seven blooms rise from the bottom edge in all four pigments, drifting slightly, staying once grown.
- [ ] **Horizon:** a full-width hairline with degree ticks.
- [ ] **Content:** "End of the page" label, a huge thin **"LET'S CHAT"**, then three columns on feathered blur:
  - Contact: the email from the current site as text with a Copy button, LinkedIn, GitHub, Handshake
  - Pages: Home, Timeline, Projects, Connect, Resume
  - Portfolio: "Coming soon"
- [ ] **Base row:** a hairline, the full name logo (`public/nameLogo.png`, tinted with `ink`), "(c) 2026 Allena Oglivie", and "Back to top".
- [ ] The end hum (section 8) starts when the footer is reached.

## 7. Settings icons

Two tiny hairline icons (18 to 20px) at the right of the nav, real buttons with tooltips and `aria-label`s stating the current state and the action. About 0.6 opacity, 1 on hover and focus. Every hover previews what a click will do. No words like "Sound on".

- [ ] **Sound off:** a flat line. Hover animates it into a moving sine wave. Click turns sound on and plays the ding.
- [ ] **Sound on:** a slowly moving sine wave. Hover gives one bright flash, then it settles flat. Click mutes.
- [ ] **Theme, light mode:** a tiny sun with a face (two dot eyes, a little smile) and hairline rays. Hover plays a soft morph into the crescent moon. Click switches to dark.
- [ ] **Theme, dark mode:** a tiny crescent moon with a face (dot eye, little smile). Hover morphs softly into the sun. Click switches to light.
- [ ] Not a minimal half circle. Draw as 1px line art; animate with SVG path morphs or transitions of about 250 to 400 ms. Under reduced motion, swap to the end state on hover instead.

## 8. Sound (mathematical ambient)

All pitches are whole-number or just-interval ratios of F0 = 110 Hz. Web Audio only, no files. The prototype's `snd` module is the reference.

- [ ] Starts on the first click or tap (unless the visitor turned it off before); the choice is remembered. Suspend when the tab is hidden.
- [ ] **Bed:** low-passed drone of sines at partials 1, 3/2, 2 and 3, each a pair about 0.1 to 0.4 Hz apart, breathing with a 0.045 Hz LFO, plus very quiet pink noise through a soft band-pass.
- [ ] **Click ding:** a soft sine bell (fundamental plus quiet octave, 8 ms attack, 1.7 s decay) through a light feedback delay; pitch from a just scale on F0 x 4 (1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2) chosen by click position left to right.
- [ ] **End hum:** at the footer, triangle partials 2, 3, 4 through a "closed mouth" low-pass with 4.6 Hz vibrato, fading in over a couple of seconds and out when leaving.
- [ ] Everything quiet; the ding is the loudest part.

## 9. Mobile, accessibility and performance

- [ ] Vertical swipe drives Home's sideways journey. Touch paints; tap drops a bloom. Case pieces work with tap and drag. Stack case text under its piece; orbit canvas about 150vw.
- [ ] Test at 375px with no horizontal page overflow. Lower watercolor and brush sim resolution on phones.
- [ ] Real HTML text, visible focus, 4.5:1 text contrast on `paper` and on every colour box in both themes.
- [ ] Reduced motion: no parallax, no draw-in, no orbit spin, blooms at full size, no brush spreading animation.
- [ ] Watercolor at about 0.55 render scale, max 40 blooms per frame with culling. Orbit canvas about 30fps. Pause everything when hidden. Lazy-load images; prefer WebP.
- [ ] Verify Jost and IBM Plex Mono load (they did not in sandboxed tests), with sans-serif fallbacks. Check the liquid glass fallback in Safari and Firefox.

## 10. Phase 2: hand tracking demo (small ML project, in Projects)

Paint this world with your hand. It becomes a planet on the AI / ML orbit with its own page.

- [ ] **Model:** on-device hand landmarks (MediaPipe Hand Landmarker, `@mediapipe/tasks-vision`, or TensorFlow.js hand pose), loaded only after opt-in.
- [ ] **Consent first:** a "Start hand tracking" button explaining what happens; camera requested only on click; live "camera on" indicator and Stop button. Frames are never recorded, uploaded or stored; say so in one line.
- [ ] **Mapping:** index fingertip is the brush (smoothed, for example a one euro filter) driving the same brush physics; thumb and index pinch drops a bloom; open palm sweep stirs or clears; optional hand size sets brush width.
- [ ] **Feedback:** a hairline cursor ring on the fingertip; an optional mirrored low-opacity mini preview.
- [ ] **Fallbacks:** camera denied means mouse and touch still paint, with a friendly message.
- [ ] **Performance:** inference at 15 to 30fps on a small video size; render on the existing canvas.
- [ ] **Write-up:** model choice, smoothing, gesture design, privacy decisions and what was learned.

## 11. Open items for Allena

- [ ] CS184 homework titles and images; CS160 work.
- [ ] BALL x PIT timeframe and LevelForger role.
- [ ] PDF portfolio link (until then, "Coming soon").
