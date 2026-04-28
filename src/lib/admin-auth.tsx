'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AdminUser {
  username: string;
  role: 'admin';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const MOCK_CREDENTIALS = { username: 'admin', password: 'boraabi2024' };

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bora-admin');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch { /* noop */ }
    setLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      const adminUser: AdminUser = { username, role: 'admin' };
      setUser(adminUser);
      try { localStorage.setItem('bora-admin', JSON.stringify(adminUser)); } catch { /* noop */ }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem('bora-admin'); } catch { /* noop */ }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminAuthProvider');
  return ctx;
}
