# Plan: refactor/feature-folder-structure

## Goal
Align the codebase with the CLAUDE.md folder structure standard:
- Feature folders get subfolders: `facades/`, `enums/`, `utils/`, `models/`, `components/`
- Feature services (data) move to `core/services/data/`
- Platform services move to `core/services/platform/`

---

## Current State

```
core/services/
  analytics.service.ts       ← needs to move → platform/
  seo.service.ts             ← needs to move → platform/
  theme.service.ts           ← needs to move → platform/

features/
  about/
    about.component.ts/html/scss   ← stays
    about.constants.ts             ← → utils/about.constants.ts
    about.enums.ts                 ← → enums/about.enums.ts
    about.facade.ts                ← → facades/about.facade.ts
    about.service.ts               ← → core/services/data/about.service.ts

  admin/
    admin.component.ts/scss        ← stays
    admin.facade.ts                ← → facades/admin.facade.ts
    admin.service.ts               ← → core/services/data/admin.service.ts

  contact/
    contact.component.ts/html/scss ← stays
    contact.constants.ts           ← → utils/contact.constants.ts
    contact.enums.ts               ← → enums/contact.enums.ts
    contact.facade.ts              ← → facades/contact.facade.ts
    contact.service.ts             ← → core/services/data/contact.service.ts

  experience/
    experience.component.ts/html/scss ← stays
    experience.constants.ts           ← → utils/experience.constants.ts
    experience.facade.ts              ← → facades/experience.facade.ts
    experience.service.ts             ← → core/services/data/experience.service.ts

  hero/
    hero.component.ts/html/scss    ← stays
    hero.facade.ts                 ← → facades/hero.facade.ts

  home/
    home.component.ts/html         ← stays (no subfolders needed)

  projects/
    projects.component.ts/html/scss ← stays
    projects.constants.ts           ← → utils/projects.constants.ts
    projects.facade.ts              ← → facades/projects.facade.ts
    projects.service.ts             ← → core/services/data/projects.service.ts

  skills/
    skills.component.ts/html/scss  ← stays
    skills.constants.ts            ← → utils/skills.constants.ts
    skills.enums.ts                ← → enums/skills.enums.ts
    skills.facade.ts               ← → facades/skills.facade.ts
    skills.service.ts              ← → core/services/data/skills.service.ts
```

---

## Target State

```
core/services/
  data/
    about.service.ts
    admin.service.ts
    contact.service.ts
    experience.service.ts
    projects.service.ts
    skills.service.ts
  platform/
    analytics.service.ts
    seo.service.ts
    theme.service.ts

features/
  about/
    enums/about.enums.ts
    facades/about.facade.ts
    utils/about.constants.ts
    about.component.ts/html/scss
  admin/
    facades/admin.facade.ts
    admin.component.ts/scss
  contact/
    enums/contact.enums.ts
    facades/contact.facade.ts
    utils/contact.constants.ts
    contact.component.ts/html/scss
  experience/
    facades/experience.facade.ts
    utils/experience.constants.ts
    experience.component.ts/html/scss
  hero/
    facades/hero.facade.ts
    hero.component.ts/html/scss
  home/
    home.component.ts/html
  projects/
    facades/projects.facade.ts
    utils/projects.constants.ts
    projects.component.ts/html/scss
  skills/
    enums/skills.enums.ts
    facades/skills.facade.ts
    utils/skills.constants.ts
    skills.component.ts/html/scss
```

---

## Steps

### Phase 1 — Platform services
1. Create `core/services/platform/`
2. Move `analytics.service.ts`, `seo.service.ts`, `theme.service.ts` into it
3. Update all imports across the app pointing to these three files

### Phase 2 — Data services
4. Create `core/services/data/`
5. Move each `[feature].service.ts` into it (about, admin, contact, experience, projects, skills)
6. Update all imports pointing to each service (primarily the facades)

### Phase 3 — Feature facades
7. For each feature: create `facades/` subfolder, move `[feature].facade.ts` into it
8. Update all imports pointing to each facade (primarily the feature smart component)

### Phase 4 — Feature enums
9. For features with enums (about, contact, skills): create `enums/` subfolder, move `[feature].enums.ts` into it
10. Update all imports pointing to each enums file

### Phase 5 — Feature constants → utils
11. For features with constants (about, contact, experience, projects, skills): create `utils/` subfolder, move `[feature].constants.ts` into it
12. Update all imports pointing to each constants file

### Phase 6 — Verify
13. Run `ng build` — must be zero errors
14. Fix any missed import paths

---

## Import Path Reference

After the refactor, the key import paths from each file type:

| From | To data service | To platform service |
|------|----------------|---------------------|
| `features/[f]/facades/[f].facade.ts` | `../../../core/services/data/[f].service.ts` | `../../../core/services/platform/[s].service.ts` |
| `features/[f]/[f].component.ts` | — (facade only) | `../../core/services/platform/[s].service.ts` |

| From component | To facade | To enums | To utils |
|----------------|-----------|----------|----------|
| `features/[f]/[f].component.ts` | `./facades/[f].facade.ts` | `./enums/[f].enums.ts` | `./utils/[f].constants.ts` |

---

## Notes
- No barrel `index.ts` files — always import from direct file paths.
- `core/enums/core.enums.ts` stays in place (not a data or platform service concern).
- `shared/` folder needs no changes in this refactor.
- No logic changes — pure file moves + import path updates.
