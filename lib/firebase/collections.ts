export const COLLECTIONS = {
  USERS: 'users',
  MEMORIAL_PAGES: 'memorialPages',
  MEMORIES: 'memories',
  COMMENTS: 'comments',
  ORDERS: 'orders',
  QR_REQUESTS: 'qrRequests',
  SUPPORT_TICKETS: 'supportTickets',
  ANALYTICS: 'analytics',
  PAYMENTS: 'payments',
} as const;

export interface MemorialPage {
  id: string;
  userId: string;
  deceasedName: string;
  deceasedBirthDate?: Date;
  deceasedDeathDate?: Date;
  templateId: string;
  backgroundColor: string;
  layout: string;
  isPublic: boolean;
  isDraft: boolean;
  uniqueLink: string;
  qrCode: string;
  commentsEnabled: boolean;
  photoLimit: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Memory {
  id: string;
  pageId: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  date?: Date;
  tags?: string[];
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  pageId: string;
  pageOwnerId: string;
  authorName: string;
  content: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: Date;
  approvedAt?: Date;
  deletedAt?: Date;
}

export type OrderStatus = 
  | 'request_received'
  | 'production_started'
  | 'production_completed'
  | 'shipped'
  | 'delivered';

export interface Order {
  id: string;
  userId: string;
  pageId: string;
  type: 'new_page' | 'extra_photos' | 'new_qr';
  status: OrderStatus;
  amount: number;
  paymentId: string;
  producerId?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    updatedBy: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export type SupportTicketStatus = 'open' | 'pending' | 'resolved';
export type SupportTicketCategory = 'payment' | 'content' | 'production' | 'shipping' | 'other';

export interface SupportTicket {
  id: string;
  userId: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  subject: string;
  description: string;
  messages: {
    senderId: string;
    senderRole: string;
    content: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
