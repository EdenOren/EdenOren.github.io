import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  WritableSignal,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'image-upload',
  imports: [TranslatePipe],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  public readonly currentImageUrl = input<string | null>(null);
  public readonly fileSelected = output<File | null>();

  private readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly previewUrl: WritableSignal<string | null> = signal(null);
  protected readonly isDragging: WritableSignal<boolean> = signal(false);
  protected readonly displayUrl: Signal<string | null> = computed(
    () => this.previewUrl() ?? this.currentImageUrl()
  );

  protected onZoneClick(): void {
    this.fileInputRef().nativeElement.click();
  }

  protected onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.handleFile(file);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(): void {
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0] ?? null;
    this.handleFile(file);
  }

  protected clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.revokePreview();
    this.previewUrl.set(null);
    this.fileInputRef().nativeElement.value = '';
    this.fileSelected.emit(null);
  }

  private handleFile(file: File | null): void {
    if (!file) { return; }
    this.revokePreview();
    this.previewUrl.set(URL.createObjectURL(file));
    this.fileSelected.emit(file);
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}
