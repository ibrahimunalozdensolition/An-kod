export interface PageAnalytics {
  pageId: string;
  pageName: string;
  totalViews: number;
  uniqueVisitors: number;
  qrScans: number;
  averageTimeOnPage: number;
  viewsByDate: { date: string; views: number }[];
  viewsByDevice: { device: string; count: number }[];
  viewsByCountry: { country: string; count: number }[];
}

export interface SystemAnalytics {
  totalUsers: number;
  totalPages: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  newUsersToday: number;
  newPagesToday: number;
  ordersToday: number;
  revenueToday: number;
  userGrowth: { date: string; count: number }[];
  revenueGrowth: { date: string; amount: number }[];
  ordersByStatus: { status: string; count: number }[];
  topPages: { id: string; name: string; views: number }[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y' | 'custom';
