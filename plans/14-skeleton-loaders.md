# Plan: feature/14-skeleton-loaders

## Current State Assessment

### SkeletonLoaderComponent — needs extending
The existing component (`src/app/shared/components/skeleton-loader/`) accepts only `height` and `width` string inputs and renders a single bar. The shimmer gradient uses hard-coded light colours (`#e0e0e0`, `#f0f0f0`) that clash with the dark Signal Luxe palette. It has no concept of layout variant (card, timeline row, pill group).

### Loading state in facades — none exist yet
All three facades (`ExperienceFacade`, `ProjectsFacade`, `SkillsFacade`) hold static in-memory arrays (`ENTRIES`, `PROJECTS`, `GROUPS`). There is no async fetch and therefore no `isLoading` signal on any facade. The feature requires simulating a brief loading phase so skeletons are visible on first render.

---

## Design Decisions

### Component inputs
Add a `type` input with enum `SkeletonType { Bar = 'bar', Card = 'card', Timeline = 'timeline', Pill = 'pill' }` (lives in `src/app/shared/enums/skeleton-type.enum.ts`). Keep `height` and `width` for the `bar` type. Add a `count` input (number, default 3) for repeated items. Remove the single-bar-only template and replace with a `@switch` on `type()` that renders a purpose-built layout for each variant:
- `timeline` — role title bar + company/date bar + three description lines + tag pill row
- `card` — full-width card with title + two description bars + tag pill row + two link buttons
- `pill` — a group label bar + a row of N pill-shaped bars

### Shimmer animation
Define `@keyframes skeleton-shimmer` in the component SCSS. Use the dark palette: base colour maps to `$color-surface` (`#141414`), shimmer highlight maps to `$color-surface-hover` (`#1C1C1C`) with a subtle `$color-accent`-tinted midpoint at very low opacity to stay on-theme. Animate `background-position` left-to-right over 1.8 s, infinite. Apply the animation class to every skeleton bar element via a shared BEM modifier `skeleton-loader--shimmer` so the keyframes only need declaring once.

### Simulated loading state
Because the data is static and in-memory, introduce a short simulated delay. Each facade gains a private `WritableSignal<boolean>` initialised to `true`, flipped to `false` inside a one-time `effect()` that fires after the initial render (or use `setTimeout` of ~600 ms inside the constructor — document the reason: simulating realistic async latency). Expose a public `readonly isLoading: Signal<boolean> = computed(...)` derived from the private signal. All three facades need this addition.

---

## Template Integration

In each feature component template, replace the current direct rendering with:

```
@if (facade.isLoading()) {
  <app-skeleton-loader [type]="SkeletonType.Timeline" [count]="3" />
} @else {
  <!-- existing content -->
}
```

- `ExperienceComponent` — `type="timeline"`, `count` matches `ENTRIES.length` (3)
- `ProjectsComponent` — `type="card"`, `count` matches `PROJECTS.length` (4)
- `SkillsComponent` — `type="pill"`, `count` matches `GROUPS.length` (3)

Import `SkeletonLoaderComponent` and `SkeletonType` in each feature component's `imports` array and expose `SkeletonType` as a `protected readonly` class property so the template can reference it.

---

## Implementation Checklist

1. Create `src/app/shared/enums/skeleton-type.enum.ts` — define `SkeletonType` enum with `Bar`, `Card`, `Timeline`, `Pill` values.
2. Extend `SkeletonLoaderComponent` — add `type` input (`SkeletonType`, default `Bar`) and `count` input (`number`, default 3). Update template to `@switch (type())` with a layout block per variant. Update SCSS to dark palette shimmer, remove hard-coded light colours.
3. Update `ExperienceFacade` — add `private readonly loading` writable signal, flip after delay, expose `readonly isLoading: Signal<boolean>`.
4. Update `ProjectsFacade` — same `isLoading` pattern.
5. Update `SkillsFacade` — same `isLoading` pattern.
6. Update `experience.component.html` — wrap content in `@if`/`@else` using `facade.isLoading()`. Add `SkeletonLoaderComponent` to `imports`.
7. Update `projects.component.html` — same pattern with `type="card"`.
8. Update `skills.component.html` — same pattern with `type="pill"`.
9. Add `SKELETON_LOADERS` i18n key group to `en.json` if any aria-labels are needed for screen-reader announcements (`aria-label="Loading experience…"` etc.) — reference keys, not inline strings.
10. Manual verify: confirm shimmer appears on hard-reload, disappears after delay, and real content renders correctly in all three sections.
