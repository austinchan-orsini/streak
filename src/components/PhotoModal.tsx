import { useRef } from 'react';
import type { PhotoEntry } from '../types';

export function PhotoModal({
  photos,
  onAddFiles,
  onDelete,
  onClose,
}: {
  photos: PhotoEntry[];
  onAddFiles: (files: FileList) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 p-5 pb-3">
          <div>
            <div className="text-[18px] font-[800]">Progress photos</div>
            <div className="text-[12px] text-[#8C7F6D]">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} -- tap x to remove
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[16px] border border-[rgba(63,51,38,0.10)] px-3 py-2 text-[12px] font-[700]"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                onAddFiles(e.target.files);
                e.target.value = '';
              }
            }}
          />

          {photos.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#8C7F6D]">No photos yet -- add some below.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  {photo.type.startsWith('image/') ? (
                    <img src={photo.dataUrl} alt={photo.name} className="h-40 w-full rounded-[16px] object-cover" />
                  ) : (
                    <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-[16px] bg-[#F1EADC]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-8 w-8 text-[#8C7F6D]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="7" width="15" height="10" rx="2" />
                        <path d="M17 9l5-2v10l-5-2" />
                      </svg>
                      <div className="max-w-full truncate px-2 text-[11px] text-[#8C7F6D]">{photo.name}</div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(photo.id)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M3 3l10 10M13 3L3 13" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-3 w-full rounded-[16px] border border-dashed border-[rgba(63,51,38,0.15)] bg-[#F7F4EB] px-4 py-2.5 text-[12px] font-[700] text-[#8C7F6D] transition hover:border-ink hover:text-ink"
          >
            + Add more photos
          </button>
        </div>

        <div className="p-5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[16px] bg-ink py-3 text-[13px] font-[700] text-bg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
