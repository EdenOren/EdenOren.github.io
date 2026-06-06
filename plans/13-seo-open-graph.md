# Plan: feature/13-seo-open-graph

## Context

- Deployed to GitHub Pages at `https://edenoren.github.io/EdenOren.github.io2/`  
  (derived from `deploy.yml` `--base-href /EdenOren.github.io2/`).
- Router uses `HashLocationStrategy`, so canonical URL is the base origin + path only
  (no `#` fragment in canonical — crawlers see the static shell).
- No SSR / prerendering — all meta tags are set at runtime via Angular services.
- `@angular/platform-browser` is already a dependency; `Meta` and `Title` are available
  with no extra install.

## Approach

Use Angular's built-in `Meta` and `Title` services from `@angular/platform-browser`.
They are the correct tool for a CSR-only Angular app: they write directly to `<head>` at
runtime and are tree-shakeable. No third-party library is needed.

A single root-singleton `SeoService` (in `src/app/core/services/seo.service.ts`) calls
these two services once on app init. The app is a single-page portfolio with one "page",
so all tags are static — no per-route updates are needed.

## Meta Tags to Set

| Tag | Value |
|---|---|
| `<title>` | `Eden Oren — Frontend Developer` |
| `meta[name="description"]` | `Portfolio of Eden Oren, a frontend developer specialising in Angular, TypeScript, and modern CSS.` |
| `meta[name="author"]` | `Eden Oren` |
| `meta[property="og:type"]` | `website` |
| `meta[property="og:title"]` | `Eden Oren — Frontend Developer` |
| `meta[property="og:description"]` | same as description above |
| `meta[property="og:url"]` | `https://edenoren.github.io/EdenOren.github.io2/` |
| `meta[property="og:image"]` | `https://edenoren.github.io/EdenOren.github.io2/assets/og-image.png` |
| `meta[property="og:image:width"]` | `1200` |
| `meta[property="og:image:height"]` | `630` |
| `meta[property="og:site_name"]` | `Eden Oren` |
| `meta[name="twitter:card"]` | `summary_large_image` |
| `meta[name="twitter:title"]` | `Eden Oren — Frontend Developer` |
| `meta[name="twitter:description"]` | same as description above |
| `meta[name="twitter:image"]` | same as og:image |
| `link[rel="canonical"]` | `https://edenoren.github.io/EdenOren.github.io2/` |

## og:image

Create a static PNG at `src/assets/og-image.png` (1200 × 630 px) — a dark editorial card
matching the Signal Luxe palette (dark background, Cormorant name, emerald accent, role
label). This file is served by the GitHub Pages deploy at the URL above with no build step.

## i18n

No new i18n keys needed. Meta content is not UI text visible to the user — it is
machine-readable metadata consumed by crawlers and social platforms. Hard-coding the values
inside `SeoService` as typed constants is correct here.

## index.html Updates

Replace the placeholder `<title>Portfolio</title>` with the real title as a static
fallback for crawlers that do not execute JS. Add a static `<meta name="description">`
fallback for the same reason. Angular's `Title` and `Meta` services will overwrite these
at runtime.

## Implementation Checklist

- [ ] Create `src/assets/og-image.png` (1200 × 630, Signal Luxe dark card design).
- [ ] Update `src/index.html`: set `<title>Eden Oren — Frontend Developer</title>`
      and add a static `<meta name="description" content="...">` fallback.
- [ ] Create `src/app/core/services/seo.service.ts` — `@Service()` root singleton that
      injects `Meta` and `Title` and exposes a single `apply()` method that sets all tags
      listed above. Use a `static readonly` constant object for the tag values.
- [ ] Call `seoService.apply()` inside `provideAppInitializer()` in `app.config.ts`,
      alongside the existing `TranslateService.load()` call.
- [ ] Verify tags appear in DevTools Elements panel under `<head>` after hot reload.
- [ ] Paste the deployed URL into the [Twitter Card Validator](https://cards-dev.twitter.com/validator)
      and [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to confirm
      the preview image and text resolve correctly.
- [ ] Update `tasks/backlog.md`: move `feature/13-seo-open-graph` from Future to Done.
