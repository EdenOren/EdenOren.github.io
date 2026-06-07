import { Service, Signal, WritableSignal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Service({ autoProvided: false })
export class ShareFacade {
  private readonly translateService: TranslateService = inject(TranslateService);

  private static readonly SHARE_URL: string = 'https://edenoren.github.io/EdenOren.github.io2/';
  private static readonly SHARE_TITLE: string = 'Eden Oren — Frontend Developer';
  private static readonly SHARE_TEXT: string = "Check out Eden Oren's portfolio";

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('SHARE') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly canUseNativeShare: boolean =
    typeof navigator !== 'undefined' && 'share' in navigator;

  readonly isPanelOpen: WritableSignal<boolean> = signal(false);
  readonly isCopied: WritableSignal<boolean> = signal(false);

  readonly whatsappUrl: string = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    ShareFacade.SHARE_TEXT + ' ' + ShareFacade.SHARE_URL
  )}`;

  readonly emailUrl: string = `mailto:?subject=${encodeURIComponent(
    ShareFacade.SHARE_TITLE
  )}&body=${encodeURIComponent(ShareFacade.SHARE_TEXT + ' ' + ShareFacade.SHARE_URL)}`;

  togglePanel(): void {
    this.isPanelOpen.update(open => !open);
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
  }

  async nativeShare(): Promise<void> {
    if (!this.canUseNativeShare) {
      return;
    }
    try {
      await navigator.share({
        title: ShareFacade.SHARE_TITLE,
        text: ShareFacade.SHARE_TEXT,
        url: ShareFacade.SHARE_URL,
      });
    } catch {
      // User dismissed or share failed — no action needed
    }
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(ShareFacade.SHARE_URL);
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000); // UI feedback timer — not reactive state
    } catch {
      // Clipboard unavailable — no action needed
    }
  }
}
