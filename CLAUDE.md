# CLAUDE.md — Development Standards

This document defines mandatory standards for all code generation, refactoring, and AI-assisted tasks in this repository. These rules override all default behaviors.

---

## Universal Standards (all projects)

### Git Workflow
- **Branches:** `main` (production) · `development` (integration) · `feature/name` · `bugfix/name`
- **PRs always target `development`.** Only `development → main` PRs release to production.
- **Never push directly to `main` or `development`.**
- **One PR per feature** — do not batch unrelated changes.
- **PR template:** `.github/PULL_REQUEST_TEMPLATE.md` must be filled out on every PR.
- See `CONTRIBUTING.md` for full workflow details.

### Planning
- Before implementing any non-trivial feature, save a plan to `plans/feature-name.md`.
- Update `tasks/backlog.md` as work progresses.
- Log bugs in `bugs/open.md`.

### Typing
- **No `any`.** Strict TypeScript enabled in all projects.
- Prefer `unknown` over `any` when the type is genuinely unknown.

### Styling — BEM + SCSS
- **BEM** (Block Element Modifier) naming in all stylesheets.
- **No inline styles** unless dynamically computed (e.g. `[style.height]="h()"`)
- Global SCSS partials live in `src/styles/abstract/` and `src/styles/base/`.
- Import global tokens with `@use 'abstract/colors'`, `@use 'abstract/variables'` etc.

### Comments
- Default: **no comments.**
- Only add a comment when the **WHY** is non-obvious: a hidden constraint, a subtle invariant, a workaround for a specific bug, or behavior that would surprise a reader.
- Never document WHAT the code does — well-named identifiers do that.

### Accessibility
- Use **Angular Aria** (`@angular/aria`) first for common UI patterns (dialogs, listboxes, menus, etc.) — headless, unstyled, accessible by default.
- Fall back to `@angular/cdk/a11y` or native ARIA only when Angular Aria doesn't cover the pattern.
- All interactive elements must be keyboard-navigable.
- No `outline: none` without a custom focus style replacement.

### i18n (Internationalisation)
- **All static UI text** (labels, buttons, placeholders, toasts, error messages) lives in `src/assets/i18n/en.json`.
- No hard-coded strings in templates or components.
- Use the project's `TranslateService` to resolve keys at runtime.

### Component Library Priority
1. **Native platform / framework components** — use these first.
2. **Approved UI library** (Angular Material in Angular projects) — use when native isn't sufficient.
3. **Nothing else** without explicit sign-off.

### Layer Hierarchy (Core → Shared → Features)
- **Core:** Singletons, interceptors, global state. May only import external libraries.
- **Shared:** Reusable dumb UI, component-scoped services, utilities. May import Core.
- **Features:** Smart components, facades, feature logic. May import Core and Shared.
- **Forbidden:** lower layers importing from higher layers.

### Security
- Sanitize all user input at system boundaries.
- Never store secrets in source code or committed `.env` files.
- No `dangerouslySetInnerHTML` / `bypassSecurityTrust*` without explicit justification.

---

## Angular 22 Specifics

> **Version:** Angular 22 · CLI 22.x · TypeScript 6.x

### Core Paradigm
- **Zoneless** — `provideZonelessChangeDetection()` in `app.config.ts`. No `zone.js` in polyfills.
- **Signals-first** — use `signal()`, `computed()`, `effect()`, `linkedSignal()`. No imperative `Subject`/`BehaviorSubject` unless absolutely necessary.
- **Standalone Components** — no `NgModule`. Every component, directive, and pipe is standalone.
- **`ChangeDetectionStrategy.OnPush`** on every component, no exceptions. (`OnPush` is the Angular 22 default but must still be declared explicitly.)
- **Signal Forms** — use `@angular/forms/signals` for all forms. No `ReactiveFormsModule` or `FormsModule`.

### Dependency Injection
- Use `inject()` function. **No constructor injection.**
- Root-level singleton services use `@Service()` — the Angular 22 shorthand for `@Injectable({ providedIn: 'root' })`.
- Component-scoped services use `@Injectable()` and are listed in the component's `providers` array.

### Component Rules
- **Smart (Feature) Components:** inject Facades only. Pass data to children via `input()`. Capture events via `output()`.
- **Dumb (Shared) Components:** inject nothing. Use `input()` / `output()` only.
- Use `input.required<T>()` for required inputs.

### HTTP
- Use `httpResource()` for data fetching in services. No raw `HttpClient` calls in components or facades.
- All services that call the API live in `features/[name]/[name].service.ts`.

### Routing
- All feature routes are **lazy-loaded** via `loadComponent`.
- Auth-protected routes use `canActivate: [authGuard]`.
- `HashLocationStrategy` is used for GitHub Pages compatibility.

### SCSS Configuration
- `angular.json` is configured with `stylePreprocessorOptions.includePaths: ["src/styles"]`.
- This allows `@use 'abstract/colors'` without relative paths.
- **No `::ng-deep`** — strict encapsulation enforced.

### Folder Structure

```
src/
├── app/
│   ├── core/           # Root singletons, interceptors, guards
│   ├── shared/         # Dumb UI components, utils, constants, enums
│   └── features/       # Smart components + facades (one folder per feature)
│       └── [feature]/
│           ├── [feature].component.ts
│           ├── [feature].facade.ts
│           ├── [feature].service.ts   (if API calls needed)
│           └── [feature].routes.ts    (if sub-routing needed)
└── styles/
    ├── abstract/   # _colors.scss, _variables.scss, _mixins.scss
    └── base/       # _reset.scss, _typography.scss
```

### Naming Conventions
- Files: `feature-name.component.ts` / `.facade.ts` / `.service.ts` / `.routes.ts`
- Constants / Enums: `src/app/shared/constants/` or `src/app/shared/enums/` if global; local to `feature/` if feature-specific.

### Execution
- Before starting any feature, check `tasks/backlog.md`.
- Mark tasks complete as work is merged, not before.
