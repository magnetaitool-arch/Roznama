# Magnet — Design System

> **MADE TO MATTER**

Magnet is a bold, confident, no-fluff marketing agency. This design system encodes
its look: **high-contrast, minimal, modern** — a black canvas, sharp white type, and
**one electric lime accent** (`#C4FF3D`) that does all the talking. Premium tech-brand
energy, not busy "agency" clutter.

**Personality:** Direct · Premium · Energetic · Clean · Egyptian-modern
**Avoid:** Cluttered · pastel · corporate-stock · gradient-heavy · "templatey"

## Sources

This system was authored from a brand reference, not a codebase or Figma file:
- `uploads/magnet-design-system.md` — the canonical brand spec (color, type, layout, voice).
- `uploads/557470792_690407037414850_6784997763361343074_n.jpg` — the official "Magnet." logo lockup on black (cropped into `assets/`).

There is no product app — a marketing agency's primary surface is its own **website**,
which is recreated as the UI kit (`ui_kits/website/`).

---

## CONTENT FUNDAMENTALS — how Magnet writes

- **Short, direct, confident.** No filler, no jargon, no hedging. Every line earns its place.
- **Benefits and outcomes, not features.** "Built to pull. Made to matter." — not "we offer integrated solutions."
- **Headline formula:** a bold claim + ONE lime keyword. e.g. **WE MAKE BRANDS _MATTER_.**
- **Casing:** headlines are UPPERCASE and tight; body is sentence case; labels/eyebrows are UPPERCASE with wide tracking.
- **Voice/person:** speaks as "we" to "you" — partner energy, never corporate third-person.
- **Frameworks:** AIDA / PAS for landing copy.
- **No emoji.** Ever. Energy comes from type, contrast, and the lime — not decoration.
- **Arabic copy** carries the same punch: modern, conversational Egyptian — never stiff or formal.
- **Examples:** "We make brands matter." · "From quiet to category leader in nine months." · "Ready to matter?" · "Made to pull."

---

## VISUAL FOUNDATIONS

**Color.** 60% black/dark · 30% white/paper · 10% lime — and **lime is the only accent**.
Lime is loud: one CTA, one highlighted word, one shape, or thin lines per view (5–10% max).
Lime text only on black/dark — **never lime text on white** (use ink, or lime as a fill/mark instead).
Black text **on** lime is encouraged (buttons, highlight blocks). Depth comes from the neutral
ink scale (`#0A0A0A → #1C1C1C → #3A3A3A`), not from new hues.

**Type.** Display = **Archivo** (Black/ExtraBold), UPPERCASE, tracking −2%, line-height ~1.0 —
punchy 2–6 word statements. Body/UI = **Inter** (400/500/600), 16px, line-height 1.6, left-aligned.
Arabic = **Cairo** (headlines) + **Tajawal** (body), full RTL, right-aligned. Never mix Latin and
Arabic inside one headline. *(All four families are Google Fonts — see Caveats.)*

**Spacing & layout.** 8px base unit; spacing in multiples (8/16/24/32/48/64/96). Generous negative
space is part of the brand — let things breathe. 12-column grid, 1200px max content width, 24px
gutters. Social posts use an ~80px inner margin on a 1080 canvas.

**Backgrounds.** Solid — almost always Magnet Black, occasionally a Paper section for contrast.
**No gradients.** No photographic or textured backgrounds by default. Visual interest comes from
oversized typographic/geometric motifs (a giant `]` bracket, a lime block) sitting in `--ink-700`,
not from imagery.

**Shape & corners.** Pick ONE corner mode per project and hold it: soft (8–12px, the default
`--radius-md: 10px`) or fully sharp (0, editorial). Badges/chips are pill. Flip the whole system
with `[data-corners="sharp"]`.

**Borders & lines.** Thin 1px dividers — `--ink-500` on dark, `--grey-200` on light. The signature
accent is a **thick lime underline / 48px rule** (`<Divider accent />`). Lime lines used sparingly.

**Shadows.** Restrained. The dark canvas leans on **borders, not shadows**. Shadows appear only in
the Paper (light) context on white cards (`--shadow-card`). No glows except the subtle lime focus ring.

