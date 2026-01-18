"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
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
    showDates: boolean;
    allowComments: boolean;
  };
  status: 'draft' | 'published' | 'unpublished';
  viewCount: number;
  slug: string;
}

const MOCK_PAGE: MemoryPageData = {
  id: '1',
  name: 'Pamuk',
  birthDate: '2015-03-15',
  deathDate: '2024-11-20',
  bio: 'En sadık dostumuz, ailemizin bir parçası. Yedi yıl boyunca hayatımızı güzelleştirdin. Seni asla unutmayacağız.',
  profilePhoto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  coverPhoto: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
  memories: [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', description: 'İlk günümüz' },
    { id: '2', type: 'photo', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400', description: 'Parkta oyun' },
    { id: '3', type: 'photo', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400', description: 'Gülümseyen yüzü' },
    { id: '4', type: 'photo', url: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400', description: 'Uyurken' },
  ],
  settings: {
    backgroundColor: '#fbfbfd',
    accentColor: '#0071e3',
    fontFamily: 'sans-serif',
    layout: 'grid',
    showDates: true,
    allowComments: true,
  },
  status: 'published',
  viewCount: 142,
  slug: 'pamuk-abc123',
};

export default function PublicMemoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isFromQR = searchParams.get('source') === 'qr';
  const [page, setPage] = useState<MemoryPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryPageData['memories'][0] | null>(null);
  const [comment, setComment] = useState('');
  const [commentName, setCommentName] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pagesRef = collection(db, COLLECTIONS.MEMORIAL_PAGES);
        const q = query(pagesRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          
          const pageData = {
            id: docSnap.id,
            name: data.name,
            birthDate: data.birthDate,
            deathDate: data.deathDate,
            bio: data.bio,
            profilePhoto: data.profilePhoto,
            coverPhoto: data.coverPhoto,
            memories: (data.memories || []).map((m: any) => ({
              ...m,
              date: m.date || new Date(),
            })),
            settings: data.settings,
            status: data.status,
            viewCount: data.viewCount || 0,
            qrScans: data.qrScans || 0,
            slug: data.slug,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          };
          
          setPage(pageData);
          
          if (isFromQR) {
            updateDoc(doc(db, COLLECTIONS.MEMORIAL_PAGES, docSnap.id), {
              qrScans: increment(1),
              viewCount: increment(1),
            }).catch(err => console.error('QR tarama sayısı artırma hatası:', err));
          } else {
            updateDoc(doc(db, COLLECTIONS.MEMORIAL_PAGES, docSnap.id), {
              viewCount: increment(1),
            }).catch(err => console.error('Görüntülenme sayısı artırma hatası:', err));
          }
        } else if (slug === 'pamuk-abc123') {
          setPage(MOCK_PAGE);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Sayfa yüklenirken hata:', error);
        if (slug === 'pamuk-abc123') {
          setPage(MOCK_PAGE);
        } else {
          setNotFound(true);
        }
      }
      
      setLoading(false);
    };

    fetchPage();
  }, [slug]);

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

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd] px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f5f7]">
            <svg className="h-10 w-10 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mt-6 text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f]">
            Sayfa Bulunamadı
          </h1>
          <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
            Aradığınız anı sayfası mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-[48px] items-center justify-center rounded-full bg-[#0071e3] px-8 text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (page?.status === 'unpublished') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1d1d1f] px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-[56px] font-semibold leading-[1.07] tracking-[-0.02em] text-white sm:text-[72px]">
            {page.name}
          </h1>
          <div className="mt-6 h-[1px] w-32 mx-auto bg-white/20"></div>
          <p className="mt-6 text-[21px] leading-[1.38] text-white/60">
            Bu anı sayfası yayından kaldırılmıştır
          </p>
          <p className="mt-4 text-[17px] leading-[1.47] text-white/40">
            Sayfa sahibi tarafından geçici olarak yayından kaldırılmış olabilir
          </p>
        </div>
      </div>
    );
  }

  if (!page) return null;

  const isDark = page.settings.backgroundColor === '#1d1d1f' || 
                 page.settings.backgroundColor === '#2c2c2e' || 
                 page.settings.backgroundColor === '#1c1c1e';
  const textColor = isDark ? '#ffffff' : '#1d1d1f';
  const textSecondary = isDark ? '#a1a1a6' : '#6e6e73';
  const fontFamily = page.settings.fontFamily === 'serif' 
    ? 'Georgia, "Times New Roman", serif' 
    : '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: page.settings.backgroundColor, fontFamily }}
    >
      <div className="relative h-64 sm:h-80 md:h-96">
        {page.coverPhoto ? (
          <img
            src={page.coverPhoto}
            alt="Kapak"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-[#86868b]/20 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-end gap-6">
              <div 
                className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border-4 bg-[#e5e5ea] sm:h-36 sm:w-36"
                style={{ borderColor: page.settings.backgroundColor }}
              >
                {page.profilePhoto ? (
                  <img
                    src={page.profilePhoto}
                    alt={page.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#6e6e73]">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mb-2 text-white">
                <h1 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] sm:text-[40px]">
                  {page.name}
                </h1>
                {(page.birthDate || page.deathDate) && (
                  <p className="mt-2 text-[17px] text-white/80">
                    {page.birthDate && new Date(page.birthDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {page.birthDate && page.deathDate && ' — '}
                    {page.deathDate && new Date(page.deathDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {page.bio && (
          <div className="mb-12">
            <p className="text-[21px] leading-[1.52] sm:text-[24px]" style={{ color: textSecondary }}>
              {page.bio}
            </p>
          </div>
        )}

        {page.memories.length > 0 && (
          <div className="mb-12">
            <h2 
              className="mb-6 text-[28px] font-semibold leading-[1.14] tracking-[-0.01em]"
              style={{ color: textColor }}
            >
              Anılar
            </h2>

            {page.settings.layout === 'grid' && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {page.memories.map((memory) => (
                  <button
                    key={memory.id}
                    onClick={() => setSelectedMemory(memory)}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-[#e5e5ea] transition-transform hover:scale-[1.02]"
                  >
                    {memory.type === 'video' ? (
                      <video src={memory.url} className="h-full w-full object-cover" />
                    ) : (
                      <img src={memory.url} alt="" className="h-full w-full object-cover" />
                    )}
                    {memory.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                          <svg className="h-6 w-6 text-[#1d1d1f]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 transition-transform group-hover:translate-y-0">
                      <p className="text-[14px] text-white">{memory.description || 'Anı'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {page.settings.layout === 'timeline' && (
              <div className="space-y-8">
                {page.memories.map((memory, index) => (
                  <div key={memory.id} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div 
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: page.settings.accentColor }}
                      />
                      {index < page.memories.length - 1 && (
                        <div className="w-[2px] flex-1" style={{ backgroundColor: page.settings.accentColor + '40' }} />
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedMemory(memory)}
                      className="flex-1 pb-8"
                    >
                      <div className="aspect-video overflow-hidden rounded-xl bg-[#e5e5ea] transition-transform hover:scale-[1.01]">
                        {memory.type === 'video' ? (
                          <video src={memory.url} className="h-full w-full object-cover" />
                        ) : (
                          <img src={memory.url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      {memory.description && (
                        <p className="mt-3 text-[17px]" style={{ color: textSecondary }}>
                          {memory.description}
                        </p>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {page.settings.layout === 'carousel' && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {page.memories.map((memory) => (
                  <button
                    key={memory.id}
                    onClick={() => setSelectedMemory(memory)}
                    className="w-72 flex-shrink-0"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[#e5e5ea] transition-transform hover:scale-[1.02]">
                      {memory.type === 'video' ? (
                        <video src={memory.url} className="h-full w-full object-cover" />
                      ) : (
                        <img src={memory.url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    {memory.description && (
                      <p className="mt-3 text-[17px]" style={{ color: textSecondary }}>
                        {memory.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {page.settings.allowComments && (
          <div 
            className="border-t pt-12"
            style={{ borderColor: isDark ? '#38383a' : '#d2d2d7' }}
          >
            <h2 
              className="mb-6 text-[28px] font-semibold leading-[1.14] tracking-[-0.01em]"
              style={{ color: textColor }}
            >
              Anma Mesajları
            </h2>

            <div 
              className="rounded-2xl p-6"
              style={{ backgroundColor: isDark ? '#2c2c2e' : '#f5f5f7' }}
            >
              <div className="space-y-4">
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Adınız"
                  className="h-[52px] w-full rounded-xl border-0 px-4 text-[17px] transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: isDark ? '#1d1d1f' : '#ffffff',
                    color: textColor,
                    '--tw-ring-color': page.settings.accentColor + '40',
                  } as React.CSSProperties}
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  rows={4}
                  className="w-full rounded-xl border-0 p-4 text-[17px] transition-all focus:outline-none focus:ring-2 resize-none"
                  style={{ 
                    backgroundColor: isDark ? '#1d1d1f' : '#ffffff',
                    color: textColor,
                    '--tw-ring-color': page.settings.accentColor + '40',
                  } as React.CSSProperties}
                />
                <button
                  className="inline-flex h-[48px] items-center justify-center rounded-full px-8 text-[17px] font-normal text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: page.settings.accentColor }}
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer 
        className="border-t py-8"
        style={{ borderColor: isDark ? '#38383a' : '#d2d2d7' }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <p className="text-[14px]" style={{ color: textSecondary }}>
            Bu anı sayfası <Link href="/" className="hover:underline" style={{ color: page.settings.accentColor }}>ANIKOD</Link> ile oluşturulmuştur
          </p>
        </div>
      </footer>

      {selectedMemory && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <button
            onClick={() => setSelectedMemory(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMemory.type === 'video' ? (
              <video 
                src={selectedMemory.url} 
                className="max-h-[90vh] w-auto"
                controls
                autoPlay
              />
            ) : (
              <img 
                src={selectedMemory.url} 
                alt={selectedMemory.description || ''} 
                className="max-h-[90vh] w-auto"
              />
            )}
          </div>

          {selectedMemory.description && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-[17px] text-white">{selectedMemory.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
