# Direction — chosen in phase 2

Three boards were built on the real copy (`content/*.json`) and the real media
(`public/media`). Each was designed to a written brief before a line of HTML, and
each lives at `concepts/{a,b,c}.html` in the built site for the record.

## The three boards

| | A · Instrument | B · Darkroom | C · Object |
|---|---|---|---|
| Dominant ground | **light** — cool drafting paper `#e7ebe9` | **dark** — warm oxblood `#1b1412` | **mid** — studio grey cyclorama `#c9cbc4` |
| Display face class | **grotesque, expanded** (Archivo wdth 118) + mono labels (Geist Mono) | **high-contrast serif** (Instrument Serif) | **characterful grotesque** (Bricolage Grotesque wdth 85) |
| Hero mechanic | annotated plate: the real cut-away render on a coordinate grid with live dimension lines that draw on | masked full-bleed still, slide-carousel crossfades, breathing scale | one object hovering above a live contact shadow that follows the cursor |
| Accent | single ultramarine `#1f3bd6` | brass `#c9a227` | signal orange `#ff5a1f` |
| Body face | Geist | Hanken Grotesk | Hanken Grotesk |
| Territory (atelier) | technical / utilitarian | editorial / refined luxury | organic-playful studio |

All three satisfy the exclusion list: none of the old hexes (`#0b0b0a #efeee9
#b8ff57 #131312`), no scroll-scrubbed particle-video hero, no Inter / Space
Grotesk, no cream-serif-terracotta, no near-black-with-lone-acid-pop, no
purple-blue gradient, no emoji markers, no centered-three-cards template.

## Rubric

Scores 1–5. **Distinctiveness is a gate: a board scoring below 4 is ineligible
regardless of total.** Performance risk is inverted (5 = safest). Tie-break rule,
declared before scoring: the higher distinctiveness wins, because the brief is
"absolutely fresh" first and everything else second.

| Criterion | A · Instrument | B · Darkroom | C · Object |
|---|---|---|---|
| Distinctiveness (gate ≥ 4) | **5** — annotated engineering plates are not a portfolio idiom; nobody else's site looks like this | **3** — dark editorial with a serif and full-bleed stills is a well-worn portfolio genre; beautifully done, but recognisable → *ineligible* | **4** — object-on-cyclorama is seen in product-design portfolios, the moving contact shadow lifts it |
| Fit to the actual media (photo/video-heavy renders) | **4** — renders read as plates; cut-aways and architecture drop straight into a drawing frame; Bitronix characters need the loosest treatment | **5** — stills and film are the whole idea | **3** — flat renders inside a "floating object" card fight the metaphor unless every case gets a real 3D object |
| Feasibility in phases 4–9 | **4** — grid, plates, annotations are CSS/SVG; the 3D exploded assembly is exactly what phase 5 already plans | **5** — mostly CSS masks and crossfades | **3** — five convincing procedural objects carrying the whole identity is the hardest ask |
| Performance risk (inverted) | **3** — one WebGL scene per page plus SVG overlays | **4** — video stills, minimal script | **2** — always-on 3D as the primary content |
| Hiring-reader clarity in 90 s | **5** — the frame itself argues "I build systems"; role, period and team are on the title block | **4** — reads as art director first, systems thinker second | **3** — minimal type delays the facts a hiring director looks for |
| **Total** | **21** | 21 (ineligible) | 15 |

## Pick: A · Instrument

B ties A on points but fails the gate — and the gate exists precisely so that a
gorgeous, familiar direction cannot beat a distinctive one on craft alone. C is
the most ambitious and the least safe; its identity depends on five 3D objects
being good enough to carry the site, which would put the whole run's outcome on
one phase.

**Strongest single reason each rejected board lost:**
- **B · Darkroom** — it is the genre. A hiring director has seen this site fifty times this year; the exclusion list exists for exactly this.
- **C · Object** — the metaphor only works if the object is real 3D on every page; with flat renders it becomes a rounded card, which is the template we are trying to avoid.

### What A says about Daniil

An engineering drawing set. The renders are treated as plates with dimension
lines, title blocks and revision marks; the 3D objects are exploded assemblies,
not decoration; the copy sits in the margins the way notes sit on a blueprint.
The reader is told, without a single adjective, that this person thinks in
systems and ships the details. That is the argument the old site made in words
("Four systems, not four styles") and this one makes in form.

**The unforgettable thing:** dimension lines that draw themselves onto the real
product photography, turning every hero into a plate from the project's own
drawing set.

### Theme decision: both

Light is primary — drafting paper. Dark is a deliberate second world, not an
inversion: **blueprint** — deep navy paper `#0c1b2a` with pale ink and a lifted
ultramarine, the same grid, the same plates. Both are token-first;
`prefers-color-scheme` and `data-theme` both switch the full set.

### Generated assets

`generated_assets: false`

Reason: the direction's atmosphere is line, grid and paper grain — all better
produced procedurally (SVG `feTurbulence`, CSS gradients, Three.js wireframes)
than as bitmaps. A generated texture would add weight and fight the vector
crispness that is the point. Phase 3 skips.

## Locked tokens

See `src/styles/tokens.css`. Faces: Archivo (display, width axis 62–125),
Geist (body), Geist Mono (labels, dimensions, data). Type scale 6 steps on a
1.25 ratio from 16 px. Spacing 4 steps on 8 px. Two radii (0 for plates, 4 px
for controls). Easings: `--ease-out: cubic-bezier(.2,.8,.2,1)`,
`--ease-draw: cubic-bezier(.65,0,.35,1)`. Durations 160 / 400 / 1400 ms.
