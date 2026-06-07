import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';
import { AdminSkillGroup } from '../../../models/admin.models';

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
export class AdminSkillsFacade {
  readonly groups: WritableSignal<AdminSkillGroup[]> = signal([...SEED_GROUPS]);

  readonly isFormOpen: WritableSignal<boolean> = signal(false);
  readonly editingId: WritableSignal<string | null> = signal(null);
  readonly labelField: WritableSignal<string> = signal('');
  readonly skillsField: WritableSignal<string> = signal('');

  readonly isEditing: Signal<boolean> = computed(() => this.editingId() !== null);
  readonly isFormValid: Signal<boolean> = computed(
    () => this.labelField().trim().length > 0
  );

  openAdd(): void {
    this.editingId.set(null);
    this.labelField.set('');
    this.skillsField.set('');
    this.isFormOpen.set(true);
  }

  openEdit(group: AdminSkillGroup): void {
    this.editingId.set(group.id);
    this.labelField.set(group.label);
    this.skillsField.set(group.skills.join(', '));
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  save(): void {
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
    if (this.isEditing()) {
      this.groups.update(list => list.map(g => (g.id === group.id ? group : g)));
    } else {
      this.groups.update(list => [...list, group]);
    }
    this.closeForm();
  }

  remove(id: string): void {
    this.groups.update(list => list.filter(g => g.id !== id));
  }
}
