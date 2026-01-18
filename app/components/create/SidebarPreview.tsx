"use client";

import { useMemo } from "react";
import { Memory, MemoryPageSettings } from "@/lib/types/memoryPage";

interface BasicInfoData {
  name: string;
  birthDate: string;
  deathDate: string;
  bio: string;
  profilePhoto: File | null;
  coverPhoto: File | null;
}

interface SidebarPreviewProps {
  basicInfo: BasicInfoData;
  memories: Partial<Memory>[];
  settings: MemoryPageSettings;
}

export default function SidebarPreview({ basicInfo, memories, settings }: SidebarPreviewProps) {
  const visibleMemories = useMemo(() => {
    return memories.filter(m => m.visible !== false).slice(0, 6);
  }, [memories]);

  const totalVisibleCount = memories.filter(m => m.visible !== false).length;
  const isDark = settings.backgroundColor === '#1d1d1f' || settings.backgroundColor === '#2c2c2e' || settings.backgroundColor === '#1c1c1e';
  const textColor = isDark ? '#ffffff' : '#1d1d1f';
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73';
  const accentColor = settings.accentColor || '#0071e3';

  return (
    <div className="sticky top-[80px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Canlı Önizleme</h3>
          {settings.template && (
            <p className="mt-0.5 text-[11px] text-[#6e6e73]">
              {settings.template === 'classic' ? 'Klasik' :
               settings.template === 'modern' ? 'Modern' :
               settings.template === 'minimal' ? 'Minimal' :
               settings.template === 'elegant' ? 'Elegant' : 'Şablon'} Şablonu
            </p>
          )}
        </div>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-medium text-yellow-700">
          Taslak
        </span>
      </div>

      <div className="rounded-2xl border-2 border-[#d2d2d7] bg-white p-3 shadow-lg">
        <div
          className="overflow-hidden rounded-xl transition-all duration-300"
          style={{ 
            backgroundColor: settings.backgroundColor, 
            fontFamily: settings.fontFamily === 'serif' ? 'Georgia, "Times New Roman", serif' : '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            color: isDark ? '#ffffff' : '#1d1d1f'
          }}
        >
          <div className="relative h-32 bg-[#e5e5ea]">
            {basicInfo.coverPhoto ? (
              <img
                src={URL.createObjectURL(basicInfo.coverPhoto)}
                alt="Kapak"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-8 w-8" style={{ color: textSecondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            <div className="absolute -bottom-10 left-5">
              <div className="h-20 w-20 overflow-hidden rounded-full border-4 bg-[#e5e5ea]" style={{ borderColor: settings.backgroundColor }}>
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

          <div className="px-5 pb-5 pt-14">
            <h1 className="text-[21px] font-semibold leading-[1.2]" style={{ color: textColor }}>
              {basicInfo.name || 'İsim'}
            </h1>

            {(basicInfo.birthDate || basicInfo.deathDate) && (
              <p className="mt-1 text-[13px]" style={{ color: textSecondary }}>
                {basicInfo.birthDate && new Date(basicInfo.birthDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {basicInfo.birthDate && basicInfo.deathDate && ' — '}
                {basicInfo.deathDate && new Date(basicInfo.deathDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            {basicInfo.bio && (
              <p className="mt-3 line-clamp-3 text-[14px] leading-[1.5]" style={{ color: textSecondary }}>
                {basicInfo.bio}
              </p>
            )}

            {visibleMemories.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold" style={{ color: textColor }}>
                    Anılar
                  </h2>
                  <span 
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold" 
                    style={{ backgroundColor: accentColor + '20', color: accentColor }}
                  >
                    {totalVisibleCount}
                  </span>
                </div>
                <div className={`grid gap-2 ${settings.layout === 'grid' ? 'grid-cols-3' : settings.layout === 'timeline' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {visibleMemories.map((memory, index) => (
                    <div 
                      key={memory.id || index} 
                      className="aspect-square overflow-hidden rounded-lg bg-[#e5e5ea] ring-1 ring-black/5"
                    >
                      {memory.type === 'video' ? (
                        <video 
                          src={memory.url} 
                          className="h-full w-full object-cover"
                          muted
                        />
                      ) : (
                        <img 
                          src={memory.url} 
                          alt={memory.description || ''} 
                          className="h-full w-full object-cover" 
                        />
                      )}
                    </div>
                  ))}
                </div>
                {totalVisibleCount > 6 && (
                  <p className="mt-3 text-center text-[12px]" style={{ color: textSecondary }}>
                    +{totalVisibleCount - 6} daha fazla anı
                  </p>
                )}
              </div>
            )}

            {visibleMemories.length === 0 && (
              <div className="mt-5 rounded-lg bg-[#f5f5f7] p-4 text-center">
                <svg className="mx-auto h-8 w-8 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-[12px] text-[#6e6e73]">
                  Henüz anı eklenmedi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[12px] text-[#6e6e73]">
        Bu önizleme sadece size özeldir
      </p>
    </div>
  );
}
