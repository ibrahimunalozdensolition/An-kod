"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";

interface MemoryPageData {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  bio: string;
  profilePhoto?: string;
  coverPhoto?: string;
  memories: {
    id: string;
    type: 'photo' | 'video';
    url: string;
    description?: string;
  }[];
  settings: {
    backgroundColor: string;
    accentColor: string;
    fontFamily: string;
    layout: 'grid' | 'timeline' | 'carousel';
  };
  status: 'draft' | 'published' | 'unpublished';
  viewCount: number;
  qrScans: number;
  slug: string;
  createdAt: string;
}

const MOCK_PAGE: MemoryPageData = {
  id: '1',
  name: 'Pamuk',
  birthDate: '2015-03-15',
  deathDate: '2024-11-20',
  bio: 'En sadık dostumuz, ailemizin bir parçası.',
  profilePhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  coverPhoto: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
  memories: [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', description: 'İlk günümüz' },
    { id: '2', type: 'photo', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400', description: 'Parkta' },
  ],
  settings: {
    backgroundColor: '#fbfbfd',
    accentColor: '#0071e3',
    fontFamily: 'sans-serif',
    layout: 'grid',
  },
  status: 'published',
  viewCount: 142,
  qrScans: 28,
  slug: 'pamuk-abc123',
  createdAt: '2024-11-25T10:30:00Z',
};

export default function PageManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useRequireAuth();
  const [page, setPage] = useState<MemoryPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/memory/${page?.slug}` 
    : '';

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.MEMORIAL_PAGES, params.id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPage({
            id: docSnap.id,
            name: data.name,
            birthDate: data.birthDate,
            deathDate: data.deathDate,
            bio: data.bio,
            profilePhoto: data.profilePhoto,
            coverPhoto: data.coverPhoto,
            memories: data.memories || [],
            settings: data.settings,
            status: data.status,
            viewCount: data.viewCount || 0,
            qrScans: data.qrScans || 0,
            slug: data.slug,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          });
        } else {
          setPage(MOCK_PAGE);
        }
      } catch (error) {
        console.error('Sayfa yüklenirken hata:', error);
        setPage(MOCK_PAGE);
      }
      
      setLoading(false);
    };

    fetchPage();
  }, [params.id]);

  const handlePublish = async () => {
    setIsProcessing(true);
    
    try {
      if (page) {
        const docRef = doc(db, COLLECTIONS.MEMORIAL_PAGES, params.id as string);
        await updateDoc(docRef, {
          status: 'published',
          updatedAt: new Date(),
        });
        setPage(prev => prev ? { ...prev, status: 'published' } : null);
      }
    } catch (error) {
      console.error('Yayınlama hatası:', error);
      alert('Yayınlama sırasında bir hata oluştu.');
    }
    
    setIsProcessing(false);
    setShowPublishModal(false);
  };

  const handleUnpublish = async () => {
    setIsProcessing(true);
    
    try {
      if (page) {
        const docRef = doc(db, COLLECTIONS.MEMORIAL_PAGES, params.id as string);
        await updateDoc(docRef, {
          status: 'unpublished',
          updatedAt: new Date(),
        });
        setPage(prev => prev ? { ...prev, status: 'unpublished' } : null);
      }
    } catch (error) {
      console.error('Yayından kaldırma hatası:', error);
      alert('Yayından kaldırma sırasında bir hata oluştu.');
    }
    
    setIsProcessing(false);
    setShowUnpublishModal(false);
  };

  const copyLink = async () => {
    if (pageUrl) {
      await navigator.clipboard.writeText(pageUrl);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    
    try {
      if (page) {
        await deleteDoc(doc(db, COLLECTIONS.MEMORIAL_PAGES, params.id as string));
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sayfa silme hatası:', error);
      alert('Sayfa silinirken bir hata oluştu.');
    }
    
    setIsProcessing(false);
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd] pt-[48px]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d2d2d7] border-t-[#0071e3]"></div>
            <div className="text-[17px] text-[#6e6e73]">Yükleniyor...</div>
          </div>
        </div>
      </>
    );
  }

  if (!page) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd] pt-[48px]">
          <div className="text-center">
            <h1 className="text-[28px] font-semibold text-[#1d1d1f]">Sayfa Bulunamadı</h1>
            <Link href="/dashboard" className="mt-4 inline-flex text-[#0071e3] hover:underline">
              Panele Dön
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fbfbfd] pt-[48px]">
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-[17px] text-[#0071e3] transition-colors hover:text-[#0077ed]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Panele Dön
          </Link>

          <div className="animate-fade-in-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f]">
                  {page.name}
                </h1>
                <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${
                  page.status === 'published' ? 'bg-green-100 text-green-700' :
                  page.status === 'unpublished' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {page.status === 'published' ? 'Yayında' :
                   page.status === 'unpublished' ? 'Yayından Kaldırıldı' :
                   'Taslak'}
                </span>
              </div>
              <p className="mt-2 text-[17px] text-[#6e6e73]">
                {new Date(page.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinde oluşturuldu
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full border border-[#ff3b30] px-6 text-[17px] font-normal text-[#ff3b30] transition-all hover:bg-red-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Sil
              </button>
              {page.status === 'published' ? (
                <button
                  onClick={() => setShowUnpublishModal(true)}
                  className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#d2d2d7] px-6 text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]"
                >
                  Yayından Kaldır
                </button>
              ) : (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#34c759] px-6 text-[17px] font-normal text-white transition-all hover:bg-[#30b350]"
                >
                  Yayınla
                </button>
              )}
              <Link
                href={`/memory/${page.slug}`}
                target="_blank"
                className="inline-flex h-[48px] items-center justify-center rounded-full bg-[#0071e3] px-6 text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
              >
                Sayfayı Görüntüle
              </Link>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-100 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="mb-4 text-[21px] font-semibold text-[#1d1d1f]">Sayfa Linki</h2>
                <p className="mb-4 text-[15px] text-[#6e6e73]">
                  Bu linki paylaşarak anı sayfanıza erişim sağlayabilirsiniz
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={pageUrl}
                    readOnly
                    className="flex-1 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] px-4 py-3 text-[15px] text-[#1d1d1f]"
                  />
                  <button
                    onClick={copyLink}
                    className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#0071e3] px-6 text-[15px] font-normal text-white transition-all hover:bg-[#0077ed]"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Kopyala
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Önizleme</h2>
                  <Link
                    href={`/memory/${page.slug}`}
                    target="_blank"
                    className="text-[15px] text-[#0071e3] hover:underline"
                  >
                    Tam Sayfa
                  </Link>
                </div>
                <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
                  <div className="relative h-40" style={{ backgroundColor: page.settings.backgroundColor }}>
                    {page.coverPhoto && (
                      <img src={page.coverPhoto} alt="" className="h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="relative -mt-6 px-4 pb-4">
                    <div className="flex items-end gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-[#e5e5ea]">
                        {page.profilePhoto ? (
                          <img src={page.profilePhoto} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[21px] font-semibold text-[#6e6e73]">
                            {page.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <h3 className="text-[19px] font-semibold text-[#1d1d1f]">{page.name}</h3>
                        <p className="text-[14px] text-[#6e6e73]">{page.memories.length} anı</p>
                      </div>
                    </div>
                    {page.bio && (
                      <p className="mt-3 text-[14px] leading-[1.47] text-[#6e6e73] line-clamp-2">
                        {page.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="mb-4 text-[21px] font-semibold text-[#1d1d1f]">İstatistikler</h2>
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#f5f5f7] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0071e3]/10 text-[#0071e3]">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-[15px] font-medium text-[#1d1d1f]">Toplam Görüntülenme</div>
                          <div className="text-[13px] text-[#6e6e73]">Tüm erişimler</div>
                        </div>
                      </div>
                      <span className="text-[24px] font-semibold text-[#1d1d1f]">{page.viewCount}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f5f5f7] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#34c759]/10 text-[#34c759]">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-[15px] font-medium text-[#1d1d1f]">QR Tarama</div>
                          <div className="text-[13px] text-[#6e6e73]">Fiziksel QR koddan</div>
                        </div>
                      </div>
                      <span className="text-[24px] font-semibold text-[#1d1d1f]">{page.qrScans}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#f5f5f7] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#af52de]/10 text-[#af52de]">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-[15px] font-medium text-[#1d1d1f]">Toplam Anı</div>
                          <div className="text-[13px] text-[#6e6e73]">Fotoğraf ve video</div>
                        </div>
                      </div>
                      <span className="text-[24px] font-semibold text-[#1d1d1f]">{page.memories.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="mb-4 text-[21px] font-semibold text-[#1d1d1f]">Hızlı İşlemler</h2>
                <div className="space-y-3">
                  <Link
                    href={`/dashboard/create?edit=${page.id}`}
                    className="flex w-full items-center gap-3 rounded-xl bg-[#f5f5f7] p-4 transition-colors hover:bg-[#e5e5ea]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#1d1d1f]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[15px] font-medium text-[#1d1d1f]">Sayfayı Düzenle</div>
                      <div className="text-[13px] text-[#6e6e73]">İçerik ve tasarımı değiştir</div>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/payment?type=extra_photos"
                    className="flex w-full items-center gap-3 rounded-xl bg-[#f5f5f7] p-4 transition-colors hover:bg-[#e5e5ea]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#1d1d1f]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[15px] font-medium text-[#1d1d1f]">Ek Fotoğraf Hakkı</div>
                      <div className="text-[13px] text-[#6e6e73]">8 fotoğraf daha ekle</div>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/payment?type=new_qr"
                    className="flex w-full items-center gap-3 rounded-xl bg-[#f5f5f7] p-4 transition-colors hover:bg-[#e5e5ea]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#1d1d1f]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[15px] font-medium text-[#1d1d1f]">QR Plaket Sipariş Et</div>
                      <div className="text-[13px] text-[#6e6e73]">Fiziksel QR plaketi</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUnpublishModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowUnpublishModal(false)}
        >
          <div 
            className="animate-fade-in-up w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff3b30]/10">
                <svg className="h-8 w-8 text-[#ff3b30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>

              <h2 className="mt-6 text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
                Yayından Kaldır
              </h2>
              <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
                "{page.name}" sayfası yayından kaldırılacak. Ziyaretçiler sayfaya erişemeyecek ancak veriler silinmeyecek.
              </p>

              <div className="mt-8 w-full space-y-3">
                <button
                  onClick={handleUnpublish}
                  disabled={isProcessing}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full bg-[#ff3b30] text-[17px] font-normal text-white transition-all hover:bg-[#ff453a] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : (
                    'Yayından Kaldır'
                  )}
                </button>
                <button
                  onClick={() => setShowUnpublishModal(false)}
                  disabled={isProcessing}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b] disabled:opacity-50"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPublishModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowPublishModal(false)}
        >
          <div 
            className="animate-fade-in-up w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#34c759]/10">
                <svg className="h-8 w-8 text-[#34c759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="mt-6 text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
                Sayfayı Yayınla
              </h2>
              <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
                "{page.name}" sayfası yayınlanacak ve herkes tarafından görüntülenebilir hale gelecek.
              </p>

              <div className="mt-8 w-full space-y-3">
                <button
                  onClick={handlePublish}
                  disabled={isProcessing}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full bg-[#34c759] text-[17px] font-normal text-white transition-all hover:bg-[#30b350] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : (
                    'Yayınla'
                  )}
                </button>
                <button
                  onClick={() => setShowPublishModal(false)}
                  disabled={isProcessing}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b] disabled:opacity-50"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
        >
          <div 
            className="animate-fade-in-up w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff3b30]/10">
                <svg className="h-8 w-8 text-[#ff3b30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h2 className="mt-6 text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
                Sayfayı Sil
              </h2>
              <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
                "{page.name}" sayfası kalıcı olarak silinecek. Tüm anılar, yorumlar ve istatistikler kaybolacak. Bu işlem geri alınamaz.
              </p>

              <div className="mt-8 w-full space-y-3">
                <button
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full bg-[#ff3b30] text-[17px] font-normal text-white transition-all hover:bg-[#ff453a] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : (
                    'Kalıcı Olarak Sil'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isProcessing}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b] disabled:opacity-50"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
