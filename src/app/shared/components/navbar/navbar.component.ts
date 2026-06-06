import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService } from '../../services/translate.service';
import { NAVBAR_SCROLL_THRESHOLD_PX } from './navbar.constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly isScrolled = signal(false);
  protected readonly isMenuOpen = signal(false);

  protected readonly navLinks = [
    { path: '/about',      label: this.translate.t('nav', 'about') },
    { path: '/experience', label: this.translate.t('nav', 'experience') },
    { path: '/skills',     label: this.translate.t('nav', 'skills') },
    { path: '/projects',   label: this.translate.t('nav', 'projects') },
    { path: '/contact',    label: this.translate.t('nav', 'contact') },
  ];

  protected readonly resumeLabel = this.translate.t('nav', 'resume');

  constructor() {
    afterNextRender(() => {
      const onScroll = () => this.isScrolled.set(window.scrollY > NAVBAR_SCROLL_THRESHOLD_PX);
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });

    effect(() => {
      document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
    });

    const sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) this.isMenuOpen.set(false);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
