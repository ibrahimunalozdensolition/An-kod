"use client";

import { useRef } from "react";
import AppleDatePicker from "./AppleDatePicker";

interface BasicInfoData {
  name: string;
  birthDate: string;
  deathDate: string;
  bio: string;
  profilePhoto: File | null;
  coverPhoto: File | null;
}

interface BasicInfoFormProps {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

export default function BasicInfoForm({ data, onChange }: BasicInfoFormProps) {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (field: 'profilePhoto' | 'coverPhoto') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange({ ...data, [field]: file });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-2 text-[24px] font-semibold leading-[1.16] tracking-[-0.01em] text-[#1d1d1f]">
        Temel Bilgiler
      </h2>
      <p className="mb-8 text-[17px] leading-[1.47] text-[#6e6e73]">
        Sevdiğiniz hakkında bilgileri girin
      </p>

      <div className="space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
              Profil Fotoğrafı
            </label>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange('profilePhoto')}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-[#d2d2d7] bg-[#f5f5f7] transition-colors hover:border-[#0071e3]"
            >
              {data.profilePhoto ? (
                <img
                  src={URL.createObjectURL(data.profilePhoto)}
                  alt="Profil"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <svg className="h-8 w-8 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
              Kapak Fotoğrafı
            </label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange('coverPhoto')}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="flex h-32 w-full items-center justify-center rounded-xl border-2 border-dashed border-[#d2d2d7] bg-[#f5f5f7] transition-colors hover:border-[#0071e3]"
            >
              {data.coverPhoto ? (
                <img
                  src={URL.createObjectURL(data.coverPhoto)}
                  alt="Kapak"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-8 w-8 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[14px] text-[#6e6e73]">Kapak ekle</span>
                </div>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
            İsim
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="h-[48px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
            placeholder="Sevdiğinizin adı"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <AppleDatePicker
            label="Doğum Tarihi"
            value={data.birthDate}
            onChange={(value) => onChange({ ...data, birthDate: value })}
            placeholder="Tarih seçin"
          />

          <AppleDatePicker
            label="Vefat Tarihi"
            value={data.deathDate}
            onChange={(value) => onChange({ ...data, deathDate: value })}
            placeholder="Tarih seçin"
          />
        </div>

        <div>
          <label htmlFor="bio" className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
            Hakkında
          </label>
          <textarea
            id="bio"
            value={data.bio}
            onChange={(e) => onChange({ ...data, bio: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-[#d2d2d7] bg-white px-4 py-3 text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
            placeholder="Kısa bir açıklama yazın..."
          />
        </div>
      </div>
    </div>
  );
}
