import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ExperienceEntry } from '../../../experience/models/experience.models';
import { AdminExperienceFacade } from './facades/admin-experience.facade';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-experience',
  imports: [FormField, ConfirmDialogComponent],
  providers: [AdminExperienceFacade],
  templateUrl: './admin-experience.component.html',
  styleUrl: './admin-experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminExperienceComponent {
  private readonly adminExperienceFacade: AdminExperienceFacade = inject(AdminExperienceFacade);

  protected readonly entries: WritableSignal<ExperienceEntry[]> = this.adminExperienceFacade.items;
  protected readonly isFormOpen: WritableSignal<boolean> = this.adminExperienceFacade.isFormOpen;
  protected readonly isEditing: Signal<boolean> = this.adminExperienceFacade.isEditing;
  protected readonly isFormValid: Signal<boolean> = this.adminExperienceFacade.isFormValid;
  protected readonly roleField: FieldTree<string> = this.adminExperienceFacade.roleField;
  protected readonly companyField: FieldTree<string> = this.adminExperienceFacade.companyField;
  protected readonly periodField: FieldTree<string> = this.adminExperienceFacade.periodField;
  protected readonly isCurrentField: FieldTree<boolean> = this.adminExperienceFacade.isCurrentField;
  protected readonly descriptionField: FieldTree<string> = this.adminExperienceFacade.descriptionField;
  protected readonly tagsField: FieldTree<string> = this.adminExperienceFacade.tagsField;

  private readonly deletingId: WritableSignal<string | null> = signal(null);
  protected readonly isDeleteDialogOpen: Signal<boolean> = computed(() => this.deletingId() !== null);
  protected readonly deleteDialogMessage: Signal<string> = computed(() => {
    const id = this.deletingId();
    if (id === null) { return ''; }
    const entry = this.entries().find(e => e.id === id);
    return entry ? `Delete "${entry.role}"?` : 'Delete this item?';
  });

  protected openAdd(): void {
    this.adminExperienceFacade.openAdd();
  }

  protected openEdit(entry: ExperienceEntry): void {
    this.adminExperienceFacade.openEdit(entry);
  }

  protected closeForm(): void {
    this.adminExperienceFacade.closeForm();
  }

  protected save(): void {
    this.adminExperienceFacade.save();
  }

  protected openDeleteFor(id: string): void {
    this.deletingId.set(id);
  }

  protected confirmDelete(): void {
    const id = this.deletingId();
    if (id === null) { return; }
    this.deletingId.set(null);
    this.adminExperienceFacade.remove(id);
  }

  protected cancelDelete(): void {
    this.deletingId.set(null);
  }
}
