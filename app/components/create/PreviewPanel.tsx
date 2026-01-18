"use client";

import { Memory, MemoryPageSettings } from "@/lib/types/memoryPage";

interface BasicInfoData {
  name: string;
  birthDate: string;
  deathDate: string;
  bio: string;
  profilePhoto: File | null;
  coverPhoto: File | null;
}

interface PreviewPanelProps {
  basicInfo: BasicInfoData;
  memories: Partial<Memory>[];
  settings: MemoryPageSettings;
}

export default function PreviewPanel({ basicInfo, memories, settings }: PreviewPanelProps) {
  const visibleMemories = memories.filter(m => m.visible);
  const isDark = settings.backgroundColor === '#1d1d1f';
  const textColor = isDark ? '#ffffff' : '#1d1d1f';
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73';

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-[24px] font-semibold leading-[1.16] tracking-[-0.01em] text-[#1d1d1f]">
            Önizleme
          </h2>
          <p className="text-[17px] leading-[1.47] text-[#6e6e73]">
            Sayfanız böyle görünecek
          </p>
        </div>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-[12px] font-medium text-yellow-700">
          Taslak
        </span>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-[#d2d2d7]"
        style={{ backgroundColor: settings.backgroundColor, fontFamily: settings.fontFamily }}
      >
        <div className="relative h-48 bg-[#e5e5ea]">
          {basicInfo.coverPhoto ? (
            <img
              src={URL.createObjectURL(basicInfo.coverPhoto)}
              alt="Kapak"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[14px]" style={{ color: textSecondary }}>Kapak fotoğrafı</span>
            </div>
          )}

          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 bg-[#e5e5ea]" style={{ borderColor: settings.backgroundColor }}>
              {basicInfo.profilePhoto ? (
                <img
                  src={URL.createObjectURL(basicInfo.profilePhoto)}
                  alt="Profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="h-8 w-8" style={{ color: textSecondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-8 pt-16">
          <h1
            className="text-[28px] font-semibold leading-[1.14]"
            style={{ color: textColor }}
          >
            {basicInfo.name || 'İsim'}
          </h1>

          {(basicInfo.birthDate || basicInfo.deathDate) && (
            <p className="mt-2 text-[14px]" style={{ color: textSecondary }}>
              {basicInfo.birthDate && new Date(basicInfo.birthDate).toLocaleDateString('tr-TR')}
              {basicInfo.birthDate && basicInfo.deathDate && ' - '}
              {basicInfo.deathDate && new Date(basicInfo.deathDate).toLocaleDateString('tr-TR')}
            </p>
          )}

          {basicInfo.bio && (
            <p className="mt-4 text-[17px] leading-[1.47]" style={{ color: textSecondary }}>
              {basicInfo.bio}
            </p>
          )}

          {visibleMemories.length > 0 && (
            <div className="mt-8">
              <h2
                className="mb-4 text-[21px] font-semibold"
                style={{ color: textColor }}
              >
                Anılar
              </h2>

              {settings.layout === 'grid' && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {visibleMemories.map((memory) => (
                    <div key={memory.id} className="group relative aspect-square overflow-hidden rounded-lg bg-[#e5e5ea]">
                      {memory.type === 'video' ? (
                        <video src={memory.url} className="h-full w-full object-cover" />
                      ) : (
                        <img src={memory.url} alt="" className="h-full w-full object-cover" />
                      )}
                      {memory.description && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-[12px] text-white">{memory.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {settings.layout === 'timeline' && (
                <div className="space-y-6">
                  {visibleMemories.map((memory, index) => (
                    <div key={memory.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: settings.accentColor }}
                        />
                        {index < visibleMemories.length - 1 && (
                          <div className="w-[2px] flex-1 bg-[#d2d2d7]" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="aspect-video overflow-hidden rounded-lg bg-[#e5e5ea]">
                          {memory.type === 'video' ? (
                            <video src={memory.url} className="h-full w-full object-cover" />
                          ) : (
                            <img src={memory.url} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        {memory.description && (
                          <p className="mt-2 text-[14px]" style={{ color: textSecondary }}>
                            {memory.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {settings.layout === 'carousel' && (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {visibleMemories.map((memory) => (
                    <div key={memory.id} className="w-64 flex-shrink-0">
                      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-[#e5e5ea]">
                        {memory.type === 'video' ? (
                          <video src={memory.url} className="h-full w-full object-cover" />
                        ) : (
                          <img src={memory.url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      {memory.description && (
                        <p className="mt-2 text-[14px]" style={{ color: textSecondary }}>
                          {memory.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {settings.allowComments && (
            <div className="mt-8 border-t pt-8" style={{ borderColor: isDark ? '#38383a' : '#d2d2d7' }}>
              <h2
                className="mb-4 text-[21px] font-semibold"
                style={{ color: textColor }}
              >
                Anma Mesajları
              </h2>
              <p className="text-[14px]" style={{ color: textSecondary }}>
                Henüz mesaj yok. Yayınlandığında ziyaretçiler mesaj bırakabilir.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-[#f5f5f7] p-4">
        <p className="text-center text-[14px] text-[#6e6e73]">
          Bu önizleme sadece size özeldir. Ödeme yaptıktan sonra sayfa yayınlanacaktır.
        </p>
      </div>
    </div>
  );
}
