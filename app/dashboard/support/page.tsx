"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { Ticket, TicketStatus, TicketCategory, TicketPriority, TICKET_CATEGORY_LABELS, TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/types/support";

export const dynamic = 'force-dynamic';

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Ahmet Yılmaz',
    userEmail: 'ahmet@example.com',
    category: 'technical',
    priority: 'medium',
    subject: 'QR kod okutulmuyor',
    message: 'Merhaba, QR kodum okutulduğunda sayfa açılmıyor. Yardımcı olabilir misiniz?',
    status: 'open',
    responses: [],
    createdAt: new Date('2024-12-15T10:30:00'),
    updatedAt: new Date('2024-12-15T10:30:00'),
  },
  {
    id: '2',
    userId: 'u1',
    userName: 'Ahmet Yılmaz',
    userEmail: 'ahmet@example.com',
    category: 'payment',
    priority: 'high',
    subject: 'Ödeme iadesi',
    message: 'Yanlışlıkla iki kez ödeme yaptım. İade alabilir miyim?',
    status: 'in_progress',
    responses: [
      {
        id: 'r1',
        ticketId: '2',
        userId: 'admin1',
        userName: 'Destek Ekibi',
        isAdmin: true,
        message: 'Merhaba, ödemenizi inceliyoruz. En kısa sürede size dönüş yapacağız.',
        createdAt: new Date('2024-12-14T16:00:00'),
      }
    ],
    createdAt: new Date('2024-12-14T15:20:00'),
    updatedAt: new Date('2024-12-14T16:00:00'),
  },
  {
    id: '3',
    userId: 'u1',
    userName: 'Ahmet Yılmaz',
    userEmail: 'ahmet@example.com',
    category: 'general',
    priority: 'low',
    subject: 'Teşekkür',
    message: 'Harika bir hizmet veriyorsunuz, teşekkürler!',
    status: 'resolved',
    responses: [],
    createdAt: new Date('2024-12-10T09:00:00'),
    updatedAt: new Date('2024-12-10T10:30:00'),
    resolvedAt: new Date('2024-12-10T10:30:00'),
  },
];

