import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject } from '@angular/core';
import { ExperienceEntry } from '../../models/admin.models';
import { AdminExperienceFacade } from './facades/admin-experience.facade';

@Component({
  selector: 'app-admin-experience',
  imports: [],
  providers: [AdminExperienceFacade],
  templateUrl: './admin-experience.component.html',
  styleUrl: './admin-experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminExperienceComponent {
  private readonly adminExperienceFacade: AdminExperienceFacade = inject(AdminExperienceFacade);

  protected readonly entries: WritableSignal<ExperienceEntry[]> = this.adminExperienceFacade.items;
  protected readonly isFormOpen: WritableSignal<boolean> = this.adminExperienceFacade.isFormOpen;
  protected readonly roleField: WritableSignal<string> = this.adminExperienceFacade.roleField;
  protected readonly companyField: WritableSignal<string> = this.adminExperienceFacade.companyField;
  protected readonly periodField: WritableSignal<string> = this.adminExperienceFacade.periodField;
  protected readonly currentField: WritableSignal<boolean> = this.adminExperienceFacade.currentField;
  protected readonly descriptionField: WritableSignal<string> = this.adminExperienceFacade.descriptionField;
  protected readonly tagsField: WritableSignal<string> = this.adminExperienceFacade.tagsField;
  protected readonly isEditing: Signal<boolean> = this.adminExperienceFacade.isEditing;
  protected readonly isFormValid: Signal<boolean> = this.adminExperienceFacade.isFormValid;

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
