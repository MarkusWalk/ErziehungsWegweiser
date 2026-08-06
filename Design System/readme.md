# ITM 2627 Design System

A warm, geometric design system for **ITM 2627 — IT-Management** (Friedrich-Alexander-Universität
Erlangen-Nürnberg, Rechts- und Wirtschaftswissenschaftliche Fakultät). It covers slide decks,
course handouts and small product UI built around the module.

Extracted from `trends-2026-slide-master.pptx` (a 12-slide "10 Trends for 2026" deck) plus rendered
screenshots of the course's own lecture decks. Every colour, size and shape in the foundations came
out of that file; everything beyond it — the icon set, the form and navigation components, the motion
and layout scales — is a deliberate, documented addition, marked as such below.

---

## Visual foundations

**Palette.** Warm coral `#FF7A59` is the single brand accent: numbered badges, key rules, the active
state of anything. Soft violet `#8B7FFF` is secondary and mostly decorative; sky `#4FACFE` is a thin
tertiary; moss and amber round the set out for charts and status. Neutrals run a light-grey canvas
`#F5F5F5` with pure white cards and near-black ink `#1A1A1A`. A cream family (`#FDFBF5 → #EDE2C8`)
carries the warm, natural half of the system — section slides and print live there. Deep navy stays
available for the one high-contrast panel a deck might need.

**Type.** Two families, deliberately chosen (the source deck used Arial only):
**Bricolage Grotesque** for display — headlines, slide titles, big numerals — and
**Instrument Sans** for everything you read. **JetBrains Mono** carries numbers in data contexts.
Two scales are defined: an interface scale (12→48px, 1.25 major third) and a slide scale
(18→120px on a 1920×1080 canvas). Slide text never goes below 24px.

**Harmonic geometry.** The deck's signature decoration is a glossy sphere with a drop shadow tinted
*its own hue* at 40–45% alpha. That hue-matched glow is the system's one deliberate lighting effect,
and it applies to exactly two things: orbs and coral numbered badges. Spheres, rings and gradient
washes are all CSS now — no raster cutouts — so they scale to any canvas.

**Botanical specimens.** The second decorative family: cutouts of period naturalist artwork —
blooms, leaves, sprigs, butterflies — strung along a letterform (`SpecimenGlyph`) or drifting at low
opacity behind a text column (`SpecimenScatter`). They live on aged-paper grounds and keep their
faded, as-scanned colour. The two families never share a slide: botanicals carry title and section
slides, orbs carry trend, data and process slides. Clean white-and-coral slides remain the default
for everything in between.

**Corner radii.** Two languages that never mix: badges and orbs are circles; containers use
`--radius-lg`/`--radius-xl` (16/24px). Buttons, tags and pills are fully rounded.

**Elevation.** One soft, warm-neutral family, five levels. Cards sit at level 2, hover at 3,
overlays at 4. Never a coloured left-border accent on a card.

**Motion.** Not present in the static source; this is a documented house default. Everything is
short and eased-out and nothing bounces — 80ms for tints, 200ms for elevation and toggles, 520ms
for slide entrances staggered 60ms apart.

## Content fundamentals

- **Language**: English is the template default; German is used for course-specific copy.
- **Tone**: direct and question-driven. Section intros pose a provocation as a subtitle
  ("Trust in automation") and end on a real question ending in "?".
- **Casing**: Title Case for headlines and card titles; sentence case for body copy.
- **Numerals as design elements**: trend numbers and years ("2026", "00 — Intro") are set as
  oversized display type, not labels.
- No exclamation points. No emoji. No first-person marketing "we".

## Iconography

The source deck had no icon set — it communicated sequence purely through numerals in circular
badges. This system adds a purpose-drawn one: **73 line icons** on a 24px grid, 1.75px stroke,
round caps and joins, geometric construction, no fills. It covers navigation, objects, concepts
(agentic AI, quantum, network, sustainability) and status. Icons inherit `currentColor`.

