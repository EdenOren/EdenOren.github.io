import { BoardDirection, BoardNavigationKey, BoardRegion } from '../enums/board.enums';
import { BoardRegionConfig } from '../models/board.models';
import {
  BOARD_DEFAULT_REGION,
  BOARD_DIRECTION_OFFSETS,
  BOARD_KEY_DIRECTIONS,
  BOARD_REGIONS,
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

export function directionForKey(key: string): BoardDirection | undefined {
  return BOARD_KEY_DIRECTIONS[key as BoardNavigationKey];
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
