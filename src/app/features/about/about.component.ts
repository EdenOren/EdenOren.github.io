import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { AboutFacade, SocialLink } from './facades/about.facade';

@Component({
  selector: 'app-about',
  imports: [ScrollRevealDirective],
  providers: [AboutFacade],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly aboutFacade: AboutFacade = inject(AboutFacade);

  protected readonly translation: Signal<Record<string, string>> = this.aboutFacade.translation;
  protected readonly SOCIAL_LINKS: SocialLink[] = this.aboutFacade.SOCIAL_LINKS;
  protected readonly portraitUrl: Signal<string | null> = this.aboutFacade.portraitUrl;
  protected readonly bioParagraphs: Signal<string[]> = this.aboutFacade.bioParagraphs;
}
