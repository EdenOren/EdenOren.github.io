import { Routes } from '@angular/router';
import { BoardRouteParam } from './enums/board.enums';
import { boardRegionGuard } from './guards/board-region.guard';
import { BOARD_DEFAULT_REGION } from './utils/board.const';

export const boardRoutes: Routes = [
  {
    path: '',
    redirectTo: BOARD_DEFAULT_REGION,
    pathMatch: 'full',
  },
  {
    path: `:${BoardRouteParam.Region}`,
    canMatch: [boardRegionGuard],
    loadComponent: () => import('./board.component').then(m => m.BoardComponent),
  },
];
