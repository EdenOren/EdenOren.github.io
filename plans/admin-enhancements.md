# Plan: Admin Enhancements

Branch: `feature/44-admin-enhancements`

## Scope

1. Confirm-delete dialog (all three CRUD sections)
2. Form action buttons aligned to `flex-end`
3. Image upload for projects
4. Admin About section — bio text editing + portrait upload

---

## Part 1 — Confirm-Delete Dialog

### New: `ConfirmDialogComponent`

**Location:** `src/app/shared/components/confirm-dialog/`

Dumb component. Takes message via `input`, emits `confirm` and `cancel` via `output`. Renders as a fixed-position backdrop + centred card.

```
confirm-dialog.component.ts
confirm-dialog.component.html
confirm-dialog.component.scss
```

Template structure:
```html
<div class="confirm-dialog__backdrop" (click)="cancel.emit()">
  <div class="confirm-dialog__card" role="dialog" aria-modal="true"
       [attr.aria-label]="message()" (click)="$event.stopPropagation()">
    <p class="confirm-dialog__message">{{ message() }}</p>
    <div class="confirm-dialog__actions">
      <button class="confirm-dialog__cancel-btn" type="button"
              (click)="onCancel()">Cancel</button>
      <button class="confirm-dialog__confirm-btn" type="button"
              (click)="onConfirm()">Delete</button>
    </div>
  </div>
</div>
```

Inputs / outputs:
- `readonly message = input.required<string>()`
- `readonly confirm = output<void>()`
- `readonly cancel = output<void>()`

Methods `onConfirm()` and `onCancel()` emit and avoid inline `.emit()` in the template.

SCSS: `position: fixed; inset: 0; z-index: 1000` backdrop with semi-transparent background. Card centred via flexbox. Action buttons `justify-content: flex-end`.

### `AdminCrudFacade` changes

Add to the base class:

```ts
readonly pendingDeleteId: WritableSignal<string | null> = signal(null);
private readonly pendingDeleteLabel: WritableSignal<string> = signal('');
readonly isDeleteDialogOpen: Signal<boolean> = computed(() => this.pendingDeleteId() !== null);
readonly deleteDialogMessage: Signal<string> = computed(() =>
  this.pendingDeleteLabel()
    ? `Delete "${this.pendingDeleteLabel()}"?`
    : 'Are you sure you want to delete this item?'
);

requestDelete(id: string, label: string = ''): void {
  this.pendingDeleteLabel.set(label);
  this.pendingDeleteId.set(id);
}

confirmDelete(): void {
  const id = this.pendingDeleteId();
  if (id === null) { return; }
  this.pendingDeleteId.set(null);
  this.remove(id);
}

cancelDelete(): void {
  this.pendingDeleteId.set(null);
}
```

`remove()` stays the same in subclasses — `confirmDelete()` dispatches to the override via `this.remove(id)`.

### Component changes (all three)

Each component (experience, projects, skills) needs:

1. Expose `isDeleteDialogOpen`, `deleteDialogMessage`, `requestDelete`, `confirmDelete`, `cancelDelete` from the facade.
2. Change delete button: `(click)="requestDelete(item.id, item.displayName)"`.
   - Projects: pass `project.name`
   - Experience: pass `entry.role`
   - Skills: pass `group.label`
3. Add at the bottom of the template:

```html
@if (isDeleteDialogOpen()) {
  <app-confirm-dialog
    [message]="deleteDialogMessage()"
    (confirm)="confirmDelete()"
    (cancel)="cancelDelete()" />
}
```

4. Add `ConfirmDialogComponent` to the component's `imports` array.

---

## Part 2 — Form Actions Flex-End

In `src/styles/base/_admin-crud.scss`, update `__form-actions`:

```scss
&__form-actions {
  display: flex;
  justify-content: flex-end;   // ← add this
  gap: variables.$space-3;
  margin-top: variables.$space-6;
}
```

---

## Part 3 — Image Upload for Projects

### DB migration (manual — run in TiDB console)

```sql
ALTER TABLE projects ADD COLUMN image_url VARCHAR(500) NULL;
```

### Backend changes (`portfolio-api`)

