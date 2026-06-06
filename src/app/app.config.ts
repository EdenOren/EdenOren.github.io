import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { TranslateService } from './shared/services/translate.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()), // required: GitHub Pages does not support HTML5 history
    provideHttpClient(),
    provideAppInitializer(() => inject(TranslateService).load()),
  ]
};
