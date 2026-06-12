# Plan: Shared UI Component Consolidation

**Branch:** `refactor/shared-ui-components`
**Target:** `development`

## Problem

The codebase has 3+ duplicate implementations of buttons, tags/pills, and badges — each feature re-styles the same visual patterns inline instead of using the shared component layer. `cta-button` exists but only covers the hero/contact CTAs; admin CRUD and confirm-dialog have their own raw `<button>` elements with local SCSS.

---

## Scope

### What we're consolidating

| Pattern | Current state | Files affected |
|---|---|---|
| Primary / save button | `.admin-crud__save-btn` (inline SCSS per section) | admin-experience, admin-projects, admin-skills |
| Outline / cancel button | `.admin-crud__cancel-btn`, `.confirm-dialog__cancel-btn` | same + confirm-dialog |
| Danger / delete button | `.admin-crud__delete-btn`, `.confirm-dialog__confirm-btn` | same + confirm-dialog |
| Ghost / add button | `.admin-crud__add-btn` | all 3 admin CRUD sections |
| Ghost / edit button | `.admin-crud__edit-btn` | all 3 admin CRUD sections |
| Tag / pill | `.admin-crud__tag`, `.admin-crud__pill`, `.skills__tag`, `.projects__card-tag`, `.experience__entry-tag` | 5 feature files |
| Badge | `.admin-crud__badge`, `.experience__entry-badge` | admin-experience, experience |

### What we're NOT touching

- `cta-button` hero/contact usage — already correct
- `icon-button` — already correct
- `section-header` — already correct
- Navbar buttons (`.navbar__burger`, `.navbar__theme-toggle`) — unique, contextual
- `image-upload__clear` — unique, contextual
- Form inputs/labels — out of scope for this refactor

---

## Changes

### 1. Extend `ButtonVariant` enum

**File:** `src/app/shared/enums/button.enums.ts`

Add variants:

```ts
export enum ButtonVariant {
  Filled   = 'filled',   // existing — accent bg, white text (save / primary CTA)
  Outline  = 'outline',  // existing — accent border, accent text → fills on hover (hero CTA)
  Ghost    = 'ghost',    // new — subtle border, muted text (add / edit / cancel)
  Danger   = 'danger',   // new — error-colored border, error text → fills on hover (delete)
}
```

The `Ghost` variant covers both the "add" (accent-tinted ghost) and "cancel" (neutral ghost) cases — they are the same visual treatment, different label content.

The `Danger` variant covers both the outline danger (`admin-crud__delete-btn`) and the filled danger (`confirm-dialog__confirm-btn`). We use a `size` input to distinguish compact admin rows from the dialog's normal-sized button. We do NOT create separate components — one variant handles both.

---

### 2. Update `cta-button` component

**File:** `src/app/shared/ui/cta-button/cta-button.component.ts`

Add:
- New `size` input: `ButtonSize` enum with values `Default` and `Compact`
- `isGhostVariant`, `isDangerVariant` computed signals
- Host class bindings for the new modifier classes

```ts
// New enum in button.enums.ts
export enum ButtonSize {
  Default = 'default',
  Compact = 'compact',
}
```

**File:** `src/app/shared/ui/cta-button/cta-button.component.scss`

Add styles for:
- `.cta-button--ghost` — `border: 1px solid $color-border`, `color: $color-text-muted`, hover → `color: $color-text`, `border-color: $color-text-muted`
- `.cta-button--danger` — `border: 1px solid color-mix(in srgb, $color-error 30%, transparent)`, `color: $color-error`, hover → `background: $color-error`, `color: white`, `border-color: $color-error`
- `.cta-button--compact` — `padding: $space-1 $space-3`, `font-size: $font-size-sm` (overrides default large padding)

---

### 3. Create `app-tag` shared UI component

**Location:** `src/app/shared/ui/tag/tag.component.ts`

A dumb inline element that renders a styled `<span>` with a `TagVariant` enum input.

```ts
export enum TagVariant {
  Default = 'default',  // neutral — monospace, muted text, border
  Accent  = 'accent',   // accent-colored border + text (e.g. "Current" badge)
}
```

The component renders a `<span class="tag tag--{variant}">` with `ng-content` inside.

No `app-badge` as a separate component — the `Accent` variant of `app-tag` covers the "Current" badge use case. The distinction between a "tag" and a "badge" is purely visual size and color, not structural.

