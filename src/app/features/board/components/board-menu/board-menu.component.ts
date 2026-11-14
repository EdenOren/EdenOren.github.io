import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  OutputEmitterRef,
  Signal,
  input,
  output,
  viewChild,
} from '@angular/core';
import { BoardRegion } from '../../enums/board.enums';
import { BoardMenuCell, BoardMenuLabels } from '../../models/board.models';

@Component({
  selector: 'app-board-menu',
  templateUrl: './board-menu.component.html',
  styleUrl: './board-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardMenuComponent {
  readonly cells: InputSignal<BoardMenuCell[]> = input.required<BoardMenuCell[]>();
  readonly labels: InputSignal<BoardMenuLabels> = input.required<BoardMenuLabels>();
  readonly isNight: InputSignal<boolean> = input.required<boolean>();
  readonly columnCount: InputSignal<number> = input.required<number>();
  readonly rowCount: InputSignal<number> = input.required<number>();
  readonly regionSelected: OutputEmitterRef<BoardRegion> = output<BoardRegion>();
  readonly themeToggled: OutputEmitterRef<void> = output<void>();

  private readonly dialog: Signal<ElementRef<HTMLDialogElement>> =
    viewChild.required<ElementRef<HTMLDialogElement>>('menuDialog');

  open(): void {
    this.dialog().nativeElement.showModal();
  }

  protected onClose(): void {
    this.dialog().nativeElement.close();
  }

  // The dialog element itself is only the target when the click lands on its backdrop.
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Keeps the board's document-level arrow keys from sliding the board behind the open menu.
  protected onDialogKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  // Closing first returns focus to the menu button, so the board's heading focus that follows wins.
  protected onCellClick(region: BoardRegion): void {
    this.onClose();
    this.regionSelected.emit(region);
  }

  protected onThemeClick(): void {
    this.themeToggled.emit();
  }
}
