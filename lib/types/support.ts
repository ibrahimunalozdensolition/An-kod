export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'general' | 'technical' | 'payment' | 'order' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  message: string;
  status: TicketStatus;
  assignedTo?: string;
  responses: TicketResponse[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  isAdmin: boolean;
  message: string;
  createdAt: Date;
}

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  general: 'Genel',
  technical: 'Teknik',
  payment: 'Ödeme',
  order: 'Sipariş',
  other: 'Diğer',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Açık',
  in_progress: 'İşleniyor',
  resolved: 'Çözüldü',
  closed: 'Kapatıldı',
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};
