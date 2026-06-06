import { Service, Signal, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import { I18nSection } from '../../shared/enums/i18n-section.enum';

@Service({ autoProvided: false })
export class HeroFacade {
  private readonly translate = inject(TranslateService);

  readonly nameFirst:  Signal<string> = this.translate.get(I18nSection.Hero, 'NAME_FIRST');
  readonly nameLast:   Signal<string> = this.translate.get(I18nSection.Hero, 'NAME_LAST');
  readonly greeting:   Signal<string> = this.translate.get(I18nSection.Hero, 'GREETING');
  readonly title:      Signal<string> = this.translate.get(I18nSection.Hero, 'TITLE');
  readonly tagline:    Signal<string> = this.translate.get(I18nSection.Hero, 'TAGLINE');
  readonly ctaWork:    Signal<string> = this.translate.get(I18nSection.Hero, 'CTA_WORK');
  readonly ctaContact: Signal<string> = this.translate.get(I18nSection.Hero, 'CTA_CONTACT');
}
