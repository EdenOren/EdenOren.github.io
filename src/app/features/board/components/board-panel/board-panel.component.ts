import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  Signal,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { BoardDirection } from '../../enums/board.enums';

@Component({
  selector: 'app-board-panel',
  templateUrl: './board-panel.component.html',
  styleUrl: './board-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.grid-column]': 'gridColumn()',
    '[style.grid-row]': 'gridRow()',
    '[attr.inert]': 'isActive() ? null : ""',
  },
})
export class BoardPanelComponent {
  readonly heading: InputSignal<string> = input.required<string>();
  readonly note: InputSignal<string> = input<string>('');
  readonly isWide: InputSignal<boolean> = input<boolean>(false);
  readonly gridColumn: InputSignal<number> = input.required<number>();
  readonly gridRow: InputSignal<number> = input.required<number>();
  readonly isActive: InputSignal<boolean> = input.required<boolean>();

  private readonly hostElement: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly headingElement: Signal<ElementRef<HTMLElement>> =
    viewChild.required<ElementRef<HTMLElement>>('headingElement');

  focusHeading(): void {
    this.headingElement().nativeElement.focus({ preventScroll: true });
  }

  scrollOffset(): number {
    return this.hostElement.nativeElement.scrollTop;
  }

  // One pixel of slack: fractional zoom levels can leave scrollTop just short of the true bottom.
  canScroll(direction: BoardDirection): boolean {
    const host = this.hostElement.nativeElement;
    if (direction === BoardDirection.Up) {
      return host.scrollTop > 0;
    }
    if (direction === BoardDirection.Down) {
      return host.scrollTop + host.clientHeight < host.scrollHeight - 1;
    }
    return false;
  }
}
