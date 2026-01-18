"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export const dynamic = 'force-dynamic';

type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
type ReportType = 'spam' | 'inappropriate' | 'copyright' | 'other';

interface Report {
  id: string;
  type: ReportType;
  targetType: 'page' | 'comment';
  targetId: string;
  targetName: string;
  reporterEmail: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  actionTaken?: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    type: 'inappropriate',
    targetType: 'comment',
    targetId: 'c1',
    targetName: 'Yorum #c1',
    reporterEmail: 'reporter1@example.com',
    reason: 'Uygunsuz içerik içeriyor',
    status: 'pending',
    createdAt: new Date('2024-12-15T10:30:00'),
  },
  {
    id: '2',
    type: 'spam',
    targetType: 'comment',
    targetId: 'c2',
    targetName: 'Yorum #c2',
    reporterEmail: 'reporter2@example.com',
    reason: 'Spam yorum',
    status: 'pending',
    createdAt: new Date('2024-12-14T15:20:00'),
  },
  {
    id: '3',
    type: 'copyright',
    targetType: 'page',
    targetId: 'p1',
    targetName: 'Pamuk',
    reporterEmail: 'reporter3@example.com',
    reason: 'Telif hakkı ihlali',
    status: 'reviewed',
    createdAt: new Date('2024-12-13T09:00:00'),
    reviewedAt: new Date('2024-12-13T14:00:00'),
    reviewedBy: 'Admin',
    actionTaken: 'İçerik kaldırıldı',
  },
];

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  spam: 'Spam',
  inappropriate: 'Uygunsuz İçerik',
  copyright: 'Telif Hakkı',
  other: 'Diğer',
};

const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Beklemede',
  reviewed: 'İncelendi',
  action_taken: 'İşlem Yapıldı',
  dismissed: 'Reddedildi',
};

export default function ModerationPage() {
  const { user, loading } = useRequireAuth(['admin']);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [filter, setFilter] = useState<ReportStatus | 'all'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionNote, setActionNote] = useState('');

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const handleTakeAction = (reportId: string, action: 'action_taken' | 'dismissed') => {
    setReports(prev => prev.map(r => 
      r.id === reportId 
        ? { 
            ...r, 
            status: action, 
            reviewedAt: new Date(), 
            reviewedBy: 'Admin',
            actionTaken: action === 'action_taken' ? actionNote : 'Rapor reddedildi'
          } 
        : r
    ));
    setSelectedReport(null);
    setActionNote('');
  };

  const getStatusColor = (status: ReportStatus): string => {
    switch (status) {
      case 'pending': return 'bg-[#ff9500]/10 text-[#ff9500]';
      case 'reviewed': return 'bg-[#0071e3]/10 text-[#0071e3]';
      case 'action_taken': return 'bg-[#34c759]/10 text-[#34c759]';
      case 'dismissed': return 'bg-[#6e6e73]/10 text-[#6e6e73]';
    }
  };

  const getTypeColor = (type: ReportType): string => {
    switch (type) {
      case 'spam': return 'bg-[#ff9500]/10 text-[#ff9500]';
      case 'inappropriate': return 'bg-[#ff3b30]/10 text-[#ff3b30]';
      case 'copyright': return 'bg-[#af52de]/10 text-[#af52de]';
      case 'other': return 'bg-[#6e6e73]/10 text-[#6e6e73]';
    }
  };

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
                Moderasyon
              </h1>
              <p className="mt-2 text-[17px] text-[#6e6e73]">
                İçerik raporlarını inceleyin ve yönetin
              </p>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-[#ff3b30]/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#ff3b30]"></span>
                <span className="text-[15px] font-medium text-[#ff3b30]">{pendingCount} bekleyen rapor</span>
              </div>
            )}
          </div>

          <div className="animate-fade-in-up animate-delay-100 mb-6 flex gap-2 overflow-x-auto pb-2">
            {(['all', 'pending', 'reviewed', 'action_taken', 'dismissed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-[15px] font-medium transition-all ${
                  filter === status
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]'
                }`}
              >
                {status === 'all' && 'Tümü'}
                {status !== 'all' && REPORT_STATUS_LABELS[status]}
              </button>
            ))}
          </div>

          <div className="animate-fade-in-up animate-delay-200 space-y-4">
            {filteredReports.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-black/5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f7]">
                  <svg className="h-8 w-8 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-[19px] font-semibold text-[#1d1d1f]">Rapor bulunamadı</h3>
                <p className="mt-2 text-[15px] text-[#6e6e73]">Bu kategoride henüz rapor yok</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                          {report.targetName}
                        </h3>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getTypeColor(report.type)}`}>
                          {REPORT_TYPE_LABELS[report.type]}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getStatusColor(report.status)}`}>
                          {REPORT_STATUS_LABELS[report.status]}
                        </span>
                        <span className="rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[11px] font-medium text-[#6e6e73]">
                          {report.targetType === 'page' ? 'Sayfa' : 'Yorum'}
                        </span>
                      </div>
                      <p className="mt-2 text-[15px] text-[#6e6e73]">{report.reason}</p>
                      <p className="mt-1 text-[13px] text-[#86868b]">
                        Raporlayan: {report.reporterEmail} • {report.createdAt.toLocaleDateString('tr-TR')}
                      </p>
                      {report.actionTaken && (
                        <div className="mt-3 rounded-lg bg-[#f5f5f7] px-3 py-2 text-[14px] text-[#6e6e73]">
                          <span className="font-medium">İşlem:</span> {report.actionTaken}
                        </div>
                      )}
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#0071e3] px-5 text-[14px] font-normal text-white transition-all hover:bg-[#0077ed]"
                        >
                          İncele
                        </button>
                        <button
                          onClick={() => handleTakeAction(report.id, 'dismissed')}
                          className="inline-flex h-[40px] items-center justify-center rounded-full border border-[#d2d2d7] px-5 text-[14px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]"
                        >
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedReport && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div 
            className="animate-fade-in-up w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
              Rapor İnceleme
            </h2>
            
            <div className="mt-4 rounded-xl bg-[#f5f5f7] p-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getTypeColor(selectedReport.type)}`}>
                  {REPORT_TYPE_LABELS[selectedReport.type]}
                </span>
                <span className="text-[14px] font-medium text-[#1d1d1f]">{selectedReport.targetName}</span>
              </div>
              <p className="mt-2 text-[15px] text-[#6e6e73]">{selectedReport.reason}</p>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">İşlem Notu</label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Yapılan işlemi açıklayın..."
                rows={3}
                className="w-full rounded-xl border border-[#d2d2d7] p-4 text-[15px] transition-all focus:border-[#0071e3] focus:outline-none resize-none"
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 h-[56px] rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]"
              >
                İptal
              </button>
              <button
                onClick={() => handleTakeAction(selectedReport.id, 'action_taken')}
                disabled={!actionNote.trim()}
                className="flex-1 h-[56px] rounded-full bg-[#ff3b30] text-[17px] font-normal text-white transition-all hover:bg-[#ff453a] disabled:opacity-50"
              >
                İşlem Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
