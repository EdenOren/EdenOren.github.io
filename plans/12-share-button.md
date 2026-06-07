# Plan: feature/12-share-button

## Behaviour by Platform

**Mobile (Web Share API available):** clicking the share button calls `navigator.share()` directly — the OS native sheet handles everything (iMessage, WhatsApp, AirDrop, etc.). No custom UI needed.

**Desktop (Web Share API unavailable):** clicking the share button opens a small popover panel with explicit share targets. The panel animates in/out via `animate.enter` / `animate.leave`.

Detection is `typeof navigator !== 'undefined' && 'share' in navigator`. This aligns naturally with mobile browsers (iOS Safari, Android Chrome) having it and desktop browsers largely not, without any UA sniffing.

---

## Share Targets (desktop panel)

| Target       | URL scheme |
|--------------|------------|
| WhatsApp     | `https://api.whatsapp.com/send?text=<text>%20<url>` |
| Email        | `mailto:?subject=<title>&body=<text>%20<url>` |
| Copy link    | clipboard API — shows inline "Copied!" feedback for 2 s, then resets |

Slack, Discord, Teams, X, LinkedIn, etc. are all covered by Copy Link — the user copies and pastes into whichever app they use. No dedicated share URL exists for Slack.

---

## Architecture

### `ShareService` — `core/services/platform/share.service.ts`
Root-provided singleton (`@Service()`). Responsibilities:
- `readonly canUseNativeShare: boolean` — computed once at construction time.
- `nativeShare(data: ShareData): Promise<void>` — calls `navigator.share()`.
- `buildTargets(url: string, title: string, text: string): ShareTarget[]` — returns the desktop target list with pre-built URLs. Returns the same order as the table above.
- `copyToClipboard(url: string): Promise<void>` — `navigator.clipboard.writeText()`.

### `ShareFacade` — `features/share/facades/share.facade.ts`
`@Service({ autoProvided: false })`. Injected by the smart component. Responsibilities:
- Injects `ShareService`.
- Exposes `readonly canUseNativeShare: Signal<boolean>` (wraps the service boolean).
- Exposes `readonly targets: Signal<ShareTarget[]>` — built from `ShareService.buildTargets()` using the canonical portfolio URL + i18n-resolved title/text.
- `readonly isPanelOpen: WritableSignal<boolean>` — controls popover visibility.
- `readonly isCopied: WritableSignal<boolean>` — drives the "Copied!" label swap; auto-resets after 2 s via `setTimeout` (documented: UI feedback timer, not reactive state).
- `togglePanel(): void`, `closePanel(): void`, `share(target: ShareTargetId): void`, `copyLink(): void`.

### `ShareComponent` — `features/share/share.component.ts`
Smart component. Provides `ShareFacade` in its `providers` array. Injected nowhere else. Placed in `FooterComponent`'s template.

Template logic:
- If `facade.canUseNativeShare()` → render a single "Share" button; click calls `facade.nativeShare()`.
- Else → render trigger button + `@if (facade.isPanelOpen())` popover with the target list.

### `ShareTarget` — `features/share/models/share.models.ts`
```ts
export interface ShareTarget {
  readonly id: ShareTargetId;
  readonly labelKey: string; // i18n key
  readonly url: string;
  readonly iconAsset: string; // path under assets/icons/
}
```

### `ShareTargetId` enum — `features/share/enums/share-target.enum.ts`
```ts
export enum ShareTargetId {
  WhatsApp = 'WHATSAPP',
  Email = 'EMAIL',
  CopyLink = 'COPY_LINK',
}
```

---

## i18n Keys (`en.json`)

```json
"SHARE": {
  "BUTTON_LABEL": "Share",
  "PANEL_LABEL": "Share this portfolio",
  "WHATSAPP": "WhatsApp",
  "EMAIL": "Email",
  "COPY_LINK": "Copy link",
  "COPIED": "Copied!"
}
```

---

## SCSS / Animation

Panel uses `animate.enter="share-panel-in"` and `animate.leave="share-panel-out"`. Keyframes defined in `share.component.scss`:
- Enter: fade + translate up 6 px → natural position over 180 ms ease-out.
- Leave: fade + translate down 4 px over 140 ms ease-in.

Each target row has an emerald hover state (`$color-accent` left border + subtle background lift) consistent with the Signal Luxe palette. Icons are SVG assets (`assets/icons/whatsapp.svg`, etc.) rendered via `NgOptimizedImage` with fixed dimensions.

Close-on-outside-click: handled via a `(document:click)` host binding on `ShareComponent` that calls `facade.closePanel()` when the click target is outside the component's element ref.

---

## Placement

`ShareComponent` is added to `FooterComponent`'s template. The footer already exists at `src/app/shared/components/footer/`. Because `FooterComponent` is a shared dumb component it must not inject the facade — `ShareComponent` is a self-contained smart component that provides its own facade, so the footer just renders `<app-share />` with no inputs.

---

## Accessibility

- Trigger button has `aria-haspopup="true"` and `aria-expanded` bound to `facade.isPanelOpen()`.
- Panel has `role="menu"`. Each target is a `role="menuitem"`.
- `Escape` key closes the panel (host `keydown.escape` binding).
- Copy Link announces the confirmation via `aria-live="polite"` region so screen readers hear "Copied!".

---

## Implementation Checklist

- [ ] Create `features/share/enums/share-target.enum.ts` — `ShareTargetId` enum.
- [ ] Create `features/share/models/share.models.ts` — `ShareTarget` interface.
- [ ] Create `core/services/platform/share.service.ts` — detection, `nativeShare`, `buildTargets`, `copyToClipboard`.
- [ ] Create `features/share/facades/share.facade.ts` — `isPanelOpen`, `isCopied`, `targets`, `canUseNativeShare`, action methods.
- [ ] Create `features/share/share.component.ts` + `.html` + `.scss` — smart component with native/custom branch, popover, keyboard and outside-click handling.
- [ ] Add social SVG icons to `assets/icons/` (whatsapp, envelope, link).
- [ ] Add `SHARE` key group to `src/assets/i18n/en.json`.
- [ ] Add `<app-share />` to `footer.component.html`.
- [ ] Import `ShareComponent` in `FooterComponent`'s `imports` array.
- [ ] Manual verify: mobile viewport → native sheet appears. Desktop → custom panel opens, all five targets open correct URLs or copy correctly. Escape closes panel. Tab navigation reaches all targets.
