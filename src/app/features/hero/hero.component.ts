import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroFacade } from './facades/hero.facade';

@Component({
  selector: 'app-hero',
  imports: [],
  providers: [HeroFacade],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  protected readonly facade = inject(HeroFacade);

  protected scrollToSection(sectionId: string): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
  }
}