**`lib/types.ts`** — add field to `Project`:
```ts
image_url: string | null;
```

**`api/upload.ts`** — new endpoint:
- `POST /api/upload`
- Body: `{ filename: string; mimeType: string; dataBase64: string }` (JSON)
- Auth: `verifyAdmin`
- Writes decoded buffer to `process.env.ASSETS_DIR` (default: `../portfolio/src/assets/images/`)
- Returns `{ url: string }` where url = `assets/images/<filename>` (sanitised)
- Filename sanitisation: strip non-alphanumeric except `.` and `-`, truncate to 100 chars, prepend timestamp to avoid collisions: `1234567890-photo.jpg`
- No new npm dependency needed (use Node `fs/promises` and `Buffer.from(dataBase64, 'base64')`)

**`api/projects/index.ts`** — update POST to include `image_url`:
```ts
await pool.execute(
  `INSERT INTO projects (id, name, description, github_url, image_url, tags, sort_order) VALUES (?,?,?,?,?,?,?)`,
  [ id, body.name, body.description, body.github_url ?? null,
    body.image_url ?? null, JSON.stringify(body.tags ?? []), body.sort_order ?? 0 ]
);
```

**`api/projects/[id].ts`** — update PUT to include `image_url`:
```ts
image_url = COALESCE(?, image_url),
```
Add `body.image_url ?? null` to the parameter array at the correct position.

### Frontend changes

**`src/app/features/projects/models/projects.models.ts`**:
```ts
export interface Project {
  id: string;
  name: string;
  description: string;
  github_url: string | null;
  image_url: string | null;   // ← add
  tags: string[];
  sort_order: number;
}
```

**`src/app/core/services/data/upload.service.ts`** — new:
```ts
@Service()
export class UploadService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  upload(file: File): Observable<{ url: string }> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const [header, dataBase64] = dataUrl.split(',');
        const mimeType = header.replace('data:', '').replace(';base64', '');
        this.httpClient
          .post<{ url: string }>(`${environment.apiBaseUrl}api/upload`, {
            filename: file.name,
            mimeType,
            dataBase64,
          })
          .subscribe(observer);
      };
      reader.readAsDataURL(file);
    });
  }
}
```

**`AdminProjectsFacade`** additions:
- `private readonly uploadService = inject(UploadService)`
- `readonly selectedFile: WritableSignal<File | null> = signal(null)`
- `readonly imagePreviewUrl: WritableSignal<string | null> = signal(null)`
- `setSelectedFile(file: File | null): void` — sets both signals; if file provided, uses `URL.createObjectURL(file)` for preview
- Update `openEdit(project)` — set `imagePreviewUrl` to `project.image_url`
- Update `openAdd()` — clear both signals
- Update `save()` — if `selectedFile()` is set, call `uploadService.upload(file)` first (using `switchMap`), get the url, then save project with the url; otherwise save with existing `image_url`

**`admin-projects.component.ts`** additions:
- Expose `selectedFile`, `imagePreviewUrl` from facade
- Add `onImageSelected(event: Event): void` — extracts `File` from `(event.target as HTMLInputElement).files![0]` and calls `facade.setSelectedFile(file)`

**`admin-projects.component.html`** — add inside `admin-crud__form-grid` (below GitHub URL field):
```html
<div class="admin-crud__field admin-crud__field--full">
  <label class="admin-crud__label">Project Image</label>
  @if (imagePreviewUrl()) {
    <img class="admin-crud__image-preview"
         [src]="imagePreviewUrl()"
         alt="Project image preview" />
  }
  <input class="admin-crud__input admin-crud__input--file"
         type="file"
         accept="image/*"
         (change)="onImageSelected($event)" />
</div>
```

**`_admin-crud.scss`** — add styles for image preview and file input:
```scss
&__image-preview {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid colors.$color-border;
  margin-bottom: variables.$space-2;
}

&__input--file {
  padding: variables.$space-2;
  cursor: pointer;
}
```

Also show the image in the project list item (admin-projects template) when `project.image_url` is set:
```html
@if (project.image_url) {
  <img class="admin-crud__item-thumb"
       [src]="project.image_url" alt="" />
}
```

