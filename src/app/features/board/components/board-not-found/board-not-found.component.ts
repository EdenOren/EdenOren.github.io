import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardCityPan } from '../../models/board.models';
import {
  BOARD_CLASSIC_PATH,
  BOARD_NOT_FOUND_CITY_PAN,
  BOARD_ROOT_PATH,
  BOARD_SHOWS_CLASSIC_LINK,
} from '../../utils/board.const';
import { BoardPanelComponent } from '../board-panel/board-panel.component';
import { CityBackdropComponent } from '../city-backdrop/city-backdrop.component';
import { BoardNotFoundFacade } from './facades/board-not-found.facade';

@Component({
  selector: 'app-board-not-found',
  imports: [RouterLink, BoardPanelComponent, CityBackdropComponent],
  providers: [BoardNotFoundFacade],
  templateUrl: './board-not-found.component.html',
  styleUrl: './board-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardNotFoundComponent {
  private readonly boardNotFoundFacade: BoardNotFoundFacade = inject(BoardNotFoundFacade);

  protected readonly BOARD_PATH: string = BOARD_ROOT_PATH;
  protected readonly CLASSIC_PATH: string = BOARD_CLASSIC_PATH;
  protected readonly SHOWS_CLASSIC_LINK: boolean = BOARD_SHOWS_CLASSIC_LINK;
  protected readonly CITY_PAN: BoardCityPan = BOARD_NOT_FOUND_CITY_PAN;

  protected readonly translation: Signal<Record<string, string>> = this.boardNotFoundFacade.translation;
  protected readonly isNight: Signal<boolean> = this.boardNotFoundFacade.isNight;
}
