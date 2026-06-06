import { Injectable, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
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

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private readonly translate = inject(TranslateService);

  readonly heading = this.translate.t('projects', 'heading');
  readonly sectionNumber = PROJECTS_SECTION_NUMBER;
  readonly githubLabel = this.translate.t('projects', 'github_label');
  readonly liveLabel = this.translate.t('projects', 'live_label');

  readonly projects: Project[] = [
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
}
