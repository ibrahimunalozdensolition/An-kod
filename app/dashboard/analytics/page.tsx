"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { AnalyticsPeriod } from "@/lib/types/analytics";

export const dynamic = 'force-dynamic';

interface PageStats {
  id: string;
  name: string;
  views: number;
  qrScans: number;
  uniqueVisitors: number;
  avgTimeOnPage: string;
  trend: number;
}

const MOCK_PAGES: PageStats[] = [
  { id: '1', name: 'Pamuk', views: 142, qrScans: 28, uniqueVisitors: 98, avgTimeOnPage: '2:34', trend: 12 },
  { id: '2', name: 'Minnoş', views: 89, qrScans: 15, uniqueVisitors: 67, avgTimeOnPage: '1:58', trend: -5 },
];

const MOCK_CHART_DATA = [
  { date: '10 Ara', views: 12 },
  { date: '11 Ara', views: 18 },
  { date: '12 Ara', views: 15 },
  { date: '13 Ara', views: 22 },
  { date: '14 Ara', views: 28 },
  { date: '15 Ara', views: 35 },
  { date: '16 Ara', views: 31 },
];

const MOCK_DEVICES = [
  { device: 'Mobil', count: 156, percentage: 65 },
  { device: 'Masaüstü', count: 72, percentage: 30 },
  { device: 'Tablet', count: 12, percentage: 5 },
];

const MOCK_COUNTRIES = [
  { country: 'Türkiye', count: 198, percentage: 82 },
  { country: 'Almanya', count: 25, percentage: 11 },
  { country: 'Diğer', count: 17, percentage: 7 },
];

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d');
  const [selectedPage, setSelectedPage] = useState<string>('all');

  const totalViews = MOCK_PAGES.reduce((sum, p) => sum + p.views, 0);
  const totalQRScans = MOCK_PAGES.reduce((sum, p) => sum + p.qrScans, 0);
  const totalUniqueVisitors = MOCK_PAGES.reduce((sum, p) => sum + p.uniqueVisitors, 0);
  const maxViews = Math.max(...MOCK_CHART_DATA.map(d => d.views));

  if (authLoading) {
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
              <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f]">
                Analitik
              </h1>
              <p className="mt-2 text-[17px] text-[#6e6e73]">
                Sayfa performansınızı takip edin
              </p>
            </div>

            <div className="flex gap-2">
              {[
                { id: '7d', label: '7 Gün' },
                { id: '30d', label: '30 Gün' },
                { id: '90d', label: '90 Gün' },
                { id: '1y', label: '1 Yıl' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id as AnalyticsPeriod)}
                  className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all ${
                    period === p.id
                      ? 'bg-[#1d1d1f] text-white'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-100 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0071e3]/10 text-[#0071e3]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-[14px] font-medium text-[#34c759]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  8%
                </span>
              </div>
              <div className="mt-4 text-[32px] font-semibold text-[#1d1d1f]">{totalViews}</div>
              <div className="mt-1 text-[14px] text-[#6e6e73]">Toplam Görüntülenme</div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34c759]/10 text-[#34c759]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-[14px] font-medium text-[#34c759]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  15%
                </span>
              </div>
              <div className="mt-4 text-[32px] font-semibold text-[#1d1d1f]">{totalQRScans}</div>
              <div className="mt-1 text-[14px] text-[#6e6e73]">QR Tarama</div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#af52de]/10 text-[#af52de]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-[14px] font-medium text-[#34c759]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  5%
                </span>
              </div>
              <div className="mt-4 text-[32px] font-semibold text-[#1d1d1f]">{totalUniqueVisitors}</div>
              <div className="mt-1 text-[14px] text-[#6e6e73]">Tekil Ziyaretçi</div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff9500]/10 text-[#ff9500]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 text-[32px] font-semibold text-[#1d1d1f]">2:16</div>
              <div className="mt-1 text-[14px] text-[#6e6e73]">Ort. Oturum Süresi</div>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-200 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Görüntülenme Grafiği</h2>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-[14px] focus:border-[#0071e3] focus:outline-none"
                >
                  <option value="all">Tüm Sayfalar</option>
                  {MOCK_PAGES.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="h-64">
                <div className="flex h-full items-end gap-2">
                  {MOCK_CHART_DATA.map((d, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div 
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#0071e3] to-[#00c7be] transition-all hover:opacity-80"
                        style={{ height: `${(d.views / maxViews) * 100}%` }}
                      />
                      <span className="text-[11px] text-[#6e6e73]">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="mb-4 text-[17px] font-semibold text-[#1d1d1f]">Cihaz Dağılımı</h2>
                <div className="space-y-3">
                  {MOCK_DEVICES.map((d) => (
                    <div key={d.device}>
                      <div className="mb-1 flex items-center justify-between text-[14px]">
                        <span className="text-[#1d1d1f]">{d.device}</span>
                        <span className="text-[#6e6e73]">{d.percentage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f5f5f7]">
                        <div 
                          className="h-full rounded-full bg-[#0071e3] transition-all"
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="mb-4 text-[17px] font-semibold text-[#1d1d1f]">Ülke Dağılımı</h2>
                <div className="space-y-3">
                  {MOCK_COUNTRIES.map((c) => (
                    <div key={c.country}>
                      <div className="mb-1 flex items-center justify-between text-[14px]">
                        <span className="text-[#1d1d1f]">{c.country}</span>
                        <span className="text-[#6e6e73]">{c.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f5f5f7]">
                        <div 
                          className="h-full rounded-full bg-[#34c759] transition-all"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-300 mt-8">
            <h2 className="mb-4 text-[21px] font-semibold text-[#1d1d1f]">Sayfa Performansı</h2>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5ea]">
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6e6e73]">Sayfa</th>
                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#6e6e73]">Görüntülenme</th>
                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#6e6e73]">QR Tarama</th>
                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#6e6e73]">Tekil Ziyaretçi</th>
                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#6e6e73]">Ort. Süre</th>
                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#6e6e73]">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PAGES.map((page) => (
                    <tr key={page.id} className="border-b border-[#e5e5ea] last:border-0">
                      <td className="px-6 py-4">
                        <Link 
                          href={`/dashboard/pages/${page.id}`}
                          className="text-[15px] font-medium text-[#0071e3] hover:underline"
                        >
                          {page.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right text-[15px] text-[#1d1d1f]">{page.views}</td>
                      <td className="px-6 py-4 text-right text-[15px] text-[#1d1d1f]">{page.qrScans}</td>
                      <td className="px-6 py-4 text-right text-[15px] text-[#1d1d1f]">{page.uniqueVisitors}</td>
                      <td className="px-6 py-4 text-right text-[15px] text-[#1d1d1f]">{page.avgTimeOnPage}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 text-[14px] font-medium ${
                          page.trend >= 0 ? 'text-[#34c759]' : 'text-[#ff3b30]'
                        }`}>
                          {page.trend >= 0 ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                          {Math.abs(page.trend)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