export default function SupportPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    category: 'general' as TicketCategory,
    priority: 'medium' as TicketPriority,
    subject: '',
    message: '',
  });
  const [newResponse, setNewResponse] = useState('');

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;

    const ticket: Ticket = {
      id: String(tickets.length + 1),
      userId: user?.uid || '',
      userName: user?.email?.split('@')[0] || 'Kullanıcı',
      userEmail: user?.email || '',
      category: newTicket.category,
      priority: newTicket.priority,
      subject: newTicket.subject,
      message: newTicket.message,
      status: 'open',
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ category: 'general', priority: 'medium', subject: '', message: '' });
    setShowNewTicket(false);
  };

  const handleSendResponse = () => {
    if (!selectedTicket || !newResponse.trim()) return;

    const response = {
      id: `r${Date.now()}`,
      ticketId: selectedTicket.id,
      userId: user?.uid || '',
      userName: user?.email?.split('@')[0] || 'Kullanıcı',
      isAdmin: false,
      message: newResponse,
      createdAt: new Date(),
    };

    setTickets(prev => prev.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, responses: [...t.responses, response], updatedAt: new Date() }
        : t
    ));
    setSelectedTicket(prev => prev ? { ...prev, responses: [...prev.responses, response] } : null);
    setNewResponse('');
  };

  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case 'open': return 'bg-[#ff9500]/10 text-[#ff9500]';
      case 'in_progress': return 'bg-[#0071e3]/10 text-[#0071e3]';
      case 'resolved': return 'bg-[#34c759]/10 text-[#34c759]';
      case 'closed': return 'bg-[#6e6e73]/10 text-[#6e6e73]';
    }
  };

  const getPriorityColor = (priority: TicketPriority): string => {
    switch (priority) {
      case 'low': return 'bg-[#6e6e73]/10 text-[#6e6e73]';
      case 'medium': return 'bg-[#ff9500]/10 text-[#ff9500]';
      case 'high': return 'bg-[#ff3b30]/10 text-[#ff3b30]';
      case 'urgent': return 'bg-[#ff3b30] text-white';
    }
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
                Destek
              </h1>
              <p className="mt-2 text-[17px] text-[#6e6e73]">
                Sorularınız için bizimle iletişime geçin
              </p>
            </div>
            <button
              onClick={() => setShowNewTicket(true)}
              className="inline-flex h-[48px] items-center gap-2 rounded-full bg-[#0071e3] px-6 text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Talep
            </button>
          </div>

          <div className="animate-fade-in-up animate-delay-100 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="border-b border-[#e5e5ea] p-4">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Taleplerim</h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {tickets.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-[15px] text-[#6e6e73]">Henüz talep oluşturmadınız</p>
                    </div>
                  ) : (
                    tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`w-full border-b border-[#e5e5ea] p-4 text-left transition-colors hover:bg-[#f5f5f7] last:border-0 ${
                          selectedTicket?.id === ticket.id ? 'bg-[#f5f5f7]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[15px] font-medium text-[#1d1d1f] line-clamp-1">{ticket.subject}</h3>
                          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${getStatusColor(ticket.status)}`}>
                            {TICKET_STATUS_LABELS[ticket.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-[#6e6e73] line-clamp-2">{ticket.message}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getPriorityColor(ticket.priority)}`}>
                            {TICKET_PRIORITY_LABELS[ticket.priority]}
                          </span>
                          <span className="text-[11px] text-[#6e6e73]">
                            {ticket.createdAt.toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                  <div className="border-b border-[#e5e5ea] p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-[21px] font-semibold text-[#1d1d1f]">{selectedTicket.subject}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${getStatusColor(selectedTicket.status)}`}>
                            {TICKET_STATUS_LABELS[selectedTicket.status]}
                          </span>
                          <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-medium text-[#6e6e73]">
                            {TICKET_CATEGORY_LABELS[selectedTicket.category]}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                            {TICKET_PRIORITY_LABELS[selectedTicket.priority]}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTicket(null)}
                        className="rounded-full p-2 text-[#6e6e73] transition-colors hover:bg-[#f5f5f7]"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto p-6">
                    <div className="space-y-4">
                      <div className="rounded-xl bg-[#f5f5f7] p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0071e3]/10 text-[13px] font-semibold text-[#0071e3]">
                            {selectedTicket.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-[14px] font-medium text-[#1d1d1f]">{selectedTicket.userName}</span>
                            <span className="ml-2 text-[12px] text-[#6e6e73]">
                              {selectedTicket.createdAt.toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-[15px] leading-[1.47] text-[#1d1d1f]">{selectedTicket.message}</p>
                      </div>

                      {selectedTicket.responses.map((response) => (
                        <div 
                          key={response.id} 
                          className={`rounded-xl p-4 ${response.isAdmin ? 'bg-[#0071e3]/5 ml-4' : 'bg-[#f5f5f7] mr-4'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${
                              response.isAdmin ? 'bg-[#0071e3] text-white' : 'bg-[#0071e3]/10 text-[#0071e3]'
                            }`}>
                              {response.isAdmin ? 'D' : response.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-[14px] font-medium text-[#1d1d1f]">
                                {response.isAdmin ? 'Destek Ekibi' : response.userName}
                              </span>
                              <span className="ml-2 text-[12px] text-[#6e6e73]">
                                {response.createdAt.toLocaleString('tr-TR')}
                              </span>
                            </div>
                          </div>
                          <p className="mt-3 text-[15px] leading-[1.47] text-[#1d1d1f]">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                    <div className="border-t border-[#e5e5ea] p-6">
                      <div className="flex gap-3">
                        <textarea
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          placeholder="Yanıtınızı yazın..."
                          rows={3}
                          className="flex-1 rounded-xl border border-[#d2d2d7] p-4 text-[15px] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 resize-none"
                        />
                        <button
                          onClick={handleSendResponse}
                          disabled={!newResponse.trim()}
                          className="self-end inline-flex h-[44px] items-center justify-center rounded-full bg-[#0071e3] px-5 text-[15px] font-normal text-white transition-all hover:bg-[#0077ed] disabled:opacity-50"
                        >
                          Gönder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[500px] items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f7]">
                      <svg className="h-8 w-8 text-[#6e6e73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-[19px] font-semibold text-[#1d1d1f]">Talep Seçin</h3>
                    <p className="mt-2 text-[15px] text-[#6e6e73]">Detayları görüntülemek için sol taraftan bir talep seçin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNewTicket && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowNewTicket(false)}
        >
          <div 
            className="animate-fade-in-up w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-[#1d1d1f]">
              Yeni Destek Talebi
            </h2>
            <p className="mt-2 text-[17px] text-[#6e6e73]">
              Sorununuzu detaylı bir şekilde açıklayın
            </p>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">Kategori</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as TicketCategory }))}
                    className="h-[48px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[15px] transition-all focus:border-[#0071e3] focus:outline-none"
                  >
                    {Object.entries(TICKET_CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">Öncelik</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as TicketPriority }))}
                    className="h-[48px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[15px] transition-all focus:border-[#0071e3] focus:outline-none"
                  >
                    {Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">Konu</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Sorununuzun kısa bir özeti"
                  className="h-[48px] w-full rounded-xl border border-[#d2d2d7] px-4 text-[15px] transition-all focus:border-[#0071e3] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">Mesaj</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Sorununuzu detaylı olarak açıklayın..."
                  rows={4}
                  className="w-full rounded-xl border border-[#d2d2d7] p-4 text-[15px] transition-all focus:border-[#0071e3] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowNewTicket(false)}
                className="flex-1 h-[56px] rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]"
              >
                İptal
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={!newTicket.subject.trim() || !newTicket.message.trim()}
                className="flex-1 h-[56px] rounded-full bg-[#0071e3] text-[17px] font-normal text-white transition-all hover:bg-[#0077ed] disabled:opacity-50"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
