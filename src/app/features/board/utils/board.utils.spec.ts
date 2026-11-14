import { BoardDirection } from '../enums/board-direction.enum';
import { BoardNavigationKey } from '../enums/board-navigation-key.enum';
import { BoardRegion } from '../enums/board-region.enum';
import {
  buildSurfaceTransform,
  countBoardColumns,
  countBoardRows,
  directionForKey,
  findNeighbour,
  findRegionConfig,
  isBoardRegion,
  isTypingTarget,
  resolveBoardRegion,
} from './board.utils';

describe('board utils', () => {
  it('recognises valid regions only', () => {
    expect(isBoardRegion(BoardRegion.Skills)).toBe(true);
    expect(isBoardRegion('nowhere')).toBe(false);
    expect(isBoardRegion(null)).toBe(false);
  });

  it('falls back to the hero region for unknown values', () => {
    expect(resolveBoardRegion('nowhere')).toBe(BoardRegion.Hero);
    expect(resolveBoardRegion(BoardRegion.Contact)).toBe(BoardRegion.Contact);
  });

  it('measures the grid from the region map', () => {
    expect(countBoardColumns()).toBe(3);
    expect(countBoardRows()).toBe(2);
  });

  it('finds neighbours and stops at the board edge', () => {
    const hero = findRegionConfig(BoardRegion.Hero);
    expect(findNeighbour(hero, BoardDirection.Left)?.region).toBe(BoardRegion.About);
    expect(findNeighbour(hero, BoardDirection.Right)?.region).toBe(BoardRegion.Experience);
    expect(findNeighbour(hero, BoardDirection.Down)?.region).toBe(BoardRegion.Projects);
    expect(findNeighbour(hero, BoardDirection.Up)).toBeUndefined();
  });

  it('translates the surface by whole cells', () => {
    expect(buildSurfaceTransform(findRegionConfig(BoardRegion.About))).toBe('translate3d(-0%, -0%, 0)');
    expect(buildSurfaceTransform(findRegionConfig(BoardRegion.Contact))).toBe(
      `translate3d(-${200 / 3}%, -50%, 0)`
    );
  });

  it('maps arrow keys to directions', () => {
    expect(directionForKey(BoardNavigationKey.ArrowLeft)).toBe(BoardDirection.Left);
    expect(directionForKey('Enter')).toBeUndefined();
  });

  it('treats form fields as typing targets', () => {
    expect(isTypingTarget(document.createElement('textarea'))).toBe(true);
    expect(isTypingTarget(document.createElement('button'))).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});
