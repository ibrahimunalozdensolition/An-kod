export type OrderStatus = 
  | 'pending'
  | 'in_production'
  | 'quality_check'
  | 'packaging'
  | 'shipped'
  | 'delivered';

export type QROrderStatus =
  | 'pending'
  | 'in_production'
  | 'shipped'
  | 'delivered';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  memoryPageId: string;
  memoryPageName: string;
  type: 'new_page' | 'new_qr';
  status: OrderStatus | QROrderStatus;
  producerId?: string;
  assignedAt?: Date;
  notes: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Producer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  activeOrders: number;
  completedOrders: number;
  isActive: boolean;
  createdAt: Date;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Beklemede',
  in_production: 'Üretimde',
  quality_check: 'Kalite Kontrol',
  packaging: 'Paketleme',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
};

export const QR_ORDER_STATUS_LABELS: Record<QROrderStatus, string> = {
  pending: 'Beklemede',
  in_production: 'Üretimde',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
};
