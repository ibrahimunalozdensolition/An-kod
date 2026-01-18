"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { uploadProfilePhoto, uploadCoverPhoto, uploadMemoryMedia } from "@/lib/utils/storage";
import Navbar from "@/app/components/Navbar";
import TemplateSelector from "@/app/components/create/TemplateSelector";
import BasicInfoForm from "@/app/components/create/BasicInfoForm";
import MediaUploader from "@/app/components/create/MediaUploader";
import SettingsPanel from "@/app/components/create/SettingsPanel";
import PreviewPanel from "@/app/components/create/PreviewPanel";
import SidebarPreview from "@/app/components/create/SidebarPreview";
import { TemplateId, Memory, MemoryPageSettings, TEMPLATES } from "@/lib/types/memoryPage";
import { generateSlug } from "@/lib/utils/slug";

type Step = 'template' | 'info' | 'media' | 'settings' | 'preview';

const steps: { id: Step; label: string }[] = [
  { id: 'template', label: 'Şablon' },
  { id: 'info', label: 'Bilgiler' },
  { id: 'media', label: 'Medya' },
  { id: 'settings', label: 'Ayarlar' },
  { id: 'preview', label: 'Önizleme' },
];

export default function CreateMemoryPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const [currentStep, setCurrentStep] = useState<Step>('template');
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    bio: '',
    profilePhoto: null as File | null,
    coverPhoto: null as File | null,
  });
  const [memories, setMemories] = useState<Partial<Memory>[]>([]);
  const [settings, setSettings] = useState<MemoryPageSettings>({
    template: 'modern',
    backgroundColor: '#fbfbfd',
    accentColor: '#0071e3',
    fontFamily: 'sans-serif',
    layout: 'grid',
    showDates: true,
    allowComments: true,
  });

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const showSidebarPreview = currentStep !== 'preview';

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template?.settings) {
      setSettings(prev => ({ ...prev, ...template.settings, template: templateId }));
    }
  };

  const savePage = async (status: 'draft' | 'published') => {
    if (!basicInfo.name.trim()) {
      alert('Lütfen bir isim girin');
      return false;
    }

    try {
      setUploadStatus('Sayfa oluşturuluyor...');
      setUploadProgress(5);

      const slug = generateSlug(basicInfo.name);
      const tempPageId = crypto.randomUUID();
      
      const pageData: any = {
        userId: user?.uid || '',
        name: basicInfo.name,
        bio: basicInfo.bio || '',
        settings: {
          template: settings.template || 'modern',
          backgroundColor: settings.backgroundColor || '#fbfbfd',
          accentColor: settings.accentColor || '#0071e3',
          fontFamily: settings.fontFamily || 'sans-serif',
          layout: settings.layout || 'grid',
          showDates: settings.showDates ?? true,
          allowComments: settings.allowComments ?? true,
        },
        status: status,
        slug: slug,
        viewCount: 0,
        qrScans: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (basicInfo.birthDate) {
        pageData.birthDate = basicInfo.birthDate;
      }
      
      if (basicInfo.deathDate) {
        pageData.deathDate = basicInfo.deathDate;
      }

      setUploadProgress(10);

      if (basicInfo.profilePhoto) {
        setUploadStatus('Profil fotoğrafı yükleniyor...');
        const profileUrl = await uploadProfilePhoto(user?.uid || '', basicInfo.profilePhoto);
        pageData.profilePhoto = profileUrl;
        setUploadProgress(20);
      }
      
      if (basicInfo.coverPhoto) {
        setUploadStatus('Kapak fotoğrafı yükleniyor...');
        const coverUrl = await uploadCoverPhoto(user?.uid || '', basicInfo.coverPhoto);
        pageData.coverPhoto = coverUrl;
        setUploadProgress(30);
      }

      const totalMemories = memories.length;
      const uploadedMemories: any[] = [];

      if (totalMemories > 0) {
        for (let i = 0; i < memories.length; i++) {
          const memory = memories[i];
          setUploadStatus(`Medya yükleniyor ${i + 1}/${totalMemories}...`);
          
          const progressPerMemory = 60 / totalMemories;
          const baseProgress = 30 + (i * progressPerMemory);

          let mediaUrl = memory.url || '';
          
          if (memory.url && memory.url.startsWith('blob:')) {
            const response = await fetch(memory.url);
            const blob = await response.blob();
            const file = new File([blob], `memory_${i}.${memory.type === 'video' ? 'mp4' : 'jpg'}`, { type: blob.type });
            
            mediaUrl = await uploadMemoryMedia(
              user?.uid || '',
              tempPageId,
              file,
              (progress) => {
                setUploadProgress(baseProgress + (progress / 100 * progressPerMemory));
              }
            );
          }

          uploadedMemories.push({
            id: memory.id || '',
            type: memory.type || 'photo',
            url: mediaUrl,
            thumbnailUrl: memory.thumbnailUrl || null,
            date: memory.date ? new Date(memory.date) : new Date(),
            description: memory.description || '',
            order: memory.order ?? i,
            visible: memory.visible ?? true,
          });
        }
      }

      pageData.memories = uploadedMemories;
      setUploadProgress(90);

      setUploadStatus('Veritabanına kaydediliyor...');
      const docRef = await addDoc(collection(db, COLLECTIONS.MEMORIAL_PAGES), pageData);
      console.log('Sayfa Firebase\'e kaydedildi, ID:', docRef.id);
      
      setUploadProgress(100);
      setUploadStatus('Tamamlandı!');
      
      return true;
    } catch (error) {
      console.error('Firebase\'e kaydetme hatası:', error);
      setUploadStatus('');
      alert('Sayfa kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
      return false;
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    
    const saved = await savePage('draft');
    if (saved) {
      router.push('/dashboard');
    }
    
    setSaving(false);
  };

  const handleGoToPayment = async () => {
    const saved = await savePage('draft');
    if (saved) {
      router.push('/dashboard/payment?type=new_page');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d2d2d7] border-t-[#0071e3]"></div>
          <div className="text-[17px] text-[#6e6e73]">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fbfbfd] pt-[48px]">
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          
          {saving && uploadStatus && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="animate-fade-in-up w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0071e3]/10">
                    <svg className="h-8 w-8 animate-spin text-[#0071e3]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>

                  <h2 className="mt-6 text-[24px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
                    {uploadStatus}
                  </h2>

                  <div className="mt-6 w-full">
                    <div className="h-2 overflow-hidden rounded-full bg-[#e5e5ea]">
                      <div 
                        className="h-full rounded-full bg-[#0071e3] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[14px] text-[#6e6e73]">
                      {Math.round(uploadProgress)}% tamamlandı
                    </p>
                  </div>

                  <p className="mt-4 text-[14px] text-[#6e6e73]">
                    Lütfen bu işlem tamamlanana kadar bekleyin
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="animate-fade-in-up mb-8">
            <h1 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-[40px]">
              Anı Sayfası Oluştur
            </h1>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">
              Sevdiğiniz için özel bir anı sayfası tasarlayın
            </p>
          </div>

          <div className="animate-fade-in-up animate-delay-100 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => index <= currentStepIndex && setCurrentStep(step.id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-medium transition-all ${
                      index < currentStepIndex
                        ? 'bg-[#34c759] text-white'
                        : index === currentStepIndex
                        ? 'bg-[#0071e3] text-white'
                        : 'bg-[#e5e5ea] text-[#6e6e73]'
                    }`}
                    disabled={index > currentStepIndex}
                  >
                    {index < currentStepIndex ? '✓' : index + 1}
                  </button>
                  <span className={`ml-3 hidden text-[14px] font-medium sm:block ${
                    index === currentStepIndex ? 'text-[#1d1d1f]' : 'text-[#6e6e73]'
                  }`}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-[2px] w-8 sm:w-16 ${
                      index < currentStepIndex ? 'bg-[#34c759]' : 'bg-[#e5e5ea]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-200">
            <div className={`flex gap-8 ${showSidebarPreview ? '' : ''}`}>
              <div className={showSidebarPreview ? 'flex-1' : 'w-full'}>
                {currentStep === 'template' && (
                  <TemplateSelector
                    selected={selectedTemplate}
                    onSelect={handleTemplateSelect}
                  />
                )}

                {currentStep === 'info' && (
                  <BasicInfoForm
                    data={basicInfo}
                    onChange={setBasicInfo}
                  />
                )}

                {currentStep === 'media' && (
                  <MediaUploader
                    memories={memories}
                    onChange={setMemories}
                  />
                )}

                {currentStep === 'settings' && (
                  <SettingsPanel
                    settings={settings}
                    onChange={setSettings}
                  />
                )}

                {currentStep === 'preview' && (
                  <PreviewPanel
                    basicInfo={basicInfo}
                    memories={memories}
                    settings={settings}
                  />
                )}
              </div>

              {showSidebarPreview && (
                <div className="hidden w-[400px] flex-shrink-0 lg:block">
                  <SidebarPreview
                    basicInfo={basicInfo}
                    memories={memories}
                    settings={settings}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#d2d2d7] pt-8">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#d2d2d7] px-6 text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b] disabled:opacity-40"
            >
              Geri
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#d2d2d7] px-6 text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]"
              >
                {saving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
              </button>

              {currentStep === 'preview' ? (
                <button
                  onClick={handleGoToPayment}
                  className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#0071e3] px-8 text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Ödeme Yap
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#0071e3] px-8 text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
                >
                  İleri
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
