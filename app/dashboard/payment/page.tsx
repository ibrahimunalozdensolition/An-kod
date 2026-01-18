"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Navbar from "@/app/components/Navbar";
import { PaymentType, PaymentItem, PAYMENT_ITEMS } from "@/lib/types/payment";

type PaymentStep = 'select' | 'checkout' | 'processing' | 'success';

const icons: Record<string, React.ReactNode> = {
  page: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  photos: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  qr: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useRequireAuth();
  
  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const type = searchParams.get('type') as PaymentType;
    if (type) {
      const item = PAYMENT_ITEMS.find(i => i.id === type);
      if (item) {
        setSelectedItem(item);
        setStep('checkout');
      }
    }
  }, [searchParams]);

  const handleSelectItem = (item: PaymentItem) => {
    setSelectedItem(item);
    setStep('checkout');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('success');
  };

  const handleSuccessContinue = () => {
    if (selectedItem?.id === 'new_page') {
      router.push('/dashboard/create');
    } else {
      router.push('/dashboard');
    }
  };

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

  if (!user) return null;

  if (step === 'processing') {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd] pt-[48px]">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 animate-spin rounded-full border-4 border-[#e5e5ea] border-t-[#0071e3]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-8 w-8 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-[24px] font-semibold text-[#1d1d1f]">Ödeme İşleniyor</h2>
              <p className="mt-2 text-[17px] text-[#6e6e73]">Lütfen bekleyin...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (step === 'success') {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd] pt-[48px]">
          <div className="mx-auto max-w-lg px-6 text-center">
            <div className="animate-fade-in-up">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#34c759]">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="mt-8 text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f]">
                Ödeme Başarılı!
              </h1>
              <p className="mt-4 text-[21px] leading-[1.38] text-[#6e6e73]">
                {selectedItem?.name} satın alındı
              </p>

              <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4">
                  <span className="text-[17px] text-[#6e6e73]">Ürün</span>
                  <span className="text-[17px] font-semibold text-[#1d1d1f]">{selectedItem?.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#e5e5ea] py-4">
                  <span className="text-[17px] text-[#6e6e73]">Tutar</span>
                  <span className="text-[17px] font-semibold text-[#1d1d1f]">₺{selectedItem?.price}</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-[17px] text-[#6e6e73]">Durum</span>
                  <span className="inline-flex items-center gap-2 text-[17px] font-semibold text-[#34c759]">
                    <span className="h-2 w-2 rounded-full bg-[#34c759]"></span>
                    Onaylandı
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleSuccessContinue}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full bg-[#0071e3] text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
                >
                  {selectedItem?.id === 'new_page' ? 'Anı Sayfası Oluştur' : 'Panele Dön'}
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-full border border-[#d2d2d7] text-[17px] font-normal text-[#1d1d1f] transition-all hover:border-[#86868b]"
                >
                  Panele Git
                </button>
              </div>
            </div>
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
          
          {step === 'select' && (
            <div className="animate-fade-in-up">
              <div className="mb-12 text-center">
                <h1 className="text-[48px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f]">
                  Fiyatlandırma
                </h1>
                <p className="mt-4 text-[21px] leading-[1.38] text-[#6e6e73]">
                  İhtiyacınıza uygun paketi seçin
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {PAYMENT_ITEMS.map((item, index) => (
                  <div
                    key={item.id}
                    className={`animate-fade-in-up relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 transition-all hover:shadow-lg ${
                      item.popular ? 'ring-[#0071e3] ring-2' : 'ring-black/5'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.popular && (
                      <div className="absolute right-4 top-4 rounded-full bg-[#0071e3] px-3 py-1 text-[12px] font-semibold text-white">
                        Popüler
                      </div>
                    )}

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f7] text-[#1d1d1f]">
                      {icons[item.icon]}
                    </div>

                    <h2 className="mt-6 text-[24px] font-semibold text-[#1d1d1f]">{item.name}</h2>
                    <p className="mt-2 text-[15px] text-[#6e6e73]">{item.description}</p>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-[48px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                        ₺{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[17px] text-[#6e6e73] line-through">₺{item.originalPrice}</span>
                      )}
                    </div>

                    <ul className="mt-8 space-y-3">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] text-[#1d1d1f]">
                          <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#34c759]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectItem(item)}
                      className={`mt-8 inline-flex h-[52px] w-full items-center justify-center rounded-full text-[17px] font-normal transition-all ${
                        item.popular
                          ? 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
                          : 'border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#86868b]'
                      }`}
                    >
                      Satın Al
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'checkout' && selectedItem && (
            <div className="animate-fade-in-up mx-auto max-w-2xl">
              <button
                onClick={() => setStep('select')}
                className="mb-8 inline-flex items-center gap-2 text-[17px] text-[#0071e3] transition-colors hover:text-[#0077ed]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Geri
              </button>

              <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f]">
                Ödeme
              </h1>

              <div className="mt-8 grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h2 className="text-[19px] font-semibold text-[#1d1d1f]">Kart Bilgileri</h2>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="mb-2 block text-[15px] font-medium text-[#1d1d1f]">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="h-[52px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[15px] font-medium text-[#1d1d1f]">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder="AD SOYAD"
                          className="h-[52px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-[15px] font-medium text-[#1d1d1f]">
                            Son Kullanma
                          </label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="AA/YY"
                            maxLength={5}
                            className="h-[52px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[15px] font-medium text-[#1d1d1f]">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            maxLength={4}
                            className="h-[52px] w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[17px] text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f5f5f7] p-4">
                      <svg className="h-5 w-5 text-[#34c759]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[14px] text-[#6e6e73]">
                        256-bit SSL ile güvenli ödeme
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="sticky top-[80px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h2 className="text-[19px] font-semibold text-[#1d1d1f]">Sipariş Özeti</h2>

                    <div className="mt-6 flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f5f7] text-[#1d1d1f]">
                        {icons[selectedItem.icon]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{selectedItem.name}</h3>
                        <p className="text-[14px] text-[#6e6e73]">{selectedItem.description}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-[#e5e5ea] pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] text-[#6e6e73]">Ara Toplam</span>
                        <span className="text-[15px] text-[#1d1d1f]">₺{selectedItem.price}</span>
                      </div>
                      {selectedItem.originalPrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] text-[#34c759]">İndirim</span>
                          <span className="text-[15px] text-[#34c759]">-₺{selectedItem.originalPrice - selectedItem.price}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#e5e5ea] pt-4">
                      <span className="text-[17px] font-semibold text-[#1d1d1f]">Toplam</span>
                      <span className="text-[24px] font-semibold text-[#1d1d1f]">₺{selectedItem.price}</span>
                    </div>

                    <button
                      onClick={handlePayment}
                      className="mt-6 inline-flex h-[56px] w-full items-center justify-center rounded-full bg-[#0071e3] text-[17px] font-normal text-white transition-all hover:bg-[#0077ed]"
                    >
                      Ödemeyi Tamamla
                    </button>

                    <p className="mt-4 text-center text-[12px] text-[#6e6e73]">
                      Ödeme yaparak kullanım koşullarını kabul etmiş olursunuz
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d2d2d7] border-t-[#0071e3]"></div>
          <div className="text-[17px] text-[#6e6e73]">Yükleniyor...</div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
