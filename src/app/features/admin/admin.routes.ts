import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'experience',
    loadComponent: () =>
      import('./components/admin-experience/admin-experience.component').then(
        m => m.AdminExperienceComponent
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./components/admin-projects/admin-projects.component').then(
        m => m.AdminProjectsComponent
      ),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./components/admin-skills/admin-skills.component').then(
        m => m.AdminSkillsComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/admin-about/admin-about.component').then(
        m => m.AdminAboutComponent
      ),
  },
];
