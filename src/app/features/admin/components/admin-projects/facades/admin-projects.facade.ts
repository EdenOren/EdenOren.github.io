import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Project } from '../../../models/admin.models';
import { AdminCrudFacade } from '../../../facades/admin-crud.facade';

const SEED_PROJECTS: Project[] = [
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

@Service({ autoProvided: false })
export class AdminProjectsFacade extends AdminCrudFacade<Project> {
  override readonly items: WritableSignal<Project[]> = signal([...SEED_PROJECTS]);

  readonly titleField: WritableSignal<string> = signal('');
  readonly descriptionField: WritableSignal<string> = signal('');
  readonly tagsField: WritableSignal<string> = signal('');
  readonly githubUrlField: WritableSignal<string> = signal('');
  readonly liveUrlField: WritableSignal<string> = signal('');
  readonly featuredField: WritableSignal<boolean> = signal(false);

  override readonly isFormValid: Signal<boolean> = computed(
    () => this.titleField().trim().length > 0
  );

  override openAdd(): void {
    this.titleField.set('');
    this.descriptionField.set('');
    this.tagsField.set('');
    this.githubUrlField.set('');
    this.liveUrlField.set('');
    this.featuredField.set(false);
    this.beginAdd();
  }

  override openEdit(project: Project): void {
    this.titleField.set(project.title);
    this.descriptionField.set(project.description);
    this.tagsField.set(project.tags.join(', '));
    this.githubUrlField.set(project.githubUrl ?? '');
    this.liveUrlField.set(project.liveUrl ?? '');
    this.featuredField.set(project.featured);
    this.beginEdit(project.id);
  }

  override save(): void {
    if (!this.isFormValid()) {
      return;
    }
    const project: Project = {
      id: this.editingId() ?? crypto.randomUUID(),
      title: this.titleField().trim(),
      description: this.descriptionField().trim(),
      tags: this.tagsField()
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      githubUrl: this.githubUrlField().trim() || undefined,
      liveUrl: this.liveUrlField().trim() || undefined,
      featured: this.featuredField(),
    };
    this.applyChange(project);
  }
}
