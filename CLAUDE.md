# CLAUDE.md — Development Standards

This document defines mandatory standards for all code generation, refactoring, and AI-assisted tasks in this repository. These rules override all default behaviors.

---

## Universal Standards (all projects)

### Git Workflow
- **Branches:** `main` (production) · `development` (integration) · `feature/name` · `bugfix/name` · `refactor/name` (optional) · `docs/name`
- **Branch & PR title format:** `type/number-general-description` — e.g. `feature/4-about`, `bugfix/11-navbar-scroll`. Only `feature/` and `bugfix/` branches carry a sequential number. `docs/` and `refactor/` branches are unnumbered — e.g. `docs/claude-commit-policy`, `refactor/angular22-standards`.
- **PR titles** must match the branch name exactly.
- **PRs always target `development`.** Only `development → main` PRs release to production.
- **Never push directly to `main` or `development`.**
- **One PR per feature** — do not batch unrelated changes.
- **Never commit or push** without explicit user approval. Show planned changes first and wait for a go-ahead before any `git commit` or `git push`.
- See `CONTRIBUTING.md` for full workflow details.

### Planning
- Before implementing any non-trivial feature, save a plan to `plans/feature-name.md`.
- Update `tasks/backlog.md` as work progresses.
- Log bugs in `bugs/open.md`.

### Typing
- **No `any`.** Strict TypeScript enabled in all projects.
- Prefer `unknown` over `any` when the type is genuinely unknown.
- **All `readonly` class properties must have explicit types** even when inferable — e.g. `Signal<string>`, `WritableSignal<boolean>`, `number`, `MyInterface[]`. Never rely on inference for class-level declarations.
- Use `WritableSignal<T>` for `signal()` declarations and `Signal<T>` for `computed()` return types.
- **Prefer `enum` over union string types** — `type State = 'a' | 'b'` should be `enum State { A = 'a', B = 'b' }`.
- Use `InputSignal<T>` as the explicit type annotation for `input()` declarations and `InputSignalWithTransform<T, U>` when a transform is applied. Use `OutputEmitterRef<T>` for `output()` declarations.
- Signal query types: `Signal<T | undefined>` for optional queries, `Signal<T>` for required queries (`.required` variant), and `Signal<readonly T[]>` for `viewChildren()` / `contentChildren()`.

### Enums
- **No literal strings in logic or comparisons** — always define and use an enum.
- Feature-scoped enums live in `features/[name]/enums/`.
- Shared / cross-feature enums live in `shared/enums/[name].enum.ts`.
- **No string comparisons in templates** — expose a `Signal<boolean>` computed in the facade instead (e.g. `isLoading`, `isSuccess`, `isError`).

### Code Style
- **`if` blocks always use braces**, even for single-line bodies:
  ```ts
  // correct
  if (condition) {
    return value;
  }
  // wrong
  if (condition) return value;
  ```
- **Braces always have inner spaces** in every context — imports, object literals, destructuring:
  ```ts
  // correct
  import { Component, inject } from '@angular/core';
  const { a, b } = obj;
  // wrong
  import {Component, inject} from '@angular/core';
  ```
- **No single-letter or abbreviated identifiers** — method names, variables, and SCSS aliases must be fully descriptive: `get()` not `t()`, `as colors` not `as c`.

### Naming Conventions (class properties)
- **Static `readonly` properties** (primitives, data arrays, constants) → `CAPITAL_SNAKE_CASE`
- **Reactive properties** (`Signal`, `WritableSignal`, `computed`) → `camelCase`
- **Injected dependencies** (via `inject()`) → `camelCase` private field. No leading underscore, no `$` suffix.
- **RxJS Observables** that must be exposed from a facade for legacy interop → `camelCase$` suffix (e.g. `items$`). Prefer signals over observables for all new state; the `$` suffix signals technical debt.

### Styling — BEM + SCSS
- **BEM** (Block Element Modifier) naming in all stylesheets.
- **No inline styles** unless dynamically computed (e.g. `[style.height]="h()"`)
- Global SCSS partials live in `src/styles/abstract/` and `src/styles/base/`.
- Import global tokens with `@use 'abstract/colors' as colors`, `@use 'abstract/variables' as variables` — **never single-letter aliases** (`as c`, `as v`).

