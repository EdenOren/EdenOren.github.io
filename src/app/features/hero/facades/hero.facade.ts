import { Service, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Service({ autoProvided: false })
export class HeroFacade {
  private readonly translateService: TranslateService = inject(TranslateService);

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('HERO') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );
}
