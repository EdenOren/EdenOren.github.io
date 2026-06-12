import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { AdminSkillGroup } from '../../models/admin.models';
import { AdminSkillsFacade } from './facades/admin-skills.facade';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-skills',
  imports: [FormField, ConfirmDialogComponent],
  providers: [AdminSkillsFacade],
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSkillsComponent {
  private readonly adminSkillsFacade: AdminSkillsFacade = inject(AdminSkillsFacade);

  protected readonly groups: WritableSignal<AdminSkillGroup[]> = this.adminSkillsFacade.items;
  protected readonly isFormOpen: WritableSignal<boolean> = this.adminSkillsFacade.isFormOpen;
  protected readonly isEditing: Signal<boolean> = this.adminSkillsFacade.isEditing;
  protected readonly isFormValid: Signal<boolean> = this.adminSkillsFacade.isFormValid;
  protected readonly labelField: FieldTree<string> = this.adminSkillsFacade.labelField;
  protected readonly skillsField: FieldTree<string> = this.adminSkillsFacade.skillsField;

  private readonly deletingId: WritableSignal<string | null> = signal(null);
  protected readonly isDeleteDialogOpen: Signal<boolean> = computed(() => this.deletingId() !== null);
  protected readonly deleteDialogMessage: Signal<string> = computed(() => {
    const id = this.deletingId();
    if (id === null) { return ''; }
    const group = this.groups().find(g => g.id === id);
    return group ? `Delete "${group.label}"?` : 'Delete this item?';
  });

  protected openAdd(): void {
    this.adminSkillsFacade.openAdd();
  }

  protected openEdit(group: AdminSkillGroup): void {
    this.adminSkillsFacade.openEdit(group);
  }

  protected closeForm(): void {
    this.adminSkillsFacade.closeForm();
  }

  protected save(): void {
    this.adminSkillsFacade.save();
  }

  protected openDeleteFor(id: string): void {
    this.deletingId.set(id);
  }

  protected confirmDelete(): void {
    const id = this.deletingId();
    if (id === null) { return; }
    this.deletingId.set(null);
    this.adminSkillsFacade.remove(id);
  }

  protected cancelDelete(): void {
    this.deletingId.set(null);
  }
}
