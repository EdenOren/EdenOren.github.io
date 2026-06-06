import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '../../services/translate.service';
import { I18nSection } from '../../enums/i18n-section.enum';
import { NAVBAR_SCROLL_THRESHOLD_PX } from './navbar.constants';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly isScrolled: WritableSignal<boolean> = signal(false);
  protected readonly isMenuOpen: WritableSignal<boolean> = signal(false);

  protected readonly NAV_LINKS: { path: string; label: Signal<string> }[] = [
    { path: '/about',      label: this.translate.get(I18nSection.Nav, 'ABOUT') },
    { path: '/experience', label: this.translate.get(I18nSection.Nav, 'EXPERIENCE') },
    { path: '/skills',     label: this.translate.get(I18nSection.Nav, 'SKILLS') },
    { path: '/projects',   label: this.translate.get(I18nSection.Nav, 'PROJECTS') },
    { path: '/contact',    label: this.translate.get(I18nSection.Nav, 'CONTACT') },
  ];

  protected readonly resumeLabel: Signal<string> = this.translate.get(I18nSection.Nav, 'RESUME');

  constructor() {
    afterNextRender(() => {
      const onScroll = () => this.isScrolled.set(window.scrollY > NAVBAR_SCROLL_THRESHOLD_PX);
      window.addEventListener('scroll', onScroll, { passive: true });
    });

    effect(() => {
      document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
    });

    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(e => {
        if (e instanceof NavigationStart) {
          this.isMenuOpen.set(false);
        }
      });
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
