import { BoardDirection, BoardRegion } from '../enums/board.enums';

export interface BoardRegionConfig {
  region: BoardRegion;
  column: number;
  row: number;
  labelKey: string;
}

export interface BoardOffset {
  column: number;
  row: number;
}

export interface BoardPanelView {
  region: BoardRegion;
  gridColumn: number;
  gridRow: number;
  heading: string;
  isActive: boolean;
}

export interface BoardArrowView {
  direction: BoardDirection;
  label: string;
  ariaLabel: string;
}
