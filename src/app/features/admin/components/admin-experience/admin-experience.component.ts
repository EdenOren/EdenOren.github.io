import { ChangeDetectionStrategy, Component, DestroyRef, Signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { ExperienceEntry } from '../../../experience/models/experience.models';
import { AdminExperienceFacade } from './facades/admin-experience.facade';
import { ConfirmDialogService } from '../../../../core/services/platform/confirm-dialog.service';
import { ButtonSize, ButtonVariant } from '../../../../shared/enums/button.enums';
import { TagVariant } from '../../../../shared/enums/tag.enum';
import { CtaButtonComponent } from '../../../../shared/ui/cta-button/cta-button.component';
import { TagComponent } from '../../../../shared/ui/tag/tag.component';

@Component({
  selector: 'app-admin-experience',
  imports: [FormField, CtaButtonComponent, TagComponent],
  providers: [AdminExperienceFacade],
  templateUrl: './admin-experience.component.html',
  styleUrl: './admin-experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminExperienceComponent {
  private readonly adminExperienceFacade: AdminExperienceFacade = inject(AdminExperienceFacade);
  private readonly confirmDialogService: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

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
    const entry: ExperienceEntry | undefined = this.entries().find(e => e.id === id);
    const message: string = entry
      ? this.translateService.instant('ADMIN.CONFIRM_DELETE_NAMED', { name: entry.role })
      : this.translateService.instant('ADMIN.CONFIRM_DELETE');
    this.confirmDialogService.open(message)
      .pipe(filter(confirmed => confirmed), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.adminExperienceFacade.remove(id));
  }
}
