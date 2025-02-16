import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Event, RouterModule } from '@angular/router';
import { MainRoutes, NavbarItem } from '../../core';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "../../pages/home/home.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule ,CommonModule, HomeComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  public currentPage: WritableSignal<MainRoutes> = signal<MainRoutes>(MainRoutes.Home);
  public isHomePage: Signal<boolean> = computed(() => this.currentPage() === MainRoutes.Home);
  public navigationRoutes: NavbarItem[] = [
    { title: 'about', icon: 'assets/icons/about.svg', route: MainRoutes.About },
    { title: 'projects', icon: 'assets/icons/projects.svg', route: MainRoutes.Projects },
    { title: 'experience', icon: 'assets/icons/work.svg', route: MainRoutes.Experience },
    { title: 'contact', icon: 'assets/icons/contact.svg', route: MainRoutes.Contact }
  ];

  constructor(
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const route: string = event.url?.slice(1);
        if (!route) {
          this.currentPage.set(MainRoutes.Home);
        } else {
          this.currentPage.set(route as MainRoutes);
        }
      });
  }
    
  public navigate(route?: MainRoutes) {
    if (route) {
      this.currentPage.set(route);
      this.router.navigate([route]);
    }
  }
}