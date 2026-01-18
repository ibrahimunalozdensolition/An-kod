"use client";

import { MemoryPageSettings } from "@/lib/types/memoryPage";

interface SettingsPanelProps {
  settings: MemoryPageSettings;
  onChange: (settings: MemoryPageSettings) => void;
}

const backgroundColors = [
  { value: '#ffffff', label: 'Beyaz', hex: '#ffffff' },
  { value: '#fbfbfd', label: 'Gri', hex: '#fbfbfd' },
  { value: '#f5f5f0', label: 'Krem', hex: '#f5f5f0' },
  { value: '#fef9f3', label: 'Şampanya', hex: '#fef9f3' },
  { value: '#f0f4f8', label: 'Buz Mavisi', hex: '#f0f4f8' },
  { value: '#1d1d1f', label: 'Koyu', hex: '#1d1d1f' },
  { value: '#2c2c2e', label: 'Gri Siyah', hex: '#2c2c2e' },
  { value: '#1c1c1e', label: 'Gece', hex: '#1c1c1e' },
];

const accentColors = [
  { value: '#0071e3', label: 'Apple Mavi', hex: '#0071e3' },
  { value: '#007aff', label: 'Parlak Mavi', hex: '#007aff' },
  { value: '#34c759', label: 'Yeşil', hex: '#34c759' },
  { value: '#30d158', label: 'Neon Yeşil', hex: '#30d158' },
  { value: '#8b7355', label: 'Kahve', hex: '#8b7355' },
  { value: '#a2845e', label: 'Bronz', hex: '#a2845e' },
  { value: '#af52de', label: 'Mor', hex: '#af52de' },
  { value: '#bf5af2', label: 'Lavanta', hex: '#bf5af2' },
  { value: '#ff3b30', label: 'Kırmızı', hex: '#ff3b30' },
  { value: '#ff453a', label: 'Mercan', hex: '#ff453a' },
  { value: '#ff9500', label: 'Turuncu', hex: '#ff9500' },
  { value: '#ff9f0a', label: 'Altın', hex: '#ff9f0a' },
  { value: '#1d1d1f', label: 'Siyah', hex: '#1d1d1f' },
  { value: '#636366', label: 'Gri', hex: '#636366' },
];

const fontFamilies = [
  { value: 'sans-serif', label: 'Modern', preview: 'Aa', description: 'Sans-serif' },
  { value: 'serif', label: 'Klasik', preview: 'Aa', description: 'Serif' },
];

const layouts = [
  { 
    value: 'grid', 
    label: 'Izgara', 
    description: 'Fotoğraflar ızgara düzeninde',
    icon: (
      <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    )
  },
  { 
    value: 'timeline', 
    label: 'Zaman Çizelgesi', 
    description: 'Kronolojik sıralama',
    icon: (
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <line x1="12" y1="2" x2="12" y2="22" strokeWidth="2" />
        <circle cx="12" cy="6" r="2" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" strokeWidth="2" />
        <circle cx="12" cy="18" r="2" strokeWidth="2" />
      </svg>
    )
  },
  { 
    value: 'carousel', 
    label: 'Karusel', 
    description: 'Yatay kaydırmalı',
    icon: (
      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="6" width="8" height="12" rx="1" strokeWidth="2" />
        <rect x="14" y="6" width="8" height="12" rx="1" strokeWidth="2" opacity="0.4" />
      </svg>
    )
  },
];

export default function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const updateSetting = <K extends keyof MemoryPageSettings>(key: K, value: MemoryPageSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="mb-5 text-[19px] font-semibold leading-[1.21] tracking-[-0.01em] text-[#1d1d1f]">
          Arka Plan
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {backgroundColors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateSetting('backgroundColor', color.value)}
              className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                settings.backgroundColor === color.value
                  ? 'border-[#0071e3] bg-[#f5f5f7]'
                  : 'border-[#d2d2d7] hover:border-[#86868b] hover:bg-[#f5f5f7]'
              }`}
            >
              <div
                className="h-10 w-10 rounded-full shadow-sm ring-1 ring-black/10"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[11px] font-medium text-[#1d1d1f]">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="mb-5 text-[19px] font-semibold leading-[1.21] tracking-[-0.01em] text-[#1d1d1f]">
          Vurgu Rengi
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateSetting('accentColor', color.value)}
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                settings.accentColor === color.value
                  ? 'ring-2 ring-[#0071e3] ring-offset-2'
                  : 'hover:scale-110'
              }`}
              title={color.label}
            >
              <div
                className="h-10 w-10 rounded-full shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              {settings.accentColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="mb-5 text-[19px] font-semibold leading-[1.21] tracking-[-0.01em] text-[#1d1d1f]">
          Yazı Tipi
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {fontFamilies.map((font) => (
            <button
              key={font.value}
              onClick={() => updateSetting('fontFamily', font.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all ${
                settings.fontFamily === font.value
                  ? 'border-[#0071e3] bg-[#f5f5f7]'
                  : 'border-[#d2d2d7] hover:border-[#86868b] hover:bg-[#f5f5f7]'
              }`}
            >
              <span
                className="text-[48px] font-medium text-[#1d1d1f]"
                style={{ fontFamily: font.value }}
              >
                {font.preview}
              </span>
              <div className="text-center">
                <div className="text-[15px] font-semibold text-[#1d1d1f]">{font.label}</div>
                <div className="text-[12px] text-[#6e6e73]">{font.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="mb-5 text-[19px] font-semibold leading-[1.21] tracking-[-0.01em] text-[#1d1d1f]">
          Yerleşim Düzeni
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {layouts.map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateSetting('layout', layout.value as MemoryPageSettings['layout'])}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                settings.layout === layout.value
                  ? 'border-[#0071e3] bg-[#f5f5f7]'
                  : 'border-[#d2d2d7] hover:border-[#86868b] hover:bg-[#f5f5f7]'
              }`}
            >
              <div className="text-[#1d1d1f]">
                {layout.icon}
              </div>
              <div className="text-center">
                <div className="text-[15px] font-semibold text-[#1d1d1f]">{layout.label}</div>
                <div className="text-[12px] text-[#6e6e73]">{layout.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="mb-5 text-[19px] font-semibold leading-[1.21] tracking-[-0.01em] text-[#1d1d1f]">
          Görünürlük
        </h3>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#f5f5f7] p-4 transition-all hover:bg-[#e5e5ea]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <svg className="h-5 w-5 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#1d1d1f]">Tarihleri Göster</div>
                <div className="text-[13px] text-[#6e6e73]">Anılardaki tarihler görünsün</div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.showDates}
                onChange={(e) => updateSetting('showDates', e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-8 w-14 rounded-full bg-[#d2d2d7] transition-all peer-checked:bg-[#34c759]" />
              <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-6" />
            </div>
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#f5f5f7] p-4 transition-all hover:bg-[#e5e5ea]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <svg className="h-5 w-5 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#1d1d1f]">Yorumlara İzin Ver</div>
                <div className="text-[13px] text-[#6e6e73]">Ziyaretçiler yorum bırakabilsin</div>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.allowComments}
                onChange={(e) => updateSetting('allowComments', e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-8 w-14 rounded-full bg-[#d2d2d7] transition-all peer-checked:bg-[#34c759]" />
              <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-6" />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
