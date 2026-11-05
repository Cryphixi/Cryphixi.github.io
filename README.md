# Allena Oglivie — HCI and game design portfolio

Static HTML, CSS, and JavaScript for GitHub Pages. No build service is required.

## Pages

- `index.html` — positioning, four featured case studies, design focus, proof points.
- `gamesmanuni.html`, `orbito.html`, `ballxpit.html`, `levelforger.html` — case studies.
- `about.html` — story, values, condensed timeline, affiliations.
- `lab.html` — other games, tools, coursework, and archives.
- `resume.html` — inline summary, PDF preview, PDF link.
- `archive.html` — previous home page with the full visual timeline and project directory.
- `organizations.html`, `socials.html` — original supplemental pages retained.

## Editing

Run `python build_portfolio.py` to regenerate the new pages after changing their content. The script contains case study copy, metadata, links, and page templates. Set colors, type, and spacing in `css/portfolio.css` under `:root`; the light theme variables are directly below. `js/portfolio.js` handles the theme toggle and optional reveal animation.

The bracketed `[ADD …]` notes mark missing evidence, screenshots, tools, evaluation details, and personal reflections. Replace them with verified content before publishing a polished portfolio. The existing LevelForger source PNG is retained; the new pages use a compressed WebP derivative.

To preview locally, serve this directory with any static server and open `index.html`. The site uses relative links and assets so it also works from the GitHub Pages root.
