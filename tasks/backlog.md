# Backlog

Planned feature branches — each maps to a PR into `development`.

## In Progress
- `feature/13-seo-open-graph` — Meta/Title/OG/Twitter tags, canonical link

## Up Next
- [ ] `feature/16-scroll-reveal-directive` — IntersectionObserver → `.is-visible` class

## Future
- [ ] `feature/14-skeleton-loaders`
- [ ] `feature/15-admin-panel`
- [ ] `refactor/feature-folder-structure` — each feature folder gets subfolders: `components/`, `enums/`, `utils/`, `models/`, `facades/` instead of flat dumps; all `httpResource` services move to `core/services/data/`; analytics, seo, theme services move to a dedicated subfolder under `core/services/` (e.g. `core/services/ui/` or `core/services/platform/`)
- [ ] `refactor/scss-shared-styles` — extract repeated SCSS patterns into shared mixins/placeholders, fix anyComponentStyle budget warnings (about.component.scss currently at 6.69 kB, budget is 4 kB)
- [ ] `feature/13-og-image-final` — replace placeholder og-image.png with final 1200×630 Signal Luxe dark card (Cormorant name, emerald accent, role label)

## Done
- [x] `feature/1-design-tokens` — palette, Cormorant + Geist fonts, base font size
- [x] `feature/2-navbar` — fixed, blur-on-scroll, emerald active dot
- [x] `feature/3-hero` — Cormorant name, emerald role label, noise texture bg
- [x] `feature/4-about` — asymmetric 2-col, tilted portrait frame, social icons
- [x] `feature/5-experience` — timeline, ghost year, scroll reveal
- [x] `feature/6-skills` — grouped pill tags, emerald hover border
- [x] `feature/7-projects` — 2-col card grid, hover lift + emerald bottom border
- [x] `feature/8-contact` — centered form, emerald submit button
- [x] `feature/9-translate-service` — wire up i18n keys with APP_INITIALIZER
- [x] `docs/claude-commit-policy` — branch naming, commit approval policy
- [x] `feature/10-github-pages-deploy` — base-href config for GitHub Pages
- [x] `feature/11-constants-followup` — extract magic numbers into constants files
- [x] `feature/17-responsive-layout` — mobile hamburger nav, fluid section padding, timeline and portrait fixes
- [x] `refactor/angular22-standards` — align codebase with Angular 22 standards (zoneless, signals, standalone)
