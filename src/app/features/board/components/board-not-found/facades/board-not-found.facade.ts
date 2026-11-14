import { DestroyRef, Service, Signal, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SeoService } from '../../../../../core/services/platform/seo.service';
import { ThemeService } from '../../../../../core/services/platform/theme.service';

@Service({ autoProvided: false })
export class BoardNotFoundFacade {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly seoService: SeoService = inject(SeoService);

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('BOARD') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly isNight: Signal<boolean> = this.themeService.isDark;

  constructor() {
    effect(() => {
      this.seoService.applyPageTitle(this.translation()['NOT_FOUND_TITLE'] ?? '');
    });
    inject(DestroyRef).onDestroy(() => this.seoService.resetTitle());
  }
}
