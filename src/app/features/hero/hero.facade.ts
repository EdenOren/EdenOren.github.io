import { Injectable, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';

@Injectable({ providedIn: 'root' })
export class HeroFacade {
  private readonly translate = inject(TranslateService);

  readonly nameFirst  = this.translate.t('hero', 'name_first');
  readonly nameLast   = this.translate.t('hero', 'name_last');
  readonly greeting   = this.translate.t('hero', 'greeting');
  readonly title      = this.translate.t('hero', 'title');
  readonly tagline    = this.translate.t('hero', 'tagline');
  readonly ctaWork    = this.translate.t('hero', 'cta_work');
  readonly ctaContact = this.translate.t('hero', 'cta_contact');
}
