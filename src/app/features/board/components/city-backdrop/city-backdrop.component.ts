import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InputSignal,
  Signal,
  afterRenderEffect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { BoardCityPan, CityLifeOptions } from '../../models/board.models';
import {
  CITY_DAY_PHOTO,
  CITY_FRAME_INTERVAL_MS,
  CITY_MAX_PIXEL_RATIO,
  CITY_NIGHT_PHOTO,
  CITY_PHOTO_FOCUS_Y,
} from '../../utils/board.const';
import { CITY_SEA_POINTS, CITY_WINDOWS } from '../../utils/city-map.const';
import { CityLifeScene, computeCityCover } from '../../utils/city-life.utils';
import { CityBackdropFacade } from './facades/city-backdrop.facade';

@Component({
  selector: 'app-city-backdrop',
  imports: [NgOptimizedImage],
  providers: [CityBackdropFacade],
  templateUrl: './city-backdrop.component.html',
  styleUrl: './city-backdrop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class.city--night]': 'isNight()',
    '[class.city--paused]': 'isPaused()',
    '[style.--city-pan-x]': 'pan().x',
    '[style.--city-pan-y]': 'pan().y',
    '[style.--city-focus-y]': 'FOCUS_Y',
  },
})
export class CityBackdropComponent {
  private readonly cityBackdropFacade: CityBackdropFacade = inject(CityBackdropFacade);

  readonly pan: InputSignal<BoardCityPan> = input.required<BoardCityPan>();
  readonly isNight: InputSignal<boolean> = input.required<boolean>();

  protected readonly DAY_PHOTO: string = CITY_DAY_PHOTO;
  protected readonly NIGHT_PHOTO: string = CITY_NIGHT_PHOTO;
  protected readonly FOCUS_Y: number = CITY_PHOTO_FOCUS_Y;

  protected readonly isPaused: Signal<boolean> = this.cityBackdropFacade.isPaused;

  private readonly canvas: Signal<ElementRef<HTMLCanvasElement>> =
    viewChild.required<ElementRef<HTMLCanvasElement>>('lifeCanvas');
  private readonly scene: CityLifeScene = new CityLifeScene(CITY_WINDOWS, CITY_SEA_POINTS);

  constructor() {
    afterRenderEffect(onCleanup => {
      const canvas = this.canvas().nativeElement;
      const context = canvas.getContext('2d');
      const isNight = this.isNight();
      const options: CityLifeOptions = {
        showsWindows: true,
        showsGlints: this.cityBackdropFacade.isWide(),
      };
      if (!context) {
        return;
      }
      if (!this.cityBackdropFacade.isAnimating()) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      let frameId = 0;
      let previousTime = performance.now();
      const tick = (time: number): void => {
        frameId = requestAnimationFrame(tick);
        const elapsedMs = time - previousTime;
        if (elapsedMs < CITY_FRAME_INTERVAL_MS) {
          return;
        }
        previousTime = time;
        this.fitCanvas(canvas);
        this.scene.advance(elapsedMs, options);
        const cover = computeCityCover(canvas.width, canvas.height);
        this.scene.draw(context, cover, isNight, options);
      };
      frameId = requestAnimationFrame(tick);
      onCleanup(() => cancelAnimationFrame(frameId));
    });
  }

  private fitCanvas(canvas: HTMLCanvasElement): void {
    const pixelRatio = Math.min(devicePixelRatio, CITY_MAX_PIXEL_RATIO);
    const width = Math.round(canvas.clientWidth * pixelRatio);
    const height = Math.round(canvas.clientHeight * pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }
}
