# Plan: feature/15-admin-panel

## Decisions
- **Backend:** Not yet built — all CRUD uses in-memory mock state in facades. Service layer stays as stubs; real `httpResource` wired when API is ready.
- **Layout:** Reuses the existing public navbar + footer. No separate shell component. The admin page renders its own internal sidebar nav and content area inside the existing layout.
- **Login:** `/admin` itself handles both states. No `authGuard` on the route. `AdminComponent` checks `localStorage['eo:admin:token']` via a signal — if absent it renders the Google Sign In view; if present it renders the admin panel. The URL stays `/admin` throughout; there is no separate `/admin/login` route.
- **Auth method:** Google Sign In (Google Identity Services — script tag, no npm package). Client-side only: verifies the signed-in email matches `edenoren@gmail.com`, stores the credential token in `localStorage['eo:admin:token']`.
- **Scope:** Login (Google OAuth) · Experience CRUD · Projects CRUD · Skills CRUD.

---

## Current State

- `authGuard` — checks `localStorage['eo:admin:token']`, redirects to `/` if missing. **Will be removed from the `/admin` route.**
- `authInterceptor` — attaches `Authorization: Bearer <token>` to outbound HTTP requests. Stays in place for when the real API is added.
- `/admin` route in `app.routes.ts` — already exists, guard will be dropped.
- `AdminComponent`, `AdminFacade`, `AdminService` stubs exist but are empty.

---

## Route Structure

```
/admin                  → AdminComponent   (no guard — component handles auth state internally)
/admin/experience       → AdminExperienceComponent
/admin/projects         → AdminProjectsComponent
/admin/skills           → AdminSkillsComponent
```

`app.routes.ts`: remove `canActivate: [authGuard]` from `/admin`; convert to `loadChildren` pointing at `admin.routes.ts`.

---

## Auth State Flow

```
Navigate to /admin
       │
       ▼
AdminComponent checks localStorage['eo:admin:token']
       │
  ┌────┴────┐
absent     present
  │           │
  ▼           ▼
Google     Admin panel
Sign In    (sidebar + router-outlet)
view
  │
  ▼
User signs in with Google
  │
email === 'edenoren@gmail.com'?
  │
 yes → store token → show admin panel (same URL, no navigation)
  no  → show "unauthorised" message
```

---

## Layout Within the Page

**Unauthenticated (`/admin`):**
```
┌─────────────────────────────────┐
│  Public Navbar                  │
├─────────────────────────────────┤
│  [Sign in with Google] button   │
│  centered, minimal              │
├─────────────────────────────────┤
│  Public Footer                  │
└─────────────────────────────────┘
```

**Authenticated (`/admin`, `/admin/experience`, …):**
```
┌─────────────────────────────────────────┐
│  Public Navbar                          │
├──────────┬──────────────────────────────┤
│ Sidebar  │  Content area                │
│          │  (router-outlet)             │
│ Exp      │                              │
│ Projects │                              │
│ Skills   │                              │
│          │                              │
│ Logout   │                              │
├──────────┴──────────────────────────────┤
│  Public Footer                          │
└─────────────────────────────────────────┘
```

---

## Folder Structure

```
features/admin/
  admin.component.ts           ← auth-state switch: login view or panel view
  admin.component.html
  admin.component.scss
  admin.routes.ts              ← child routes for experience, projects, skills
  facades/
    admin.facade.ts            ← isAuthenticated signal, login callback, logout
  components/
    admin-experience/
      admin-experience.component.ts
      admin-experience.component.html
      admin-experience.component.scss
      facades/
        admin-experience.facade.ts
    admin-projects/
      admin-projects.component.ts
      admin-projects.component.html
      admin-projects.component.scss
      facades/
        admin-projects.facade.ts
    admin-skills/
      admin-skills.component.ts
      admin-skills.component.html
      admin-skills.component.scss
      facades/
        admin-skills.facade.ts
  models/
    admin.models.ts            ← ExperienceEntry, Project, SkillGroup interfaces
```

---

## Component Responsibilities

| Component | Responsibility |
|---|---|
| `AdminComponent` | Reads `facade.isAuthenticated`. If false: renders Google Sign In button. If true: renders sidebar nav + `<router-outlet>` + logout. |
| `AdminExperienceComponent` | Table of experience entries + add/edit inline form + delete |
| `AdminProjectsComponent` | Grid of project cards + add/edit inline form + delete |
| `AdminSkillsComponent` | Skill groups + pill list + add/edit inline form + delete |

Each sub-component gets its own facade (`@Service({ autoProvided: false })`) in its own `providers` array.

---

## AdminFacade

