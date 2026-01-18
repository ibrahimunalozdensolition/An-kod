"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

type ReportPeriod = '7d' | '30d' | '90d' | '1y';

interface SystemReport {
  period: ReportPeriod;
  users: { total: number; new: number; active: number };
  pages: { total: number; new: number; published: number };
  orders: { total: number; completed: number; pending: number };
  revenue: { total: number; thisMonth: number; growth: number };
  support: { total: number; resolved: number; avgResponseTime: string };
}

const MOCK_REPORT: SystemReport = {
  period: '30d',
  users: { total: 156, new: 23, active: 89 },
  pages: { total: 234, new: 18, published: 198 },
  orders: { total: 89, completed: 72, pending: 17 },
  revenue: { total: 26500, thisMonth: 8700, growth: 12 },
  support: { total: 45, resolved: 38, avgResponseTime: '2.4 saat' },
};

export default function ReportsPage() {
  const { user, loading } = useRequireAuth(['admin']);
  const [period, setPeriod] = useState<ReportPeriod>('30d');
  const report = MOCK_REPORT;

  if (loading) {
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
            href="/admin"
            className="mb-6 inline-flex items-center gap-2 text-[17px] text-[#0071e3] transition-colors hover:text-[#0077ed]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Admin Paneline Dön
          </Link>

          <div className="animate-fade-in-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f]">
                Raporlar
              </h1>
              <p className="mt-2 text-[17px] text-[#6e6e73]">
                Sistem performansı ve metrikler
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
                  onClick={() => setPeriod(p.id as ReportPeriod)}
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

          <div className="animate-fade-in-up animate-delay-100 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0071e3]/10 text-[#0071e3]">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Kullanıcılar</h2>
                  <p className="text-[14px] text-[#6e6e73]">Kullanıcı metrikleri</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#1d1d1f]">{report.users.total}</div>
                  <div className="text-[13px] text-[#6e6e73]">Toplam</div>
                </div>
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#34c759]">+{report.users.new}</div>
                  <div className="text-[13px] text-[#6e6e73]">Yeni</div>
                </div>
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#0071e3]">{report.users.active}</div>
                  <div className="text-[13px] text-[#6e6e73]">Aktif</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#34c759]/10 text-[#34c759]">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Anı Sayfaları</h2>
                  <p className="text-[14px] text-[#6e6e73]">Sayfa metrikleri</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#1d1d1f]">{report.pages.total}</div>
                  <div className="text-[13px] text-[#6e6e73]">Toplam</div>
                </div>
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#34c759]">+{report.pages.new}</div>
                  <div className="text-[13px] text-[#6e6e73]">Yeni</div>
                </div>
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#0071e3]">{report.pages.published}</div>
                  <div className="text-[13px] text-[#6e6e73]">Yayında</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff9500]/10 text-[#ff9500]">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Siparişler</h2>
                  <p className="text-[14px] text-[#6e6e73]">Sipariş metrikleri</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#1d1d1f]">{report.orders.total}</div>
                  <div className="text-[13px] text-[#6e6e73]">Toplam</div>
                </div>
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#34c759]">{report.orders.completed}</div>
                  <div className="text-[13px] text-[#6e6e73]">Tamamlanan</div>
                </div>
                <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                  <div className="text-[28px] font-semibold text-[#ff9500]">{report.orders.pending}</div>
                  <div className="text-[13px] text-[#6e6e73]">Bekleyen</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#00c7be] p-6 text-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[21px] font-semibold">Gelir</h2>
                  <p className="text-[14px] text-white/80">Finansal metrikler</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <div className="text-[28px] font-semibold">₺{(report.revenue.total / 1000).toFixed(1)}K</div>
                  <div className="text-[13px] text-white/80">Toplam</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <div className="text-[28px] font-semibold">₺{(report.revenue.thisMonth / 1000).toFixed(1)}K</div>
                  <div className="text-[13px] text-white/80">Bu Ay</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4 text-center">
                  <div className="text-[28px] font-semibold">+{report.revenue.growth}%</div>
                  <div className="text-[13px] text-white/80">Büyüme</div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-200 mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#af52de]/10 text-[#af52de]">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[21px] font-semibold text-[#1d1d1f]">Destek</h2>
                <p className="text-[14px] text-[#6e6e73]">Destek talepleri metrikleri</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                <div className="text-[28px] font-semibold text-[#1d1d1f]">{report.support.total}</div>
                <div className="text-[13px] text-[#6e6e73]">Toplam Talep</div>
              </div>
              <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                <div className="text-[28px] font-semibold text-[#34c759]">{report.support.resolved}</div>
                <div className="text-[13px] text-[#6e6e73]">Çözülen</div>
              </div>
              <div className="rounded-xl bg-[#f5f5f7] p-4 text-center">
                <div className="text-[28px] font-semibold text-[#0071e3]">{report.support.avgResponseTime}</div>
                <div className="text-[13px] text-[#6e6e73]">Ort. Yanıt Süresi</div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-300 mt-8 flex gap-4">
            <button className="inline-flex h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-[#0071e3] text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF Olarak İndir
            </button>
            <button className="inline-flex h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Rapor Planla
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
