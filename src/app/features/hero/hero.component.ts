import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { ButtonVariant } from '../../shared/enums/button.enums';
import { CtaButtonComponent } from '../../shared/ui/cta-button/cta-button.component';
import { HeroFacade } from './facades/hero.facade';

@Component({
  selector: 'app-hero',
  imports: [CtaButtonComponent],
  providers: [HeroFacade],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly heroFacade: HeroFacade = inject(HeroFacade);

  protected readonly buttonVariant: typeof ButtonVariant = ButtonVariant;
  protected readonly translation: Signal<Record<string, string>> = this.heroFacade.translation;

  protected scrollToSection(sectionId: string): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
  }
}
