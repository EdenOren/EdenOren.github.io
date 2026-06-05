# Contributing

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — GitHub Pages deploys from here. Never push directly. |
| `development` | Integration — all PRs target this branch. |
| `feature/name` | New features (e.g. `feature/hero`, `feature/dark-light-mode`) |
| `bugfix/name` | Bug fixes (e.g. `bugfix/navbar-scroll`) |

## Workflow

1. Branch off `development`: `git checkout -b feature/my-feature development`
2. Implement the feature following standards in `CLAUDE.md`
3. Open a PR targeting `development`
4. After PR is merged to `development` and tested, open a PR from `development` → `main` to release

## Commit Convention

```
feat: add hero section
fix: correct navbar scroll offset
refactor: extract translate service
docs: update CLAUDE.md
```

## Code Standards

See [CLAUDE.md](./CLAUDE.md) for full architectural standards.

Quick rules:
- No `any` types
- `ChangeDetectionStrategy.OnPush` on every component
- All static text in `src/assets/i18n/en.json`
- Native Angular components first, Angular Material second
- BEM for all SCSS
- No `::ng-deep`
