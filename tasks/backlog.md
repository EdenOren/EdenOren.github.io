# Backlog

Planned feature branches — each maps to a PR into `development`.

## In Progress (PRs open → development)
- [ ] `feature/15-admin-panel` — Google Sign In, mock CRUD for Experience/Projects/Skills, navbar Admin link
- [ ] `refactor/scss-shared-styles` — shared mixins, SVGs to assets, about.component.scss budget fix
- [ ] `feature/18-404-page` — NotFoundComponent for unknown hash routes + static 404.html for GitHub Pages

## Future
- [ ] `feature/20-backend-tidb` — Stage 1: TiDB Cloud cluster + schema + seed data (see plans/be-tidb-vercel.md)
- [ ] `feature/21-backend-api` — Stage 2: Vercel API project (Node.js/TS, mysql2, auth middleware, CRUD routes)
- [ ] `feature/22-backend-angular` — Stage 3: Angular httpResource() integration, environment files, update facades
- [ ] `feature/23-backend-admin` — Stage 4: Wire admin panel CRUD to live API
- [ ] `feature/12-share-button` — share portfolio URL (Web Share API with clipboard fallback)
- [ ] `feature/13-og-image-final` — replace placeholder og-image.png with final 1200×630 Signal Luxe dark card (Cormorant name, emerald accent, role label)
- [ ] `feature/19-contact-form-connect` — wire contact form to a real email service (EmailJS / Formspree)

## Done — Features
- [x] `feature/1-design-tokens` — palette, Cormorant + Geist fonts, base font size
- [x] `feature/2-navbar` — fixed, blur-on-scroll, emerald active dot
- [x] `feature/3-hero` — Cormorant name, emerald role label, noise texture bg
- [x] `feature/4-about` — asymmetric 2-col, tilted portrait frame, social icons
- [x] `feature/5-experience` — timeline, ghost year, scroll reveal
- [x] `feature/6-skills` — grouped pill tags, emerald hover border
- [x] `feature/7-projects` — 2-col card grid, hover lift + emerald bottom border
- [x] `feature/8-contact` — centered form, emerald submit button
- [x] `feature/9-translate-service` — wire up i18n keys with APP_INITIALIZER
- [x] `feature/10-github-pages-deploy` — base-href config for GitHub Pages
- [x] `feature/11-constants-followup` — extract magic numbers into constants files
- [x] `feature/13-seo-open-graph` — Meta/Title/OG/Twitter tags, canonical link
- [x] `feature/14-skeleton-loaders` — shimmer skeletons with fade reveal for experience, projects, and skills
- [x] `feature/16-scroll-reveal-directive` — IntersectionObserver directive with fade-slide entrance on 5 sections
- [x] `feature/17-responsive-layout` — mobile hamburger nav, fluid section padding, timeline and portrait fixes

## Done — Refactor / Docs
- [x] `docs/claude-commit-policy` — branch naming, commit approval policy
- [x] `refactor/angular22-standards` — align codebase with Angular 22 standards (zoneless, signals, standalone)
- [x] `refactor/feature-folder-structure` — feature subfolders (facades/, enums/, utils/); data services → core/services/data/; platform services → core/services/platform/