**Selector:** `app-tag`

---

### 4. Replace inline button elements in admin CRUD

For each of the three admin CRUD components (admin-projects, admin-experience, admin-skills):

| Old element | New element |
|---|---|
| `<button class="admin-crud__add-btn">` | `<app-cta-button [variant]="ButtonVariant.Ghost" [size]="ButtonSize.Compact">` |
| `<button class="admin-crud__save-btn">` | `<app-cta-button [variant]="ButtonVariant.Filled" [size]="ButtonSize.Compact">` |
| `<button class="admin-crud__cancel-btn">` | `<app-cta-button [variant]="ButtonVariant.Ghost" [size]="ButtonSize.Compact">` |
| `<button class="admin-crud__edit-btn">` | `<app-cta-button [variant]="ButtonVariant.Ghost" [size]="ButtonSize.Compact">` |
| `<button class="admin-crud__delete-btn">` | `<app-cta-button [variant]="ButtonVariant.Danger" [size]="ButtonSize.Compact">` |
| `<span class="admin-crud__tag">` | `<app-tag>` |
| `<span class="admin-crud__pill">` | `<app-tag>` |
| `<span class="admin-crud__badge">` | `<app-tag [variant]="TagVariant.Accent">` |

Because `app-cta-button` wraps a `<button>`, the host component must forward the `disabled` and `(click)` bindings at the wrapper level. The component already handles `[disabled]` input — no change needed.

Remove the replaced CSS rules from each component's `.scss` file.

---

### 5. Replace inline button elements in `confirm-dialog`

| Old element | New element |
|---|---|
| `<button class="confirm-dialog__cancel-btn">` | `<app-cta-button [variant]="ButtonVariant.Ghost">` |
| `<button class="confirm-dialog__confirm-btn">` | `<app-cta-button [variant]="ButtonVariant.Danger">` |

Remove `&__cancel-btn` and `&__confirm-btn` blocks from `confirm-dialog.component.scss`.

---

### 6. Replace inline tags in feature components

| File | Old | New |
|---|---|---|
| `skills.component.html` | `<span class="skills__tag">` | `<app-tag>` |
| `projects.component.html` | `<span class="projects__card-tag">` | `<app-tag>` |
| `experience.component.html` | `<span class="experience__entry-tag">` | `<app-tag>` |
| `experience.component.html` | `<span class="experience__entry-badge">` | `<app-tag [variant]="TagVariant.Accent">` |

Remove the replaced CSS rules. Keep any layout rules (gap, flex-wrap on the container) in the feature SCSS.

---

## File summary

### New files
- `src/app/shared/ui/tag/tag.component.ts`
- `src/app/shared/ui/tag/tag.component.scss`

### Modified files
- `src/app/shared/enums/button.enums.ts` — add `ButtonVariant.Ghost`, `ButtonVariant.Danger`, `ButtonSize` enum
- `src/app/shared/ui/cta-button/cta-button.component.ts` — add `size` input + new computed signals
- `src/app/shared/ui/cta-button/cta-button.component.scss` — add `--ghost`, `--danger`, `--compact` modifier styles
- `src/app/features/admin/components/admin-projects/admin-projects.component.{html,scss,ts}`
- `src/app/features/admin/components/admin-experience/admin-experience.component.{html,scss,ts}`
- `src/app/features/admin/components/admin-skills/admin-skills.component.{html,scss,ts}`
- `src/app/shared/components/confirm-dialog/confirm-dialog.component.{html,scss,ts}`
- `src/app/features/skills/skills.component.{html,scss}`
- `src/app/features/projects/projects.component.{html,scss}`
- `src/app/features/experience/experience.component.{html,scss}`

---

## Implementation order

1. `button.enums.ts` — add `Ghost`, `Danger`, `ButtonSize`
2. `cta-button` — add size input + new variant styles
3. `tag` component — create new
4. `confirm-dialog` — swap buttons, remove dead CSS
5. Admin CRUD (experience, projects, skills) — swap buttons + tags, remove dead CSS
6. Feature components (skills, projects, experience) — swap tags, remove dead CSS

---

## Non-goals

- No new `app-input` / `app-textarea` components (separate refactor)
- No Storybook or component catalogue
- No changes to hero/contact `cta-button` usage
- No changes to form structure or Signal Forms bindings
