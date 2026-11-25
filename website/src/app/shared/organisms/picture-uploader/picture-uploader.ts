import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  CloudinaryUploadService,
  MAX_CLOUDINARY_IMAGE_SIZE_BYTES,
} from '@core/services/cloudinary-upload.service';
import { ThemeAvatarComponent } from '@shared/atoms/theme-avatar/theme-avatar';
import { ThemeButtonComponent } from '@shared/atoms/theme-button/theme-button';
import { ThemeProgressComponent } from '@shared/atoms/theme-progress/theme-progress';

type UploadStatus = 'idle' | 'ready' | 'optimizing' | 'signing' | 'uploading' | 'success' | 'error';

@Component({
  selector: 'app-picture-uploader',
  standalone: true,
  imports: [ThemeAvatarComponent, ThemeButtonComponent, ThemeProgressComponent],
  templateUrl: './picture-uploader.html',
  styles: `
    :host {
      display: block;
    }
    .uploader-content[data-direction='col'],
    .uploader-content[data-direction='row'] {
      align-items: center;
      text-align: center;
    }
    .uploader-details,
    .uploader-actions {
      width: 100%;
    }
    .uploader-actions {
      justify-content: center;
    }
    .uploader-content[data-direction='col'] .uploader-preview {
      width: min(13.5rem, 100%);
      height: auto;
      aspect-ratio: 1;
    }
    @container (min-width: 44rem) {
      .uploader-content[data-direction='row'] {
        flex-direction: row;
        align-items: center;
        text-align: left;
      }
      .uploader-content[data-direction='row'] .uploader-details,
      .uploader-content[data-direction='row'] .uploader-actions {
        width: auto;
      }
      .uploader-content[data-direction='row'] .uploader-actions {
        justify-content: flex-start;
      }
    }
  `,
})
export class PictureUploaderComponent {
  private readonly cloudinary = inject(CloudinaryUploadService);
  private readonly destroyRef = inject(DestroyRef);
  private previewObjectUrl: string | null = null;
  private abortController: AbortController | null = null;
  private initialImageUrl: string | null = null;

  @Input() userName = 'Tu imagen';
  @Input() direction: 'row' | 'col' = 'row';
  @Input() folder = 'uploads';
  @Input() previewOnly = false;
  @Input() externalSelection = false;
  @Input() previewActionLabel: string | null = null;

  @Input()
  set imageUrl(value: string | null) {
    this.initialImageUrl = value;
    if (!this.selectedFile()) this.previewUrl.set(value);
  }

  @Input()
  set preparedFile(file: File | null) {
    if (file) this.setSelectedFile(file);
  }

  @Output() readonly fileSelected = new EventEmitter<File>();
  @Output() readonly uploaded = new EventEmitter<string>();
  @Output() readonly previewAction = new EventEmitter<void>();

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly progress = signal(0);
  protected readonly status = signal<UploadStatus>('idle');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = computed(() =>
    ['optimizing', 'signing', 'uploading'].includes(this.status()),
  );
  protected readonly statusMessage = computed(() => {
    const messages: Partial<Record<UploadStatus, string>> = {
      optimizing: 'Optimizando la imagen…',
      signing: 'Validando la carga segura…',
      uploading: 'Subiendo la imagen…',
      success: 'La imagen se subió correctamente.',
    };
    return messages[this.status()] ?? null;
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.abortController?.abort();
      this.releasePreviewObjectUrl();
    });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.rejectSelection('Elige una imagen JPG, PNG o WebP.');
      return;
    }
    if (file.size === 0 || file.size > MAX_CLOUDINARY_IMAGE_SIZE_BYTES) {
      this.rejectSelection('La imagen debe tener contenido y pesar 8 MB o menos.');
      return;
    }
    if (this.externalSelection) {
      this.errorMessage.set(null);
      this.fileSelected.emit(file);
      return;
    }
    this.setSelectedFile(file);
  }

  protected async uploadSelectedFile(): Promise<void> {
    const file = this.selectedFile();
    if (!file || this.isBusy()) return;
    this.errorMessage.set(null);
    this.progress.set(0);
    this.abortController = new AbortController();
    try {
      const imageUrl = await this.cloudinary.uploadImage(file, this.folder, {
        signal: this.abortController.signal,
        onStage: (stage) => this.status.set(stage),
        onProgress: (progress) => this.progress.set(progress),
      });
      this.previewUrl.set(imageUrl);
      this.releasePreviewObjectUrl();
      this.status.set('success');
      this.uploaded.emit(imageUrl);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        this.status.set('ready');
        return;
      }
      this.status.set('error');
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo subir la imagen.');
    } finally {
      this.abortController = null;
    }
  }

  protected cancelUpload(): void {
    this.abortController?.abort();
  }

  protected clearSelection(): void {
    if (this.isBusy()) {
      this.cancelUpload();
      return;
    }
    this.selectedFile.set(null);
    this.previewUrl.set(this.initialImageUrl);
    this.errorMessage.set(null);
    this.progress.set(0);
    this.status.set('idle');
    this.releasePreviewObjectUrl();
  }

  private setSelectedFile(file: File): void {
    this.releasePreviewObjectUrl();
    this.selectedFile.set(file);
    this.previewObjectUrl = URL.createObjectURL(file);
    this.previewUrl.set(this.previewObjectUrl);
    this.progress.set(0);
    this.errorMessage.set(null);
    this.status.set('ready');
  }

  private rejectSelection(message: string): void {
    this.errorMessage.set(message);
    this.status.set('error');
  }

  private releasePreviewObjectUrl(): void {
    if (!this.previewObjectUrl) return;
    URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }
}
