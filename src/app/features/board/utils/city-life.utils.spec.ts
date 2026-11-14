import { CityLifeOptions, CityPoint, CityWindow } from '../models/board.models';
import {
  CITY_GLINT_MAX_COUNT,
  CITY_PHOTO_HEIGHT,
  CITY_PHOTO_WIDTH,
  CITY_WINDOW_MAX_OFF_RATIO,
  CITY_WINDOW_TOGGLE_INTERVAL_MS,
} from './board.const';
import { CITY_SEA_POINTS, CITY_WINDOWS } from './city-map.const';
import { CityLifeScene, RandomSource, computeCityCover } from './city-life.utils';

const ALL_LAYERS: CityLifeOptions = { showsWindows: true, showsGlints: true };
const WINDOWS_ONLY: CityLifeOptions = { showsWindows: true, showsGlints: false };

function sequence(values: number[]): RandomSource {
  let index = 0;
  return () => values[index++ % values.length];
}

function buildWindows(count: number): CityWindow[] {
  return Array.from({ length: count }, (_, index) => ({
    x: index * 10,
    y: 600,
    width: 4,
    height: 3,
    offColor: '#333333',
  }));
}

describe('city life utils', () => {
  it('covers a wider frame by width and keeps the photo focus', () => {
    const cover = computeCityCover(CITY_PHOTO_WIDTH * 2, CITY_PHOTO_HEIGHT);
    expect(cover.scale).toBe(2);
    expect(cover.offsetX).toBe(0);
    expect(cover.offsetY).toBeLessThan(0);
  });

  it('covers a taller frame by height and centres it horizontally', () => {
    const cover = computeCityCover(CITY_PHOTO_WIDTH, CITY_PHOTO_HEIGHT * 2);
    expect(cover.scale).toBe(2);
    expect(cover.offsetX).toBe(-CITY_PHOTO_WIDTH / 2);
    expect(cover.offsetY).toBe(0);
  });

  it('switches windows off on a timer but never more than the cap', () => {
    const windowCount = 20;
    const scene = new CityLifeScene(buildWindows(windowCount), [], sequence([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]));
    for (let step = 0; step < 40; step++) {
      scene.advance(CITY_WINDOW_TOGGLE_INTERVAL_MS, WINDOWS_ONLY);
    }
    expect(scene.offWindowCount).toBeGreaterThan(0);
    expect(scene.offWindowCount).toBeLessThanOrEqual(Math.ceil(windowCount * CITY_WINDOW_MAX_OFF_RATIO));
  });

  it('does nothing before the first toggle interval', () => {
    const scene = new CityLifeScene(buildWindows(5), [], sequence([0]));
    scene.advance(CITY_WINDOW_TOGGLE_INTERVAL_MS - 1, WINDOWS_ONLY);
    expect(scene.offWindowCount).toBe(0);
  });

  it('keeps the sea full of glints and drops them when the layer is off', () => {
    const seaPoints: CityPoint[] = [{ x: 700, y: 610 }];
    const scene = new CityLifeScene([], seaPoints, sequence([0.5]));
    scene.advance(16, ALL_LAYERS);
    expect(scene.glintCount).toBe(CITY_GLINT_MAX_COUNT);
    scene.advance(16, WINDOWS_ONLY);
    expect(scene.glintCount).toBe(0);
  });

  it('maps every window and sea point inside the photo', () => {
    const isInside = (point: CityPoint): boolean =>
      point.x >= 0 && point.x < CITY_PHOTO_WIDTH && point.y >= 0 && point.y < CITY_PHOTO_HEIGHT;
    expect(CITY_WINDOWS.length).toBeGreaterThan(0);
    expect(CITY_SEA_POINTS.length).toBeGreaterThan(0);
    expect(CITY_WINDOWS.every(isInside)).toBe(true);
    expect(CITY_SEA_POINTS.every(isInside)).toBe(true);
  });
});
