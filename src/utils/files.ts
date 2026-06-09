import type { PhotoEntry } from '../types';

export function readFileAsDataUrl(file: File): Promise<PhotoEntry> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) =>
      resolve({
        id: `photo-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        type: file.type,
        dataUrl: e.target?.result as string,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
