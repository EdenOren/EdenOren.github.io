import { Service } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import translations from '../../../../assets/i18n/en.json';

// The HTTP loader requests a relative URL, which has no origin to resolve against during
// build-time pre-rendering, so the server reads the bundled file instead.
@Service({ autoProvided: false })
export class ServerTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(translations);
  }
}
