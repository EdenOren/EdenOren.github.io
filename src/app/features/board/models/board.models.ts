import { BoardDirection, BoardPanelWidth, BoardRegion } from '../enums/board.enums';

export interface BoardRegionConfig {
  region: BoardRegion;
  column: number;
  row: number;
  labelKey: string;
  headingKey: string;
  noteKey: string;
  width: BoardPanelWidth;
}

export interface BoardOffset {
  column: number;
  row: number;
}

export interface BoardCityPan {
  x: number;
  y: number;
}

export interface CityPoint {
  x: number;
  y: number;
}

export interface CityWindow extends CityPoint {
  width: number;
  height: number;
  offColor: string;
}

export interface CityCover {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface CityWindowState {
  cityWindow: CityWindow;
  isOff: boolean;
  shade: number;
}

export interface CityGlint extends CityPoint {
  length: number;
  age: number;
  lifetime: number;
}

export interface CityLifeOptions {
  showsWindows: boolean;
  showsGlints: boolean;
}

export interface BoardPanelView {
  region: BoardRegion;
  gridColumn: number;
  gridRow: number;
  heading: string;
  note: string;
  isWide: boolean;
  isActive: boolean;
}

export interface BoardMenuCell {
  region: BoardRegion;
  label: string;
  gridColumn: number;
  gridRow: number;
  isActive: boolean;
}

export interface BoardMenuLabels {
  open: string;
  close: string;
  heading: string;
  here: string;
  day: string;
  night: string;
  themeAction: string;
  admin: string;
}

export interface BoardTouchPoint {
  x: number;
  y: number;
  time: number;
}

export interface BoardArrowView {
  direction: BoardDirection;
  label: string;
  ariaLabel: string;
}
