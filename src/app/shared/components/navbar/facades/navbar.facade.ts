import {
  DestroyRef,
  Service,
  Signal,
  WritableSignal,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/platform/auth.service';
import { NAVBAR_SCROLL_THRESHOLD_PX } from '../navbar.constants';

@Service({ autoProvided: false })
export class NavbarFacade {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly authService: AuthService = inject(AuthService);

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('NAV') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly isScrolled: WritableSignal<boolean> = signal(false);
  readonly isMenuOpen: WritableSignal<boolean> = signal(false);
  readonly activeSection: WritableSignal<string> = signal('');
  readonly isAuthenticated: Signal<boolean> = this.authService.isAuthenticated;

  readonly NAV_LINKS: { labelKey: string; sectionId: string }[] = [
    { labelKey: 'ABOUT', sectionId: 'about' },
    { labelKey: 'EXPERIENCE', sectionId: 'experience' },
    { labelKey: 'SKILLS', sectionId: 'skills' },
    { labelKey: 'PROJECTS', sectionId: 'projects' },
    { labelKey: 'CONTACT', sectionId: 'contact' },
  ];

  constructor() {
    afterNextRender(() => {
      const onScroll = (): void => {
        this.isScrolled.set(window.scrollY > NAVBAR_SCROLL_THRESHOLD_PX);
        this.updateActiveSection();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
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

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    } else {
      this.router.navigate(['']);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  private updateActiveSection(): void {
    let current = '';
    for (const link of this.NAV_LINKS) {
      const element = document.getElementById(link.sectionId);
      if (element && element.getBoundingClientRect().top <= 100) {
        current = link.sectionId;
      }
    }
    this.activeSection.set(current);
  }
}
