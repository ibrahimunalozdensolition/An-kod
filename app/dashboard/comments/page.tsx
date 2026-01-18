"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { Comment, CommentStatus } from "@/lib/types/comment";

export const dynamic = 'force-dynamic';

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    memoryPageId: '1',
    name: 'Ahmet Yılmaz',
    message: 'Çok güzel bir anı sayfası olmuş. Pamuk\'u hep hatırlayacağız.',
    status: 'pending',
    createdAt: new Date('2024-12-15T10:30:00'),
  },
  {
    id: '2',
    memoryPageId: '1',
    name: 'Ayşe Kaya',
    message: 'Başınız sağ olsun. Pamuk gerçekten çok tatlı bir dostmuş.',
    status: 'approved',
    createdAt: new Date('2024-12-14T15:20:00'),
    approvedAt: new Date('2024-12-14T16:00:00'),
  },
  {
    id: '3',
    memoryPageId: '1',
    name: 'Mehmet Demir',
    message: 'Mekanı cennet olsun güzel dost.',
    status: 'approved',
    createdAt: new Date('2024-12-13T09:00:00'),
    approvedAt: new Date('2024-12-13T10:30:00'),
  },
];

export default function CommentsPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [filter, setFilter] = useState<CommentStatus | 'all'>('all');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredComments = filter === 'all' 
    ? comments 
    : comments.filter(c => c.status === filter);

  const pendingCount = comments.filter(c => c.status === 'pending').length;

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'approved' as CommentStatus, approvedAt: new Date() } : c
    ));
    setIsProcessing(false);
    setSelectedComment(null);
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'rejected' as CommentStatus, rejectedAt: new Date() } : c
    ));
    setIsProcessing(false);
    setSelectedComment(null);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setComments(prev => prev.filter(c => c.id !== id));
    setIsProcessing(false);
    setSelectedComment(null);
  };

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
                Yorumlar
              </h1>
              <p className="mt-2 text-[17px] text-[#6e6e73]">
                Anı sayfalarınıza gelen yorumları yönetin
              </p>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-[#ff9500]/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#ff9500]"></span>
                <span className="text-[15px] font-medium text-[#ff9500]">{pendingCount} onay bekliyor</span>
              </div>
            )}
          </div>

          <div className="animate-fade-in-up animate-delay-100 mb-6 flex gap-2 overflow-x-auto pb-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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
                {status === 'pending' && 'Bekleyen'}
                {status === 'approved' && 'Onaylanan'}
                {status === 'rejected' && 'Reddedilen'}
                {status !== 'all' && (
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[12px]">
                    {comments.filter(c => c.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="animate-fade-in-up animate-delay-200 space-y-4">
            {filteredComments.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-black/5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f7]">
                  <svg className="h-8 w-8 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-[19px] font-semibold text-[#1d1d1f]">Yorum bulunamadı</h3>
                <p className="mt-2 text-[15px] text-[#6e6e73]">Bu kategoride henüz yorum yok</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0071e3]/10 text-[17px] font-semibold text-[#0071e3]">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{comment.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            comment.status === 'pending' ? 'bg-[#ff9500]/10 text-[#ff9500]' :
                            comment.status === 'approved' ? 'bg-[#34c759]/10 text-[#34c759]' :
                            'bg-[#ff3b30]/10 text-[#ff3b30]'
                          }`}>
                            {comment.status === 'pending' ? 'Bekliyor' :
                             comment.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#6e6e73]">
                          {comment.createdAt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="mt-3 text-[15px] leading-[1.47] text-[#1d1d1f]">{comment.message}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34c759]/10 text-[#34c759] transition-colors hover:bg-[#34c759]/20"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(comment.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff3b30]/10 text-[#ff3b30] transition-colors hover:bg-[#ff3b30]/20"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedComment(comment)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] transition-colors hover:bg-[#e5e5ea]"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedComment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedComment(null)}
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
                Yorumu Sil
              </h2>
              <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
                Bu yorum kalıcı olarak silinecek. Bu işlem geri alınamaz.
              </p>

              <div className="mt-8 w-full space-y-3">
                <button
                  onClick={() => handleDelete(selectedComment.id)}
                  disabled={isProcessing}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full bg-[#ff3b30] text-[17px] font-normal text-white transition-all hover:bg-[#ff453a] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : (
                    'Sil'
                  )}
                </button>
                <button
                  onClick={() => setSelectedComment(null)}
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
