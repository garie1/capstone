# Capstone Technologies — Brand & Redesign Notes

## 1. USP (Unique Selling Proposition)
**One senior team that owns the whole stack — software, data, and cloud — end to end.**

Most firms sell one of the three and stitch the rest together with subcontractors and
handoffs. Capstone designs, builds, *and* sustains all three under one roof, with the
same senior people from first conversation to long after launch. Hong Kong-rooted,
globally deployed.

The name itself is the proof point: a *capstone* is the final, load-bearing stone that
completes and holds a structure together. That's the role Capstone plays in a client's
business — **"the part everything else rests on."**

## 2. Brand Personality
Archetype: **The Sage + The Maker** (the trusted expert who actually builds).

| Trait | What it means here |
|-------|--------------------|
| Quietly confident | States facts, doesn't sell. Lets results carry the weight. |
| Precise | Engineering rigour; nothing vague or padded. |
| Grounded | Plain language, honest about scope, no buzzwords. |
| Senior | Speaks as a peer to CTOs and founders, not a vendor. |
| Calm under load | The system stays up; so does the tone. |

**Voice rules**
- Short, declarative sentences. Subject–verb–done.
- No hype words ("cutting-edge", "world-class", "revolutionary", "synergy").
- Specific over superlative ("99.98% uptime" beats "highly reliable").
- Confidence through restraint — say less, mean more.

## 3. Brand Strategy
**Positioning statement**
> For growth-stage and enterprise teams who can't afford for their systems to fail,
> Capstone Technologies is the Hong Kong engineering partner that designs, builds, and
> sustains custom software, data, and cloud as one — so the foundation never becomes the
> bottleneck.

**Three messaging pillars**
1. **Own the whole stack** — software + data + cloud, one accountable team.
2. **Senior, hands-on, no handoffs** — the people who design it build and run it.
3. **Built to hold up** — reliability and longevity over flash.

**Proof to develop next**: real case studies, named uptime/SLA figures, client logos,
team credentials. (Current stats on the site are illustrative placeholders.)

## 4. Colour System
White-dominant, blue secondary, glossy-silver accent.

| Token | Hex / value | Role |
|-------|-------------|------|
| White | `#FFFFFF` | Dominant background |
| Paper | `#F6F8FC` | Layered off-white planes (depth) |
| Sky   | `#EAF0FF` | Light blue tint |
| Ink   | `#0B1530` | Near-black navy — text & dark sections |
| **Capstone Blue** | `#2D5BFF` | Secondary / structural — links, charts, lines |
| **Silver** | `#9AA6B8` | Accent mid-tone (legible on white) |
| Silver-deep | `#5E6B80` | Accent shadow tone |
| Silver-bright | `#EDF1F7` | Accent highlight (on dark) |
| **Chrome** | `linear-gradient(…)` | Metallic gloss for filled accent shapes |

**Why glossy silver:** it reads premium, precise, and *quiet* — a better fit for an
engineering firm than warm gold, and it never competes with the blue. Flat grey would
look dull, so filled accents use a **`--chrome` gradient** (white→silver→shadow→white)
that catches light and reads as polished metal on any background. Text accents use the
solid `--silver` tones so they stay legible.

**The accent shape is a square**, not a circle — it echoes the mark above the "A" in the
Capstone logo. All former orange dots/circles (eyebrow marker, list bullets, cursor,
marquee separators) are now small rounded **squares** in chrome silver.

**Swappable** — retune the `--silver*` / `--chrome` tokens in `styles.css :root`.

### Dot-field ("data" texture)
A halftone dot grid (inspired by the BoneView bar chart) is used sparingly to signal
*data* and add depth to flat panels. Reusable `.dotfield` utility — tune density with
`--dot-gap`, dot size with `--dot-size`, colour with `--dot-color`; fade helpers
(`--fade-b/-l/-radial`) dissolve the edges. Placements:
1. **Home chart** — dotted fill under the line graph (SVG `<pattern>` + fade mask),
   the most literal data read.
2. **Inner page heroes** — a blue dotted square in the deconstructed grid (top-right),
   echoing the square motif.
3. **Approach section (dark)** — a faint dot grid fading from a corner, for depth on
   the navy panel.
Deliberately *not* used on the CTA band or footer, to keep those calm.

