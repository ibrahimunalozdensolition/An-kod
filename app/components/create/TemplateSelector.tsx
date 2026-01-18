"use client";

import { TemplateId, TEMPLATES } from "@/lib/types/memoryPage";

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-[24px] font-semibold leading-[1.16] tracking-[-0.01em] text-[#1d1d1f]">
        Şablon Seçin
      </h2>
      <p className="mb-8 text-[17px] leading-[1.47] text-[#6e6e73]">
        Anı sayfanız için bir tasarım şablonu seçin
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
              selected === template.id
                ? 'border-[#0071e3] bg-[#f5f5f7]'
                : 'border-[#d2d2d7] bg-white hover:border-[#86868b]'
            }`}
          >
            <div 
              className="mb-4 aspect-[4/3] rounded-lg"
              style={{ backgroundColor: template.settings.backgroundColor }}
            >
              <div className="flex h-full items-center justify-center">
                <div 
                  className="h-16 w-16 rounded-full"
                  style={{ backgroundColor: template.settings.accentColor, opacity: 0.2 }}
                />
              </div>
            </div>

            <h3 className="mb-1 text-[17px] font-semibold leading-[1.23] text-[#1d1d1f]">
              {template.name}
            </h3>
            <p className="text-[14px] leading-[1.43] text-[#6e6e73]">
              {template.description}
            </p>

            {selected === template.id && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0071e3]">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
