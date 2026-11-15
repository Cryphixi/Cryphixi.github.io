# Allena Oglivie: Portfolio

Personal portfolio site for Allena Oglivie, HCI and game designer at UC Berkeley.
Static HTML, CSS and vanilla JavaScript on GitHub Pages. No build step, no framework.

The look is **Watercolor Futurism**: thin lines on cool paper, a few bold colour
boxes, and watercolor that arrives as you progress. The design handoff (note,
tokens and prototypes) is in `design_handoff/watercolor-futurism/`.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: the interactive portfolio, scrolled through sideways |
| `timeline.html` | Timeline: a spine that draws as you scroll, with an overview mode |
| `projects.html` | Projects: the orbit system, with a list view |
| `cs180.html`, `cs184.html`, `cs160.html` | Class pages, one tab per assignment |
| `connect.html` | Socials, latest updates and the organizations constellation |
| `resume.html` | Resume, then Portfolio |
| `organizations.html`, `socials.html` | Redirects to `connect.html#orgs` and `connect.html#socials` |

## Structure

- `css/site.css`: the whole design system. All colours are CSS variables in one
  `:root` block plus the dark overrides.
- `js/shell.js`: shared by every page. Nav and phone menu, settings icons, theme,
  the WebGL2 watercolor background (blooms plus the wet brush simulation), sound,
  text arrival and the footer.
- `js/contact.js`: the contact address shown in the footer, on Home and on Connect.
- `js/home.js`: Home's sideways journey, armillary, case pieces and case pop-up.
- `js/timeline.js`: the Timeline. Data-driven through `ENTRIES`.
- `js/projects.js`: the orbit system. Data-driven through `CATS` and `P`.
- `js/orgs.js`: the organizations constellation. Data-driven through `ORGS`.
- `js/class.js`: the assignment tabs on class pages.

## Editing content

- **Email:** `js/contact.js`.
- **Timeline:** `js/timeline.js`, `ENTRIES`. Keep newest first and keep each
  `group` (academic year) contiguous.
- **Projects:** `js/projects.js`, `P`. A link with an empty url shows as "Coming soon".
- **Organizations:** `js/orgs.js`, `ORGS`.
- **Latest updates:** `connect.html`, the `.feed` list.
- **Class pages:** the `.csec` sections in each class file; the tabs build themselves.
- **Home case pop-ups:** `js/home.js`, `CASES`.

## Running locally

Serve the folder statically, for example `python -m http.server`, and open `index.html`.
