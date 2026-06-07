import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';
import { AdminSkillGroup } from '../../../models/admin.models';
import { AdminCrudFacade } from '../../../facades/admin-crud.facade';

const SEED_GROUPS: AdminSkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'HTML', 'CSS / SCSS', 'Animations', 'A11y'],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: ['Git', 'GitHub Actions', 'Vite', 'Node.js', 'Figma', 'Storybook', 'Jest', 'Playwright'],
  },
  {
    id: 'other',
    label: 'Other',
    skills: ['REST APIs', 'GraphQL', 'Design Systems', 'Web Perf', 'SEO', 'i18n'],
  },
];

@Service({ autoProvided: false })
export class AdminSkillsFacade extends AdminCrudFacade<AdminSkillGroup> {
  override readonly items: WritableSignal<AdminSkillGroup[]> = signal([...SEED_GROUPS]);

  readonly labelField: WritableSignal<string> = signal('');
  readonly skillsField: WritableSignal<string> = signal('');

  override readonly isFormValid: Signal<boolean> = computed(
    () => this.labelField().trim().length > 0
  );

  override openAdd(): void {
    this.labelField.set('');
    this.skillsField.set('');
    this.beginAdd();
  }

  override openEdit(group: AdminSkillGroup): void {
    this.labelField.set(group.label);
    this.skillsField.set(group.skills.join(', '));
    this.beginEdit(group.id);
  }

  override save(): void {
    if (!this.isFormValid()) {
      return;
    }
    const group: AdminSkillGroup = {
      id: this.editingId() ?? crypto.randomUUID(),
      label: this.labelField().trim(),
      skills: this.skillsField()
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0),
    };
    this.applyChange(group);
  }
}
