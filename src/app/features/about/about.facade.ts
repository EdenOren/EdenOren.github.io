import { Injectable, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import { ABOUT_SECTION_NUMBER } from './about.constants';

export interface SocialLink {
  key: string;
  href: string;
  label: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class AboutFacade {
  private readonly translate = inject(TranslateService);

  readonly heading = this.translate.t('about', 'heading');
  readonly sectionNumber = ABOUT_SECTION_NUMBER;

  readonly bio: string[] = [
    'I\'m a frontend developer who cares deeply about the craft — clean architecture, thoughtful interactions, and interfaces that feel as good as they look.',
    'I work primarily with Angular, TypeScript, and modern CSS. I enjoy the challenge of translating complex requirements into simple, elegant solutions.',
    'When I\'m not building products, I\'m exploring design systems, contributing to open source, and obsessing over typographic details.',
  ];

  readonly socialLinks: SocialLink[] = [
    {
      key: 'github',
      href: 'https://github.com/EdenOren',
      label: 'GitHub',
      icon: 'github',
    },
    {
      key: 'linkedin',
      href: 'https://linkedin.com/in/edenoren',
      label: 'LinkedIn',
      icon: 'linkedin',
    },
    {
      key: 'email',
      href: 'mailto:edenoren@gmail.com',
      label: 'Email',
      icon: 'mail',
    },
  ];
}
