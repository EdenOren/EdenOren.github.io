import { Service, Signal, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import { I18nSection } from '../../shared/enums/i18n-section.enum';
import { ABOUT_SECTION_NUMBER } from './about.constants';
import { SocialIcon, SocialLinkKey } from './about.enums';

export interface SocialLink {
  key: SocialLinkKey;
  href: string;
  label: string;
  ariaLabel: Signal<string>;
  icon: SocialIcon;
}

@Service({ autoProvided: false })
export class AboutFacade {
  private readonly translate = inject(TranslateService);

  readonly heading:       Signal<string> = this.translate.get(I18nSection.About, 'HEADING');
  readonly SECTION_NUMBER: string = ABOUT_SECTION_NUMBER;

  readonly BIO: Signal<string>[] = [
    this.translate.get(I18nSection.About, 'BIO_1'),
    this.translate.get(I18nSection.About, 'BIO_2'),
    this.translate.get(I18nSection.About, 'BIO_3'),
  ];

  readonly SOCIAL_LINKS: SocialLink[] = [
    {
      key: SocialLinkKey.GitHub,
      href: 'https://github.com/EdenOren',
      label: 'GitHub',
      ariaLabel: this.translate.get(I18nSection.About, 'GITHUB_LABEL'),
      icon: SocialIcon.GitHub,
    },
    {
      key: SocialLinkKey.LinkedIn,
      href: 'https://linkedin.com/in/edenoren',
      label: 'LinkedIn',
      ariaLabel: this.translate.get(I18nSection.About, 'LINKEDIN_LABEL'),
      icon: SocialIcon.LinkedIn,
    },
    {
      key: SocialLinkKey.Email,
      href: 'mailto:edenoren@gmail.com',
      label: 'Email',
      ariaLabel: this.translate.get(I18nSection.About, 'EMAIL_LABEL'),
      icon: SocialIcon.Mail,
    },
  ];
}