Add `&__item-thumb` style: small thumbnail, ~80x60px, `object-fit: cover`, rounded.

---

## Part 4 — Admin About Section

### DB migration (manual — run in TiDB console)

```sql
ALTER TABLE about ADD COLUMN image_url VARCHAR(500) NULL;
```

### Backend changes

**`lib/types.ts`** — update `About`:
```ts
export interface About {
  id: string;
  bio_text: string;
  image_url: string | null;
}
```

**`api/about.ts`** — already selects `*`, so `image_url` will be returned once the column exists. No code change needed.

**`api/admin/about/index.ts`** — extend to also handle `image_url`:
```ts
const body = req.body as { bio_text?: string; image_url?: string };
// Both fields optional — only update what is provided
await pool.execute(
  `INSERT INTO about (id, bio_text, image_url) VALUES ('about-1', ?, ?)
   ON DUPLICATE KEY UPDATE bio_text = VALUES(bio_text), image_url = VALUES(image_url)`,
  [body.bio_text ?? '', body.image_url ?? null]
);
```
Remove the hard requirement on `bio_text` (both fields optional but at least one must be present — add validation).

### Frontend: About model

New file `src/app/features/about/models/about.models.ts`:
```ts
export interface AboutData {
  id: string;
  bio_text: string;
  image_url: string | null;
}
```

### Frontend: `AboutService`

Implement `src/app/core/services/data/about.service.ts`:
```ts
@Service()
export class AboutService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly resource: HttpResourceRef<AboutData | undefined> =
    httpResource<AboutData>(() => `${environment.apiBaseUrl}api/about`);

  readonly data: Signal<AboutData | undefined> = computed(() => this.resource.value());
  readonly isLoading: Signal<boolean> = this.resource.isLoading;

  reload(): void { this.resource.reload(); }

  update(payload: Partial<Omit<AboutData, 'id'>>): Observable<{ ok: boolean }> {
    return this.httpClient.put<{ ok: boolean }>(
      `${environment.apiBaseUrl}api/admin/about`,
      payload
    );
  }
}
```

### Frontend: `AboutFacade` — integrate API data

Update `src/app/features/about/facades/about.facade.ts`:
- Inject `AboutService`
- Expose `aboutData: Signal<AboutData | undefined> = this.aboutService.data`
- Expose `bioParagraphs: Signal<string[]> = computed(() => { const text = this.aboutData()?.bio_text; return text ? text.split('\n\n').filter(p => p.trim()) : []; })`
- Keep `SOCIAL_LINKS` and `translation` as-is (heading remains from i18n)
- Expose `portraitUrl: Signal<string | null> = computed(() => this.aboutData()?.image_url ?? null)`

### Frontend: `AboutComponent` — show portrait + API bio

`about.component.ts` — expose `bioParagraphs` and `portraitUrl` from facade.

`about.component.html` — update the portrait frame and bio:
```html
<!-- portrait col -->
@if (portraitUrl()) {
  <img class="about__portrait" [src]="portraitUrl()" alt="Eden Oren" />
} @else {
  <div class="about__frame" aria-hidden="true"> ... </div>
}

<!-- bio -->
@if (bioParagraphs().length > 0) {
  @for (paragraph of bioParagraphs(); track paragraph) {
    <p class="about__bio-paragraph">{{ paragraph }}</p>
  }
} @else {
  <!-- fallback to i18n while API loads -->
  <p class="about__bio-paragraph">{{ t['BIO_1'] }}</p>
  <p class="about__bio-paragraph">{{ t['BIO_2'] }}</p>
  <p class="about__bio-paragraph">{{ t['BIO_3'] }}</p>
}
```

### Frontend: `AdminAboutComponent`

New file tree:
```
src/app/features/admin/components/admin-about/
├── admin-about.component.ts
├── admin-about.component.html
├── admin-about.component.scss
└── facades/
    └── admin-about.facade.ts
```

