import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EXPERIENCE_SECTION_NUMBER } from './experience.constants';

export interface ExperienceEntry {
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

  private readonly _loading: WritableSignal<boolean> = signal(true);
  readonly isLoading: Signal<boolean> = computed(() => this._loading());

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('EXPERIENCE') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly SECTION_NUMBER: string = EXPERIENCE_SECTION_NUMBER;

  readonly ENTRIES: ExperienceEntry[] = [
    {
      id: 'exp-1',
      role: 'Frontend Developer',
      company: 'Freelance',
      period: '2023',
      current: true,
      description: 'Building accessible, performant web applications for clients across fintech and SaaS. Specializing in Angular with signals, design systems, and component architecture.',
      tags: ['Angular', 'TypeScript', 'SCSS', 'Design Systems'],
    },
    {
      id: 'exp-2',
      role: 'Junior Frontend Developer',
      company: 'Startup',
      period: '2022',
      current: false,
      description: 'Developed and maintained React-based dashboards. Improved Lighthouse scores by 40% through code-splitting and image optimization.',
      tags: ['React', 'TypeScript', 'Performance'],
    },
    {
      id: 'exp-3',
      role: 'Web Developer Intern',
      company: 'Agency',
      period: '2021',
      current: false,
      description: 'Built marketing landing pages and maintained client websites. Wrote semantic HTML and modular CSS for a portfolio of 20+ clients.',
      tags: ['HTML', 'CSS', 'JavaScript'],
    },
  ];

  constructor() {
    // Simulates realistic async latency for static in-memory data
    setTimeout(() => this._loading.set(false), 600);
  }
}
