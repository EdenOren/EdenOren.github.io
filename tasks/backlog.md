# Backlog

Planned feature branches — each maps to a PR into `development`.

## In Progress

## Up Next
- [ ] `feature/15-admin-panel`
- [ ] `feature/18-404-page` — styled 404 component; evaluate removing withHashLocation() and switching to 404.html trick or Netlify/Cloudflare Pages for clean URLs

## Future
- [ ] `feature/19-share-button` — share portfolio URL (Web Share API with clipboard fallback)
- [ ] `feature/20-contact-form-connect` — wire contact form to a real email service (EmailJS / Formspree)
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
- [x] `feature/13-seo-open-graph` — Meta/Title/OG/Twitter tags, canonical link
- [x] `feature/14-skeleton-loaders` — shimmer skeletons with fade reveal for experience, projects, and skills
- [x] `feature/16-scroll-reveal-directive` — IntersectionObserver directive with fade-slide entrance on 5 sections
- [x] `refactor/feature-folder-structure` — feature subfolders (facades/, enums/, utils/); data services → core/services/data/; platform services → core/services/platform/
