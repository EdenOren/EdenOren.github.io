import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

  protected readonly isScrolled = signal(false);

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
  }
}
