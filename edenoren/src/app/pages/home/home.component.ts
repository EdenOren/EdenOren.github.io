import { Component, Input } from '@angular/core';
import { MainRoutes, NavbarItem } from '../../core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @Input() isHomePage: boolean = true;
  public readonly mainRoutes = MainRoutes;
  public icons: NavbarItem[] = [
    { title: 'Linkedin', icon: 'assets/icons/linkedin.svg#linkedin', url: 'https://www.linkedin.com/in/EdenOren/' },
    { title: 'GitHub', icon: 'assets/icons/github.svg#github', url: 'https://github.com/EdenOren/' }
  ] 

  constructor(
    private router: Router
  ) {}

  public navigate(route: MainRoutes) {
    this.router.navigate([route]);
  }

  public openNewWindow(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