- `components/core/Icon.jsx` — React component, `<Icon name="sparkle" size={24} />`
- `assets/icons/icons.svg` — SVG sprite for non-React consumers, `<use href="…#i-sparkle">`

Numbered badges remain the primary sequence device on slides; icons support, never replace them.

## Components

**Core** (`components/core/`)
Button · IconButton · Icon · Card · Tag · Avatar · AvatarGroup · Divider

**Forms** (`components/forms/`)
Field · Input · Textarea · Select · Checkbox · RadioGroup · Switch

**Feedback** (`components/feedback/`)
Alert · ProgressBar · Spinner · Tooltip

**Navigation** (`components/navigation/`)
Tabs · Stepper · Breadcrumb · Accordion

**Data** (`components/data/`)
Table · Stat · DataBar · Legend

**Slide** (`components/slide/`)
NumberBadge · SectionLabel · Pill · Connector · Orb · Ring · Wash · Specimen · SpecimenGlyph · SpecimenScatter · Paper

Only the six slide primitives derive from real artefacts in the source deck. Everything else is an
intentional addition, sized and styled to the same rules.

## Tokens

`styles.css` imports the lot:

| File | Holds |
|---|---|
| `tokens/colors.css` | Ink, coral, violet, sky, cream, moss, amber, navy ramps; semantic aliases; status; chart series; interaction states |
| `tokens/typography.css` | Font families, interface scale, slide scale, weights, leading, tracking |
| `tokens/spacing.css` | 4px spacing grid, radii, control heights, stroke weights |
| `tokens/elevation.css` | Five shadow levels plus the hue-matched glows |
| `tokens/motion.css` | Durations, easings, stagger and entrance distance |
| `tokens/layout.css` | Slide canvas and margins, containers, grid, breakpoints, z-index |
| `tokens/effects.css` | CSS orbs, gradient washes, bar fills, rings, focus ring |
| `tokens/paper.css` | Aged-paper grounds (cream/sage/tan), paper ink, procedural grain, specimen scale |

## Assets

- `assets/icons/icons.svg` — the 73-icon sprite.
- `assets/gradients/` — the eight original diagonal panel PNGs from the pptx. Kept for fidelity when
  reproducing a source slide exactly; new work should use the CSS `--wash-*` tokens instead.
- `assets/orbs/`, `assets/bars/` — the original raster sphere and bar art, superseded by
  `--orb-*` and `--fill-*-bar`.
- `assets/botanical/` — 48 transparent PNG cutouts of period naturalist artwork: 15 blooms,
  10 leaves, 9 sprigs, 14 butterflies/moths/beetles. Registered in `SPECIMENS` in `Specimen.jsx`;
  see the folder readme for naming and the Botanical specimens card for the usage rules.
- **No logo exists** for ITM 2627 and none has been invented — render the name in display type where
  a mark would go. The FAU logo in the source screenshots belongs to the university and is not part
  of this system.

## Templates

`templates/trend-deck/` — an 18-slide 16:9 deck: title, section/trend, numbered steps, sessions table,
quote, thank you, card grid, two-column comparison, image + text, image trio, process flow, cycle
diagram, big numbers, icebreaker, icon list. Image slots are drag-and-drop.

## Guidelines

The Design System tab groups the specimen cards as Colors, Type, Iconography, Effects, Motion,
Layout, Spacing, Accessibility, Content, Assets and Components.

## Caveats & open questions

- **Motion, hover and focus states** are extrapolations — a static pptx defines none of them. They
  are conservative and internally consistent, but tell me if you want them tuned.
- **Coral-500 never carries small text** (2.7:1 on white). It is a fill. Use coral-600 behind white
  for large text only, or coral-700 on coral-100. See the Accessibility card.
- **No photography set** ships with the system. Slides that need imagery use image slots. The
  botanical specimen library is the one illustration family. `SpecimenGlyph` covers digits 0–9 plus
  I, T and M; other letters need new skeletons — say which and I'll draw them.
- **Charts** stop at DataBar. If your decks regularly show lines, stacked bars or scatter, tell me
  the typical metrics and I'll extend the data set properly.