```ts
readonly isAuthenticated: Signal<boolean> = computed(() =>
  !!localStorage.getItem('eo:admin:token')
);

// Called from the Google Sign In callback
onGoogleCredential(credential: string, email: string): void {
  if (email !== 'edenoren@gmail.com') {
    this.isUnauthorized.set(true);
    return;
  }
  localStorage.setItem('eo:admin:token', credential);
  this._authenticated.set(true);
}

logout(): void {
  localStorage.removeItem('eo:admin:token');
  this._authenticated.set(false);
}
```

`isAuthenticated` is backed by a `WritableSignal<boolean>` initialised from localStorage so it is reactive without polling.

---

## Google Sign In Flow

1. Load the Google Identity Services script (`https://accounts.google.com/gsi/client`) in `index.html`.
2. `AdminFacade` calls `google.accounts.id.initialize({ client_id, callback: onGoogleCredential })` inside `afterNextRender` when `!isAuthenticated()`.
3. Template renders the `<div class="g_id_signin">` button (or calls `google.accounts.id.renderButton`).
4. On credential response, decode the JWT payload (atob of the middle segment), extract `email`.
5. Email match → store token → `_authenticated.set(true)` → router navigates to `/admin/experience`.
6. No match → `isUnauthorized.set(true)` → template shows error.
7. **Prerequisite:** Google OAuth Client ID created in Google Cloud Console. Authorised JavaScript origin: `https://edenoren.github.io`. Add the client ID to `index.html` as a `<meta name="google-signin-client_id">` tag.

---

## Mock Data Strategy

No real API yet. Each sub-facade holds in-memory `WritableSignal<T[]>` state seeded from the same static data in the public facades. CRUD operations mutate the signal directly.

```ts
readonly entries: WritableSignal<ExperienceEntry[]> = signal([...SEED_ENTRIES]);

add(entry: ExperienceEntry): void { this.entries.update(list => [...list, entry]); }
update(id: string, patch: Partial<ExperienceEntry>): void {
  this.entries.update(list => list.map(e => e.id === id ? { ...e, ...patch } : e));
}
remove(id: string): void { this.entries.update(list => list.filter(e => e.id !== id)); }
```

When the real API is ready, these are replaced by `httpResource` triggers in `AdminService`.

---

## Form Pattern (Signal Forms)

Each add/edit form uses `WritableSignal` per field and `computed()` for validation — same pattern as `ContactFacade`. No `ReactiveFormsModule` or `FormsModule`.

```ts
readonly titleField: WritableSignal<string> = signal('');
readonly isFormValid: Signal<boolean> = computed(() => this.titleField().trim().length > 0);
```

Selecting an entry for edit populates the field signals. Saving reads them and calls `add()` / `update()`.

---

## Models (`admin.models.ts`)

```ts
export interface ExperienceEntry { id: string; role: string; company: string; period: string; current: boolean; description: string; tags: string[]; }
export interface Project { id: string; title: string; description: string; tags: string[]; githubUrl?: string; liveUrl?: string; featured: boolean; }
export interface SkillGroup { id: string; label: string; skills: string[]; }
```

The public facades (`ExperienceFacade`, `ProjectsFacade`, `SkillsFacade`) will import these interfaces from `admin.models.ts` rather than declaring their own.

---

## Implementation Checklist

- [ ] Create Google OAuth Client ID; add `https://edenoren.github.io` as authorised origin
- [ ] Add GSI script tag + client ID meta tag to `index.html`
- [ ] Remove `canActivate: [authGuard]` from `/admin` in `app.routes.ts`; convert to `loadChildren`
- [ ] Add `admin.routes.ts` with lazy `loadComponent` for experience, projects, skills
- [ ] Create `admin.models.ts`; update public facades to import from it
- [ ] Update `AdminFacade` — `isAuthenticated` signal, `onGoogleCredential`, `logout`
- [ ] Update `AdminComponent` — conditional login view vs panel view; Google Sign In init
- [ ] Build `AdminExperienceFacade` + `AdminExperienceComponent`
- [ ] Build `AdminProjectsFacade` + `AdminProjectsComponent`
- [ ] Build `AdminSkillsFacade` + `AdminSkillsComponent`
- [ ] Apply Signal Luxe admin styling (dark surface, emerald accents, Cormorant headings)
- [ ] `ng build` — zero errors

---

## Notes
- The Google Client ID is non-secret (visible in page source). The authorised origins setting in Google Cloud Console is the actual access control for initiating OAuth flows.
- The email check (`=== 'edenoren@gmail.com'`) is the only access gate until a real backend is added.
- No `authGuard` on `/admin` — the component itself is the gate.
