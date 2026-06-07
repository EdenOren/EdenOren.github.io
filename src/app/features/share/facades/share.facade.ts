import { Service, Signal, WritableSignal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SHARE_EMAIL_URL, SHARE_TEXT, SHARE_TITLE, SHARE_URL, SHARE_WHATSAPP_URL } from '../utils/share.constants';

@Service({ autoProvided: false })
export class SocialShareFacade {
  private readonly translateService: TranslateService = inject(TranslateService);

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('SHARE') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly canUseNativeShare: boolean =
    typeof navigator !== 'undefined' && 'share' in navigator;

  readonly isPanelOpen: WritableSignal<boolean> = signal(false);
  readonly isCopied: WritableSignal<boolean> = signal(false);

  readonly whatsappUrl: string = SHARE_WHATSAPP_URL;
  readonly emailUrl: string = SHARE_EMAIL_URL;

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
      await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL });
    } catch {
      // User dismissed or share failed — no action needed
    }
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000); // UI feedback timer — not reactive state
    } catch {
      // Clipboard unavailable — no action needed
    }
  }
}
