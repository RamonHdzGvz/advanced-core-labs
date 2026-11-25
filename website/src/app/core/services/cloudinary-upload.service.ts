import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/services/supabase/supabase-client.service';
import { optimizeImage } from '@core/utils/images/image-optimizer';

export const MAX_CLOUDINARY_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

export type CloudinaryUploadStage = 'optimizing' | 'signing' | 'uploading';

export interface CloudinaryUploadOptions {
  readonly signal?: AbortSignal;
  readonly onStage?: (stage: CloudinaryUploadStage) => void;
  readonly onProgress?: (progress: number) => void;
}

interface CloudinarySignature {
  readonly timestamp: number;
  readonly signature: string;
  readonly apiKey: string;
  readonly cloudName: string;
  readonly folder: string;
}

@Injectable({ providedIn: 'root' })
export class CloudinaryUploadService {
  private readonly supabase = inject(SupabaseClientService);

  async uploadImage(
    file: File,
    folder: string,
    options: CloudinaryUploadOptions = {},
  ): Promise<string> {
    if (!this.supabase.isConfigured) {
      throw new Error('Supabase no está configurado para firmar la carga.');
    }

    if (!/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(folder) || folder.length > 255) {
      throw new Error('La carpeta de destino no es válida.');
    }

    if (file.size === 0 || file.size > MAX_CLOUDINARY_IMAGE_SIZE_BYTES) {
      throw new Error('La imagen debe tener contenido y pesar 8 MB o menos.');
    }

    if (options.signal?.aborted) {
      throw new DOMException('La carga fue cancelada.', 'AbortError');
    }

    options.onStage?.('optimizing');
    const optimizedFile = await optimizeImage(file);

    if (options.signal?.aborted) {
      throw new DOMException('La carga fue cancelada.', 'AbortError');
    }

    options.onStage?.('signing');
    const { data, error } = await this.supabase
      .getClient()
      .functions.invoke<unknown>('cloudinary-signature', { body: { folder } });

    if (error || !this.isSignature(data) || data.folder !== folder) {
      throw new Error(
        'No pudimos autorizar la carga. Revisa tu sesión y la configuración de Cloudinary en Supabase.',
      );
    }

    if (options.signal?.aborted) {
      throw new DOMException('La carga fue cancelada.', 'AbortError');
    }

    options.onStage?.('uploading');
    return this.sendToCloudinary(optimizedFile, data, options);
  }

  private isSignature(value: unknown): value is CloudinarySignature {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const signature = value as Record<string, unknown>;
    return (
      typeof signature['timestamp'] === 'number' &&
      Number.isInteger(signature['timestamp']) &&
      typeof signature['signature'] === 'string' &&
      signature['signature'].length > 0 &&
      typeof signature['apiKey'] === 'string' &&
      signature['apiKey'].length > 0 &&
      typeof signature['cloudName'] === 'string' &&
      /^[A-Za-z0-9_-]+$/.test(signature['cloudName']) &&
      typeof signature['folder'] === 'string'
    );
  }

  private sendToCloudinary(
    file: File,
    signature: CloudinarySignature,
    options: CloudinaryUploadOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      let settled = false;

      const finish = (callback: () => void): void => {
        if (settled) {
          return;
        }
        settled = true;
        options.signal?.removeEventListener('abort', abortRequest);
        callback();
      };

      const abortRequest = (): void => request.abort();

      if (options.signal?.aborted) {
        reject(new DOMException('La carga fue cancelada.', 'AbortError'));
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signature.apiKey);
      formData.append('timestamp', String(signature.timestamp));
      formData.append('signature', signature.signature);
      formData.append('folder', signature.folder);

      request.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
      );
      request.responseType = 'json';
      request.timeout = 120_000;
      request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          options.onProgress?.(Math.round((event.loaded / event.total) * 100));
        }
      };
      request.onload = () => {
        const response: unknown = request.response;
        if (request.status >= 200 && request.status < 300 && this.isUploadedImage(response)) {
          options.onProgress?.(100);
          finish(() => resolve(response.secure_url));
          return;
        }

        finish(() => reject(new Error(this.getUploadError(response))));
      };
      request.onerror = () =>
        finish(() => reject(new Error('No se pudo conectar con Cloudinary. Inténtalo de nuevo.')));
      request.ontimeout = () =>
        finish(() => reject(new Error('La carga tardó demasiado. Inténtalo de nuevo.')));
      request.onabort = () =>
        finish(() => reject(new DOMException('La carga fue cancelada.', 'AbortError')));
      options.signal?.addEventListener('abort', abortRequest, { once: true });
      request.send(formData);
    });
  }

  private isUploadedImage(value: unknown): value is { secure_url: string } {
    if (typeof value !== 'object' || value === null || !('secure_url' in value)) {
      return false;
    }

    const url = value.secure_url;
    if (typeof url !== 'string') {
      return false;
    }

    try {
      return new URL(url).protocol === 'https:';
    } catch {
      return false;
    }
  }

  private getUploadError(value: unknown): string {
    if (
      typeof value === 'object' &&
      value !== null &&
      'error' in value &&
      typeof value.error === 'object' &&
      value.error !== null &&
      'message' in value.error &&
      typeof value.error.message === 'string'
    ) {
      return 'Cloudinary rechazó la imagen. Revisa el archivo e inténtalo de nuevo.';
    }

    return 'No se pudo subir la imagen. Inténtalo de nuevo.';
  }
}
