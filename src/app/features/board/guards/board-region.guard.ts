import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { isBoardRegion } from '../utils/board.utils';

export const boardRegionGuard: CanMatchFn = (_route: Route, segments: UrlSegment[]): boolean =>
  segments.length === 1 && isBoardRegion(segments[0].path);
