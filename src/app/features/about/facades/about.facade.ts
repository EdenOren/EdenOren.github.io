import { Service, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SocialIcon, SocialLinkKey } from '../enums/about.enums';
import { AboutService } from '../../../core/services/data/about.service';

export interface SocialLink {
  key: SocialLinkKey;
  href: string;
  label: string;
  ariaLabel: Signal<string>;
  icon: SocialIcon;
}

@Service({ autoProvided: false })
export class AboutFacade {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly aboutService: AboutService = inject(AboutService);

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('ABOUT') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly portraitUrl: Signal<string | null> = computed(
    () => this.aboutService.data()?.image_url ?? null
  );

  readonly bioParagraphs: Signal<string[]> = computed(() => {
    const text = this.aboutService.data()?.bio_text;
    if (!text) { return []; }
    return text.split('\n\n').filter(p => p.trim().length > 0);
  });

  readonly SOCIAL_LINKS: SocialLink[] = [
    {
      key: SocialLinkKey.GitHub,
      href: 'https://github.com/EdenOren',
      label: 'GitHub',
      ariaLabel: computed(() => this.translation()['GITHUB_LABEL']),
      icon: SocialIcon.GitHub,
    },
    {
      key: SocialLinkKey.LinkedIn,
      href: 'https://linkedin.com/in/edenoren',
      label: 'LinkedIn',
      ariaLabel: computed(() => this.translation()['LINKEDIN_LABEL']),
      icon: SocialIcon.LinkedIn,
    },
    {
      key: SocialLinkKey.Email,
      href: 'mailto:edenoren@gmail.com',
      label: 'Email',
      ariaLabel: computed(() => this.translation()['EMAIL_LABEL']),
      icon: SocialIcon.Mail,
    },
  ];
}
