import { Routes } from '@angular/router';
import { AppRoute } from './core/enums/core.enums';
import { signedOutGuard } from './core/guards/signed-out.guard';
import { BoardRouteParam } from './features/board/enums/board.enums';

export const routes: Routes = [
  {
    path: AppRoute.LegacyBoard,
    redirectTo: AppRoute.Board,
    pathMatch: 'full',
  },
  {
    path: `${AppRoute.LegacyBoard}/:${BoardRouteParam.Region}`,
    redirectTo: `:${BoardRouteParam.Region}`,
  },
  // Signed out, every admin URL shows the board-styled login; signed in, this stops matching and
  // the admin panel inside the classic shell below takes over.
  {
    path: AppRoute.Admin,
    canMatch: [signedOutGuard],
    children: [
      {
        path: '**',
        loadComponent: () =>
          import('./features/admin/components/admin-login/admin-login.component').then(
            m => m.AdminLoginComponent
          ),
      },
    ],
  },
  // The board's region guard rejects anything that is not a region, so /admin, /classic and
  // unknown paths fall through to the classic shell below.
  {
    path: AppRoute.Board,
    loadChildren: () => import('./features/board/board.routes').then(m => m.boardRoutes),
  },
  {
    path: AppRoute.Board,
    loadComponent: () =>
      import('./features/classic-shell/classic-shell.component').then(m => m.ClassicShellComponent),
    children: [
      {
        path: AppRoute.Classic,
        children: [
          {
            path: AppRoute.Board,
            loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
          },
          {
            path: '**',
            loadComponent: () =>
              import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
          },
        ],
      },
      {
        path: AppRoute.Admin,
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/board/components/board-not-found/board-not-found.component').then(
        m => m.BoardNotFoundComponent
      ),
  },
];
