import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fullPath = `${path}/${fileName}`;
    const storageRef = ref(storage, fullPath);

    if (onProgress) onProgress(0);

    await uploadBytes(storageRef, file);

    if (onProgress) onProgress(100);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    throw new Error('Dosya yüklenirken bir hata oluştu');
  }
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  return uploadFile(file, `users/${userId}/profile`);
}

export async function uploadCoverPhoto(userId: string, file: File): Promise<string> {
  return uploadFile(file, `users/${userId}/cover`);
}

export async function uploadMemoryMedia(
  userId: string,
  pageId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return uploadFile(file, `users/${userId}/pages/${pageId}/memories`, onProgress);
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Dosya silme hatası:', error);
  }
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

export function isValidVideoFile(file: File): boolean {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  return validTypes.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
