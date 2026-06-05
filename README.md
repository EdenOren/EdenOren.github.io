# Eden Oren — Portfolio

> A personal portfolio site built with Angular 22, showcasing modern frontend engineering practices.

[![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SCSS](https://img.shields.io/badge/SCSS%2FBEM-CC6699?logo=sass&logoColor=white)](https://sass-lang.com)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)

**[Live Demo →](https://edenoren.github.io)**

---

## Architecture

This project applies Angular 22's modern paradigm end-to-end — no legacy patterns.

| Decision | Approach |
|---|---|
| **Change detection** | Zoneless — `provideZonelessChangeDetection()`, no `zone.js` |
| **Reactivity** | Signals-first — `signal()`, `computed()`, `effect()` throughout |
| **Components** | Standalone — no `NgModule`, every unit self-contained |
| **Strategy** | `ChangeDetectionStrategy.OnPush` on every component |
| **Typing** | Strict TypeScript — `any` is banned, `unknown` for genuinely dynamic types |
| **Styles** | BEM + SCSS — global design tokens in `src/styles/abstract/` |
| **i18n** | All UI strings in `src/assets/i18n/en.json`, resolved via `TranslateService` |
| **Accessibility** | Keyboard navigation, ARIA attributes, no bare `outline: none` |

### Layer Hierarchy

```
src/app/
├── core/         # Root singletons, interceptors, guards
├── shared/       # Dumb components, utilities, enums
└── features/     # Smart components + facades (one folder per feature)
    └── [name]/
        ├── [name].component.ts
        ├── [name].facade.ts
        └── [name].service.ts
src/styles/
├── abstract/     # _colors.scss, _variables.scss, _mixins.scss
└── base/         # _reset.scss, _typography.scss
```

Lower layers never import from higher layers: Core → Shared → Features.

---

## CI / CD

Pushes to `main` automatically build and deploy to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Getting Started

**Prerequisites:** Node.js 22+, npm

```bash
npm install
npm start        # dev server at http://localhost:4200
npm run build    # production build → dist/
npm test         # unit tests (Vitest)
```
