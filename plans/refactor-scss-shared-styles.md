# Plan: refactor/scss-shared-styles

## Goal

1. Fix `about.component.scss` budget violation (6.69 kB vs 4 kB limit).
2. Eliminate duplicated SCSS patterns across the 5 section components.

## Root Cause Analysis

### Budget violation — `about.component.scss`
The three inline SVG data URIs embedded in `mask-image` properties account for ~2.5 kB of the
compiled output. Extracting them to asset files brings the component stylesheet back under budget.

### Duplicated patterns (no new bugs, just waste)
| Pattern | Files |
|---|---|
| `&__heading::after` accent bar (5 props) | `about`, `experience`, `projects`, `skills`, `contact` |
| `@keyframes content-reveal` + `.content-reveal` class | `experience`, `projects`, `skills` |
| Pill tag style (mono, border, pad, radius) | `experience` `__entry-tag`, `projects` `__card-tag`, `skills` `__tag` |

---

## Approach

### A. Extract SVG icons to asset files (budget fix)
Create `src/assets/icons/{github,linkedin,mail}.svg` and replace the data URI strings in
`about.component.scss` with `mask-image: url('/assets/icons/name.svg')`.

No template changes needed — the `[data-icon]` attribute selectors remain identical.

### B. Add `@mixin heading-accent-bar` to `_mixins.scss`
Captures the repeated `::after` underline shared by all five section headings:
```scss
@mixin heading-accent-bar {
  &::after {
    content: '';
    display: block;
    width: 2.5rem;
    height: 2px;
    background-color: colors.$color-accent;
    margin-top: variables.$space-4;
  }
}
```
Replace the inline block in each section's `&__heading` rule.

### C. Move `content-reveal` to `styles.scss`
The `content-reveal` class is applied by the scroll-reveal directive — it is a global utility,
not component-scoped. Moving it to `styles.scss` (next to `.scroll-reveal`) and removing the
three copies from `experience`, `projects`, and `skills` is the correct layer.

### D. Add `@mixin pill-tag` to `_mixins.scss`
```scss
@mixin pill-tag {
  @include text-mono;
  font-size: 0.75rem;
  color: colors.$color-text-muted;
  background-color: colors.$color-surface;
  border: 1px solid colors.$color-border;
  padding: 2px variables.$space-3;
  border-radius: 2px;
}
```
Apply in `experience.__entry-tag`, `projects.__card-tag`, `skills.__tag`
(hover overrides stay inline per component since they differ slightly).

---

## Files Changed

| File | Change |
|---|---|
| `src/assets/icons/github.svg` | **new** — SVG icon |
| `src/assets/icons/linkedin.svg` | **new** — SVG icon |
| `src/assets/icons/mail.svg` | **new** — SVG icon |
| `src/styles/abstract/_mixins.scss` | add `heading-accent-bar`, `pill-tag` |
| `src/styles.scss` | add `content-reveal` keyframe + class |
| `src/app/features/about/about.component.scss` | replace data URIs with asset paths, use `heading-accent-bar` |
| `src/app/features/experience/experience.component.scss` | use `heading-accent-bar`, `pill-tag`; remove `content-reveal` |
| `src/app/features/projects/projects.component.scss` | use `heading-accent-bar`, `pill-tag`; remove `content-reveal` |
| `src/app/features/skills/skills.component.scss` | use `heading-accent-bar`, `pill-tag`; remove `content-reveal` |
| `src/app/features/contact/contact.component.scss` | use `heading-accent-bar` |

**Files not touched:** `navbar.*`, `admin.*`, `app.routes.ts`, `index.html`, `hero.*` — zero
overlap with `feature/15-admin-panel`, so no merge conflicts.

---

## Merge Safety

This branch only modifies:
- Global SCSS partials (`_mixins.scss`, `styles.scss`) — not in admin branch
- The 5 section component SCSS files — not in admin branch
- New asset files — not in admin branch

`feature/15-admin-panel` modifies `navbar.*`, `admin.*`, `app.routes.ts`, `index.html`.
No file appears in both branches → clean merge in both directions.

---

## Success Criteria
- `ng build` produces zero errors and zero budget warnings
- `about.component.scss` compiled output < 4 kB
- No visual regression (accent bars, tag pills, reveal animations unchanged)
