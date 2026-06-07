import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { ShareFacade } from './facades/share.facade';

@Component({
  selector: 'app-share',
  providers: [ShareFacade],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'facade.closePanel()',
  },
})
export class ShareComponent {
  protected readonly facade: ShareFacade = inject(ShareFacade);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  protected onTriggerClick(): void {
    if (this.facade.canUseNativeShare) {
      void this.facade.nativeShare();
    } else {
      this.facade.togglePanel();
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.facade.closePanel();
    }
  }
}
