import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
