# Plan: Backend — TiDB Cloud + Vercel API

## Goal
Replace all hard-coded facade data with real database-backed HTTP responses.
Admin panel performs authenticated CRUD. Public FE reads via `httpResource()`.

## Architecture
```
GitHub Pages (Angular FE)
        ↓ httpResource()
Vercel Serverless Functions (Node.js / TypeScript)
        ↓ mysql2 connection pool
TiDB Cloud Serverless (MySQL-compatible)
```

---

## Stage 1 — TiDB Cloud Setup
- [ ] Create a free serverless cluster in TiDB Cloud
- [ ] Create database `portfolio`
- [ ] Run schema SQL (experience, projects, skills, about tables)
- [ ] Seed initial data (current hard-coded facade values)
- [ ] Save connection string (host, user, password, port, ssl cert)

## Stage 2 — Vercel API Project
- [ ] Create new GitHub repo `portfolio-api`
- [ ] Init Node.js / TypeScript project with Vercel functions
- [ ] Add `mysql2` + `google-auth-library` dependencies
- [ ] Create `lib/db.ts` — shared connection pool
- [ ] Create `lib/auth.ts` — Google JWT verification middleware
- [ ] Implement public GET routes: `/api/experience`, `/api/projects`, `/api/skills`, `/api/about`
- [ ] Implement admin CRUD routes (protected): `/api/admin/experience`, `/api/admin/projects`, `/api/admin/skills`, `/api/admin/about`
- [ ] Add CORS headers (allow GitHub Pages origin)
- [ ] Deploy to Vercel, add TiDB env vars in Vercel dashboard

## Stage 3 — Angular Integration
- [ ] Create `src/environments/environment.ts` and `environment.production.ts` with `apiBaseUrl`
- [ ] Configure `angular.json` file replacements for build
- [ ] Implement `httpResource()` in each data service (`experience`, `projects`, `skills`, `about`, `admin`)
- [ ] Update facades to inject services and derive signals from resource state
- [ ] Remove hard-coded ENTRIES arrays and `setTimeout` loading simulation
- [ ] Update `AuthService` — send Google credential to BE or validate locally for admin routes

## Stage 4 — Admin Panel Wiring
- [ ] Connect admin CRUD forms to `AdminService` (POST / PUT / DELETE via `httpResource` or `HttpClient`)
- [ ] Handle optimistic UI or reload after mutation
- [ ] Test full round-trip: admin saves → DB updates → public FE reflects change

---

## Database Schema

```sql
CREATE TABLE experience (
  id          VARCHAR(36)  PRIMARY KEY,
  role        VARCHAR(100) NOT NULL,
  company     VARCHAR(100) NOT NULL,
  period      VARCHAR(20)  NOT NULL,
  is_current  BOOLEAN      NOT NULL DEFAULT FALSE,
  description TEXT         NOT NULL,
  tags        JSON         NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
);

CREATE TABLE projects (
  id          VARCHAR(36)  PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description TEXT         NOT NULL,
  github_url  VARCHAR(255),
  tags        JSON         NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0
);

CREATE TABLE skills (
  id         VARCHAR(36)  PRIMARY KEY,
  category   VARCHAR(100) NOT NULL,
  name       VARCHAR(100) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE about (
  id       VARCHAR(36) PRIMARY KEY,
  bio_text TEXT        NOT NULL
);
```

## Seed Data (from current facades)

```sql
INSERT INTO experience (id, role, company, period, is_current, description, tags, sort_order) VALUES
  ('exp-1', 'Frontend Developer', 'Freelance', '2023', TRUE,
   'Building accessible, performant web applications for clients across fintech and SaaS. Specializing in Angular with signals, design systems, and component architecture.',
   '["Angular","TypeScript","SCSS","Design Systems"]', 1),
  ('exp-2', 'Junior Frontend Developer', 'Startup', '2022', FALSE,
   'Developed and maintained React-based dashboards. Improved Lighthouse scores by 40% through code-splitting and image optimization.',
   '["React","TypeScript","Performance"]', 2),
  ('exp-3', 'Web Developer Intern', 'Agency', '2021', FALSE,
   'Built marketing landing pages and maintained client websites. Wrote semantic HTML and modular CSS for a portfolio of 20+ clients.',
   '["HTML","CSS","JavaScript"]', 3);
```

---

## API Contract

### Public (no auth)
| Method | Path | Response |
|--------|------|----------|
| GET | `/api/experience` | `ExperienceEntry[]` |
| GET | `/api/projects` | `Project[]` |
| GET | `/api/skills` | `Skill[]` |
| GET | `/api/about` | `About` |

### Admin (Bearer: Google ID token)
| Method | Path | Body |
|--------|------|------|
| POST | `/api/admin/experience` | `ExperienceEntry` (no id) |
| PUT | `/api/admin/experience/:id` | Partial `ExperienceEntry` |
| DELETE | `/api/admin/experience/:id` | — |
| POST | `/api/admin/projects` | `Project` (no id) |
| PUT | `/api/admin/projects/:id` | Partial `Project` |
| DELETE | `/api/admin/projects/:id` | — |
| POST | `/api/admin/skills` | `Skill` (no id) |
| PUT | `/api/admin/skills/:id` | Partial `Skill` |
| DELETE | `/api/admin/skills/:id` | — |
| PUT | `/api/admin/about` | `{ bio_text: string }` |