**Cards.** On black: `--ink-700` fill, 1px `--ink-500` border, white text, lime reserved for one
stat/label — or one fully lime card per grid to draw the eye. On paper: white fill, 1px `--grey-200`
border, subtle shadow.

**Motion.** Quick and subtle. `--ease-out` (cubic-bezier .2 .7 .2 1), 120–360ms. Buttons **lift 2px**
on hover (primary lifts toward white); press **shrinks ~3%**. Cards lift 4px. No bounces, no parallax,
no infinite decorative loops.

**Hover / press states.** Hover = lift + subtle background lift (lime→white for primary, faint white
wash for secondary/ghost). Press = scale down slightly. Focus = lime border + soft lime glow ring.

**Transparency & blur.** Used only for the sticky nav (`rgba(10,10,10,.72)` + `backdrop-filter: blur`).
Not used decoratively elsewhere.

**Imagery (when used).** High-contrast, real, slightly desaturated. Add a solid black or lime overlay
block for text legibility. Avoid generic smiling-stock people. Keep the logo off busy photos unless on
a solid backing block.

---

## ICONOGRAPHY

Magnet has **no bundled icon font or custom SVG set** in the source material. The spec calls for:
**line-style icons, 2px stroke, single color** (white, black, or lime), one consistent set — no mixed styles.

- **Recommendation / substitution:** use **[Lucide](https://lucide.dev)** (2px stroke, geometric,
  single-color) as the closest match to the spec. Load from CDN and color via `currentColor` so icons
  inherit white / lime / ink from context. *(This is a substitution — flagged in Caveats; swap for an
  official Magnet set if one exists.)*
- **Emoji:** never used.
- **Unicode marks** *are* part of the brand language used as "icons": the arrow `→` (U+2192) in CTAs,
  brackets `[ ]`, and the lime dot/period from the logo. These appear throughout the kit instead of
  drawn glyphs.
- **Stroke weight** for any icon = `--border-2` (2px), matching the lime underline weight.

---

## VISUAL FOUNDATIONS INDEX (this repo)

**Tokens** (`tokens/`, all `@import`ed by root `styles.css`)
- `colors.css` — core palette, neutral scale, semantic aliases + `[data-theme="light"]` scope.
- `typography.css` — families, weights, scale, tracking, utility classes, RTL rules.
- `spacing.css` — 8px scale + grid/layout tokens.
- `radii.css` — radii, borders, restrained elevation, motion easings/durations + `[data-corners="sharp"]`.
- `fonts.css` — Archivo / Inter / Cairo / Tajawal (Google Fonts).

**Components** (`components/`, bundled to `window.MagnetDesignSystem_862266`)
- `core/` — `Button`, `Badge`, `Tag`, `SectionLabel`
- `surfaces/` — `Card`, `Stat`, `Divider`
- `forms/` — `Input`
- `brand/` — `Logo`

**UI kit** (`ui_kits/`)
- `website/` — full marketing-site recreation (Nav, Hero, Services, Proof, Contact, Footer).

**Foundation cards** (`guidelines/`) — specimen HTML rendered in the Design System tab
(Colors, Type, Spacing, Brand groups).

**Assets** (`assets/`)
- `magnet-logo.png` — white wordmark, transparent bg (for dark).
- `magnet-logo-dark.png` — ink wordmark, transparent bg (for paper/white).
- `magnet-logo-black.png` — wordmark on solid black.
- `magnet-logo-square.jpg` — original 1080×1080 social lockup.

**Other**
- `SKILL.md` — makes this folder usable as a downloadable Agent Skill.

---

## CAVEATS

- **Fonts load from Google Fonts CDN** (`tokens/fonts.css`) rather than self-hosted binaries.
  All four families (Archivo, Inter, Cairo, Tajawal) match the brand spec exactly — no visual
  substitution — but consumers need network access, and the DS "Fonts" panel will read 0 self-hosted
  faces. Drop in `.woff2` files + local `@font-face` rules if you need offline/self-hosted.
- **Icons are a substitution** — the brand had no icon assets, so Lucide (CDN) is recommended as the
  closest match to the "2px line, single color" spec. Replace if an official set exists.
- **Logo is raster** (cropped from the supplied JPG, alpha-knocked-out). A clean vector wordmark would
  be sharper at large sizes — please supply an SVG if available.
