import { AppRoute } from '../../../core/enums/core.enums';
import { BoardDirection, BoardNavigationKey, BoardRegion } from '../enums/board.enums';
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

export const CITY_DAY_PHOTO = 'assets/images/tlv-west-day.avif';
export const CITY_NIGHT_PHOTO = 'assets/images/tlv-west-night.avif';
export const CITY_PHOTO_WIDTH = 1536;
export const CITY_PHOTO_HEIGHT = 1024;
export const CITY_PHOTO_FOCUS_Y = 0.58;

export const CITY_FRAME_INTERVAL_MS = 1000 / 30;
export const CITY_MAX_PIXEL_RATIO = 2;
export const CITY_WINDOW_TOGGLE_INTERVAL_MS = 700;
export const CITY_WINDOW_FADE_MS = 500;
export const CITY_WINDOW_MAX_OFF_RATIO = 0.15;
export const CITY_GLINT_MAX_COUNT = 16;
export const CITY_GLINT_MIN_LIFETIME_MS = 2600;
export const CITY_GLINT_MAX_LIFETIME_MS = 5200;
// Sized in photo pixels to survive the 3px glass blur; smaller glints vanish behind the pane.
export const CITY_GLINT_MIN_LENGTH = 8;
export const CITY_GLINT_MAX_LENGTH = 22;
export const CITY_GLINT_THICKNESS = 2;
export const CITY_GLINT_DAY_COLOR = 'rgb(255 255 255)';
export const CITY_GLINT_NIGHT_COLOR = 'rgb(205 218 255)';
export const CITY_GLINT_DAY_ALPHA = 0.85;
export const CITY_GLINT_NIGHT_ALPHA = 0.45;

export const CITY_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const CITY_WIDE_QUERY = '(min-width: 768px)';
