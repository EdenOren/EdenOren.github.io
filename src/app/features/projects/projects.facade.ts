import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { PROJECTS_SECTION_NUMBER } from './projects.constants';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

@Service({ autoProvided: false })
export class ProjectsFacade {
  private readonly translateService: TranslateService = inject(TranslateService);

  private readonly _loading: WritableSignal<boolean> = signal(true);
  readonly isLoading: Signal<boolean> = computed(() => this._loading());

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('PROJECTS') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly SECTION_NUMBER: string = PROJECTS_SECTION_NUMBER;

  readonly PROJECTS: Project[] = [
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'This portfolio — built with Angular 22, zoneless change detection, signals, and a hand-crafted design system.',
      tags: ['Angular 22', 'Signals', 'SCSS', 'TypeScript'],
      githubUrl: 'https://github.com/EdenOren/EdenOren.github.io2',
      liveUrl: 'https://edenoren.github.io',
      featured: true,
    },
    {
      id: 'design-system',
      title: 'Signal Luxe DS',
      description: 'A dark editorial design system with Cormorant + Geist typography, emerald accent tokens, and full SCSS BEM architecture.',
      tags: ['Design System', 'SCSS', 'Tokens'],
      githubUrl: 'https://github.com/EdenOren',
      featured: true,
    },
    {
      id: 'open-source',
      title: 'Open Source Contributions',
      description: 'Various contributions to Angular ecosystem libraries — accessibility fixes, documentation, and performance improvements.',
      tags: ['Angular', 'Open Source', 'A11y'],
      githubUrl: 'https://github.com/EdenOren',
      featured: false,
    },
    {
      id: 'web-experiments',
      title: 'Web Experiments',
      description: 'A collection of CSS animations, canvas experiments, and creative coding sketches exploring the boundaries of the browser.',
      tags: ['CSS', 'Canvas', 'Animation'],
      githubUrl: 'https://github.com/EdenOren',
      featured: false,
    },
  ];

  constructor() {
    // Simulates realistic async latency for static in-memory data
    setTimeout(() => this._loading.set(false), 600);
  }
}
