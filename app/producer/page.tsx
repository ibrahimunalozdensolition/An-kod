"use client";

import { useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Navbar from "@/app/components/Navbar";
import { Order, OrderStatus, QROrderStatus, ORDER_STATUS_LABELS, QR_ORDER_STATUS_LABELS } from "@/lib/types/producer";

export const dynamic = 'force-dynamic';

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet@example.com',
    customerPhone: '0532 123 4567',
    memoryPageId: '1',
    memoryPageName: 'Pamuk',
    type: 'new_page',
    status: 'pending',
    notes: '',
    address: 'Atatürk Cad. No:123, Kadıköy/İstanbul',
    createdAt: new Date('2024-12-15T10:30:00'),
    updatedAt: new Date('2024-12-15T10:30:00'),
  },
  {
    id: '2',
    customerId: 'c2',
    customerName: 'Ayşe Kaya',
    customerEmail: 'ayse@example.com',
    customerPhone: '0533 234 5678',
    memoryPageId: '2',
    memoryPageName: 'Minnoş',
    type: 'new_page',
    status: 'in_production',
    notes: 'Özel tasarım istendi',
    address: 'İstiklal Cad. No:45, Beyoğlu/İstanbul',
    createdAt: new Date('2024-12-14T15:20:00'),
    updatedAt: new Date('2024-12-15T09:00:00'),
  },
  {
    id: '3',
    customerId: 'c3',
    customerName: 'Mehmet Demir',
    customerEmail: 'mehmet@example.com',
    customerPhone: '0534 345 6789',
    memoryPageId: '1',
    memoryPageName: 'Pamuk',
    type: 'new_qr',
    status: 'in_production',
    notes: 'Ek QR kod talebi',
    address: 'Bağdat Cad. No:78, Kadıköy/İstanbul',
    createdAt: new Date('2024-12-13T09:00:00'),
    updatedAt: new Date('2024-12-14T11:00:00'),
  },
];

const ORDER_STEPS: OrderStatus[] = ['pending', 'in_production', 'quality_check', 'packaging', 'shipped', 'delivered'];
const QR_ORDER_STEPS: QROrderStatus[] = ['pending', 'in_production', 'shipped', 'delivered'];

