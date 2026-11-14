import { Routes } from '@angular/router';
import { BoardRouteParam } from './enums/board-route.enum';
import { boardRegionGuard } from './guards/board-region.guard';
import { BOARD_DEFAULT_REGION } from './utils/board.constants';

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
