# Portfolio Design Plan — "Signal Luxe"

## Concept
Dark editorial precision. Elegant serif display type paired with a clean, familiar geometric sans.
Warm dark surfaces. One unforgettable emerald accent.

---

## Palette

| Token             | Value     | Role                      |
|-------------------|-----------|---------------------------|
| `--bg`            | `#0A0A0A` | Page background           |
| `--surface`       | `#141414` | Cards, panels             |
| `--surface-hover` | `#1C1C1C` | Hover states              |
| `--text`          | `#F2F0EB` | Primary text (warm white) |
| `--text-muted`    | `#7A7870` | Secondary / metadata      |
| `--accent`        | `#1A9E65` | Dark emerald — accent hit |
| `--border`        | `#242424` | Subtle dividers           |

---

## Typography

| Role          | Font           | Notes                                 |
|---------------|----------------|---------------------------------------|
| Display/Title | Cormorant       | Name, section numbers, major headings |
| UI / body     | Geist           | Nav, labels, body, inputs, footer     |
| Code / labels | JetBrains Mono  | Already in project                    |

Google Fonts CDN. Cormorant for display elegance; Geist is the widespread developer-community favorite — clean, geometric, not fancy.

**Font size rule:** All UI text (nav, body, labels, inputs, footer, tags) uses one size: `1rem`. Only headings and titles get different sizes.

---

## User Select

`user-select: none` applied to:
- All heading elements (`h1`–`h4` within `.section-header`, hero title, etc.)
- Footer text
- Buttons and CTAs
- Navbar links and logo

Apply via the global `.no-select` class in the template. Never via a mixin or placeholder.

---

## Layout Signature

- **Left rail** — persistent `1px` `--accent` vertical line, full viewport height, section dot-indicators
- **Ghost numbers** — `01`–`06` in Cormorant at ~20vw, `5% opacity`, behind section headings
- **Section headings** — Cormorant, bleed slightly past column grid

---

## Sections

### Navbar
- Fixed, `backdrop-filter: blur` on scroll
- `E. Oren` in small Cormorant italic (left) — `user-select: none`
- Nav links in Geist uppercase + emerald underline `scaleX` reveal (right) — `user-select: none`
- Active section: emerald dot `●` indicator

### Hero (100vh)
- Name in Cormorant, 2-line break, ~10vw — `user-select: none`
- "Frontend Developer" in Geist uppercase, `--accent` color — `user-select: none`
- Tagline in JetBrains Mono, muted
- CTAs: outline (`--accent` border) + filled (`--accent` bg) — `user-select: none`
- Background: noise texture layer 4% opacity + slow pulsing radial gradient at bottom-right
- Staggered entry animations (CSS `animation-delay`)

### About (asymmetric 2-col)
- Left: bio paragraphs + stack highlights list
- Right: portrait frame — emerald border, 2° tilt, overflow clipped + social icons below
- Ghost `01` behind heading

### Experience (timeline)
- Oversized ghost year far left
- Company + role on right, dashed connector
- Scroll-triggered reveal via IntersectionObserver → `.is-visible` class

### Skills (grouped tags)
- Three categories: Frontend / Tools & DevOps / Other
- Pill tags, emerald border on hover
- Category label: Geist uppercase + short emerald leading bar

### Projects (2-col grid)
- Cards: `--surface` bg, `1px` border
- Top: gradient color block (project-specific or emerald-to-dark)
- Hover: `translateY -4px`, emerald bottom border
- Links: GitHub + Live Demo in mono

### Contact (centered)
- Heading in Cormorant large — `user-select: none`
- Minimal form: name / email / message
- Full-width `--accent` submit button with loading state — `user-select: none`
- Direct email in mono below form

### Footer
- Single line: `© 2026 Eden Oren` + social icons (right) — `user-select: none`
- Small Geist uppercase, `1rem`

---

## Motion Budget

| Trigger       | Effect                                                              |
|---------------|---------------------------------------------------------------------|
| Page load     | Staggered hero reveal, CSS `@keyframes` + `animation-delay`        |
| Scroll        | IntersectionObserver → `.is-visible` → `opacity 0→1` + `translateY 24px→0` |
| Hover         | `transition: 200ms ease` on all interactive elements                |
| Left rail dot | Smooth `top` transition tracking scroll                             |

---

## SCSS Changes Required

`_colors.scss`:
```scss
$color-bg: #0A0A0A;
$color-surface: #141414;
$color-surface-hover: #1C1C1C;
$color-text: #F2F0EB;
$color-text-muted: #7A7870;
$color-accent: #1A9E65;
$color-border: #242424;
```

`_variables.scss`:
```scss
$font-family-display: 'Cormorant', Georgia, serif;
$font-family-base: 'Geist', system-ui, sans-serif;
$font-family-mono: 'JetBrains Mono', monospace;
$font-size-base: 1rem; // All UI text. Only titles/headings deviate.
```

`styles.scss` — `.no-select { user-select: none }` global utility class (already added).

`index.html` — add Google Fonts link for Cormorant + Geist.

---

## Implementation Order

1. `feature/1-design-tokens` — `_colors.scss`, `_variables.scss`, `_mixins.scss`, `index.html`
2. `feature/2-navbar`
3. `feature/3-hero`
4. `feature/4-about`
5. `feature/5-experience`
6. `feature/6-skills`
7. `feature/7-projects`
8. `feature/8-contact`
9. `feature/9-translate-service`
10. `feature/10-github-pages-deploy`
11. `feature/11-scroll-reveal-directive`
12. `feature/12-ghost-section-numbers`
13. `feature/13-seo-open-graph`
14. `feature/14-skeleton-loaders`
15. `feature/15-admin-panel`
16. `feature/16-cv-download`
