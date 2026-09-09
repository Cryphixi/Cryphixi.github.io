# Allena Oglivie — Portfolio

Personal portfolio site for Allena Oglivie (senior CS @ UC Berkeley, targeting
game engineering). Static HTML, CSS, and vanilla JavaScript, deployed on GitHub
Pages. No build step.

## Pages

- `index.html` — home: fluid hero, profile, the pinned **Journey timeline**,
  end-of-timeline handoff, and the Projects preview (`#projects`).
- `organizations.html` — ledger index + idle-cycling flashcard stack.
- `socials.html` — links and a hand-maintained "latest updates" list.
- `resume.html` — document preview and PDF download.

## Structure

- `css/site.css` — the full design system (locked palette, serif-only type,
  components, responsive rules).
- `css/fonts.css` + `public/fonts/` — self-hosted EB Garamond, Cormorant
  Garamond, and Pinyon Script (latin + latin-ext). No external font CDN.
- `js/fluid.js` — the hero's real-time WebGL curl-noise fluid background
  (hero-only, no pointer input; CSS ombré fallback if WebGL is unavailable).
- `js/shell.js` — starfields, nav visibility/idle/toggle, and the two
  shared-window background crossfades (hero → side margins → footer).
- `js/timeline.js` — the pinned Journey timeline. **Data-driven:** edit the
  `ENTRIES` array to add or reorder milestones; the section grows automatically
  and academic-year separators (the `group` field) render between them.
- `js/orgs.js` — the Organizations index + flashcard stack. Edit the `ORGS`
  array to fill in roles/links; empty fields render the designed fill-in prompts.

## Editing content

- **Timeline:** `js/timeline.js` → `ENTRIES`. Keep newest-first; keep each
  `group` (academic year) contiguous.
- **Organizations:** `js/orgs.js` → `ORGS`.
- **Socials updates:** `socials.html` → the `.feed-item` blocks.
- **Resume PDF:** `resume.html` links `Allena_Oglivie_Resume.pdf`.

## Still to add

- Real imagery: profile photo, timeline milestone images, project thumbnails.
- Copy for milestones 5–6 and the organizations without roles/links yet.

## Design source

The design handoff (brief, spec, and prototypes) lived in a separate
`design_handoff_journey_portfolio` bundle. The previous version of the site is
preserved on the `old-version` branch.

## Running locally

No build required. Serve the folder statically, e.g. `python3 -m http.server`,
and open `index.html`.