### Comments
- Default: **no comments.**
- Only add a comment when the **WHY** is non-obvious: a hidden constraint, a subtle invariant, a workaround for a specific bug, or behavior that would surprise a reader.
- Never document WHAT the code does — well-named identifiers do that.

### Accessibility
- All interactive elements must be keyboard-navigable.
- No `outline: none` without a custom focus style replacement.
- Must pass all AXE checks and meet WCAG AA minimums — including focus management, colour contrast, and ARIA attributes.

### i18n (Internationalisation)
- **All static UI text** (labels, buttons, placeholders, toasts, error messages) lives in `src/assets/i18n/en.json`.
- No hard-coded strings in templates or components.
- Use the project's `TranslateService` to resolve keys at runtime.
- **JSON keys are `UPPER_SNAKE_CASE`** at every level — section names and leaf keys alike: `"HERO"`, `"NAME_FIRST"`, `"CTA_WORK"`.

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
- **Standalone by default** — do **not** write `standalone: true` in `@Component`, `@Directive`, or `@Pipe` decorators; it is the framework default and is redundant.
- **`ChangeDetectionStrategy.OnPush`** on every component, no exceptions. (`OnPush` is the Angular 22 default but must still be declared explicitly.)
- **Signal Forms** — use `@angular/forms/signals` for all forms. Do not import `ReactiveFormsModule` or `FormsModule` anywhere in the project. There are no exceptions; this is a new project with no legacy form code to preserve.
- **No `model()`** — two-way binding is not used in this project. Pass data down via `input()` and communicate changes up via `output()`. Never use the `model()` function.

### Dependency Injection
- Use `inject()` function. **No constructor injection.**
- Root-level singleton services (provided in root) use `@Service()`.
- Services that must be provided manually — for example a per-instance component-scoped service — use `@Service({ autoProvided: false })` and are listed in the component's or directive's `providers` array. Never use `@Injectable()` for new code.

### Component Rules
- **Facades are not root services.** Every facade uses `@Service({ autoProvided: false })` and is listed in its feature component's `providers` array — never provided in root. This keeps state contained to the feature's lifetime.
- **Smart (Feature) Components:** inject Facades only. Pass data to children via `input()`. Capture events via `output()`.
- **Dumb (Shared) Components:** inject nothing. Use `input()` / `output()` only.
- Use `input.required<T>()` for required inputs.
- Declare all `input()`, `output()`, and query results as `readonly`. The Angular compiler enforces that Angular-managed signals are not overwritten; `readonly` makes that intent explicit at the TypeScript level.
  ```ts
  // correct
  readonly title  = input.required<string>();
  readonly saved  = output<void>();
  readonly header = contentChild(HeaderComponent);

  // wrong
  title  = input.required<string>();
  saved  = output<void>();
  header = contentChild(HeaderComponent);
  ```
- **No `@HostBinding` or `@HostListener`** — declare host bindings inside the `host: {}` object of `@Component` / `@Directive` instead.
- **`NgOptimizedImage`** for all static `<img>` elements. Does not apply to inline base64 images.

### Signal Queries
- Use signal-based queries exclusively: `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`.
- Never use the decorator-based `@ViewChild`, `@ViewChildren`, `@ContentChild`, or `@ContentChildren`.
- For optional queries the result type is `Signal<T | undefined>`; for required queries use `viewChild.required<T>()` or `contentChild.required<T>()`.
- When a query is used only in the template, mark it `protected`.
  ```ts
  // correct
  protected readonly panel   = viewChild.required<PanelComponent>('panel');
  protected readonly items   = viewChildren(ItemComponent);
  protected readonly trigger = contentChild<ElementRef>('trigger');

  // wrong
  @ViewChild('panel')   panel!: PanelComponent;
  @ContentChild(Token)  trigger?: ElementRef;
  ```

