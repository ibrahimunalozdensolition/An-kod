"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import Navbar from "@/app/components/Navbar";

interface MemoryPage {
  id: string;
  userId: string;
  name: string;
  status: 'draft' | 'published' | 'unpublished';
  viewCount: number;
  profilePhoto?: string;
  slug: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const [pages, setPages] = useState<MemoryPage[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      if (!user?.uid) return;

      try {
        const pagesRef = collection(db, COLLECTIONS.MEMORIAL_PAGES);
        const q = query(
          pagesRef,
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const userPages: MemoryPage[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userPages.push({
            id: doc.id,
            userId: data.userId,
            name: data.name,
            status: data.status || 'draft',
            viewCount: data.viewCount || 0,
            profilePhoto: data.profilePhoto,
            slug: data.slug,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          });
        });
        
        userPages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setPages(userPages);
      } catch (error) {
        console.error('Sayfalar yüklenirken hata:', error);
        alert('Sayfalar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      }
    };

    fetchPages();
  }, [user]);


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

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fbfbfd] pt-[48px]">
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="animate-fade-in-up mb-8">
            <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-[48px]">
              Hoş geldiniz
            </h1>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">
              {user.email}
            </p>
            <div className="mt-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                user.role === 'producer' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {user.role === 'admin' ? 'Admin' :
                 user.role === 'producer' ? 'Üretici' :
                 'Müşteri'}
              </span>
            </div>
          </div>

          {!user.phoneVerified && (
            <div className="animate-fade-in-up animate-delay-100 mb-8 rounded-2xl bg-yellow-50 p-6 ring-1 ring-yellow-200">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold leading-[1.23] text-yellow-900">
                Telefon Numaranızı Doğrulayın
              </h3>
                  <p className="mt-1 text-[14px] leading-[1.47] text-yellow-700">
                Tüm özelliklere erişmek için telefon numaranızı doğrulamanız gerekmektedir.
              </p>
                  <Link
                    href="/auth/verify-phone"
                    className="mt-3 inline-flex h-[36px] items-center justify-center rounded-full bg-yellow-600 px-4 text-[14px] font-medium text-white transition-all hover:bg-yellow-700"
                  >
                    Doğrula
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="animate-fade-in-up animate-delay-200 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0071e3]/10 text-[#0071e3]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="mt-4 text-[21px] font-semibold leading-[1.19] tracking-[-0.01em] text-[#1d1d1f]">
                Anı Sayfalarım
              </h2>
              
              {pages.length === 0 ? (
                <p className="mt-4 text-[14px] leading-[1.47] text-[#6e6e73]">
                Henüz anı sayfası oluşturmadınız
              </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {pages.map((page) => (
                    <Link
                      key={page.id}
                      href={`/dashboard/pages/${page.id}`}
                      className="group flex items-center gap-4 rounded-xl bg-[#f5f5f7] p-3 transition-colors hover:bg-[#e5e5ea]"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#d2d2d7]">
                        {page.profilePhoto ? (
                          <img 
                            src={page.profilePhoto} 
                            alt={page.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[17px] font-semibold text-[#6e6e73]">
                            {page.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-semibold text-[#1d1d1f]">{page.name}</span>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            page.status === 'published' ? 'bg-green-100 text-green-700' :
                            page.status === 'unpublished' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {page.status === 'published' ? 'Yayında' :
                             page.status === 'unpublished' ? 'Yayından Kaldırıldı' : 'Taslak'}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#6e6e73] truncate">{page.viewCount} görüntülenme</p>
                      </div>
                      <svg className="h-5 w-5 text-[#86868b] transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/dashboard/create"
                  className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#0071e3] px-5 text-[14px] font-normal text-white transition-all hover:bg-[#0077ed]"
                >
                  Yeni Oluştur
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34c759]/10 text-[#34c759]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="mt-4 text-[21px] font-semibold leading-[1.19] tracking-[-0.01em] text-[#1d1d1f]">
                Siparişlerim
              </h2>
              <p className="mt-2 text-[14px] leading-[1.47] text-[#6e6e73]">
                Henüz siparişiniz bulunmamaktadır
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 text-[14px] text-[#6e6e73]">
                  <span className="h-2 w-2 rounded-full bg-[#e5e5ea]"></span>
                  0 aktif sipariş
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#00c7be] p-6 text-white shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-[21px] font-semibold leading-[1.19] tracking-[-0.01em]">
                Paketler
              </h2>
              <p className="mt-2 text-[14px] leading-[1.47] text-white/80">
                Anı sayfası veya ek özellikler satın alın
              </p>
              <Link
                href="/dashboard/payment"
                className="mt-6 inline-flex h-[40px] items-center justify-center rounded-full bg-white px-5 text-[14px] font-medium text-[#0071e3] transition-all hover:bg-white/90"
              >
                Paketleri Gör
              </Link>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-300 mt-8">
            <h2 className="mb-4 text-[19px] font-semibold leading-[1.21] tracking-[-0.01em] text-[#1d1d1f]">
              Hızlı İşlemler
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/dashboard/payment?type=new_page"
                className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#1d1d1f] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">Yeni Anı Sayfası</div>
                  <div className="text-[13px] text-[#6e6e73]">₺299</div>
                </div>
              </Link>

              <Link
                href="/dashboard/payment?type=extra_photos"
                className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#1d1d1f] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">Ek Fotoğraf Hakkı</div>
                  <div className="text-[13px] text-[#6e6e73]">₺99</div>
                </div>
              </Link>

              <Link
                href="/dashboard/payment?type=new_qr"
                className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#1d1d1f] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">QR Plaket</div>
                  <div className="text-[13px] text-[#6e6e73]">₺149</div>
                </div>
              </Link>

              <Link
                href="/dashboard/comments"
                className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#1d1d1f] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">Yorumlar</div>
                  <div className="text-[13px] text-[#6e6e73]">Yorum yönetimi</div>
                </div>
              </Link>

              <Link
                href="/dashboard/support"
                className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#1d1d1f] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">Destek</div>
                  <div className="text-[13px] text-[#6e6e73]">Yardım merkezi</div>
                </div>
              </Link>

              <Link
                href="/dashboard/analytics"
                className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#1d1d1f] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">Analitik</div>
                  <div className="text-[13px] text-[#6e6e73]">İstatistikler</div>
                </div>
              </Link>

              <Link
                href="/nasil-calisir"
                className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5f5f7] text-[#1d1d1f] transition-colors group-hover:bg-[#0071e3] group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">Nasıl Çalışır?</div>
                  <div className="text-[13px] text-[#6e6e73]">Rehber</div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
