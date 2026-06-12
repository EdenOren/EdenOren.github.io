import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ExperienceEntry } from '../../../experience/models/experience.models';
import { AdminExperienceFacade } from './facades/admin-experience.facade';

@Component({
  selector: 'app-admin-experience',
  imports: [FormField],
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

  protected remove(id: string): void {
    this.adminExperienceFacade.remove(id);
  }
}
