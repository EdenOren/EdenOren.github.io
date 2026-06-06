# Plan: feature/17-responsive-layout

## Goal
Make the portfolio fully responsive across mobile (320px+), tablet (768px+), and desktop (1024px+).

---

## What's already working

| Feature | Status |
|---|---|
| `respond-to()` mixin (mobile-first, min-width) | ✅ in `_mixins.scss` |
| `container` mixin with responsive `padding-inline` | ✅ |
| Breakpoint tokens (`sm/md/lg/xl`) | ✅ in `_variables.scss` |
| Hero: fluid `clamp()` typography | ✅ |
| About: `1fr` → `5fr 7fr` at `lg` | ✅ |
| Skills: column → 3-col grid at `md` | ✅ |
| Projects: 1-col → 2-col grid at `md` | ✅ |
| Contact: single-column, fluid | ✅ |
| `flex-wrap: wrap` on hero CTAs | ✅ |

---

## Gaps to fix

### 1. `_mixins.scss` — add `section-padding` mixin

All sections hardcode `padding-block: $space-24` (6rem) with no mobile reduction. Add:

```scss
@mixin section-padding {
  padding-block: variables.$space-12;          // mobile: 3rem

  @include respond-to(md) {
    padding-block: variables.$space-16;        // tablet: 4rem
  }
  @include respond-to(lg) {
    padding-block: variables.$space-24;        // desktop: 6rem
  }
}
```

Apply to: **hero, about, experience, skills, projects, contact** (swap out their current `padding-block` line).

---

### 2. Navbar — mobile hamburger menu (biggest change)

The nav links are always visible — on a 375px screen they overflow or compress badly.

**Component (`navbar.component.ts`):**
- Add `isMenuOpen = signal(false)`
- Add `toggleMenu()` / `closeMenu()` methods
- On route change: `Router.events` → `closeMenu()`
- On menu open: lock body scroll (`document.body.style.overflow = 'hidden'`), undo on close
- Use `effect()` to sync overflow lock with `isMenuOpen`

**Template (`navbar.component.html`):**
- Add `<button class="navbar__burger">` — visible below `md`, hidden above
- Burger shows 3 lines → animates to ✕ when open (`--open` modifier)
- Move `<nav class="navbar__links">` into its own overlay panel
  - Hidden off-screen on mobile, slides in when `isMenuOpen()`
  - Full-screen backdrop overlay to catch outside-click to close
  - Each nav link calls `closeMenu()` on click

**SCSS (`navbar.component.scss`):**
```
navbar__burger     — 44×44px touch target, 3 lines → ✕ with CSS transition
navbar__overlay    — position: fixed, inset: 0, z-index above content, backdrop
navbar__drawer     — position: fixed, right: 0, top: 4rem, width: min(280px, 85vw)
                     slide-in from right: transform translateX(100%) → translateX(0)
navbar__links      — hidden (display: none) below md; visible (display: flex) above md
```

Above `md`, overlay and drawer are hidden; nav renders inline as before.

---

### 3. Experience timeline — mobile collapse

Current: `grid-template-columns: 4rem 2rem 1fr` — no mobile override.

On mobile (base), collapse to 2-column and move the year inline:
```scss
// base (mobile)
grid-template-columns: 1.5rem 1fr;   // marker + content

// at sm
grid-template-columns: 3.5rem 1.5rem 1fr;  // year + marker + content
```

The `__entry-year` gets `display: none` on mobile; add a new `__entry-year--inline` element shown only on mobile (above the role title), hidden at `sm`.

---

### 4. About — portrait frame responsive size

Current: fixed `width: 280px; height: 340px`. On small phones (< 360px) this bleeds the layout.

```scss
&__frame {
  width: min(280px, 75vw);
  aspect-ratio: 280 / 340;
  height: auto;
}
```

The `aspect-ratio` replaces the fixed `height` and scales proportionally.

---

### 5. Touch targets

Wrap nav links and action buttons with enough padding so the tap target is ≥ 44px vertically. Already met for CTAs (they have `padding-block: $space-3 = 0.75rem` × 2 = 1.5rem + line-height). For nav `__link`, add on mobile:

```scss
@media (pointer: coarse) {
  min-height: 44px;
}
```

---

### 6. Hero — `padding-block` already covered by §1

The hero has `min-height: 100vh` + `align-items: center`, so on mobile the section fills the screen. Replacing `padding-block: $space-24` with the `section-padding` mixin prevents content clipping when the viewport is short (landscape mobile).

---

## Breakpoint summary

| Breakpoint | Token | Width | Target |
|---|---|---|---|
| base | — | 320px+ | Single-column, hamburger nav |
| `sm` | `$breakpoint-sm` | 640px+ | Experience year column shows |
| `md` | `$breakpoint-md` | 768px+ | Desktop nav, projects 2-col, skills 3-col |
| `lg` | `$breakpoint-lg` | 1024px+ | About 2-col |
| `xl` | `$breakpoint-xl` | 1280px+ | (no new changes needed) |

---

## Files changed

| File | Change |
|---|---|
| `_mixins.scss` | Add `section-padding` mixin |
| `hero.component.scss` | Use `section-padding` |
| `about.component.scss` | Use `section-padding`, fluid frame size |
| `experience.component.scss` | Use `section-padding`, mobile timeline grid |
| `experience.component.html` | Add `__entry-year--inline` element |
| `skills.component.scss` | Use `section-padding` |
| `projects.component.scss` | Use `section-padding` |
| `contact.component.scss` | Use `section-padding` |
| `navbar.component.ts` | Add `isMenuOpen` signal, close-on-nav, scroll lock |
| `navbar.component.html` | Add burger button, overlay, drawer |
| `navbar.component.scss` | Burger styles, drawer slide-in, media queries |

---

## Out of scope for this branch

- Scroll-reveal directive (feature/11)
- Ghost section numbers (feature/12)
- Dark/light mode toggle
