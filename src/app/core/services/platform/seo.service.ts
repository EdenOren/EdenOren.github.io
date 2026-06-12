import { Service, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Service()
export class SeoService {
  private static readonly TITLE = 'Eden Oren — Frontend Developer';
  private static readonly DESCRIPTION = 'Portfolio of Eden Oren, a frontend developer specialising in Angular, TypeScript, and modern CSS.';
  private static readonly BASE_URL = 'https://edenoren.github.io/EdenOren.github.io/';
  private static readonly OG_IMAGE = 'https://edenoren.github.io/EdenOren.github.io/assets/og-image.png';

  private readonly meta: Meta = inject(Meta);
  private readonly title: Title = inject(Title);

  apply(): void {
    this.title.setTitle(SeoService.TITLE);

    this.meta.addTags([
      { name: 'description', content: SeoService.DESCRIPTION },
      { name: 'author', content: 'Eden Oren' },

      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: SeoService.TITLE },
      { property: 'og:description', content: SeoService.DESCRIPTION },
      { property: 'og:url', content: SeoService.BASE_URL },
      { property: 'og:image', content: SeoService.OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'Eden Oren' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SeoService.TITLE },
      { name: 'twitter:description', content: SeoService.DESCRIPTION },
      { name: 'twitter:image', content: SeoService.OG_IMAGE },
    ]);

    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', SeoService.BASE_URL);
    document.head.appendChild(canonical);
  }
}
