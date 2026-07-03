# Fix: mobile navbar menu unresponsive

## Root cause (confirmed via headless browser testing)

`.navbar__overlay` (`src/app/shared/components/navbar/navbar.component.scss:93-109`)
is `display: block` for the entire `< 768px` media query regardless of
`isMenuOpen()` — only its `opacity` is toggled by the `--visible` modifier.
It never gets `pointer-events: none` when invisible.

Because the overlay has an explicit `z-index: variables.$z-nav - 1` (99)
and the burger button has no explicit `z-index` (`auto` → 0), the overlay
stacks **above** the burger within `.navbar`'s stacking context, even
though it's fully transparent.

Result: on any mobile viewport, a full-viewport, invisible, click-catching
div sits on top of the navbar at all times — including over the burger
button itself. Tapping the hamburger icon hits the overlay, not the
button, so `toggleMenu()` never fires and the drawer can never be opened.
Confirmed with Playwright at 375×800:

```
getComputedStyle(overlay) → display: block, opacity: 0, pointer-events: auto, z-index: 99
document.elementFromPoint(burger center) === overlay   // true
```

This has been broken since the hamburger nav was introduced
(`3601b5b feat(responsive): mobile hamburger nav...`).

## Fix

In `navbar.component.scss`, give `.navbar__overlay` `pointer-events: none`
by default and only re-enable it when visible, so it stops intercepting
taps while hidden:

```scss
&__overlay {
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 60%);
  z-index: variables.$z-nav - 1;
  opacity: 0;
  pointer-events: none;
  transition: opacity variables.$transition-base;

  @media (max-width: #{variables.$breakpoint-md - 1px}) {
    display: block;
  }

  &--visible {
    opacity: 1;
    pointer-events: auto;
  }
}
```

No TypeScript or template changes needed — `toggleMenu()` / `closeMenu()`
in `navbar.facade.ts` are already correct; they just never received the
click.

## Verification plan

1. `ng serve`, open at a mobile viewport (or devtools device emulation).
2. Confirm `document.elementFromPoint()` over the burger now resolves to
   the burger button, not the overlay, while the menu is closed.
3. Tap burger → drawer slides in, overlay becomes visible and clickable.
4. Tap a nav link → scrolls to section and closes drawer.
5. Tap overlay (outside drawer) → closes drawer.
6. Re-run AXE checks per CLAUDE.md a11y standard (focus ring still visible
   on burger, `aria-expanded` still toggles correctly — unaffected by
   this change).

## Branch / PR

`bugfix/{issue-number}-mobile-menu-overlay` — number unknown, fill in
once an issue is filed or supplied. Targets `development`.
