import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Signal,
  afterNextRender,
  inject,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardArrowsComponent } from './components/board-arrows/board-arrows.component';
import { BoardPanelComponent } from './components/board-panel/board-panel.component';
import { BoardDirection } from './enums/board-direction.enum';
import { BoardFacade } from './facades/board.facade';
import { BoardArrowView, BoardPanelView } from './models/board.models';
import { BOARD_CLASSIC_PATH } from './utils/board.constants';
import { directionForKey, isTypingTarget } from './utils/board.utils';

@Component({
  selector: 'app-board',
  imports: [RouterLink, BoardArrowsComponent, BoardPanelComponent],
  providers: [BoardFacade],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class BoardComponent {
  private readonly boardFacade: BoardFacade = inject(BoardFacade);
  private readonly injector: Injector = inject(Injector);

  protected readonly CLASSIC_PATH: string = BOARD_CLASSIC_PATH;
  protected readonly COLUMN_COUNT: number = this.boardFacade.COLUMN_COUNT;
  protected readonly ROW_COUNT: number = this.boardFacade.ROW_COUNT;

  protected readonly translation: Signal<Record<string, string>> = this.boardFacade.translation;
  protected readonly panels: Signal<BoardPanelView[]> = this.boardFacade.panels;
  protected readonly arrows: Signal<BoardArrowView[]> = this.boardFacade.arrows;
  protected readonly surfaceTransform: Signal<string> = this.boardFacade.surfaceTransform;
  protected readonly activeHeading: Signal<string> = this.boardFacade.activeHeading;

  private readonly panelComponents: Signal<readonly BoardPanelComponent[]> =
    viewChildren(BoardPanelComponent);

  protected onMove(direction: BoardDirection): void {
    void this.boardFacade.move(direction).then(hasMoved => {
      if (hasMoved) {
        this.focusActivePanel();
      }
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
      return;
    }
    const direction = directionForKey(event.key);
    if (!direction) {
      return;
    }
    event.preventDefault();
    this.onMove(direction);
  }

  // The newly active panel stays inert until the next render, and inert elements cannot take focus.
  private focusActivePanel(): void {
    afterNextRender(
      () => {
        this.panelComponents()
          .find(panel => panel.isActive())
          ?.focusHeading();
      },
      { injector: this.injector }
    );
  }
}
