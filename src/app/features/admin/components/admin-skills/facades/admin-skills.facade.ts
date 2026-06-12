import {
  DestroyRef,
  Service,
  Signal,
  WritableSignal,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldTree, form, required } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { Observable, filter, forkJoin, of, switchMap } from 'rxjs';
import { Skill } from '../../../../../features/skills/models/skills.models';
import { SkillsService } from '../../../../../core/services/data/skills.service';
import { ConfirmDialogService } from '../../../../../core/services/platform/confirm-dialog.service';
import { AdminSkillGroup } from '../../../models/admin.models';
import { AdminCrudFacade } from '../../../facades/admin-crud.facade';

interface SkillGroupFormModel {
  label: string;
  skills: string;
}

@Service({ autoProvided: false })
export class AdminSkillsFacade extends AdminCrudFacade<AdminSkillGroup> {
  private readonly skillsService: SkillsService = inject(SkillsService);
  private readonly confirmDialogService: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  override readonly items: WritableSignal<AdminSkillGroup[]> = linkedSignal(() =>
    this.groupByCategory(this.skillsService.items())
  );

  private readonly formModel: WritableSignal<SkillGroupFormModel> = signal({
    label: '',
    skills: '',
  });

  private readonly formTree: FieldTree<SkillGroupFormModel> = form(
    this.formModel,
    (p) => {
      required(p.label);
    }
  );

  readonly labelField: FieldTree<string> = this.formTree.label;
  readonly skillsField: FieldTree<string> = this.formTree.skills;

  override readonly isFormValid: Signal<boolean> = computed(() => this.formTree().valid());

  override openAdd(): void {
    this.formModel.set({ label: '', skills: '' });
    this.beginAdd();
  }

  override openEdit(group: AdminSkillGroup): void {
    this.formModel.set({
      label: group.label,
      skills: group.skills.join(', '),
    });
    this.beginEdit(group.id);
  }

  override save(): void {
    if (!this.isFormValid()) {
      return;
    }
    const { label, skills } = this.formModel();
    const category = label.trim();
    const skillNames = skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const existingSkills = this.skillsService.items().filter(skill => skill.category === (this.editingId() ?? ''));

    const newSkillRows: Skill[] = skillNames.map((name, index) => ({
      id: crypto.randomUUID(),
      category,
      name,
      sort_order: index,
    }));

    const deleteAll$: Observable<unknown> =
      existingSkills.length > 0
        ? forkJoin(existingSkills.map(skill => this.skillsService.delete(skill.id)))
        : of(null);

    const createAll$: Observable<unknown> =
      newSkillRows.length > 0
        ? forkJoin(newSkillRows.map(skill => this.skillsService.create(skill)))
        : of(null);

    deleteAll$
      .pipe(
        switchMap(() => createAll$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.skillsService.reload();
          this.closeForm();
        },
      });
  }

  override remove(id: string): void {
    const skillsToDelete = this.skillsService.items().filter(skill => skill.category === id);

    if (skillsToDelete.length === 0) {
      return;
    }

    forkJoin(skillsToDelete.map(skill => this.skillsService.delete(skill.id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.skillsService.reload() });
  }

  requestDelete(id: string): void {
    const group: AdminSkillGroup | undefined = this.items().find(g => g.id === id);
    const message: string = group
      ? this.translateService.instant('ADMIN.CONFIRM_DELETE_NAMED', { name: group.label })
      : this.translateService.instant('ADMIN.CONFIRM_DELETE');
    this.confirmDialogService.open(message)
      .pipe(filter(confirmed => confirmed), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.remove(id));
  }

  private groupByCategory(skills: Skill[]): AdminSkillGroup[] {
    const categoryMap = new Map<string, string[]>();
    for (const skill of skills) {
      const existing = categoryMap.get(skill.category) ?? [];
      existing.push(skill.name);
      categoryMap.set(skill.category, existing);
    }
    return Array.from(categoryMap.entries()).map(([category, skillNames]) => ({
      id: category,
      label: category,
      skills: skillNames,
    }));
  }
}
