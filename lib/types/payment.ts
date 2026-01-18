export type PaymentType = 'new_page' | 'extra_photos' | 'new_qr';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PaymentItem {
  id: PaymentType;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  icon: string;
  popular?: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  memoryPageId?: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
  completedAt?: Date;
}

export const PAYMENT_ITEMS: PaymentItem[] = [
  {
    id: 'new_page',
    name: 'Anı Sayfası',
    description: 'Yeni bir anı sayfası oluşturun',
    price: 299,
    originalPrice: 399,
    features: [
      '8 fotoğraf kapasitesi',
      '1 video (50 MB)',
      'Özelleştirilebilir tasarım',
      'QR kod ile erişim',
      'Sınırsız ziyaretçi',
      'Ömür boyu yayında',
    ],
    icon: 'page',
    popular: true,
  },
  {
    id: 'extra_photos',
    name: 'Ek Fotoğraf Hakkı',
    description: '+8 fotoğraf kapasitesi',
    price: 99,
    features: [
      '8 ek fotoğraf',
      'Mevcut sayfanıza eklenir',
      'Anında aktif',
    ],
    icon: 'photos',
  },
  {
    id: 'new_qr',
    name: 'QR Plaket',
    description: 'Yeni QR plaketi',
    price: 149,
    features: [
      'Dayanıklı QR plaketi',
      'UV korumalı baskı',
      'Kolay montaj',
      'Adrese teslim',
    ],
    icon: 'qr',
  },
];
