import { AppRoute } from '../../../core/enums/core.enums';
import { BoardDirection } from '../enums/board-direction.enum';
import { BoardNavigationKey } from '../enums/board-navigation-key.enum';
import { BoardRegion } from '../enums/board-region.enum';
import { BoardOffset, BoardRegionConfig } from '../models/board.models';

export const BOARD_REGIONS: BoardRegionConfig[] = [
  { region: BoardRegion.About, column: 0, row: 0, labelKey: 'REGION_ABOUT' },
  { region: BoardRegion.Hero, column: 1, row: 0, labelKey: 'REGION_HERO' },
  { region: BoardRegion.Experience, column: 2, row: 0, labelKey: 'REGION_EXPERIENCE' },
  { region: BoardRegion.Skills, column: 0, row: 1, labelKey: 'REGION_SKILLS' },
  { region: BoardRegion.Projects, column: 1, row: 1, labelKey: 'REGION_PROJECTS' },
  { region: BoardRegion.Contact, column: 2, row: 1, labelKey: 'REGION_CONTACT' },
];

export const BOARD_DEFAULT_REGION: BoardRegion = BoardRegion.Hero;

export const BOARD_DIRECTION_OFFSETS: Record<BoardDirection, BoardOffset> = {
  [BoardDirection.Left]: { column: -1, row: 0 },
  [BoardDirection.Right]: { column: 1, row: 0 },
  [BoardDirection.Up]: { column: 0, row: -1 },
  [BoardDirection.Down]: { column: 0, row: 1 },
};

export const BOARD_KEY_DIRECTIONS: Record<BoardNavigationKey, BoardDirection> = {
  [BoardNavigationKey.ArrowLeft]: BoardDirection.Left,
  [BoardNavigationKey.ArrowRight]: BoardDirection.Right,
  [BoardNavigationKey.ArrowUp]: BoardDirection.Up,
  [BoardNavigationKey.ArrowDown]: BoardDirection.Down,
};

export const BOARD_CLASSIC_PATH = `/${AppRoute.Home}`;
export const BOARD_ROOT_PATH = `/${AppRoute.Board}`;
export const FULL_PERCENT = 100;
