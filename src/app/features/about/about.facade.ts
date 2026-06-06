import { Injectable, Signal, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import { ABOUT_SECTION_NUMBER } from './about.constants';

export interface SocialLink {
  key: string;
  href: string;
  label: string;
  ariaLabel: Signal<string>;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class AboutFacade {
  private readonly translate = inject(TranslateService);

  readonly heading = this.translate.t('about', 'heading');
  readonly sectionNumber = ABOUT_SECTION_NUMBER;

  readonly bio: Signal<string>[] = [
    this.translate.t('about', 'bio_1'),
    this.translate.t('about', 'bio_2'),
    this.translate.t('about', 'bio_3'),
  ];

  readonly socialLinks: SocialLink[] = [
    {
      key: 'github',
      href: 'https://github.com/EdenOren',
      label: 'GitHub',
      ariaLabel: this.translate.t('about', 'github_label'),
      icon: 'github',
    },
    {
      key: 'linkedin',
      href: 'https://linkedin.com/in/edenoren',
      label: 'LinkedIn',
      ariaLabel: this.translate.t('about', 'linkedin_label'),
      icon: 'linkedin',
    },
    {
      key: 'email',
      href: 'mailto:edenoren@gmail.com',
      label: 'Email',
      ariaLabel: this.translate.t('about', 'email_label'),
      icon: 'mail',
    },
  ];
}
