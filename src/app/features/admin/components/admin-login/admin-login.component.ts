import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  afterRenderEffect,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BoardPanelComponent } from '../../../board/components/board-panel/board-panel.component';
import { CityBackdropComponent } from '../../../board/components/city-backdrop/city-backdrop.component';
import { BoardCityPan } from '../../../board/models/board.models';
import { BOARD_NOT_FOUND_CITY_PAN, BOARD_ROOT_PATH } from '../../../board/utils/board.const';
import { GoogleButtonShape, GoogleButtonTheme } from '../../enums/admin.enums';
import { AdminFacade } from '../../facades/admin.facade';

@Component({
  selector: 'app-admin-login',
  imports: [RouterLink, TranslatePipe, BoardPanelComponent, CityBackdropComponent],
  providers: [AdminFacade],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent {
  private readonly adminFacade: AdminFacade = inject(AdminFacade);

  protected readonly BOARD_PATH: string = BOARD_ROOT_PATH;
  protected readonly CITY_PAN: BoardCityPan = BOARD_NOT_FOUND_CITY_PAN;
  protected readonly isNight: Signal<boolean> = this.adminFacade.isNight;

  private readonly googleButton: Signal<ElementRef<HTMLElement>> =
    viewChild.required<ElementRef<HTMLElement>>('googleButton');

  constructor() {
    afterRenderEffect(() => {
      this.adminFacade.initGoogleSignIn(this.googleButton().nativeElement, {
        theme: this.isNight() ? GoogleButtonTheme.FilledBlack : GoogleButtonTheme.Outline,
        shape: GoogleButtonShape.Pill,
      });
    });
  }
}
