import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';
import { ExperienceEntry } from '../../../models/admin.models';
import { AdminCrudFacade } from '../../../facades/admin-crud.facade';

const SEED_ENTRIES: ExperienceEntry[] = [
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

@Service({ autoProvided: false })
export class AdminExperienceFacade extends AdminCrudFacade<ExperienceEntry> {
  override readonly items: WritableSignal<ExperienceEntry[]> = signal([...SEED_ENTRIES]);

  readonly roleField: WritableSignal<string> = signal('');
  readonly companyField: WritableSignal<string> = signal('');
  readonly periodField: WritableSignal<string> = signal('');
  readonly currentField: WritableSignal<boolean> = signal(false);
  readonly descriptionField: WritableSignal<string> = signal('');
  readonly tagsField: WritableSignal<string> = signal('');

  override readonly isFormValid: Signal<boolean> = computed(
    () =>
      this.roleField().trim().length > 0 &&
      this.companyField().trim().length > 0 &&
      this.periodField().trim().length > 0
  );

  override openAdd(): void {
    this.roleField.set('');
    this.companyField.set('');
    this.periodField.set('');
    this.currentField.set(false);
    this.descriptionField.set('');
    this.tagsField.set('');
    this.beginAdd();
  }

  override openEdit(entry: ExperienceEntry): void {
    this.roleField.set(entry.role);
    this.companyField.set(entry.company);
    this.periodField.set(entry.period);
    this.currentField.set(entry.current);
    this.descriptionField.set(entry.description);
    this.tagsField.set(entry.tags.join(', '));
    this.beginEdit(entry.id);
  }

  override save(): void {
    if (!this.isFormValid()) {
      return;
    }
    const entry: ExperienceEntry = {
      id: this.editingId() ?? crypto.randomUUID(),
      role: this.roleField().trim(),
      company: this.companyField().trim(),
      period: this.periodField().trim(),
      current: this.currentField(),
      description: this.descriptionField().trim(),
      tags: this.tagsField()
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
    };
    this.applyChange(entry);
  }
}
