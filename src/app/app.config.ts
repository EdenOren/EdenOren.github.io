import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { Language } from './core/enums/core.enums';
import { SeoService } from './core/services/platform/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    ...provideTranslateService(),
    ...provideTranslateHttpLoader(),
    provideAppInitializer(() => inject(TranslateService).use(Language.English)),
    provideAppInitializer(() => inject(SeoService).apply()),
  ]
};
