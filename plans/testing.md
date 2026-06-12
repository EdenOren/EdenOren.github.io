# Testing Plan

**Goal:** Full unit-test coverage across all layers — pure functions, services, guards, interceptors, facades, shared UI, and feature components.

**Runner:** Vitest (configured in `angular.json`). `describe / it / expect / vi` are global (no imports needed) via `tsconfig.spec.json` → `vitest/globals`.

**Spec file convention:** co-locate each spec alongside its source: `foo.service.spec.ts` next to `foo.service.ts`.

---

## Conventions

### TestBed baseline for services
```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), MyService],
  });
});
```

### TestBed for HTTP services
```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(),
      provideHttpClientTesting(),
      MyService,
    ],
  });
  httpTesting = TestBed.inject(HttpTestingController);
});
afterEach(() => httpTesting.verify());
```

### TestBed for components
```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [provideZonelessChangeDetection()],
  }).compileComponents();
});
```

### Signal reads in tests
After mutating signals use `TestBed.flushEffects()` to flush pending effect/computed re-runs.

---

## Phase 1 — Pure Functions (no TestBed)

Highest ROI. No setup needed.

### `auth.service.spec.ts`
Extract and test the two exported pure functions:
- `parseToken(token)` → valid JWT base64 payload returns object; malformed input returns `null`
- `isTokenValid(token)` → null input → false; expired token → false; future `exp` → true

---

## Phase 2 — Core Platform Services

### `auth.service.spec.ts` (continued, with TestBed)
- `localStorage` via `vi.spyOn(Storage.prototype, 'getItem')`
- `checkStoredToken()` on init: valid stored token → `isAuthenticated()` = true
- `checkStoredToken()` on init: expired/absent → false, invalid token removed from storage
- `login(token)` → stores in localStorage, signal flips to true
- `logout()` → removes from localStorage, signal flips to false
- `getValidToken()` → returns token when valid; null when expired or absent

### `theme.service.spec.ts`
- `init()` with stored `Theme.Light` → signal = Light, `data-theme` attribute set
- `init()` with no storage, system prefers dark → signal = Dark
- `toggle()` from Dark → Light, persisted, attribute updated
- `toggle()` from Light → Dark, persisted, attribute updated
- `isDark` computed follows `theme` signal

### `seo.service.spec.ts`
- `apply()` → `Title.setTitle()` called with correct string
- `apply()` → `Meta.addTags()` called, spot-check og:title and twitter:card tags
- `apply()` → `<link rel="canonical">` appended to `document.head`
- Uses `jasmine.createSpyObj` or `vi.fn()` stubs for `Meta` and `Title`

### `confirm-dialog.service.spec.ts`
- `open(message)` → creates and attaches `ConfirmDialogComponent`, returns Observable
- Confirm event → Observable emits `true` and completes, component removed
- Cancel event → Observable emits `false` and completes, component removed
- Router `NavigationStart` while dialog open → auto-closes with false
- `authService.isAuthenticated()` → false → auto-closes

---

## Phase 3 — Guards & Interceptors

### `auth.guard.spec.ts`
Two cases, both run inside `TestBed.runInInjectionContext()`:
- `isAuthenticated()` = true → returns `true`
- `isAuthenticated()` = false → returns `UrlTree` pointing to `'/'`

### `auth.interceptor.spec.ts`
Use `HttpTestingController`:
- `getValidToken()` returns a token → outgoing request has `Authorization: Bearer <token>`
- `getValidToken()` returns null → request passes through without `Authorization` header

---

## Phase 4 — Data Services

### `base-data.service.spec.ts`
Concrete test subclass extending `BaseDataService`:
- `create(item)` → `POST` to `api/<path>`
- `update(id, item)` → `PUT` to `api/<path>/<id>`
- `delete(id)` → `DELETE` to `api/<path>/<id>`
- `isError` signal set when `httpResource` error state is truthy

### `contact.service.spec.ts`
- `send(payload)` → `POST` to `FORMSPREE_URL` with `Accept: application/json` header
- Resolves on 200; rejects on 4xx/5xx

### `about.service.spec.ts`
- `update(payload)` → `PUT` to `api/admin/about` with correct body

### Other data services (`experience`, `projects`, `skills`, `admin`, `upload`)
- Follow the same `BaseDataService` pattern
- `upload.service.spec.ts` — `upload(file)` → `POST` to upload endpoint, returns `{ url }`

---

## Phase 5 — Facades

### `admin-crud.facade.spec.ts`
Base class logic — use a minimal concrete stub:
- `isFormOpen` starts false, `editingId` starts null
- `beginAdd()` → `isFormOpen` = true, `editingId` = null
- `beginEdit(id)` → `isFormOpen` = true, `editingId` = id, `isEditing` = true
- `closeForm()` → both reset to defaults
- `remove(id)` → filters item from `items`
- `applyChange(item)` when adding → appends to `items`, closes form
- `applyChange(item)` when editing → replaces in-place, closes form

### `contact.facade.spec.ts`
Provide `ContactService` with a `vi.fn()` stub:
- `isLoading`, `isSuccess`, `isError` start at correct defaults
- `submit()` with valid form → calls `contactService.send()`, on success sets `isSuccess` = true, resets model
- `submit()` with server error → sets `isError` = true
- `submit()` with invalid form → does not call `send()`

