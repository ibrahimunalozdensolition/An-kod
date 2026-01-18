export type UserRole = 'customer' | 'producer' | 'admin';

export interface User {
  uid: string;
  email: string;
  phoneNumber: string;
  phoneVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
