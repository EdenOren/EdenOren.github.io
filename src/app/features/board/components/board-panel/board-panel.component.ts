import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  Signal,
  input,
  viewChild,
} from '@angular/core';

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

  private readonly headingElement: Signal<ElementRef<HTMLElement>> =
    viewChild.required<ElementRef<HTMLElement>>('headingElement');

  focusHeading(): void {
    this.headingElement().nativeElement.focus({ preventScroll: true });
  }
}
