# Plan: feature/15-admin-panel

## Context

Auth infrastructure is fully in place: `authGuard` checks `localStorage['eo:admin:token']`,
`authInterceptor` attaches `Authorization: Bearer <token>` to every outbound HTTP request.
The `/admin` route already exists in `app.routes.ts` and is guarded. The `AdminComponent`
shell, `AdminFacade`, and `AdminService` stubs exist but are empty.

---

## Auth Flow

1. `/admin` route hit without a token → `authGuard` redirects to `/`.
2. A separate `/admin/login` route (no guard) renders `AdminLoginComponent`.
3. Login form (Signal Forms) collects `password` only — Eden is the only user; no username.
4. On submit the facade calls `AdminService.login()` which fires a `POST /auth/login`
   via `httpResource()` with `{ password }` as the request body.
5. On success the API returns `{ token: string }`. The facade writes the token to
   `localStorage[LocalStorageKeys.AdminToken]` and navigates to `/admin/experience`.
6. On failure the facade exposes an `isLoginError: Signal<boolean>` for the template.
7. Logout clears the localStorage key and navigates to `/`.
8. The token is never kept in a signal — `localStorage` is the single source of truth,
   matching what `authGuard` and `authInterceptor` already read.

---

## Route Structure

```
/admin/login          → AdminLoginComponent    (no guard)
/admin                → AdminShellComponent    (canActivate: authGuard, children below)
/admin/experience     → AdminExperienceComponent
/admin/projects       → AdminProjectsComponent
/admin/skills         → AdminSkillsComponent
```

`AdminShellComponent` acts as the authenticated layout wrapper (sidebar nav + `<router-outlet>`).
All child routes are lazy-loaded via `loadComponent` inside `admin.routes.ts`.

`app.routes.ts` changes:
- Add `/admin/login` route without the guard.
- Convert the existing `/admin` entry to use `children` loaded from `admin.routes.ts`
  via `loadChildren`.

---

## Component Breakdown

| File | Responsibility |
|---|---|
| `admin.component.ts` (renamed to `admin-shell`) | Auth-protected layout: sidebar links (Experience / Projects / Skills), logout button, `<router-outlet>` |
| `admin-login/admin-login.component.ts` | Unguarded login form (password field + submit) |
| `admin-experience/admin-experience.component.ts` | List of experience entries + inline edit form |
| `admin-projects/admin-projects.component.ts` | List of project cards + inline edit form |
| `admin-skills/admin-skills.component.ts` | List of skill pills grouped by category + inline edit form |

Each sub-view gets its own facade (`@Service({ autoProvided: false })`) scoped to that
component's `providers` array. All sub-view facades inject `AdminService`.

---

## httpResource Calls (in AdminService)

All calls live exclusively in `admin.service.ts`. The service exposes resource factories
that accept reactive param signals from each facade.

| Operation | Method | Endpoint |
|---|---|---|
| Login | POST | `/auth/login` |
| List experience | GET | `/experience` |
| Update experience entry | PUT | `/experience/:id` |
| Create experience entry | POST | `/experience` |
| Delete experience entry | DELETE | `/experience/:id` |
| List projects | GET | `/projects` |
| Update project | PUT | `/projects/:id` |
| Create project | POST | `/projects` |
| Delete project | DELETE | `/projects/:id` |
| List skills | GET | `/skills` |
| Update skill | PUT | `/skills/:id` |
| Create skill | POST | `/skills` |
| Delete skill | DELETE | `/skills/:id` |

Mutation resources (POST/PUT/DELETE) use a `WritableSignal` as their reactive param;
the facade sets the signal to trigger the request, then resets it to `null` to idle.

---

## Signal Forms Usage

Each edit form uses `@angular/forms/signals`. Fields match the shape of the relevant
model interface (`ExperienceEntry`, `Project`, `Skill`). On save, the facade reads
the form's value signal and passes it to the mutation resource param signal.
Validation errors are surfaced via the form signal's built-in error state — no manual
error tracking needed.

---

## Implementation Checklist

- [ ] Add `admin.routes.ts` with child routes for login, experience, projects, skills
- [ ] Update `app.routes.ts`: add `/admin/login` (no guard), convert `/admin` to `loadChildren`
- [ ] Rename `admin.component.ts` → `admin-shell.component.ts`; build sidebar nav + logout
- [ ] Build `admin-login.component.ts` with Signal Form and login facade method
- [ ] Populate `AdminService` with `httpResource` factories for all CRUD endpoints
- [ ] Build `AdminExperienceFacade` + `AdminExperienceComponent` (list + edit form)
- [ ] Build `AdminProjectsFacade` + `AdminProjectsComponent` (list + edit form)
- [ ] Build `AdminSkillsFacade` + `AdminSkillsComponent` (list + edit form)
- [ ] Add `ExperienceEntry`, `Project`, `Skill` model interfaces to each feature's
      `models.ts` (or promote to `shared/models/` if shared with read-only views)
- [ ] Verify `authGuard` + `authInterceptor` cover all child routes automatically
- [ ] Apply Signal Luxe styling (dark surface, emerald accents, Cormorant headings)
- [ ] Confirm no nav or footer renders inside the admin shell (admin is a separate layout)
