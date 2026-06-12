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
import { ExperienceEntry } from '../../../../../features/experience/models/experience.models';
import { ExperienceService } from '../../../../../core/services/data/experience.service';
import { AdminCrudFacade } from '../../../facades/admin-crud.facade';

interface ExperienceFormModel {
  role: string;
  company: string;
  period: string;
  isCurrent: boolean;
  description: string;
  tags: string;
}

@Service({ autoProvided: false })
export class AdminExperienceFacade extends AdminCrudFacade<ExperienceEntry> {
  private readonly experienceService: ExperienceService = inject(ExperienceService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  override readonly items: WritableSignal<ExperienceEntry[]> = linkedSignal(() =>
    this.experienceService.items()
  );

  private readonly formModel: WritableSignal<ExperienceFormModel> = signal({
    role: '',
    company: '',
    period: '',
    isCurrent: false,
    description: '',
    tags: '',
  });

  private readonly formTree: FieldTree<ExperienceFormModel> = form(
    this.formModel,
    (p) => {
      required(p.role);
      required(p.company);
      required(p.period);
    }
  );

  readonly roleField: FieldTree<string> = this.formTree.role;
  readonly companyField: FieldTree<string> = this.formTree.company;
  readonly periodField: FieldTree<string> = this.formTree.period;
  readonly isCurrentField: FieldTree<boolean> = this.formTree.isCurrent;
  readonly descriptionField: FieldTree<string> = this.formTree.description;
  readonly tagsField: FieldTree<string> = this.formTree.tags;

  override readonly isFormValid: Signal<boolean> = computed(() => this.formTree().valid());

  override openAdd(): void {
    this.formModel.set({ role: '', company: '', period: '', isCurrent: false, description: '', tags: '' });
    this.beginAdd();
  }

  override openEdit(entry: ExperienceEntry): void {
    this.formModel.set({
      role: entry.role,
      company: entry.company,
      period: entry.period,
      isCurrent: entry.is_current,
      description: entry.description,
      tags: entry.tags.join(', '),
    });
    this.beginEdit(entry.id);
  }

  override save(): void {
    if (!this.isFormValid()) {
      return;
    }
    const value = this.formModel();
    const existing = this.items().find(item => item.id === this.editingId());
    const entry: ExperienceEntry = {
      id: this.editingId() ?? crypto.randomUUID(),
      role: value.role.trim(),
      company: value.company.trim(),
      period: value.period.trim(),
      is_current: value.isCurrent,
      description: value.description.trim(),
      tags: value.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      sort_order: existing?.sort_order ?? this.items().length,
    };

    const call$ = this.isEditing()
      ? this.experienceService.update(entry.id, entry)
      : this.experienceService.create(entry);

    call$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.experienceService.reload();
        this.closeForm();
      },
    });
  }

  override remove(id: string): void {
    this.experienceService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.experienceService.reload() });
  }
}
