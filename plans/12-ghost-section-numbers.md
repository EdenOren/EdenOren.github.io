# Plan: Feature/12 — Ghost Section Numbers

## Context

Each feature section already has a `SECTION_NUMBER` constant (e.g. `'01'`, `'02'`) defined in its
`*.constants.ts` file, exposed from its facade as a `readonly SECTION_NUMBER: string`, and rendered
in the template as a `<p class="[block]__section-number" aria-hidden="true">` element.
The About section's SCSS shows the established pattern: absolute positioning, Cormorant Garamond via
`text-display` mixin, very large `clamp()` font-size, low-contrast surface colour, `z-index: -1`.

Skills and Experience follow the same pattern. The `SectionHeaderComponent` in
`src/app/shared/components/section-header/` is not yet used by any feature — all sections render
their own heading markup directly.

## Approach

The ghost number is **not** moved into `SectionHeaderComponent`. Reasons:

1. Each section already owns its heading markup with unique layout concerns (About has a two-column
   grid; Experience has a dedicated `experience__header` wrapper; Skills mirrors that). Centralising
   into a shared component would fight those layouts.
2. The positioning anchor (`position: relative` parent, `z-index` stacking) differs per section.
3. No shared behaviour beyond pure CSS — there is no logic to reuse in TypeScript.

The correct approach is to **standardise the existing per-section pattern** so every section renders
its ghost number consistently, and then apply the ghost styling via a shared SCSS partial.

## i18n

Ghost numbers (`01`–`06`) are **not translated**. They are ordinal identifiers, not linguistic
content — the same numerals read identically in every locale. No i18n keys are needed. The existing
`aria-hidden="true"` attribute correctly excludes them from screen readers.

## SCSS Strategy

Extract the ghost-number visual rules into a new mixin `ghost-section-number` in
`src/styles/abstract/_mixins.scss`. Each section's `__section-number` element includes this mixin
rather than repeating the declarations. Rules the mixin encapsulates:

- `font-family`: Cormorant Garamond via the `$font-family-display` token
- `font-size`: `clamp(6rem, 15vw, 12rem)` — large enough to read as a watermark behind the heading
- `font-weight`: 700 (bold, for editorial weight at low opacity)
- `line-height`: 1
- `color`: `$color-surface-hover` (the existing About approach — dark, low-contrast against the
  background; no separate opacity property needed since the colour already provides the ghost effect)
- `position: absolute`
- `pointer-events: none`
- `user-select: none` (already handled by the `.no-select` utility class in the template)
- `z-index: -1`
- Offset: `top` and `left` values per section remain in the section's own SCSS block, as layout
  context varies (About offsets differ from Experience)

## Sections and Numbers

| Section    | Constant file               | Number |
|------------|-----------------------------|--------|
| About      | `about.constants.ts`        | `'01'` |
| Experience | `experience.constants.ts`   | `'02'` |
| Skills     | `skills.constants.ts`       | `'03'` |
| Projects   | `projects.constants.ts`     | `'04'` |
| Contact    | `contact.constants.ts`      | `'05'` |

Hero (`'00'` or omitted) is decorative-only and already has its own typographic treatment — exclude
from this feature unless design direction changes.

## Implementation Checklist

- [ ] Add `ghost-section-number` mixin to `src/styles/abstract/_mixins.scss` with the shared rules
      listed above (no positional offsets — those stay per-section).
- [ ] Audit all five feature sections (About, Experience, Skills, Projects, Contact) to confirm each
      has a `__section-number` element with `aria-hidden="true"` and the `.no-select` class.
      Add the element to any section that is missing it.
- [ ] Confirm each missing section has a `SECTION_NUMBER` constant in its `*.constants.ts` and the
      constant is exposed on the facade.
- [ ] In each section's `*.component.scss`, replace the inline ghost-number declarations with
      `@include mixins.ghost-section-number` inside the `&__section-number` block, then add only
      the per-section `top` / `left` offset values after the include.
- [ ] Confirm the parent wrapper of each `__section-number` element has `position: relative` so the
      absolute positioning resolves correctly.
- [ ] Confirm `z-index: 1` (or equivalent) is set on the `__heading` element in every section so
      the heading text sits above the ghost number when they overlap.
- [ ] Visual QA: check each section at desktop, tablet, and mobile viewport widths. The ghost
      numeral should bleed slightly behind the heading without pushing layout or causing overflow.
      Adjust `clamp()` bounds per section if needed, but keep them in the mixin call-site, not the
      mixin definition, so the mixin stays a single source of truth for non-size rules.
- [ ] Accessibility check: confirm all `__section-number` elements retain `aria-hidden="true"` so
      screen readers skip the decorative numeral.
