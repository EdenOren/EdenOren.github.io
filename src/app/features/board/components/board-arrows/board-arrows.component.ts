import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';
import { BoardDirection } from '../../enums/board.enums';
import { BoardArrowView } from '../../models/board.models';

@Component({
  selector: 'app-board-arrows',
  templateUrl: './board-arrows.component.html',
  styleUrl: './board-arrows.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardArrowsComponent {
  readonly arrows: InputSignal<BoardArrowView[]> = input.required<BoardArrowView[]>();
  readonly navigationLabel: InputSignal<string> = input.required<string>();
  readonly moved: OutputEmitterRef<BoardDirection> = output<BoardDirection>();

  protected onArrowClick(direction: BoardDirection): void {
    this.moved.emit(direction);
  }
}
