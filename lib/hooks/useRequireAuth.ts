"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/types/user';

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/');
      }
    }
  }, [user, loading, router, allowedRoles]);

  return { user, loading };
}
