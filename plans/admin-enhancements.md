# Plan: Admin Enhancements

## Status

| Part | Description | Status |
|---|---|---|
| 1 | Confirm-delete dialog | ✅ Done — PR #44 |
| 2 | Form actions flex-end | ✅ Done — PR #44 |
| 3 | Project image upload | ✅ Done — PR #44 |
| 4 | Admin About section | 🔲 Todo |

---

## Part 4 — Admin About Section

Branch: `feature/45-admin-about`

### DB migration (run manually in TiDB console)

```sql
USE portfolio;
ALTER TABLE about ADD COLUMN image_url VARCHAR(500) NULL;
```

---

### Backend (`portfolio-api`) — 2 files

**`lib/types.ts`** — add `image_url` to `About`:
```ts
export interface About {
  id: string;
  bio_text: string;
  image_url: string | null;
}
```

**`api/admin/about/index.ts`** — accept both `bio_text` and `image_url`; neither individually required:
```ts
const body = req.body as { bio_text?: string; image_url?: string };
if (!body.bio_text && body.image_url === undefined) {
  res.status(400).json({ error: 'Provide at least one of: bio_text, image_url' });
  return;
}
await pool.execute(
  `INSERT INTO about (id, bio_text, image_url) VALUES ('about-1', ?, ?)
   ON DUPLICATE KEY UPDATE bio_text = VALUES(bio_text), image_url = VALUES(image_url)`,
  [body.bio_text ?? '', body.image_url ?? null]
);
```

`api/about.ts` — already `SELECT *`, no change needed once column exists.

---

### Frontend — files to create / modify

#### New: `src/app/features/about/models/about.models.ts`
```ts
export interface AboutData {
  id: string;
  bio_text: string;
  image_url: string | null;
}
```

#### Implement: `src/app/core/services/data/about.service.ts`
- `httpResource<AboutData>` pointing to `api/about`
- Expose `data: Signal<AboutData | undefined>`, `isLoading: Signal<boolean>`
- `update(payload: Partial<Omit<AboutData, 'id'>>): Observable<{ ok: boolean }>` — PUT to `api/admin/about`
- `reload(): void`

#### Update: `src/app/features/about/facades/about.facade.ts`
- Inject `AboutService`
- Add `private readonly aboutService: AboutService = inject(AboutService)`
- Add `readonly portraitUrl: Signal<string | null> = computed(() => this.aboutService.data()?.image_url ?? null)`
- Add `readonly bioParagraphs: Signal<string[]> = computed(() => { const text = this.aboutService.data()?.bio_text; return text ? text.split('\n\n').filter(p => p.trim().length > 0) : []; })`

#### Update: `src/app/features/about/about.component.ts`
- Expose `portraitUrl` and `bioParagraphs` from facade

#### Update: `src/app/features/about/about.component.html`
Portrait column — show portrait image if set, otherwise existing EO frame:
```html
@if (portraitUrl()) {
  <img class="about__portrait" [src]="portraitUrl()" alt="Eden Oren" />
} @else {
  <div class="about__frame" aria-hidden="true">
    ...existing frame markup...
  </div>
}
```

Bio — use API paragraphs with i18n fallback while loading or empty:
```html
@if (bioParagraphs().length > 0) {
  @for (paragraph of bioParagraphs(); track paragraph) {
    <p class="about__bio-paragraph">{{ paragraph }}</p>
  }
} @else {
  <p class="about__bio-paragraph">{{ t['BIO_1'] }}</p>
  <p class="about__bio-paragraph">{{ t['BIO_2'] }}</p>
  <p class="about__bio-paragraph">{{ t['BIO_3'] }}</p>
}
```

#### New: `src/app/features/admin/components/admin-about/`

```
admin-about.component.ts
admin-about.component.html
admin-about.component.scss
facades/admin-about.facade.ts
```

**`AdminAboutFacade`** (`@Service({ autoProvided: false })`):
- Inject `AboutService`, `UploadService`, `DestroyRef`
- `readonly bioText: WritableSignal<string> = linkedSignal(() => this.aboutService.data()?.bio_text ?? '')`
- `readonly imagePreviewUrl: WritableSignal<string | null> = linkedSignal(() => this.aboutService.data()?.image_url ?? null)`
- `private readonly selectedFile: WritableSignal<File | null> = signal(null)`
- `readonly isSaving: WritableSignal<boolean> = signal(false)`
- `setSelectedFile(file: File | null): void`
- `setBioText(value: string): void`
- `save(): void` — if file pending: upload → PUT `{ bio_text, image_url: url }`; else PUT `{ bio_text }` only; uses `takeUntilDestroyed`; sets `isSaving` around the call

**`AdminAboutComponent`** — smart, injects facade only:
- Expose `bioText`, `imagePreviewUrl`, `isSaving` as `Signal<T>` (not Writable)
- Methods: `onImageSelected(file: File | null)`, `onBioInput(event: Event)`, `save()`
- Use `ImageUploadComponent` for portrait, textarea for bio, Save button disabled while `isSaving()`

#### Update: `src/app/features/admin/admin.routes.ts`
Add:
```ts
{
  path: 'about',
  loadComponent: () =>
    import('./components/admin-about/admin-about.component').then(m => m.AdminAboutComponent),
},
```

#### Update: `src/app/features/admin/admin.component.html`
Add About link as first item in sidebar nav:
```html
<a class="admin-panel__nav-link"
   routerLink="/admin/about"
   routerLinkActive="admin-panel__nav-link--active">
  About
</a>
```

---

### Notes
- Bio is plain text; blank lines between paragraphs define the split
- `ImageUploadComponent` (already in shared) handles drag-drop and preview — reused here
- `bioParagraphs` falls back to i18n `BIO_1/2/3` so the about page is never blank
- Portrait `<img>` is dynamic (blob URL) — no `NgOptimizedImage` needed
