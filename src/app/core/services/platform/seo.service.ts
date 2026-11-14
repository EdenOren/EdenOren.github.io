import { Service, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Service()
export class SeoService {
  private static readonly TITLE = 'Eden Oren — Frontend Developer';
  private static readonly SITE_NAME = 'Eden Oren';

  private readonly title: Title = inject(Title);

  applyPageTitle(pageName: string): void {
    this.title.setTitle(pageName ? `${pageName} — ${SeoService.SITE_NAME}` : SeoService.TITLE);
  }

  resetTitle(): void {
    this.title.setTitle(SeoService.TITLE);
  }
}
