import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from './constants';

/**
 * Validates if a file is an accepted image type
 */
export function isValidImageType(file: File): boolean {
  return Object.keys(ACCEPTED_IMAGE_TYPES).includes(file.type);
}

/**
 * Validates if a file size is within limits
 */
export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * Converts a file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Extracts base64 data from data URL
 */
export function extractBase64(dataUrl: string): string {
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : dataUrl;
}

/**
 * Downloads an image from base64
 */
export function downloadImage(base64: string, filename: string = 'age-transformed.png'): void {
  const link = document.createElement('a');
  link.href = base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Shares an image using Web Share API if available
 */
export async function shareImage(base64: string, title: string = 'My Age Transformation'): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    // Convert base64 to blob
    const response = await fetch(base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`);
    const blob = await response.blob();
    const file = new File([blob], 'age-transformation.png', { type: 'image/png' });

    await navigator.share({
      title,
      text: 'Check out my AI age transformation!',
      files: [file],
    });
    return true;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Compresses an image to reduce size
 */
export function compressImage(base64: string, maxWidth: number = 1024, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = base64;
  });
}
