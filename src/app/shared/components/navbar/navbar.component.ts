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
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NAVBAR_SCROLL_THRESHOLD_PX } from './navbar.constants';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('NAV') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  protected readonly isScrolled: WritableSignal<boolean> = signal(false);
  protected readonly isMenuOpen: WritableSignal<boolean> = signal(false);

  protected readonly NAV_LINKS: { path: string; labelKey: string }[] = [
    { path: '/about', labelKey: 'ABOUT' },
    { path: '/experience', labelKey: 'EXPERIENCE' },
    { path: '/skills', labelKey: 'SKILLS' },
    { path: '/projects', labelKey: 'PROJECTS' },
    { path: '/contact', labelKey: 'CONTACT' },
  ];

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
