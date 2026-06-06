import { APP_INITIALIZER, ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { TranslateService } from './shared/services/translate.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: (translate: TranslateService) => () => translate.load(),
      deps: [TranslateService],
      multi: true,
    },
  ]
};
