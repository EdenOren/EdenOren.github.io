import {
  DestroyRef,
  Service,
  Signal,
  WritableSignal,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { AboutService } from '../../../../../core/services/data/about.service';
import { UploadService } from '../../../../../core/services/data/upload.service';

@Service({ autoProvided: false })
export class AdminAboutFacade {
  private readonly aboutService: AboutService = inject(AboutService);
  private readonly uploadService: UploadService = inject(UploadService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly selectedFile: WritableSignal<File | null> = signal(null);
  private readonly _imagePreviewUrl: WritableSignal<string | null> = linkedSignal(
    () => this.aboutService.data()?.image_url ?? null
  );

  readonly bioText: WritableSignal<string> = linkedSignal(
    () => this.aboutService.data()?.bio_text ?? ''
  );
  readonly imagePreviewUrl: Signal<string | null> = this._imagePreviewUrl.asReadonly();
  readonly isSaving: WritableSignal<boolean> = signal(false);

  setSelectedFile(file: File | null): void {
    this.selectedFile.set(file);
    if (file) {
      this._imagePreviewUrl.set(URL.createObjectURL(file));
    } else {
      this._imagePreviewUrl.set(null);
    }
  }

  setBioText(value: string): void {
    this.bioText.set(value);
  }

  save(): void {
    const file = this.selectedFile();
    const bioText = this.bioText();

    const persist = (imageUrl: string | null) =>
      this.aboutService.update({ bio_text: bioText, image_url: imageUrl });

    this.isSaving.set(true);

    const save$ = file
      ? this.uploadService.upload(file).pipe(switchMap(({ url }) => persist(url)))
      : persist(this._imagePreviewUrl());

    save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.selectedFile.set(null);
        this.isSaving.set(false);
        this.aboutService.reload();
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }
}
