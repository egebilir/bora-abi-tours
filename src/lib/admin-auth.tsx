'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signOut, SessionProvider } from 'next-auth/react';

interface AdminAuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

function AdminAuthInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const userObj = session?.user ? { ...session.user, username: session.user.email } : null;

  const value = {
    user: userObj,
    isAuthenticated: status === 'authenticated' && (session?.user as any)?.role === 'ADMIN',
    loading: status === 'loading',
    logout: () => signOut({ callbackUrl: '/admin/login' })
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AdminAuthInner>
        {children}
      </AdminAuthInner>
    </SessionProvider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminAuthProvider');
  return ctx;
}
