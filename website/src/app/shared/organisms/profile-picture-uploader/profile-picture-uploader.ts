import { Component, ElementRef, Input, ViewChild, inject, signal } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { ProfilePictureService } from '@core/services/profile-picture.service';
import { PictureUploaderComponent } from '@shared/organisms/picture-uploader/picture-uploader';
import { ThemeButtonComponent } from '@shared/atoms/theme-button/theme-button';

export type PictureCropMask = 'circle' | 'rectangle';

@Component({
  selector: 'app-profile-picture-uploader',
  standalone: true,
  imports: [ImageCropperComponent, PictureUploaderComponent, ThemeButtonComponent],
  templateUrl: './profile-picture-uploader.html',
  styles: `
    :host ::ng-deep .ngx-ic-cropper {
      visibility: hidden !important;
    }
    .crop-mask {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .crop-mask--circle {
      background: rgb(15 23 42 / 0.58);
      -webkit-mask-image: radial-gradient(circle, transparent 0 49%, #000 50%);
      mask-image: radial-gradient(circle, transparent 0 49%, #000 50%);
    }
    .crop-mask--rectangle {
      border: 2px solid rgb(255 255 255 / 0.9);
      box-shadow: 0 0 0 999px rgb(15 23 42 / 0.48);
    }
  `,
})
export class ProfilePictureUploaderComponent {
  private readonly profilePicture = inject(ProfilePictureService);
  private lastCroppedEvent: ImageCroppedEvent | null = null;

  @ViewChild('cropDialog') private cropDialog?: ElementRef<HTMLDialogElement>;

  @Input() userName = 'Tu perfil';
  @Input() imageUrl: string | null = null;
  @Input() previewOnly = false;
  @Input() direction: 'row' | 'col' = 'row';
  @Input() folder = 'profiles';
  @Input() maskShape: PictureCropMask = 'circle';
  @Input() aspectRatio = 1;
  @Input() outputWidth = 512;
  @Input() outputHeight = 512;

  protected readonly sourceFile = signal<File | null>(null);
  protected readonly originalFile = signal<File | null>(null);
  protected readonly preparedFile = signal<File | null>(null);
  protected readonly transform = signal<ImageTransform>({
    translateUnit: 'px',
    translateH: 0,
    translateV: 0,
    scale: 1,
  });
  protected readonly cropError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly lastUploadedUrl = signal<string | null>(null);

  protected get safeAspectRatio(): number {
    return Number.isFinite(this.aspectRatio) && this.aspectRatio > 0 ? this.aspectRatio : 1;
  }

  protected get safeOutputWidth(): number {
    return Number.isInteger(this.outputWidth) && this.outputWidth > 0 ? this.outputWidth : 512;
  }

  protected get safeOutputHeight(): number {
    return Number.isInteger(this.outputHeight) && this.outputHeight > 0 ? this.outputHeight : 512;
  }

  protected onSourceSelected(file: File): void {
    this.sourceFile.set(file);
    this.transform.set({
      translateUnit: 'px',
      translateH: 0,
      translateV: 0,
      scale: 1,
    });
    this.lastCroppedEvent = null;
    this.cropError.set(null);
    this.cropDialog?.nativeElement.showModal();
  }

  protected editCrop(): void {
    const file = this.originalFile();
    if (!file || this.cropDialog?.nativeElement.open) return;
    this.sourceFile.set(file);
    this.transform.set({
      translateUnit: 'px',
      translateH: 0,
      translateV: 0,
      scale: 1,
    });
    this.lastCroppedEvent = null;
    this.cropError.set(null);
    this.cropDialog?.nativeElement.showModal();
  }

  protected onImageCropped(event: ImageCroppedEvent): void {
    this.lastCroppedEvent = event;
  }

  protected adjustZoom(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.transform.set({ ...this.transform(), scale: value });
  }

  protected onTransformChange(transform: ImageTransform): void {
    this.transform.set(transform);
  }

  protected cancelCrop(): void {
    this.cropDialog?.nativeElement.close();
    this.sourceFile.set(null);
    this.cropError.set(null);
  }

  protected acceptCrop(): void {
    const blob = this.lastCroppedEvent?.blob;
    if (!blob) {
      this.cropError.set('Aún se está preparando el recorte. Inténtalo de nuevo en un momento.');
      return;
    }
    const mimeType = blob.type || 'image/jpeg';
    const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const croppedFile = new File([blob], `profile-picture-${Date.now()}.${extension}`, {
      type: mimeType,
    });
    this.originalFile.set(this.sourceFile());
    this.preparedFile.set(croppedFile);
    this.cropDialog?.nativeElement.close();
    this.sourceFile.set(null);
  }

  protected async onUploaded(url: string): Promise<void> {
    this.lastUploadedUrl.set(url);
    if (this.previewOnly) return;
    await this.saveAvatarUrl(url);
  }

  protected async retrySave(): Promise<void> {
    const url = this.lastUploadedUrl();
    if (url && !this.saving()) await this.saveAvatarUrl(url);
  }

  private async saveAvatarUrl(url: string): Promise<void> {
    this.saving.set(true);
    this.saveError.set(null);
    try {
      await this.profilePicture.saveAvatarUrl(url);
      this.imageUrl = url;
      this.lastUploadedUrl.set(null);
    } catch {
      this.saveError.set(
        'La imagen se subió, pero no se pudo guardar en tu perfil. Puedes reintentar.',
      );
    } finally {
      this.saving.set(false);
    }
  }
}
