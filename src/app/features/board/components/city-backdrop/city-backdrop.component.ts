import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';
import { BoardCityPan } from '../../models/board.models';
import { CITY_DAY_PHOTO, CITY_NIGHT_PHOTO } from '../../utils/board.const';

@Component({
  selector: 'app-city-backdrop',
  imports: [NgOptimizedImage],
  templateUrl: './city-backdrop.component.html',
  styleUrl: './city-backdrop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.--city-pan-x]': 'pan().x',
    '[style.--city-pan-y]': 'pan().y',
  },
})
export class CityBackdropComponent {
  readonly pan: InputSignal<BoardCityPan> = input.required<BoardCityPan>();
  readonly isNight: InputSignal<boolean> = input.required<boolean>();

  protected readonly DAY_PHOTO: string = CITY_DAY_PHOTO;
  protected readonly NIGHT_PHOTO: string = CITY_NIGHT_PHOTO;
}
