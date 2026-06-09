import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

const MOCK_EXPERIENCE = [
  {
    id: 'exp-1',
    role: 'Frontend Developer',
    company: 'Freelance',
    period: '2023',
    is_current: true,
    description:
      'Building accessible, performant web applications for clients across fintech and SaaS. Specializing in Angular with signals, design systems, and component architecture.',
    tags: ['Angular', 'TypeScript', 'SCSS', 'Design Systems'],
    sort_order: 1,
  },
  {
    id: 'exp-2',
    role: 'Junior Frontend Developer',
    company: 'Startup',
    period: '2022',
    is_current: false,
    description:
      'Developed and maintained React-based dashboards. Improved Lighthouse scores by 40% through code-splitting and image optimization.',
    tags: ['React', 'TypeScript', 'Performance'],
    sort_order: 2,
  },
  {
    id: 'exp-3',
    role: 'Web Developer Intern',
    company: 'Agency',
    period: '2021',
    is_current: false,
    description:
      'Built marketing landing pages and maintained client websites. Wrote semantic HTML and modular CSS for a portfolio of 20+ clients.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    sort_order: 3,
  },
];

const MOCK_PROJECTS = [
  {
    id: 'portfolio',
    name: 'Portfolio',
    description:
      'This portfolio — built with Angular 22, zoneless change detection, signals, and a hand-crafted design system.',
    github_url: 'https://github.com/EdenOren/EdenOren.github.io2',
    tags: ['Angular 22', 'Signals', 'SCSS', 'TypeScript'],
    sort_order: 1,
  },
  {
    id: 'design-system',
    name: 'Signal Luxe DS',
    description:
      'A dark editorial design system with Cormorant + Geist typography, emerald accent tokens, and full SCSS BEM architecture.',
    github_url: 'https://github.com/EdenOren',
    tags: ['Design System', 'SCSS', 'Tokens'],
    sort_order: 2,
  },
  {
    id: 'open-source',
    name: 'Open Source Contributions',
    description:
      'Various contributions to Angular ecosystem libraries — accessibility fixes, documentation, and performance improvements.',
    github_url: 'https://github.com/EdenOren',
    tags: ['Angular', 'Open Source', 'A11y'],
    sort_order: 3,
  },
  {
    id: 'web-experiments',
    name: 'Web Experiments',
    description:
      'A collection of CSS animations, canvas experiments, and creative coding sketches exploring the boundaries of the browser.',
    github_url: 'https://github.com/EdenOren',
    tags: ['CSS', 'Canvas', 'Animation'],
    sort_order: 4,
  },
];

const MOCK_SKILLS = [
  { id: 'skill-fe-1', category: 'Frontend', name: 'Angular', sort_order: 1 },
  { id: 'skill-fe-2', category: 'Frontend', name: 'TypeScript', sort_order: 2 },
  { id: 'skill-fe-3', category: 'Frontend', name: 'RxJS', sort_order: 3 },
  { id: 'skill-fe-4', category: 'Frontend', name: 'Signals', sort_order: 4 },
  { id: 'skill-fe-5', category: 'Frontend', name: 'HTML', sort_order: 5 },
  { id: 'skill-fe-6', category: 'Frontend', name: 'CSS / SCSS', sort_order: 6 },
  { id: 'skill-fe-7', category: 'Frontend', name: 'Animations', sort_order: 7 },
  { id: 'skill-fe-8', category: 'Frontend', name: 'A11y', sort_order: 8 },
  { id: 'skill-tl-1', category: 'Tools', name: 'Git', sort_order: 1 },
  { id: 'skill-tl-2', category: 'Tools', name: 'GitHub Actions', sort_order: 2 },
  { id: 'skill-tl-3', category: 'Tools', name: 'Vite', sort_order: 3 },
  { id: 'skill-tl-4', category: 'Tools', name: 'Node.js', sort_order: 4 },
  { id: 'skill-tl-5', category: 'Tools', name: 'Figma', sort_order: 5 },
  { id: 'skill-tl-6', category: 'Tools', name: 'Storybook', sort_order: 6 },
  { id: 'skill-tl-7', category: 'Tools', name: 'Jest', sort_order: 7 },
  { id: 'skill-tl-8', category: 'Tools', name: 'Playwright', sort_order: 8 },
  { id: 'skill-be-1', category: 'Backend & APIs', name: 'REST APIs', sort_order: 1 },
  { id: 'skill-be-2', category: 'Backend & APIs', name: 'GraphQL', sort_order: 2 },
  { id: 'skill-be-3', category: 'Backend & APIs', name: 'Design Systems', sort_order: 3 },
  { id: 'skill-be-4', category: 'Backend & APIs', name: 'Web Perf', sort_order: 4 },
  { id: 'skill-be-5', category: 'Backend & APIs', name: 'SEO', sort_order: 5 },
  { id: 'skill-be-6', category: 'Backend & APIs', name: 'i18n', sort_order: 6 },
];

const MOCK_ROUTES: Record<string, unknown[]> = {
  '/api/experience': MOCK_EXPERIENCE,
  '/api/projects': MOCK_PROJECTS,
  '/api/skills': MOCK_SKILLS,
};

export const mockApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (environment.production) {
    return next(req);
  }

  for (const [path, body] of Object.entries(MOCK_ROUTES)) {
    if (req.url.endsWith(path)) {
      return of(new HttpResponse<unknown>({ status: 200, body }));
    }
  }

  return next(req);
};
