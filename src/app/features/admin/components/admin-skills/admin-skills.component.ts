import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { AdminSkillGroup } from '../../models/admin.models';
import { AdminSkillsFacade } from './facades/admin-skills.facade';

@Component({
  selector: 'app-admin-skills',
  imports: [FormField],
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

  protected remove(id: string): void {
    this.adminSkillsFacade.remove(id);
  }
}
