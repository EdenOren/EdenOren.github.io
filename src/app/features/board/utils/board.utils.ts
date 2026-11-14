import { BoardDirection, BoardNavigationKey, BoardRegion } from '../enums/board.enums';
import { BoardCityPan, BoardRegionConfig, BoardTouchPoint } from '../models/board.models';
import {
  BOARD_DEFAULT_REGION,
  BOARD_DIRECTION_OFFSETS,
  BOARD_KEY_DIRECTIONS,
  BOARD_REGIONS,
  BOARD_SWIPE_AXIS_RATIO,
  BOARD_SWIPE_MAX_DURATION_MS,
  BOARD_SWIPE_MIN_DISTANCE,
  BOARD_WHEEL_MIN_DELTA,
  FULL_PERCENT,
} from './board.const';

export function isBoardRegion(value: string | null | undefined): value is BoardRegion {
  return BOARD_REGIONS.some(config => config.region === value);
}

export function resolveBoardRegion(value: string | null | undefined): BoardRegion {
  return isBoardRegion(value) ? value : BOARD_DEFAULT_REGION;
}

export function findRegionConfig(region: BoardRegion): BoardRegionConfig {
  return BOARD_REGIONS.find(config => config.region === region) ?? BOARD_REGIONS[0];
}

export function findNeighbour(
  config: BoardRegionConfig,
  direction: BoardDirection
): BoardRegionConfig | undefined {
  const offset = BOARD_DIRECTION_OFFSETS[direction];
  return BOARD_REGIONS.find(
    candidate =>
      candidate.column === config.column + offset.column && candidate.row === config.row + offset.row
  );
}

export function countBoardColumns(): number {
  return Math.max(...BOARD_REGIONS.map(config => config.column)) + 1;
}

export function countBoardRows(): number {
  return Math.max(...BOARD_REGIONS.map(config => config.row)) + 1;
}

export function buildSurfaceTransform(config: BoardRegionConfig): string {
  const offsetX = (config.column * FULL_PERCENT) / countBoardColumns();
  const offsetY = (config.row * FULL_PERCENT) / countBoardRows();
  return `translate3d(-${offsetX}%, -${offsetY}%, 0)`;
}

export function buildCityPan(config: BoardRegionConfig): BoardCityPan {
  return {
    x: panFraction(config.column, countBoardColumns()),
    y: panFraction(config.row, countBoardRows()),
  };
}

function panFraction(index: number, count: number): number {
  return count > 1 ? index / (count - 1) : 0;
}

export function directionForKey(key: string): BoardDirection | undefined {
  return BOARD_KEY_DIRECTIONS[key as BoardNavigationKey];
}

// The board follows the finger: dragging content to the left reveals the region on the right.
export function swipeDirection(
  start: BoardTouchPoint,
  end: BoardTouchPoint
): BoardDirection | undefined {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const distanceX = Math.abs(deltaX);
  const distanceY = Math.abs(deltaY);
  if (end.time - start.time > BOARD_SWIPE_MAX_DURATION_MS) {
    return undefined;
  }
  if (distanceX >= BOARD_SWIPE_MIN_DISTANCE && distanceX >= distanceY * BOARD_SWIPE_AXIS_RATIO) {
    return deltaX < 0 ? BoardDirection.Right : BoardDirection.Left;
  }
  if (distanceY >= BOARD_SWIPE_MIN_DISTANCE && distanceY >= distanceX * BOARD_SWIPE_AXIS_RATIO) {
    return deltaY < 0 ? BoardDirection.Down : BoardDirection.Up;
  }
  return undefined;
}

export function wheelDirection(deltaX: number, deltaY: number): BoardDirection | undefined {
  const distanceX = Math.abs(deltaX);
  const distanceY = Math.abs(deltaY);
  if (Math.max(distanceX, distanceY) < BOARD_WHEEL_MIN_DELTA) {
    return undefined;
  }
  if (distanceY >= distanceX) {
    return deltaY > 0 ? BoardDirection.Down : BoardDirection.Up;
  }
  return deltaX > 0 ? BoardDirection.Right : BoardDirection.Left;
}

export function isVerticalDirection(direction: BoardDirection): boolean {
  return direction === BoardDirection.Up || direction === BoardDirection.Down;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}
