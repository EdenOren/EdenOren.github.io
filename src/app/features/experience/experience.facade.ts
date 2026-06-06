import { Injectable, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
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

@Injectable({ providedIn: 'root' })
export class ExperienceFacade {
  private readonly translate = inject(TranslateService);

  readonly heading = this.translate.t('experience', 'heading');
  readonly present = this.translate.t('experience', 'present');
  readonly sectionNumber = EXPERIENCE_SECTION_NUMBER;

  readonly entries: ExperienceEntry[] = [
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
}
