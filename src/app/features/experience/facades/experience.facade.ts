import { Service, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ExperienceService } from '../../../core/services/data/experience.service';

export interface ExperienceEntryView {
  id: string;
  role: string;
  company: string;
  period: string;
  current: boolean;
  description: string;
  tags: string[];
}

@Service({ autoProvided: false })
export class ExperienceFacade {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly experienceService: ExperienceService = inject(ExperienceService);

  readonly isLoading: Signal<boolean> = this.experienceService.isLoading;
  readonly isError: Signal<boolean> = this.experienceService.isError;

  readonly entries: Signal<ExperienceEntryView[]> = computed(() =>
    this.experienceService.items().map(entry => ({
      id: entry.id,
      role: entry.role,
      company: entry.company,
      period: entry.period,
      current: entry.is_current,
      description: entry.description,
      tags: entry.tags,
    }))
  );

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('EXPERIENCE') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );
}
