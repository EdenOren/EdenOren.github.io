import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { Language } from './core/enums/core.enums';
import { SeoService } from './core/services/platform/seo.service';
import { ThemeService } from './core/services/platform/theme.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    ...provideTranslateService(),
    ...provideTranslateHttpLoader(),
    provideAppInitializer(() => inject(TranslateService).use(Language.English)),
    provideAppInitializer(() => inject(SeoService).apply()),
    provideAppInitializer(() => inject(ThemeService).init()),
  ]
};
