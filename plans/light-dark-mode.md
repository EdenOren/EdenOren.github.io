# Plan: Light / Dark Mode Toggle

## Goal
Add a theme toggle to the navbar that switches between the existing dark "Signal Luxe" palette and a warm light counterpart, persisted to `localStorage` with `prefers-color-scheme` as the initial default.

---

## Palette

### Dark (current, unchanged)
| Token | Value |
|---|---|
| `--color-bg` | `#0A0A0A` |
| `--color-surface` | `#141414` |
| `--color-surface-hover` | `#1C1C1C` |
| `--color-text` | `#F2F0EB` |
| `--color-text-muted` | `#7A7870` |
| `--color-accent` | `#1A9E65` |
| `--color-border` | `#242424` |
| `--color-success` | `#1A9E65` |
| `--color-error` | `#D94F4F` |
| `--color-warning` | `#C68B2E` |

### Light (new — warm parchment, keeps Signal Luxe feel)
| Token | Value |
|---|---|
| `--color-bg` | `#F5F3EF` |
| `--color-surface` | `#EBEBEB` |
| `--color-surface-hover` | `#E1E0DC` |
| `--color-text` | `#111111` |
| `--color-text-muted` | `#6B6865` |
| `--color-accent` | `#1A9E65` (unchanged) |
| `--color-border` | `#D4D1CC` |
| `--color-success` | `#1A9E65` |
| `--color-error` | `#D94F4F` |
| `--color-warning` | `#C68B2E` |

---

## Architecture

### SCSS Strategy — CSS Custom Properties with SCSS variable wrappers
Convert `_colors.scss` so each `$color-*` variable wraps the corresponding CSS custom property:

```scss
// _colors.scss
:root {
  --color-bg: #0A0A0A;
  // ... dark defaults
}

[data-theme="light"] {
  --color-bg: #F5F3EF;
  // ... light overrides
}

// SCSS vars remain — all existing component SCSS works unchanged
$color-bg: var(--color-bg);
$color-surface: var(--color-surface);
// ...
```

**Caveat:** SCSS color functions (`darken()`, `lighten()`, `color.mix()`) cannot act on `var()` references. A grep of the codebase for these calls must be done before implementation — any found must be converted to explicit values in both theme blocks.

### ThemeService
`ThemeService` already has the signal stub. The full implementation:
- On `init()`: read `localStorage` key → fall back to `prefers-color-scheme` → apply `data-theme` attr to `document.documentElement`
- `toggle()`: flip signal, write to `localStorage`, update `data-theme` attr
- Expose `readonly isDark: Signal<boolean>` computed from `theme`

### Initialization
Add to `app.config.ts`:
```ts
provideAppInitializer(() => inject(ThemeService).init()),
```

### Toggle Button in Navbar
- Wired through `NavbarFacade` (inject `ThemeService`, expose `isDark` and `toggleTheme()`)
- `NavbarComponent` exposes them to the template
- Button placed between nav links and social share — uses existing `navbar__link` button pattern (no new component needed for the toggle itself)
- Icons: SVG mask pattern matching `IconButtonComponent`'s approach — `sun.svg` and `moon.svg` in `public/icons/`

---

## Files to Change

| # | File | Change |
|---|---|---|
| 1 | `core/enums/core.enums.ts` | Add `LocalStorageKeys.Theme = 'eo:portfolio:theme'` |
| 2 | `styles/abstract/_colors.scss` | Migrate to CSS custom properties + SCSS var wrappers |
| 3 | `core/services/platform/theme.service.ts` | Implement `init()`, `toggle()`, `isDark` |
| 4 | `app.config.ts` | Add `provideAppInitializer` for `ThemeService.init()` |
| 5 | `shared/components/navbar/facades/navbar.facade.ts` | Inject `ThemeService`, expose `isDark` + `toggleTheme()` |
| 6 | `shared/components/navbar/navbar.component.ts` | Expose `isDark` + `toggleTheme` from facade |
| 7 | `shared/components/navbar/navbar.component.html` | Add toggle button |
| 8 | `shared/components/navbar/navbar.component.scss` | Style toggle button |
| 9 | `public/icons/sun.svg` | Sun icon (inline SVG, no external dependency) |
| 10 | `public/icons/moon.svg` | Moon icon |
| 11 | `src/assets/i18n/en.json` | Add `NAV.TOGGLE_THEME_DARK` / `TOGGLE_THEME_LIGHT` aria-label keys |

---

## Toggle Button Design

The toggle sits in the navbar, visually consistent with the existing icon button style. On desktop it appears in the nav row; on mobile inside the drawer.

```html
<button
  class="navbar__theme-toggle no-select"
  type="button"
  [attr.aria-label]="isDark() ? t['TOGGLE_THEME_LIGHT'] : t['TOGGLE_THEME_DARK']"
  (click)="toggleTheme()"
>
  <span
    class="navbar__theme-toggle-icon"
    [style.maskImage]="'url(' + (isDark() ? '/icons/sun.svg' : '/icons/moon.svg') + ')'"
    aria-hidden="true"
  ></span>
</button>
```

SCSS: same mask-image + `background-color: currentColor` pattern used in `icon-button`.

---

## Accessibility
- `aria-label` switches between "Switch to light mode" / "Switch to dark mode"
- No `outline: none` without replacement focus style
- Transition on background/color is `$transition-base` — respects `prefers-reduced-motion` via existing reset or an added `@media (prefers-reduced-motion: reduce)` guard

---

## Out of Scope
- Per-component theme-aware illustrations or images
- Admin panel theming (can follow separately)
- Animated icon morph between sun/moon (keep it simple)