**`AdminAboutFacade`** (`@Service({ autoProvided: false })`):
- Inject `AboutService` and `UploadService` (and `DestroyRef`)
- `readonly aboutData: Signal<AboutData | undefined> = computed(() => this.aboutService.data())`
- `readonly bioText: WritableSignal<string> = linkedSignal(() => this.aboutData()?.bio_text ?? '')`
- `readonly imagePreviewUrl: WritableSignal<string | null> = linkedSignal(() => this.aboutData()?.image_url ?? null)`
- `readonly selectedFile: WritableSignal<File | null> = signal(null)`
- `readonly isSaving: WritableSignal<boolean> = signal(false)`
- `setSelectedFile(file: File | null): void`
- `onBioTextChange(value: string): void` — updates `bioText` signal
- `save(): void` — if file selected, upload first then PUT with both fields; else PUT with only changed bio_text; uses `takeUntilDestroyed`

**`admin-about.component.html`**:
```html
<div class="admin-about">
  <div class="admin-about__header">
    <h2 class="admin-about__title">About</h2>
  </div>

  <div class="admin-about__form">
    <div class="admin-about__field">
      <label class="admin-about__label">Portrait Image</label>
      @if (imagePreviewUrl()) {
        <img class="admin-about__portrait-preview" [src]="imagePreviewUrl()" alt="Portrait preview" />
      }
      <input class="admin-about__file-input" type="file" accept="image/*"
             (change)="onImageSelected($event)" />
    </div>

    <div class="admin-about__field">
      <label class="admin-about__label">Bio (use blank lines to separate paragraphs)</label>
      <textarea class="admin-about__textarea" rows="8"
                [value]="bioText()"
                (input)="onBioInput($event)"></textarea>
    </div>

    <div class="admin-about__actions">
      <button class="admin-about__save-btn" type="button"
              [disabled]="isSaving()"
              (click)="save()">
        {{ isSaving() ? 'Saving…' : 'Save' }}
      </button>
    </div>
  </div>
</div>
```

Note: uses `(input)="onBioInput($event)"` (component method) and `(change)="onImageSelected($event)"` (component method) — no inline `.set()` in template.

**`admin-about.component.ts`** — exposes `imagePreviewUrl`, `bioText`, `isSaving` from facade; methods `onImageSelected(event)`, `onBioInput(event)`, `save()`.

**`admin-about.component.scss`** — similar styles to `_admin-crud.scss` but scoped to `.admin-about`.

### Frontend: Routing + Sidebar

**`admin.routes.ts`** — add about route:
```ts
{
  path: 'about',
  loadComponent: () =>
    import('./components/admin-about/admin-about.component').then(m => m.AdminAboutComponent),
},
```

**`admin.component.html`** — add About nav link in the sidebar (above Experience or as first item):
```html
<a class="admin-panel__nav-link"
   routerLink="/admin/about"
   routerLinkActive="admin-panel__nav-link--active">
  About
</a>
```

---

## i18n

Add to `en.json` → `ADMIN` section:
```json
"CONFIRM_DELETE_ITEM": "Are you sure you want to delete \"{{label}}\"?",
"UPLOAD_IMAGE": "Upload image",
"BIO_LABEL": "Bio",
"BIO_HINT": "Use blank lines to separate paragraphs.",
"SAVE": "Save",
"SAVING": "Saving…",
"PORTRAIT_LABEL": "Portrait Image"
```

Note: `CONFIRM_DELETE` already exists in `ADMIN`. It can stay as a fallback generic message.

---

## Implementation Order

1. Part 2 (CSS flex-end) — trivial, low-risk
2. Part 1 (ConfirmDialog) — no backend needed
3. Part 3 (Project image) — backend + frontend
4. Part 4 (Admin About) — backend + frontend

---

## Open Questions / Production Notes

- **Image storage in production**: The `api/upload.ts` endpoint writes to the local filesystem (`src/assets/images/`). On Vercel serverless, the filesystem is read-only at deploy time. For production, either commit uploaded images to the repo (acceptable for a portfolio) or migrate to Vercel Blob / Cloudinary later. The current plan covers local development only.
- **`ASSETS_DIR` env var**: Backend should read `process.env['ASSETS_DIR']` with a fallback of `path.resolve(__dirname, '../../../portfolio/src/assets/images')` (relative from `api/` folder). The user should set this in a local `.env` file.
