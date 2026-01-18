"use client";

import { useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Navbar from "@/app/components/Navbar";

export const dynamic = 'force-dynamic';

type TabType = 'overview' | 'users' | 'producers' | 'orders';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'producer' | 'admin';
  status: 'active' | 'suspended';
  createdAt: Date;
  lastLogin?: Date;
  pagesCount: number;
}

interface ProducerStats {
  id: string;
  name: string;
  email: string;
  activeOrders: number;
  completedOrders: number;
  isActive: boolean;
  lastActivity?: Date;
}

const MOCK_USERS: User[] = [
  { id: '1', email: 'ahmet@example.com', name: 'Ahmet Yılmaz', role: 'customer', status: 'active', createdAt: new Date('2024-10-15'), lastLogin: new Date('2024-12-15'), pagesCount: 2 },
  { id: '2', email: 'ayse@example.com', name: 'Ayşe Kaya', role: 'customer', status: 'active', createdAt: new Date('2024-11-01'), lastLogin: new Date('2024-12-14'), pagesCount: 1 },
  { id: '3', email: 'mehmet@example.com', name: 'Mehmet Demir', role: 'producer', status: 'active', createdAt: new Date('2024-09-01'), lastLogin: new Date('2024-12-15'), pagesCount: 0 },
  { id: '4', email: 'zeynep@example.com', name: 'Zeynep Öz', role: 'customer', status: 'suspended', createdAt: new Date('2024-08-20'), pagesCount: 1 },
];

const MOCK_PRODUCERS: ProducerStats[] = [
  { id: '1', name: 'Mehmet Demir', email: 'mehmet@example.com', activeOrders: 3, completedOrders: 45, isActive: true, lastActivity: new Date('2024-12-15') },
  { id: '2', name: 'Ali Yıldız', email: 'ali@example.com', activeOrders: 2, completedOrders: 32, isActive: true, lastActivity: new Date('2024-12-14') },
  { id: '3', name: 'Fatma Kara', email: 'fatma@example.com', activeOrders: 0, completedOrders: 28, isActive: false },
];