### Templates
- Use **native control flow** — `@if`, `@for`, `@switch`. Never `*ngIf`, `*ngFor`, `*ngSwitch`.
- **No `ngClass`** — use `[class.name]="expr"` bindings.
- **No `ngStyle`** — use `[style.prop]="expr"` bindings.
- Keep templates free of complex logic — move any non-trivial expression into the component or facade.
- Do not assume browser globals (`new Date()`, `window`, etc.) are available in templates.
- Import and declare pipes in the component's `imports` array when used in a template.
- Use `@let` to alias long or deeply nested template expressions. Declare `@let` at the top of the block that uses it. `@let` cannot be reassigned and is scoped to its declaring view and descendants — it is not visible to parent or sibling views.
  ```html
  @let profile = user()?.profile?.settings;
  <span>{{ profile?.displayName }}</span>
  ```
- Use `@defer` to lazy-load heavy or below-the-fold components. See the Lazy Loading section below for rules.

### Lazy Loading (`@defer`)
- Use `@defer` to defer any component that is heavy, below the fold, or not needed on initial render.
- Components used inside `@defer` must never be imported in the same file's `imports` array. Import them only through barrel-free direct paths so the bundler can split them into separate chunks.
- Always provide a `@placeholder` block. Provide `@loading` and `@error` blocks for any `@defer` that fetches data or may fail.
- Choose the trigger that matches the UX intent:
  - `on viewport` — content below the fold
  - `on interaction` — content revealed by user action
  - `on idle` — non-critical background content
  - `on immediate` — content needed soon after first render but not blocking LCP
- When SSR is enabled and incremental hydration is active, add a matching `hydrate on <trigger>` to control when the dehydrated block is hydrated on the client.
- Do not use `@defer (on immediate)` as a shortcut to avoid fixing a slow component. Fix the component first.
  ```html
  <!-- correct -->
  @defer (on viewport) {
    <app-comments [postId]="postId()" />
  } @placeholder {
    <div class="comments__placeholder">Loading comments…</div>
  } @loading (minimum 300ms) {
    <app-spinner />
  } @error {
    <p>Could not load comments.</p>
  }
  ```

### Animations
- Use `animate.enter="<class>"` and `animate.leave="<class>"` for all enter/leave animations. These are compiler-supported APIs, not directives.
- Do not use or import `@angular/animations` (`BrowserAnimationsModule`, `trigger()`, `state()`, `transition()`, `animate()`). The package is deprecated as of Angular v20.2 and must not be introduced into this project.
- Define `@keyframes` rules in the component's `.scss` file. The classes referenced by `animate.enter` and `animate.leave` must live there too.
- When using `animate.leave` with a function callback, you **must** call `event.animationComplete()` or Angular will not remove the element.
- For view transition animations between routes, place `::view-transition-old()` and `::view-transition-new()` rules in the global styles file — component encapsulation prevents them from matching the transition pseudo-elements.
  ```html
  <!-- correct -->
  <div animate.enter="fade-in" animate.leave="fade-out">…</div>

  <!-- wrong -->
  <div [@fadeInOut]="state">…</div>
  ```

### State Management (Signals)
- Use `signal()` for local mutable state.
- Use `computed()` for all derived state — never recompute manually.
- **Never call `.mutate()`** — use `.set()` for replacement and `.update()` for transforms.
- Use `linkedSignal()` when a writable signal's default value must reset in response to another signal changing (e.g. a selection that must reset when its source list changes). Do not use `effect()` to synchronise two writable signals.
- Use `effect()` only for genuine side effects: writing to the DOM, calling a third-party library, or logging. Never use `effect()` to set another signal's value — that is always a `computed()` or `linkedSignal()` problem.
- Use `resource()` for non-HTTP async data sources (e.g. IndexedDB, Web Workers). Use `httpResource()` for all HTTP data (see HTTP section).

### HTTP
- Use `httpResource()` for all HTTP data fetching inside services. This is a new project; raw `HttpClient` calls are not permitted in any file — not in components, facades, or services.
- Every `httpResource()` call lives in `core/services/data/[feature].service.ts`.
- The resource's reactive `params` function is the only place to derive the request from signals or route state. Do not call `.reload()` as a substitute for reactive params.
- Handle loading, error, and resolved states using the resource's `status`, `isLoading`, `error`, and `hasValue()` signals — expose these through the facade as computed `Signal<boolean>` properties (`isLoading`, `isError`, `isSuccess`) rather than exposing the raw resource object to templates.

