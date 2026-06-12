import { Routes } from '@angular/router';
import { AdminRoute } from './enums/admin-route.enum';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: AdminRoute.ABOUT,
    pathMatch: 'full',
  },
  {
    path: AdminRoute.ABOUT,
    loadComponent: () =>
      import('./components/admin-about/admin-about.component').then(
        m => m.AdminAboutComponent
      ),
  },
  {
    path: AdminRoute.EXPERIENCE,
    loadComponent: () =>
      import('./components/admin-experience/admin-experience.component').then(
        m => m.AdminExperienceComponent
      ),
  },
  {
    path: AdminRoute.PROJECTS,
    loadComponent: () =>
      import('./components/admin-projects/admin-projects.component').then(
        m => m.AdminProjectsComponent
      ),
  },
  {
    path: AdminRoute.SKILLS,
    loadComponent: () =>
      import('./components/admin-skills/admin-skills.component').then(
        m => m.AdminSkillsComponent
      ),
  },
];
