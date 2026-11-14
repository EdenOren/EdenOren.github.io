import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { AboutFacade, SocialLink } from '../../../../about/facades/about.facade';

@Component({
  selector: 'app-about-panel',
  imports: [NgOptimizedImage],
  providers: [AboutFacade],
  templateUrl: './about-panel.component.html',
  styleUrl: './about-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPanelComponent {
  private readonly aboutFacade: AboutFacade = inject(AboutFacade);

  protected readonly SOCIAL_LINKS: SocialLink[] = this.aboutFacade.SOCIAL_LINKS;
  protected readonly portraitUrl: Signal<string | null> = this.aboutFacade.portraitUrl;
  protected readonly bioParagraphs: Signal<string[]> = this.aboutFacade.bioParagraphs;
}