## 5. Typography
- **Clash Display** (500/600/700) — headlines & big numbers. Bold, geometric,
  distinctive — matches refs 3, 4, 5.
- **Satoshi** (400/500/700/900) — body & UI. Clean, modern, highly legible.
- Both free via Fontshare; loaded from CDN with a system-sans fallback.

## 6. Animation (the "top-tier, not amateurish" brief)
Principle: **slow, deliberate easing = quiet confidence.** Custom cubic-bezier
`(0.22, 1, 0.36, 1)`. Nothing bounces; everything settles.

- **Intro** — brief dark logo wipe with a gold rule drawing in, then lifts away.
- **Hero line reveal** — headline rises line-by-line from behind a mask.
- **Layered parallax** — hero image and floating glass stat-cards drift at different
  depths on scroll (ref 2's sense of depth).
- **Dotted-blue graph** — line draws on with `stroke-dashoffset`, then settles to a
  dotted texture; data points pop in sequence; last point is gold (ref 1).
- **Count-up stats** — numbers ease up to value when scrolled into view.
- **Scroll reveals** — staggered fade-and-rise via IntersectionObserver.
- **Magnetic buttons + custom cursor dot** — buttons lean toward the pointer; a soft
  gold dot trails the cursor and swells over interactive targets (desktop only).
- **Service rows** — gold edge-bar grows, row indents, arrow kicks on hover.
- **Marquee** of industries; nav shrinks/hides intelligently on scroll.
- **Fully degrades** under `prefers-reduced-motion`.

## 7. Site structure (multi-page)
The site is now four individual HTML pages sharing one stylesheet and one script:
- `index.html` — Home: full-width image hero, intro statement, stats + dotted chart,
  services preview, approach, CTA.
- `services.html` — Services: page hero + three deconstructed service detail blocks
  (outlined "01/02/03"), approach, CTA. Deep-links: `#custom-software`,
  `#data-analytics`, `#cloud`.
- `about.html` — About: statement, 6-cell values grid, stats, CTA.
- `contact.html` — Contact: details aside + working contact form (client-side demo
  handler; wire to a backend / form service before launch).

Shared nav adapts automatically: the **light logo + light links** sit over the dark
hero on the home page, swapping to the **dark logo + dark links** once scrolled or on
any light inner page (`nav--over-hero` class + scroll state).

## 8. Hero (full-width image)
`hero.png` now runs **full-bleed** behind the headline with a layered navy gradient
scrim for text legibility, a slow 14s ken-burns zoom-in on load, and subtle scroll
parallax. Content is bottom-anchored with an inline stat strip and a "scroll" cue.

## 9. ✦ Travelling-border buttons (high-tech comet outline)
The CTAs use an animated "comet" that continuously traces the pill outline — a faint
static ring with a bright leading head + glow circling the perimeter. Sleek, modern,
monospace-style uppercase label.

How it's built (pure CSS, no images, no JS dependency):
- A `conic-gradient(from var(--angle), …)` painted on `::before`, then **masked to a
  1.5px ring** via `mask-composite: exclude` so only the border shows.
- An `@property --angle` registers the angle as animatable, so `@keyframes beam`
  rotates it 0→360° smoothly (browsers without `@property` still show the gradient).
- A `drop-shadow` on the ring creates the neon glow; a solid `::after` is the pill fill.
- **Hover** speeds the orbit up (3.6s → 1.4s), intensifies the glow, and lifts 3px.

Three colour variants (comet hue set via the `--beam` custom property):
- `.btn` — blue comet (primary / nav)
- `.btn--gold` — gold comet (accent CTA)
- `.btn--clear` / `.btn--clear.on-dark` — white comet (secondary; `.on-dark` keeps it
  legible on the dark CTA/footer sections).

Under `prefers-reduced-motion` the comet is replaced by a calm, evenly-lit static
outline — no rotation.

## 10. Files
- `index.html`, `services.html`, `about.html`, `contact.html` — the four pages
- `styles.css` — design system + all styling (edit `:root` to retune)
- `script.js` — vanilla JS interactions, no dependencies
- Assets: `capstone_logo_1.png` (dark, on white), `capstone_logo_2.png` (white, on dark),
  `hero.png`
