# Refactor: I18n Translate API

## Goal

Three concrete changes:

1. **Delete `I18nSection` enum** — replace all usages with literal section strings (`'HERO'`, `'NAV'`, etc.).
2. **Single `get()` call per consumer** — `TranslateService.get(section)` returns the whole section as `Signal<Record<string, string>>`; each key is accessed via a `computed`.
3. **Consistent injection style** — `private readonly translateService: TranslateService = inject(TranslateService)` everywhere; no vertical alignment of `:` or `=`.

---

## Files Changed

### `src/app/shared/services/translate.service.ts`

Remove `I18nSection` import. Change `get()` to accept a plain string and return the whole section:

```ts
get(section: string): Signal<Record<string, string>> {
  return computed(() => this.translations()[section] ?? {});
}
```

### `src/app/shared/enums/i18n-section.enum.ts`

Delete the file.

### Each facade + NavbarComponent

Pattern applied to all 7 consumers (hero, contact, projects, skills, about, experience facades + navbar):

- Remove `I18nSection` import.
- Rename injected service: `private readonly translateService: TranslateService = inject(TranslateService)`.
- Add one private field for the section: `private readonly translation: Signal<Record<string, string>> = this.translateService.get('SECTION')`.
- Replace every `this.translate.get(I18nSection.X, 'KEY')` with `computed(() => this.translation()['KEY'])`.
- No vertical alignment of `:` or `=` across properties.

---

## Example Diff (ContactFacade)

**Before:**
```ts
private readonly translate = inject(TranslateService);

readonly heading:            Signal<string> = this.translate.get(I18nSection.Contact, 'HEADING');
readonly nameLabel:          Signal<string> = this.translate.get(I18nSection.Contact, 'NAME_LABEL');
readonly namePlaceholder:    Signal<string> = this.translate.get(I18nSection.Contact, 'NAME_PLACEHOLDER');
```

**After:**
```ts
private readonly translateService: TranslateService = inject(TranslateService);
private readonly translation: Signal<Record<string, string>> = this.translateService.get('CONTACT');

readonly heading: Signal<string> = computed(() => this.translation()['HEADING']);
readonly nameLabel: Signal<string> = computed(() => this.translation()['NAME_LABEL']);
readonly namePlaceholder: Signal<string> = computed(() => this.translation()['NAME_PLACEHOLDER']);
```

---

## Files Touched

| File | Change |
|---|---|
| `shared/services/translate.service.ts` | New `get()` signature, remove `I18nSection` import |
| `shared/enums/i18n-section.enum.ts` | **Delete** |
| `features/hero/hero.facade.ts` | Section `'HERO'` |
| `features/contact/contact.facade.ts` | Section `'CONTACT'` |
| `features/projects/projects.facade.ts` | Section `'PROJECTS'` |
| `features/skills/skills.facade.ts` | Section `'SKILLS'` |
| `features/about/about.facade.ts` | Section `'ABOUT'` (includes BIO array + SOCIAL_LINKS ariaLabels) |
| `features/experience/experience.facade.ts` | Section `'EXPERIENCE'` |
| `shared/components/navbar/navbar.component.ts` | Section `'NAV'` (NAV_LINKS + resumeLabel) |

---

## Notes

- `about.facade.ts` uses the translate call inline inside `BIO: Signal<string>[]` and `SOCIAL_LINKS[].ariaLabel`. Both become `computed(() => this.translation()['KEY'])` — no structural change needed, just replace the call.
- `computed` is imported from `@angular/core` in every file that needs it (already present in most).
- `Signal` import stays; the `I18nSection` import is removed.
- No template changes required — the signal shapes are identical.