### `share.facade.spec.ts`
- `togglePanel()` flips `isPanelOpen`
- `closePanel()` sets `isPanelOpen` = false
- `copyLink()` → calls `navigator.clipboard.writeText`, sets `isCopied` = true, reverts after 2s (fake timers: `vi.useFakeTimers()`)
- `nativeShare()` → calls `navigator.share` when `canUseNativeShare` is true
- `canUseNativeShare` = false → `nativeShare()` is no-op

### `navbar.facade.spec.ts`
Stub `AuthService`, `ThemeService`, `Router`, `TranslateService`:
- `toggleMenu()` flips `isMenuOpen`
- `closeMenu()` sets `isMenuOpen` = false
- `scrollToSection(id)` → element exists → calls `scrollIntoView`
- `scrollToSection(id)` → element absent → sets `pendingScrollSection`, navigates to `/`
- Router `NavigationStart` → closes menu
- `toggleTheme()` → delegates to `themeService.toggle()`

### `admin-projects.facade.spec.ts` (representative CRUD facade)
Stub `ProjectsService`, `UploadService`, `ConfirmDialogService`, `TranslateService`:
- `openAdd()` → resets form, calls `beginAdd()`
- `openEdit(project)` → populates form fields, calls `beginEdit(project.id)`
- `save()` with invalid form → no HTTP call
- `save()` editing, no new file → calls `projectsService.update()`, reloads, closes form
- `save()` adding, with file → calls `uploadService.upload()` then `projectsService.create()`
- `remove(id)` → calls `projectsService.delete()`, reloads
- `requestDelete(id)` → opens confirm dialog; on confirmed → calls `remove()`; on cancelled → no-op

---

## Phase 6 — Shared UI Components (dumb)

### `cta-button.component.spec.ts`
- Default inputs render `cta-button--filled` class
- `variant=Outline` → `cta-button--outline` class present
- `loading=true` → spinner element present, button is disabled
- `disabled=true` → button is disabled even without loading
- `buttonType` bound to native `[type]` attribute

### `tag.component.spec.ts`
- Renders projected content
- Correct BEM class applied per `TagVariant` input

### `section-header.component.spec.ts`
- Renders `title` and `subtitle` inputs

### `icon-button.component.spec.ts`
- Renders icon; `disabled` disables the button

### `confirm-dialog.component.spec.ts`
- Confirm button click → emits `confirm` output
- Cancel button click → emits `cancel` output
- `message` input renders in the template

### `skeleton-loader.component.spec.ts`
- Renders with the correct skeleton BEM classes

### `image-upload.component.spec.ts`
- File input change → emits selected file
- Invalid file type → does not emit

---

## Phase 7 — Directives

### `scroll-reveal.directive.spec.ts`
- Host element gets `scroll-reveal` class applied immediately
- `IntersectionObserver` callback with `isIntersecting=true` → adds `is-visible` class, calls `unobserve`
- `isIntersecting=false` → no class change
- On destroy → `observer.disconnect()` called

Mock `IntersectionObserver` with `vi.stubGlobal('IntersectionObserver', ...)`.

---

## Phase 8 — Feature Components (smoke tests)

Smart components delegate all logic to facades. Smoke tests verify the component tree renders without errors when the facade is stubbed.

For each: `AdminComponent`, `AboutComponent`, `HeroComponent`, `ProjectsComponent`, `SkillsComponent`, `ExperienceComponent`, `ContactComponent`, `ShareComponent`, `NotFoundComponent`, `HomeComponent`:
- Component creates without error
- Key template output visible (e.g. section heading, loading skeleton, or stub content)
- Stub facade signals at known values and assert the template reflects them

---

## Execution Order (recommended)

| Order | Phase | Files | Notes |
|-------|-------|-------|-------|
| 1 | Pure functions | `auth.service.spec.ts` (pure part) | No Angular needed |
| 2 | Core services | `auth / theme / seo / confirm-dialog` | Stub DOM APIs |
| 3 | Guards & interceptors | `auth.guard / auth.interceptor` | HttpTestingController |
| 4 | Data services | `base-data / contact / about / upload` | HttpTestingController |
| 5 | Base facade | `admin-crud.facade.spec.ts` | Signal assertions |
| 6 | Feature facades | `contact / share / navbar / admin-projects` | Stub services |
| 7 | Shared UI | All in `shared/ui/` + `shared/components/` | Dumb, straightforward |
| 8 | Directive | `scroll-reveal` | Mock IntersectionObserver |
| 9 | Feature components | All feature root components | Facade stubs |

---

## Total spec files to create

- Phase 1–2: `auth.service.spec.ts`, `theme.service.spec.ts`, `seo.service.spec.ts`, `confirm-dialog.service.spec.ts`
- Phase 3: `auth.guard.spec.ts`, `auth.interceptor.spec.ts`
- Phase 4: `base-data.service.spec.ts`, `contact.service.spec.ts`, `about.service.spec.ts`, `upload.service.spec.ts`
- Phase 5: `admin-crud.facade.spec.ts`, `contact.facade.spec.ts`, `share.facade.spec.ts`, `navbar.facade.spec.ts`, `admin-projects.facade.spec.ts`
- Phase 6: `cta-button.component.spec.ts`, `tag.component.spec.ts`, `section-header.component.spec.ts`, `icon-button.component.spec.ts`, `confirm-dialog.component.spec.ts`, `skeleton-loader.component.spec.ts`, `image-upload.component.spec.ts`
- Phase 7: `scroll-reveal.directive.spec.ts`
- Phase 8: One spec per feature component (10 files)

**Total: ~33 new spec files** (plus fixing `app.spec.ts`).