export default function AdminPage() {
  const { user, loading } = useRequireAuth(['admin']);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [producers] = useState<ProducerStats[]>(MOCK_PRODUCERS);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalUsers: users.length,
    totalCustomers: users.filter(u => u.role === 'customer').length,
    totalProducers: producers.length,
    activeProducers: producers.filter(p => p.isActive).length,
    totalPages: users.reduce((sum, u) => sum + u.pagesCount, 0),
    totalOrders: producers.reduce((sum, p) => sum + p.completedOrders + p.activeOrders, 0),
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleUserStatus = async (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } 
        : u
    ));
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
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          <div className="animate-fade-in-up mb-8">
            <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-[48px]">
            Admin Paneli
          </h1>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">
              Sistem yönetimi ve kullanıcı takibi
            </p>
          </div>

          <div className="animate-fade-in-up animate-delay-100 mb-8 flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { id: 'users', label: 'Kullanıcılar', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { id: 'producers', label: 'Üreticiler', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
              { id: 'orders', label: 'Siparişler', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="animate-fade-in-up animate-delay-200">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0071e3]/10 text-[#0071e3]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[28px] font-semibold text-[#1d1d1f]">{stats.totalUsers}</div>
                      <div className="text-[14px] text-[#6e6e73]">Toplam Kullanıcı</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34c759]/10 text-[#34c759]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[28px] font-semibold text-[#1d1d1f]">{stats.totalPages}</div>
                      <div className="text-[14px] text-[#6e6e73]">Anı Sayfası</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#af52de]/10 text-[#af52de]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[28px] font-semibold text-[#1d1d1f]">{stats.activeProducers}/{stats.totalProducers}</div>
                      <div className="text-[14px] text-[#6e6e73]">Aktif Üretici</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff9500]/10 text-[#ff9500]">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[28px] font-semibold text-[#1d1d1f]">{stats.totalOrders}</div>
                      <div className="text-[14px] text-[#6e6e73]">Toplam Sipariş</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <h2 className="mb-4 text-[21px] font-semibold text-[#1d1d1f]">Son Kayıtlar</h2>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center justify-between rounded-xl bg-[#f5f5f7] p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0071e3]/10 text-[15px] font-semibold text-[#0071e3]">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[15px] font-medium text-[#1d1d1f]">{u.name}</div>
                            <div className="text-[13px] text-[#6e6e73]">{u.email}</div>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'producer' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {u.role === 'admin' ? 'Admin' : u.role === 'producer' ? 'Üretici' : 'Müşteri'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <h2 className="mb-4 text-[21px] font-semibold text-[#1d1d1f]">Üretici Performansı</h2>
                  <div className="space-y-3">
                    {producers.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl bg-[#f5f5f7] p-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-semibold ${
                            p.isActive ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#6e6e73]/10 text-[#6e6e73]'
                          }`}>
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[15px] font-medium text-[#1d1d1f]">{p.name}</div>
                            <div className="text-[13px] text-[#6e6e73]">{p.activeOrders} aktif • {p.completedOrders} tamamlanan</div>
                          </div>
                        </div>
                        <span className={`h-2 w-2 rounded-full ${p.isActive ? 'bg-[#34c759]' : 'bg-[#6e6e73]'}`}></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-fade-in-up animate-delay-200">
              <div className="mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kullanıcı ara..."
                  className="h-[48px] w-full max-w-md rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                />
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5ea]">
                      <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6e6e73]">Kullanıcı</th>
                      <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6e6e73]">Rol</th>
                      <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6e6e73]">Durum</th>
                      <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6e6e73]">Sayfa</th>
                      <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#6e6e73]">Son Giriş</th>
                      <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#6e6e73]">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-[#e5e5ea] last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0071e3]/10 text-[15px] font-semibold text-[#0071e3]">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-[15px] font-medium text-[#1d1d1f]">{u.name}</div>
                              <div className="text-[13px] text-[#6e6e73]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'producer' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {u.role === 'admin' ? 'Admin' : u.role === 'producer' ? 'Üretici' : 'Müşteri'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                            u.status === 'active' ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'
                          }`}>
                            {u.status === 'active' ? 'Aktif' : 'Askıda'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[15px] text-[#1d1d1f]">{u.pagesCount}</td>
                        <td className="px-6 py-4 text-[14px] text-[#6e6e73]">
                          {u.lastLogin?.toLocaleDateString('tr-TR') || '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                              u.status === 'active'
                                ? 'bg-[#ff3b30]/10 text-[#ff3b30] hover:bg-[#ff3b30]/20'
                                : 'bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/20'
                            }`}
                          >
                            {u.status === 'active' ? 'Askıya Al' : 'Aktifleştir'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'producers' && (
            <div className="animate-fade-in-up animate-delay-200">
              <div className="mb-6 flex justify-end">
                <button className="inline-flex h-[44px] items-center gap-2 rounded-full bg-[#0071e3] px-5 text-[15px] font-normal text-white transition-all hover:bg-[#0077ed]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yeni Üretici Ekle
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {producers.map((p) => (
                  <div key={p.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full text-[21px] font-semibold ${
                          p.isActive ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#6e6e73]/10 text-[#6e6e73]'
                        }`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{p.name}</h3>
                          <p className="text-[14px] text-[#6e6e73]">{p.email}</p>
                        </div>
                      </div>
                      <span className={`h-3 w-3 rounded-full ${p.isActive ? 'bg-[#34c759]' : 'bg-[#6e6e73]'}`}></span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-[#f5f5f7] p-3 text-center">
                        <div className="text-[24px] font-semibold text-[#0071e3]">{p.activeOrders}</div>
                        <div className="text-[13px] text-[#6e6e73]">Aktif Sipariş</div>
                      </div>
                      <div className="rounded-xl bg-[#f5f5f7] p-3 text-center">
                        <div className="text-[24px] font-semibold text-[#34c759]">{p.completedOrders}</div>
                        <div className="text-[13px] text-[#6e6e73]">Tamamlanan</div>
                      </div>
            </div>

                    {p.lastActivity && (
                      <p className="mt-4 text-[13px] text-[#6e6e73]">
                        Son aktivite: {p.lastActivity.toLocaleDateString('tr-TR')}
              </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-fade-in-up animate-delay-200">
              <Link
                href="/producer"
                className="inline-flex h-[44px] items-center gap-2 rounded-full bg-[#0071e3] px-5 text-[15px] font-normal text-white transition-all hover:bg-[#0077ed]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Üretici Paneline Git
              </Link>
              <p className="mt-4 text-[15px] text-[#6e6e73]">
                Sipariş yönetimi için üretici panelini kullanabilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
