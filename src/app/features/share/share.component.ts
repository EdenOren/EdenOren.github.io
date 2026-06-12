import { ChangeDetectionStrategy, Component, ElementRef, Signal, WritableSignal, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Icon } from '../../shared/enums/icon.enum';
import { IconButtonComponent } from '../../shared/ui/icon-button/icon-button.component';
import { SocialShareFacade } from './facades/share.facade';

@Component({
  selector: 'app-social-share',
  imports: [NgOptimizedImage, IconButtonComponent],
  providers: [SocialShareFacade],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closePanel()',
  },
})
export class SocialShareComponent {
  private readonly socialShareFacade: SocialShareFacade = inject(SocialShareFacade);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  protected readonly translation: Signal<Record<string, string>> = this.socialShareFacade.translation;
  protected readonly canUseNativeShare: boolean = this.socialShareFacade.canUseNativeShare;
  protected readonly isPanelOpen: WritableSignal<boolean> = this.socialShareFacade.isPanelOpen;
  protected readonly isCopied: WritableSignal<boolean> = this.socialShareFacade.isCopied;
  protected readonly whatsappUrl: string = this.socialShareFacade.whatsappUrl;
  protected readonly emailUrl: string = this.socialShareFacade.emailUrl;
  protected readonly Icon: typeof Icon = Icon;

  protected onTriggerClick(): void {
    if (this.canUseNativeShare) {
      void this.socialShareFacade.nativeShare();
    } else {
      this.socialShareFacade.togglePanel();
    }
  }

  protected closePanel(): void {
    this.socialShareFacade.closePanel();
  }

  protected copyLink(): void {
    void this.socialShareFacade.copyLink();
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.socialShareFacade.closePanel();
    }
  }
}
