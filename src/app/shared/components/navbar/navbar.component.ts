import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  WritableSignal,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NAVBAR_SCROLL_THRESHOLD_PX } from './navbar.constants';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('NAV') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  protected readonly isScrolled: WritableSignal<boolean> = signal(false);
  protected readonly isMenuOpen: WritableSignal<boolean> = signal(false);
  protected readonly activeSection: WritableSignal<string> = signal('');

  protected readonly NAV_LINKS: { labelKey: string; sectionId: string }[] = [
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

  protected scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    } else {
      this.router.navigate(['']);
    }
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu(): void {
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
