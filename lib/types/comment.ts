export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface Comment {
  id: string;
  memoryPageId: string;
  name: string;
  message: string;
  status: CommentStatus;
  createdAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  ipAddress?: string;
}

export interface CommentSettings {
  allowComments: boolean;
  requireApproval: boolean;
  maxCommentsPerDay: number;
}