export default function ProducerPage() {
  const { user, loading } = useRequireAuth(['producer', 'admin']);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<'all' | 'new_page' | 'new_qr'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.type === filter);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const inProductionCount = orders.filter(o => o.status === 'in_production').length;

  const getNextStatus = (order: Order): OrderStatus | QROrderStatus | null => {
    const steps = order.type === 'new_qr' ? QR_ORDER_STEPS : ORDER_STEPS;
    const currentIndex = steps.indexOf(order.status as any);
    if (currentIndex < steps.length - 1) {
      return steps[currentIndex + 1];
    }
    return null;
  };

  const handleAdvanceStatus = async (orderId: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const nextStatus = getNextStatus(order);
        if (nextStatus) {
          return { 
            ...order, 
            status: nextStatus, 
            updatedAt: new Date(),
            completedAt: nextStatus === 'delivered' ? new Date() : undefined
          };
        }
      }
      return order;
    }));
    
    setIsProcessing(false);
  };

  const getStatusColor = (status: OrderStatus | QROrderStatus): string => {
    switch (status) {
      case 'pending': return 'bg-[#ff9500]/10 text-[#ff9500]';
      case 'in_production': return 'bg-[#0071e3]/10 text-[#0071e3]';
      case 'quality_check': return 'bg-[#af52de]/10 text-[#af52de]';
      case 'packaging': return 'bg-[#5856d6]/10 text-[#5856d6]';
      case 'shipped': return 'bg-[#34c759]/10 text-[#34c759]';
      case 'delivered': return 'bg-[#34c759]/10 text-[#34c759]';
      default: return 'bg-[#6e6e73]/10 text-[#6e6e73]';
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
            Üretici Paneli
          </h1>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">
            Üretim emirleri ve sipariş takibi
          </p>
          </div>

          <div className="animate-fade-in-up animate-delay-100 mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff9500]/10 text-[#ff9500]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[28px] font-semibold text-[#1d1d1f]">{pendingCount}</div>
                  <div className="text-[14px] text-[#6e6e73]">Bekleyen</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0071e3]/10 text-[#0071e3]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[28px] font-semibold text-[#1d1d1f]">{inProductionCount}</div>
                  <div className="text-[14px] text-[#6e6e73]">Üretimde</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34c759]/10 text-[#34c759]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[28px] font-semibold text-[#1d1d1f]">{orders.filter(o => o.status === 'delivered').length}</div>
                  <div className="text-[14px] text-[#6e6e73]">Tamamlanan</div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-200 mb-6 flex gap-2">
            {(['all', 'new_page', 'new_qr'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-all ${
                  filter === type
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]'
                }`}
              >
                {type === 'all' && 'Tümü'}
                {type === 'new_page' && 'Anı Sayfası'}
                {type === 'new_qr' && 'QR Talebi'}
              </button>
            ))}
          </div>

          <div className="animate-fade-in-up animate-delay-300 space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[19px] font-semibold text-[#1d1d1f]">
                        #{order.id} - {order.memoryPageName}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${getStatusColor(order.status)}`}>
                        {order.type === 'new_qr' 
                          ? QR_ORDER_STATUS_LABELS[order.status as QROrderStatus]
                          : ORDER_STATUS_LABELS[order.status as OrderStatus]}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                        order.type === 'new_page' ? 'bg-[#af52de]/10 text-[#af52de]' : 'bg-[#5856d6]/10 text-[#5856d6]'
                      }`}>
                        {order.type === 'new_page' ? 'Anı Sayfası' : 'QR Talebi'}
                      </span>
                    </div>
                    <div className="mt-2 text-[15px] text-[#6e6e73]">
                      <span className="font-medium text-[#1d1d1f]">{order.customerName}</span>
                      {' • '}{order.customerPhone}
                    </div>
                    <div className="mt-1 text-[14px] text-[#6e6e73]">{order.address}</div>
                    {order.notes && (
                      <div className="mt-2 rounded-lg bg-[#f5f5f7] px-3 py-2 text-[14px] text-[#6e6e73]">
                        <span className="font-medium">Not:</span> {order.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-[13px] text-[#6e6e73]">
                      {order.createdAt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleAdvanceStatus(order.id)}
                        disabled={isProcessing}
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 text-[15px] font-normal text-white transition-all hover:bg-[#0077ed] disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        ) : (
                          <>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Sonraki Aşama
                          </>
                        )}
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <span className="inline-flex items-center gap-2 text-[15px] text-[#34c759]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Tamamlandı
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    {(order.type === 'new_qr' ? QR_ORDER_STEPS : ORDER_STEPS).map((step, index, arr) => {
                      const steps = order.type === 'new_qr' ? QR_ORDER_STEPS : ORDER_STEPS;
                      const currentIndex = steps.indexOf(order.status as any);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div key={step} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium transition-all ${
                              isCompleted 
                                ? 'bg-[#34c759] text-white' 
                                : isCurrent 
                                  ? 'bg-[#0071e3] text-white'
                                  : 'bg-[#e5e5ea] text-[#6e6e73]'
                            }`}>
                              {isCompleted && index < currentIndex ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                index + 1
                              )}
                            </div>
                            <span className={`mt-2 text-[11px] ${isCurrent ? 'font-medium text-[#1d1d1f]' : 'text-[#6e6e73]'}`}>
                              {order.type === 'new_qr' 
                                ? QR_ORDER_STATUS_LABELS[step as QROrderStatus]
                                : ORDER_STATUS_LABELS[step as OrderStatus]}
                            </span>
                          </div>
                          {index < arr.length - 1 && (
                            <div className={`mx-2 h-[2px] flex-1 ${
                              index < currentIndex ? 'bg-[#34c759]' : 'bg-[#e5e5ea]'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
