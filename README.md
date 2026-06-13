# Eden Oren — Portfolio

> A personal portfolio site built with Angular 22, showcasing modern frontend engineering practices.

[![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SCSS](https://img.shields.io/badge/SCSS%2FBEM-CC6699?logo=sass&logoColor=white)](https://sass-lang.com)
[![Vercel](https://img.shields.io/badge/API-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)

**[Live Demo →](https://edenoren.github.io)**

---

## What Is This?

A fully dynamic personal portfolio with a database-backed admin panel. Content (bio, work experience, projects, skills) is stored in TiDB Cloud and served through a REST API deployed on Vercel — no rebuilds required to update the site. The contact form is handled by Formspree. The admin panel is protected by Google OAuth.

---

## Features

- **Dynamic content** — all sections pull live data from the API; updates go live instantly without a deployment
- **Admin panel** — CRUD interface for every section, protected by Google Sign-In
- **Contact form** — handled by Formspree; no backend code needed for email delivery
- **Light / dark theme** — preference persisted in `localStorage`
- **i18n ready** — all UI strings live in `src/assets/i18n/en.json`
- **Fully accessible** — keyboard navigation, ARIA attributes, WCAG AA colour contrast

---

## System Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Browser (Angular SPA)               │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ Portfolio │  │   Admin   │  │  Contact Form    │  │
│  │  (public) │  │  (gated)  │  │  (Formspree)     │  │
│  └─────┬─────┘  └─────┬─────┘  └────────┬─────────┘  │
└────────┼──────────────┼─────────────────┼────────────┘
         │              │                 │
         ▼              ▼                 ▼
┌────────────────────────────┐   ┌────────────────────┐
│   REST API (Vercel)        │   │      Formspree     │
│  /api/experience           │   │  (email delivery)  │
│  /api/projects             │   └────────────────────┘
│  /api/skills               │
│  /api/about                │
│  /api/upload               │
│  /api/admin/verify         │
└────────────┬───────────────┘
             │
    ┌────────┴────────┐
    │   TiDB Cloud    │   ← persists all portfolio content
    └─────────────────┘
             │
    ┌────────┴────────┐
    │  Vercel Blob    │   ← hosts uploaded portrait / project images
    └─────────────────┘
```

---

## Frontend Architecture

This project applies Angular 22's modern paradigm end-to-end — no legacy patterns.

| Decision | Approach |
|---|---|
| **Change detection** | Zoneless — `provideZonelessChangeDetection()`, no `zone.js` |
| **Reactivity** | Signals-first — `signal()`, `computed()`, `effect()`, `httpResource()` |
| **Components** | Standalone — no `NgModule`, every unit self-contained |
| **Strategy** | `ChangeDetectionStrategy.OnPush` on every component |
| **Forms** | Angular Signal Forms (`@angular/forms/signals`) — no `ReactiveFormsModule` |
| **Routing** | Lazy-loaded features via `loadComponent`; hash routing for GitHub Pages |
| **Typing** | Strict TypeScript throughout |
| **Styles** | BEM + SCSS — global design tokens in `src/styles/abstract/` |
| **i18n** | All UI strings in `src/assets/i18n/en.json`, resolved via `TranslateService` |
| **Accessibility** | Keyboard navigation, ARIA attributes, no bare `outline: none` |

### Layer Hierarchy

```
src/app/
├── core/                   # Root singletons, interceptors, guards
│   ├── guards/             # authGuard — protects /admin routes
│   ├── interceptors/       # authInterceptor — attaches Bearer token to API calls
│   └── services/
│       ├── data/           # One httpResource service per API endpoint
│       │   ├── experience.service.ts
│       │   ├── projects.service.ts
│       │   ├── skills.service.ts
│       │   ├── about.service.ts
│       │   ├── contact.service.ts   ← Formspree POST
│       │   ├── upload.service.ts    ← base64 image upload
│       │   └── admin.service.ts     ← token verification
│       └── platform/       # App-wide singletons
│           ├── auth.service.ts      ← Google JWT management
│           ├── seo.service.ts
│           └── theme.service.ts
├── shared/                 # Dumb components, utilities, enums
└── features/               # Smart components + facades (one folder per feature)
    ├── hero/
    ├── about/
    ├── experience/
    ├── skills/
    ├── projects/
    ├── contact/
    ├── share/
    └── admin/              # Admin panel — all sub-sections are lazy routes

src/styles/
├── abstract/     # _colors.scss, _variables.scss, _mixins.scss
└── base/         # _reset.scss, _typography.scss
```

Lower layers never import from higher layers: **Core → Shared → Features**.

---

## Services & Integrations

### API — Vercel Serverless Functions

The backend is a separate repository deployed to Vercel. Every content section is a REST resource:

| Endpoint | Used by |
|---|---|
| `GET /api/experience` | Experience section |
| `GET /api/projects` | Projects section |
| `GET /api/skills` | Skills section |
| `GET /api/about` | About section |
| `POST/PATCH/DELETE /api/*` | Admin panel CRUD (requires auth) |
| `POST /api/upload` | Image uploads from admin panel |
| `GET /api/admin/verify` | Validates Google JWT on the server side |

All `GET` requests are unauthenticated (public portfolio data). Write operations require a valid `Authorization: Bearer <google-id-token>` header, injected automatically by `authInterceptor`.

### Google OAuth (Admin Authentication)

The admin panel uses [Google Identity Services](https://developers.google.com/identity/gsi/web) (One Tap / Sign In With Google):

1. User clicks the Google Sign-In button rendered by the GSI SDK
2. Google returns an ID token (JWT) to the `callback` in `AdminFacade`
3. The token is stored in `localStorage` under the key `eo:admin:token`
4. `AuthService` validates the token's `exp` claim on every app load to auto-logout expired sessions
5. `authInterceptor` reads the token from `AuthService` and attaches it to every outbound API request
6. The API's `/admin/verify` endpoint independently validates the token server-side; if it fails, the frontend logs out and redirects to `/`

### Contact Form — Formspree

The contact form POSTs directly to Formspree (`https://formspree.io/f/xyzkybnl`). Formspree handles spam filtering and email forwarding — no backend code is involved.

### Image Upload

When an admin uploads a portrait or project image:
1. The browser reads the file as a `FileReader` data URL
2. The base64-encoded content + MIME type are POSTed to `/api/upload`
3. The API stores the image in Vercel Blob Storage and returns a public URL
4. The URL is saved alongside the content record in TiDB Cloud

---

## CI / CD

Pushes to `main` automatically build and deploy to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

```
git push origin main
       ↓
GitHub Actions (ubuntu-latest)
  npm ci
  npm run build --configuration=production
       ↓
peaceiris/actions-gh-pages
  → publishes dist/portfolio/browser to gh-pages branch
```

---

## Getting Started

**Prerequisites:** Node.js 22+, npm

```bash
npm install
npm start        # dev server at http://localhost:4200
npm run build    # production build → dist/
npm test         # unit tests
```

The dev server points at the live Vercel API (`environment.ts`), so content loads out of the box. To run your own API locally, update `apiBaseUrl` in `src/environments/environment.ts`.