### Routing
- All feature routes are **lazy-loaded** via `loadComponent`.
- Auth-protected routes use `canActivate: [authGuard]`.
- The default `PathLocationStrategy` is used. If the project is later deployed to a static host (e.g. GitHub Pages) that does not support HTML5 history, update `app.config.ts` to provide `HashLocationStrategy` at that time and document the reason in `CONTRIBUTING.md`. Do not add it pre-emptively.

### RxJS Interop
- Prefer signals over observables for all state in new code. RxJS is permitted where it adds genuine value: complex async pipelines, streams that merge multiple sources, or library APIs that return observables.
- When subscribing to an observable inside a component, service, or directive, use `takeUntilDestroyed()` from `@angular/core/rxjs-interop` to tie the subscription lifetime to the host's destruction. Never manage subscriptions manually with `ngOnDestroy` + `Subscription.unsubscribe()`.
  ```ts
  // correct
  someObservable$
    .pipe(takeUntilDestroyed())
    .subscribe(value => this.data.set(value));

  // wrong
  private sub = new Subscription();
  ngOnInit() { this.sub.add(someObservable$.subscribe(…)); }
  ngOnDestroy() { this.sub.unsubscribe(); }
  ```
- To bridge a signal into an observable (e.g. for debouncing or `switchMap`), use `toObservable()`.
- To bridge an observable into a signal, use `toSignal()` with an explicit `initialValue`. Call `toSignal()` once and reuse the result; never call it inside a reactive expression.
- Do not use `Subject` or `BehaviorSubject` to hold local component state. Use `signal()` instead.

### SCSS Configuration
- `angular.json` is configured with `stylePreprocessorOptions.includePaths: ["src/styles"]`.
- This allows `@use 'abstract/colors' as colors` without relative paths.
- **No `::ng-deep`** — strict encapsulation enforced.

### Folder Structure

```
src/
├── app/
│   ├── core/                     # Root singletons, interceptors, guards
│   │   ├── interceptors/
│   │   ├── guards/
│   │   └── services/
│   │       ├── data/             # httpResource services — one file per feature
│   │       │   └── [feature].service.ts
│   │       └── platform/         # App-wide singletons: analytics, seo, theme
│   │           ├── analytics.service.ts
│   │           ├── seo.service.ts
│   │           └── theme.service.ts
│   ├── shared/                   # Dumb UI components, utils, constants, enums, models
│   └── features/                 # Smart components + facades (one folder per feature)
│       └── [feature]/
│           ├── components/       # Dumb sub-components scoped to this feature
│           ├── enums/            # Feature-scoped enums
│           ├── facades/          # Feature facade(s)
│           ├── models/           # Interfaces / types for this feature
│           ├── utils/            # Feature-scoped utilities
│           ├── [feature].component.ts   # Smart root component
│           └── [feature].routes.ts      # If sub-routing needed
└── styles/
    ├── abstract/   # _colors.scss, _variables.scss, _mixins.scss
    └── base/       # _reset.scss, _typography.scss
```

Additional rules:
- `httpResource` instances live exclusively in `core/services/data/[feature].service.ts`. Facades inject the service and expose computed signals derived from the resource's state signals.
- Platform services (`analytics`, `seo`, `theme`) are root-provided singletons and live in `core/services/platform/`.
- `@defer` imports that reference components from other features go through the component's own file path, never a barrel index.

### Naming Conventions
- Feature root component: `[feature].component.ts` (directly inside `[feature]/`)
- Feature routes: `[feature].routes.ts` (directly inside `[feature]/`)
- Sub-components: `[feature]/components/[name].component.ts`
- Facades: `[feature]/facades/[feature].facade.ts`
- Models: `[feature]/models/[feature].models.ts`
- Enums: `[feature]/enums/[name].enum.ts`
- Utils: `[feature]/utils/[name].utils.ts`
- Data services: `core/services/data/[feature].service.ts`
- Platform services: `core/services/platform/[name].service.ts`
- Global constants: `src/app/shared/constants/`
- Global enums: `src/app/shared/enums/`
- Global models: `src/app/shared/models/`

### Execution
- Before starting any feature, check `tasks/backlog.md`.
- Mark tasks complete as work is merged, not before.
