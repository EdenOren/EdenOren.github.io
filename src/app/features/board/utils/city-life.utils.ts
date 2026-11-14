import {
  CityCover,
  CityGlint,
  CityLifeOptions,
  CityPoint,
  CityWindow,
  CityWindowState,
} from '../models/board.models';
import {
  CITY_GLINT_DAY_ALPHA,
  CITY_GLINT_DAY_COLOR,
  CITY_GLINT_MAX_COUNT,
  CITY_GLINT_MAX_LENGTH,
  CITY_GLINT_MAX_LIFETIME_MS,
  CITY_GLINT_MIN_LENGTH,
  CITY_GLINT_MIN_LIFETIME_MS,
  CITY_GLINT_NIGHT_ALPHA,
  CITY_GLINT_NIGHT_COLOR,
  CITY_GLINT_THICKNESS,
  CITY_PHOTO_FOCUS_Y,
  CITY_PHOTO_HEIGHT,
  CITY_PHOTO_WIDTH,
  CITY_WINDOW_FADE_MS,
  CITY_WINDOW_MAX_OFF_RATIO,
  CITY_WINDOW_TOGGLE_INTERVAL_MS,
} from './board.const';

export type RandomSource = () => number;

export function computeCityCover(frameWidth: number, frameHeight: number): CityCover {
  const scale = Math.max(frameWidth / CITY_PHOTO_WIDTH, frameHeight / CITY_PHOTO_HEIGHT);
  return {
    scale,
    offsetX: (frameWidth - CITY_PHOTO_WIDTH * scale) / 2,
    offsetY: (frameHeight - CITY_PHOTO_HEIGHT * scale) * CITY_PHOTO_FOCUS_Y,
  };
}

function randomBetween(random: RandomSource, minimum: number, maximum: number): number {
  return minimum + random() * (maximum - minimum);
}

function pickIndex(random: RandomSource, length: number): number {
  return Math.min(length - 1, Math.floor(random() * length));
}

export class CityLifeScene {
  private readonly windowStates: CityWindowState[];
  private readonly glints: CityGlint[] = [];
  private sinceToggle: number = 0;

  constructor(
    windows: CityWindow[],
    private readonly seaPoints: CityPoint[],
    private readonly random: RandomSource = Math.random
  ) {
    this.windowStates = windows.map(cityWindow => ({ cityWindow, isOff: false, shade: 0 }));
  }

  get offWindowCount(): number {
    return this.windowStates.filter(state => state.isOff).length;
  }

  get glintCount(): number {
    return this.glints.length;
  }

  advance(elapsedMs: number, options: CityLifeOptions): void {
    if (options.showsWindows) {
      this.advanceWindows(elapsedMs);
    }
    if (options.showsGlints) {
      this.advanceGlints(elapsedMs);
    } else {
      this.glints.length = 0;
    }
  }

  draw(context: CanvasRenderingContext2D, cover: CityCover, isNight: boolean, options: CityLifeOptions): void {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (options.showsWindows && isNight) {
      this.drawWindows(context, cover);
    }
    if (options.showsGlints) {
      this.drawGlints(context, cover, isNight);
    }
    context.globalAlpha = 1;
  }

  private advanceWindows(elapsedMs: number): void {
    const shadeStep = elapsedMs / CITY_WINDOW_FADE_MS;
    for (const state of this.windowStates) {
      state.shade = state.isOff ? Math.min(1, state.shade + shadeStep) : Math.max(0, state.shade - shadeStep);
    }
    this.sinceToggle += elapsedMs;
    if (this.sinceToggle < CITY_WINDOW_TOGGLE_INTERVAL_MS || this.windowStates.length === 0) {
      return;
    }
    this.sinceToggle = 0;
    const candidate = this.windowStates[pickIndex(this.random, this.windowStates.length)];
    const isAtCap = this.offWindowCount >= this.windowStates.length * CITY_WINDOW_MAX_OFF_RATIO;
    if (candidate.isOff || !isAtCap) {
      candidate.isOff = !candidate.isOff;
    }
  }

  private advanceGlints(elapsedMs: number): void {
    for (const glint of this.glints) {
      glint.age += elapsedMs;
    }
    for (let index = this.glints.length - 1; index >= 0; index--) {
      if (this.glints[index].age >= this.glints[index].lifetime) {
        this.glints.splice(index, 1);
      }
    }
    if (this.seaPoints.length === 0) {
      return;
    }
    while (this.glints.length < CITY_GLINT_MAX_COUNT) {
      const point = this.seaPoints[pickIndex(this.random, this.seaPoints.length)];
      this.glints.push({
        x: point.x,
        y: point.y,
        length: randomBetween(this.random, CITY_GLINT_MIN_LENGTH, CITY_GLINT_MAX_LENGTH),
        age: 0,
        lifetime: randomBetween(this.random, CITY_GLINT_MIN_LIFETIME_MS, CITY_GLINT_MAX_LIFETIME_MS),
      });
    }
  }

  private drawWindows(context: CanvasRenderingContext2D, cover: CityCover): void {
    for (const state of this.windowStates) {
      if (state.shade <= 0) {
        continue;
      }
      const { cityWindow } = state;
      context.globalAlpha = state.shade;
      context.fillStyle = cityWindow.offColor;
      context.fillRect(
        cover.offsetX + (cityWindow.x - 0.5) * cover.scale,
        cover.offsetY + (cityWindow.y - 0.5) * cover.scale,
        (cityWindow.width + 1) * cover.scale,
        (cityWindow.height + 1) * cover.scale
      );
    }
  }

  private drawGlints(context: CanvasRenderingContext2D, cover: CityCover, isNight: boolean): void {
    const peakAlpha = isNight ? CITY_GLINT_NIGHT_ALPHA : CITY_GLINT_DAY_ALPHA;
    context.fillStyle = isNight ? CITY_GLINT_NIGHT_COLOR : CITY_GLINT_DAY_COLOR;
    for (const glint of this.glints) {
      context.globalAlpha = peakAlpha * Math.sin((glint.age / glint.lifetime) * Math.PI);
      context.fillRect(
        cover.offsetX + (glint.x - glint.length / 2) * cover.scale,
        cover.offsetY + glint.y * cover.scale,
        glint.length * cover.scale,
        CITY_GLINT_THICKNESS * cover.scale
      );
    }
  }
}
