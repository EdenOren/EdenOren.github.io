import { Routes } from '@angular/router';
import { MainRoutes } from './core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: MainRoutes.Home, pathMatch: 'full' },
            { path: MainRoutes.Home, component: HomeComponent },
            { path: MainRoutes.About, component: AboutComponent },
            { path: MainRoutes.Experience, component: ExperienceComponent },
            { path: MainRoutes.Projects, component: ProjectsComponent },
            { path: MainRoutes.Contact, component: ContactComponent },
        ],
    },
    { path: '**', component: NotFoundComponent }
];