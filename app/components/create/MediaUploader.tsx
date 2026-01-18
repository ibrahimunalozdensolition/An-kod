"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Memory, MAX_PHOTOS, MAX_VIDEOS, MAX_VIDEO_SIZE_MB, MAX_VIDEO_SIZE_BYTES } from "@/lib/types/memoryPage";

interface MediaUploaderProps {
  memories: Partial<Memory>[];
  onChange: (memories: Partial<Memory>[]) => void;
}

export default function MediaUploader({ memories, onChange }: MediaUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showVideoLimitModal, setShowVideoLimitModal] = useState(false);

  const photoCount = memories.filter(m => m.type === 'photo').length;
  const videoCount = memories.filter(m => m.type === 'video').length;
  const canAddPhoto = photoCount < MAX_PHOTOS;
  const canAddVideo = videoCount < MAX_VIDEOS;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoLimitModal) {
        setShowVideoLimitModal(false);
      }
    };

    if (showVideoLimitModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showVideoLimitModal]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError("");
    setSuccess("");

    if (files.length === 0) return;

    const currentPhotoCount = memories.filter(m => m.type === 'photo').length;
    const currentVideoCount = memories.filter(m => m.type === 'video').length;
    const newMemories: Partial<Memory>[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isPhoto = file.type.startsWith('image/');

      if (!isVideo && !isPhoto) {
        errors.push(`${file.name}: Sadece fotoğraf ve video dosyaları yüklenebilir`);
        return;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
        errors.push(`${file.name}: Video boyutu maksimum ${MAX_VIDEO_SIZE_MB} MB olabilir`);
        return;
      }

      const newPhotoCount = newMemories.filter(m => m.type === 'photo').length;
      const newVideoCount = newMemories.filter(m => m.type === 'video').length;
      
      if (isPhoto && (currentPhotoCount + newPhotoCount) >= MAX_PHOTOS) {
        errors.push(`${file.name}: Maksimum ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz`);
        return;
      }

      if (isVideo && (currentVideoCount + newVideoCount) >= MAX_VIDEOS) {
        if (currentVideoCount >= MAX_VIDEOS) {
          setShowVideoLimitModal(true);
          return;
        }
        errors.push(`${file.name}: Maksimum ${MAX_VIDEOS} video yükleyebilirsiniz`);
        return;
      }

      const newMemory: Partial<Memory> = {
        id: crypto.randomUUID(),
        type: isVideo ? 'video' : 'photo',
        url: URL.createObjectURL(file),
        date: new Date(),
        description: '',
        order: memories.length + newMemories.length,
        visible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      newMemories.push(newMemory);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (newMemories.length > 0) {
      onChange([...memories, ...newMemories]);
      const photoCount = newMemories.filter(m => m.type === 'photo').length;
      const videoCount = newMemories.filter(m => m.type === 'video').length;
      const parts: string[] = [];
      if (photoCount > 0) parts.push(`${photoCount} fotoğraf`);
      if (videoCount > 0) parts.push(`${videoCount} video`);
      setSuccess(`${parts.join(' ve ')} başarıyla yüklendi`);
      setTimeout(() => setSuccess(""), 3000);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newMemories = memories.filter((_, i) => i !== index);
    onChange(newMemories.map((m, i) => ({ ...m, order: i })));
  };

  const handleToggleVisibility = (index: number) => {
    const newMemories = [...memories];
    newMemories[index] = { ...newMemories[index], visible: !newMemories[index].visible };
    onChange(newMemories);
  };

  const handleUpdateDescription = (index: number, description: string) => {
    const newMemories = [...memories];
    newMemories[index] = { ...newMemories[index], description };
    onChange(newMemories);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newMemories = [...memories];
    [newMemories[index - 1], newMemories[index]] = [newMemories[index], newMemories[index - 1]];
    onChange(newMemories.map((m, i) => ({ ...m, order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === memories.length - 1) return;
    const newMemories = [...memories];
    [newMemories[index], newMemories[index + 1]] = [newMemories[index + 1], newMemories[index]];
    onChange(newMemories.map((m, i) => ({ ...m, order: i })));
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="mb-2 text-[24px] font-semibold leading-[1.16] tracking-[-0.01em] text-[#1d1d1f]">
            Anılar
          </h2>
          <p className="text-[17px] leading-[1.47] text-[#6e6e73]">
            Fotoğraf ve videolar ekleyin
          </p>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <span className={`text-[14px] font-medium ${photoCount >= MAX_PHOTOS ? 'text-[#ff3b30]' : 'text-[#6e6e73]'}`}>
              {photoCount} / {MAX_PHOTOS} fotoğraf
            </span>
            <span className={`block text-[14px] font-medium ${videoCount >= MAX_VIDEOS ? 'text-[#ff3b30]' : 'text-[#6e6e73]'}`}>
              {videoCount} / {MAX_VIDEOS} video
            </span>
          </div>
          <p className="mt-2 text-[12px] text-[#6e6e73]">
            Video: max {MAX_VIDEO_SIZE_MB} MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-red-900 mb-1">Yükleme Hatası</p>
              <div className="text-[14px] text-red-700 whitespace-pre-line">
                {error}
              </div>
            </div>
            <button
              onClick={() => setError("")}
              className="flex-shrink-0 text-red-600 hover:text-red-800"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[14px] font-medium text-green-900">{success}</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            const fakeEvent = {
              target: { files: files as any },
            } as React.ChangeEvent<HTMLInputElement>;
            handleFileSelect(fakeEvent);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!canAddPhoto && !canAddVideo}
          className={`mb-8 flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed transition-all ${
            (canAddPhoto || canAddVideo)
              ? 'border-[#d2d2d7] bg-[#f5f5f7] hover:border-[#0071e3] hover:bg-[#f0f0f5]'
              : 'border-[#e5e5ea] bg-[#f5f5f7] opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${(canAddPhoto || canAddVideo) ? 'bg-[#0071e3]/10' : 'bg-[#e5e5ea]'}`}>
              <svg className={`h-7 w-7 ${(canAddPhoto || canAddVideo) ? 'text-[#0071e3]' : 'text-[#6e6e73]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-center">
              <span className={`text-[17px] font-medium ${(canAddPhoto || canAddVideo) ? 'text-[#0071e3]' : 'text-[#6e6e73]'}`}>
                {(canAddPhoto || canAddVideo) ? 'Dosya Seç' : 'Limit doldu'}
              </span>
              {(canAddPhoto || canAddVideo) && (
                <p className="mt-1 text-[14px] text-[#6e6e73]">Birden fazla dosya seçebilir veya sürükleyip bırakın</p>
              )}
            </div>
          </div>
        </button>
      </div>

      {memories.length > 0 && (
        <div className="space-y-4">
          {memories.map((memory, index) => (
            <div
              key={memory.id}
              className={`overflow-hidden rounded-xl border transition-all ${
                !memory.visible ? 'border-[#d2d2d7] bg-[#f5f5f7] opacity-60' : 'border-[#d2d2d7] bg-white'
              }`}
            >
              <div className="flex items-start gap-4 p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5f5f7]">
                  {memory.type === 'video' ? (
                    <video src={memory.url} className="h-full w-full object-cover" />
                  ) : (
                    <img src={memory.url} alt="" className="h-full w-full object-cover" />
                  )}
                  {memory.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    value={memory.description || ''}
                    onChange={(e) => handleUpdateDescription(index, e.target.value)}
                    placeholder="Açıklama ekle..."
                    className="w-full rounded-lg border border-[#d2d2d7] px-3 py-2 text-[14px] transition-all focus:border-[#0071e3] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="rounded p-1 text-[#6e6e73] transition-colors hover:bg-[#f5f5f7] disabled:opacity-30"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === memories.length - 1}
                    className="rounded p-1 text-[#6e6e73] transition-colors hover:bg-[#f5f5f7] disabled:opacity-30"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(index)}
                    className="rounded p-1 text-[#6e6e73] transition-colors hover:bg-[#f5f5f7]"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {memory.visible ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    className="rounded p-1 text-[#ff3b30] transition-colors hover:bg-red-50"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {memories.length === 0 && (
        <div className="text-center text-[14px] text-[#6e6e73]">
          Henüz anı eklenmedi
        </div>
      )}

      {showVideoLimitModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVideoLimitModal(false);
            }
          }}
        >
          <div 
            className="animate-fade-in-up w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0071e3]/10">
                <svg className="h-8 w-8 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 className="mt-6 text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
                Video Sınırına Ulaştınız
              </h2>
              <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
                Maksimum {MAX_VIDEOS} video yükleyebilirsiniz. Ek hak satın almak ister misiniz?
              </p>

              <div className="mt-8 w-full space-y-3">
                <button
                  onClick={() => {
                    setShowVideoLimitModal(false);
                    router.push('/dashboard/payment?type=extra_photos');
                  }}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full bg-[#0071e3] text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Ek Hak Satın Al
                </button>
                <button
                  onClick={() => setShowVideoLimitModal(false)}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
