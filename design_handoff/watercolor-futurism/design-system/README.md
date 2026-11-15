Watercolor Futurism is Allena Oglivie's design system: the delicate side of cyber futurism, drawn in the soft thin lines of Gris, with watercolor that arrives as you move through it. Light type, hairline orbits and constellations, a few bold colour boxes, and colour that is earned as you progress.

## Content fundamentals

- First person, plain and short. Use the words already on the current site; this is a redesign, not a rewrite.
- Labels are mono, uppercase and tracked: `INTERACTIVE PORTFOLIO · 2026 / 27`, `04 / 08`. They inform; they never shout.
- No emojis and no em dashes anywhere.
- Never invent numbers or facts. Mark gaps as `[ADD IMAGE]` or "Coming soon".

## Visual foundations

- **Ground.** `paper`, a cool off-white with faint fibre. Never warm, never pure white. Dark mode is a deep night `paper`. The theme follows the visitor's system setting, with a toggle.
- **Lines.** Everything is drawn with 1px hairlines in `line` or `faint`: orbit rings, degree ticks, constellations, the line art for each project. Lines draw themselves in as they arrive.
- **Type.** Sans only. Jost 200 for display, 300 for body; IBM Plex Mono 300 for labels. The name is uppercase with very wide tracking (`name-xl`).
- **Bold colour boxes.** The one solid shape: a flat, square-cornered rectangle with white text (`on-box`). `box-black` sits behind the last name, slides in behind nav items on hover and marks the current page, and fills behind project titles on hover. `box-lilac` sits behind the kicker. Category colours: Classes `box-blue`, Games `box-black` (its orbit uses `games-line`), AI / ML `box-lilac`, Community tools `box-teal`.
- **Watercolor.** Two pigments in the journey, `pigment-a` (lilac) then `pigment-b` (blue); the footer adds `pigment-c` (teal) and `pigment-d` (orchid) as a reward. The world starts colourless and blooms appear as each section is reached, then stay. Pigments glaze, pool at a darker drying edge and granulate. The pointer is a real wet brush: dragging lays down a continuous stroke that spreads and dries, and a click drops a bloom.
- **Orbits.** The logo's star and orbits are the system's core motif. The home arrival has a slow armillary of turning great circles; the Projects page turns the logo into a system of coloured category orbits with project planets.
- **Layout.** Home is scrolled through sideways; every other page scrolls vertically and ends with the same watercolor footer ("Let's chat"). Text sits on a feathered backdrop blur when the colour behind it gets busy.
- **Shapes.** Rectangles are square-cornered. Only true circles are round.

## Interaction rules

- Every hover previews what a click will do (the sound and theme icons, the nav boxes, the orbits).
- More than one way in: scroll, click, keys, and a plain list view where a page is exploratory.
- Sound is mathematical and quiet: a harmonic-series drone, a soft ding per click, a hum at the end of a page.
- Respect reduced motion: no parallax, no line draw-in, blooms appear without growing.
- Text keeps 4.5:1 against `paper` in both themes, and against any colour box.

## Iconography

- **Logo:** Allena's own marks, never redrawn. The condensed star-and-orbit mark (`logo.png`) sits top left; the full name logo (`nameLogo.png`) sits in the footer. Both are white line art, tinted with a mask in `ink`.
- **Settings icons:** hairline line art at 18 to 20px. Sound is a flat line or a moving sine wave. Theme is a tiny sun with a face in light mode and a crescent moon with a face in dark mode; hovering morphs one toward the other.
