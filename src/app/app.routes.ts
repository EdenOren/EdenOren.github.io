import { Routes } from '@angular/router';
import { AppRoute } from './core/enums/core.enums';

export const routes: Routes = [
  {
    path: AppRoute.Board,
    loadChildren: () => import('./features/board/board.routes').then(m => m.boardRoutes),
  },
  {
    path: AppRoute.Home,
    loadComponent: () =>
      import('./features/classic-shell/classic-shell.component').then(m => m.ClassicShellComponent),
    children: [
      {
        path: AppRoute.Home,
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: AppRoute.Admin,
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];
