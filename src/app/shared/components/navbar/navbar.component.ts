import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../enums/icon.enum';
import { NavbarFacade } from './facades/navbar.facade';
import { SocialShareComponent } from '../../../features/share/share.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, SocialShareComponent],
  providers: [NavbarFacade],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly navbarFacade: NavbarFacade = inject(NavbarFacade);

  protected readonly translation: Signal<Record<string, string>> = this.navbarFacade.translation;
  protected readonly isScrolled: WritableSignal<boolean> = this.navbarFacade.isScrolled;
  protected readonly isMenuOpen: WritableSignal<boolean> = this.navbarFacade.isMenuOpen;
  protected readonly activeSection: WritableSignal<string> = this.navbarFacade.activeSection;
  protected readonly isAuthenticated: Signal<boolean> = this.navbarFacade.isAuthenticated;
  protected readonly isDark: Signal<boolean> = this.navbarFacade.isDark;
  protected readonly themeIconUrl: Signal<string> = computed(() =>
    this.isDark() ? Icon.Sun : Icon.Moon
  );
  protected readonly NAV_LINKS: { labelKey: string; sectionId: string }[] = this.navbarFacade.NAV_LINKS;

  protected scrollToSection(sectionId: string): void {
    this.navbarFacade.scrollToSection(sectionId);
  }

  protected toggleTheme(): void {
    this.navbarFacade.toggleTheme();
  }

  protected toggleMenu(): void {
    this.navbarFacade.toggleMenu();
  }

  protected closeMenu(): void {
    this.navbarFacade.closeMenu();
  }
}
