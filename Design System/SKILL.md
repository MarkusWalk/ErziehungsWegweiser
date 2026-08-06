---
name: itm-2627-design-system
description: >-
  Warm, geometric design system for ITM 2627 (IT-Management, FAU Erlangen-Nürnberg).
  Coral primary, cream warm surfaces, CSS orbs with hue-matched glows, Bricolage
  Grotesque display + Instrument Sans text, a 73-icon line set, and slide, form,
  navigation and data components. Use for course decks, handouts and small product UI.
---

# ITM 2627 Design System

## Non-negotiables

1. **One accent.** Coral `#FF7A59` is the only brand accent. Violet, sky, moss and amber are
   secondary/decorative or functional. Never introduce a new hue.
2. **Coral-500 never carries small text.** It is a fill (2.7:1 on white). White text goes on
   coral-600+ at large sizes; small text uses coral-700 on coral-100.
3. **Two radius languages.** Badges and orbs are circles. Containers are 16 or 24px. Buttons,
   tags and pills are fully rounded. Do not mix.
4. **The glow is hue-matched.** Any glow shadow is the shape's own hue at 40–45% alpha with a large
   blur. It applies only to orbs and coral numbered badges — never to cards.
5. **No emoji, no exclamation points, no marketing "we".**
6. **Slide text never below 24px** on a 1920×1080 canvas.

## Type

```
--font-display: "Bricolage Grotesque"   headlines, slide titles, big numerals (400-800)
--font-sans:    "Instrument Sans"       body, UI, captions (400-700)
--font-mono:    "JetBrains Mono"        numbers in data contexts
```

Interface scale `--text-xs`…`--text-4xl` (12→48px). Slide scale `--slide-caption`…`--slide-display`
(18→120px). Tracking tightens as size grows: `--tracking-tighter` above 56px, `--tracking-tight`
for 24–48px, none below.

## Colour

```
--coral-500  #FF7A59   primary accent      --moss-600   #2E8B5F   success, nature, charts
--violet-500 #8B7FFF   secondary           --amber-600  #D08A1E   warning
--sky-500    #4FACFE   tertiary            --status-danger #D6453D
--cream-100  #FBF7EC   warm surface        --ink-900    #1A1A1A   text
--surface-page #F5F5F5 canvas              --ink-000    #FFFFFF   cards
```

Charts take `--chart-1`…`--chart-6` in order. Status colours are functional only.

## Geometry & decoration

Use `--orb-coral|violet|sky|moss` (radial gradients) with the matching `--glow-*` shadow, and
hairline rings in `--coral-200/300`. Section backgrounds use `--wash-cream`, `--wash-violet-sky`,
`--wash-cool-pale`, `--wash-spectrum` or `--wash-dark` — one wash per view, full bleed or one large
panel. Never two competing gradients in sight of each other.

## Icons

73 line icons, 24px grid, 1.75px stroke, round caps/joins, no fills, `currentColor`.
React: `<Icon name="sparkle" size={24} />`. Sprite: `assets/icons/icons.svg`, `<use href="#i-sparkle">`.
Sizes 16 (1.5 stroke) · 20/24 (1.75) · 32/48 (2.0). Never mix in a second icon family.

## Components

Core: Button, IconButton, Icon, Card, Tag, Avatar, AvatarGroup, Divider.
Forms: Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch.
Feedback: Alert, ProgressBar, Spinner, Tooltip.
Navigation: Tabs, Stepper, Breadcrumb, Accordion.
Data: Table, Stat, DataBar, Legend.
Slide: NumberBadge, SectionLabel, Pill, Connector, Orb, Ring, Wash.

## Slide layout

1920×1080. Side margins 140px, top/bottom 100px, 36px between cards. Body content is left-aligned;
only title and section slides centre. Sequence is shown either as a horizontal row of circular
numbered badges above cards, or a vertical chain of cards linked by a thin coral down-arrow.

## Copy pattern for a section slide

```
TREND 04                     ← uppercase eyebrow, coral, 0.12em tracking
The Agentic Revolution       ← display, Title Case
Trust in automation          ← italic, coral
Can we delegate planning …?  ← a real question, sentence case
```

## Motion

80ms tints · 120ms colour · 200ms elevation and toggles · 320ms progress · 520ms slide entrances.
`--ease-standard` by default, `--ease-out` for entrances. Slide builds rise 16px while fading,
staggered 60ms, four elements maximum.
