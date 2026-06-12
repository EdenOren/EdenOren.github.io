import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { ExperienceEntry } from '../../../experience/models/experience.models';
import { AdminExperienceFacade } from './facades/admin-experience.facade';
import { ButtonSize, ButtonVariant } from '../../../../shared/enums/button.enums';
import { TagVariant } from '../../../../shared/enums/tag.enum';
import { CtaButtonComponent } from '../../../../shared/ui/cta-button/cta-button.component';
import { TagComponent } from '../../../../shared/ui/tag/tag.component';

@Component({
  selector: 'app-admin-experience',
  imports: [FormField, CtaButtonComponent, TagComponent, TranslatePipe],
  providers: [AdminExperienceFacade],
  templateUrl: './admin-experience.component.html',
  styleUrl: './admin-experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminExperienceComponent {
  private readonly adminExperienceFacade: AdminExperienceFacade = inject(AdminExperienceFacade);

  protected readonly buttonVariant: typeof ButtonVariant = ButtonVariant;
  protected readonly buttonSize: typeof ButtonSize = ButtonSize;
  protected readonly tagVariant: typeof TagVariant = TagVariant;

  protected readonly entries: Signal<ExperienceEntry[]> = this.adminExperienceFacade.items;
  protected readonly isFormOpen: Signal<boolean> = this.adminExperienceFacade.isFormOpen;
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

  protected onDeleteClick(id: string): void {
    this.adminExperienceFacade.requestDelete(id);
  }
}
