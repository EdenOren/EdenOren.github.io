import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { CtaButtonComponent } from '../../../../shared/ui/cta-button/cta-button.component';
import { ButtonSize, ButtonVariant } from '../../../../shared/enums/button.enums';
import { AdminAboutFacade } from './facades/admin-about.facade';

@Component({
  selector: 'app-admin-about',
  imports: [ImageUploadComponent, CtaButtonComponent],
  providers: [AdminAboutFacade],
  templateUrl: './admin-about.component.html',
  styleUrl: './admin-about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAboutComponent {
  private readonly adminAboutFacade: AdminAboutFacade = inject(AdminAboutFacade);

  protected readonly buttonVariant: typeof ButtonVariant = ButtonVariant;
  protected readonly buttonSize: typeof ButtonSize = ButtonSize;

  protected readonly bioText: Signal<string> = this.adminAboutFacade.bioText;
  protected readonly imagePreviewUrl: Signal<string | null> = this.adminAboutFacade.imagePreviewUrl;
  protected readonly isSaving: Signal<boolean> = this.adminAboutFacade.isSaving;

  protected onBioInput(event: Event): void {
    this.adminAboutFacade.setBioText((event.target as HTMLTextAreaElement).value);
  }

  protected onFileSelected(file: File | null): void {
    this.adminAboutFacade.setSelectedFile(file);
  }

  protected save(): void {
    this.adminAboutFacade.save();
  }
}
