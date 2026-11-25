export interface ImageOptimizeOptions {
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly quality?: number;
  readonly format?: 'image/jpeg' | 'image/webp';
}

const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function optimizeImage(file: File, options: ImageOptimizeOptions = {}): Promise<File> {
  const { maxWidth = 512, maxHeight = 512, quality = 0.82, format = 'image/jpeg' } = options;

  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Elige una imagen JPG, PNG o WebP.');
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('No pudimos leer la imagen. Prueba con otro archivo.');
  }

  const canvas = document.createElement('canvas');

  try {
    if (
      bitmap.width === 0 ||
      bitmap.height === 0 ||
      bitmap.width > 20_000 ||
      bitmap.height > 20_000 ||
      bitmap.width * bitmap.height > 40_000_000
    ) {
      throw new Error('La resolución de la imagen es demasiado grande.');
    }

    const scale = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No se pudo preparar la imagen para subir.');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result ? resolve(result) : reject(new Error('No se pudo optimizar la imagen.')),
        format,
        Math.max(0.1, Math.min(1, quality)),
      );
    });

    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
    const name = `${baseName || 'profile-picture'}.${extension}`;

    return new File([blob], name, { type: blob.type || format, lastModified: Date.now() });
  } finally {
    bitmap.close();
    canvas.width = 0;
    canvas.height = 0;
  }
}
