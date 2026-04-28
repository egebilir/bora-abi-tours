'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types';

// =============================================
// User Auth — Uçak bileti modeli
// Misafir olarak satın alabilir, yorum için üyelik şart
// localStorage ile persist — backend'e geçişte kolay adapte
// =============================================

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

const STORAGE_KEY = 'bora-user';
const USERS_KEY = 'bora-users';

// Basit hash simülasyonu (mock — gerçek projede bcrypt kullanılır)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function getStoredUsers(): { email: string; passwordHash: string; user: User }[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return [];
}

function saveStoredUsers(users: { email: string; passwordHash: string; user: User }[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch { /* noop */ }
}

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch { /* noop */ }
    setLoading(false);
  }, []);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    const users = getStoredUsers();
    
    // Email zaten kayıtlı mı?
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      bookings: [],
    };

    users.push({
      email: email.toLowerCase(),
      passwordHash: simpleHash(password),
      user: newUser,
    });

    saveStoredUsers(users);
    setUser(newUser);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser)); } catch { /* noop */ }
    setAuthModalOpen(false);
    return true;
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const users = getStoredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === simpleHash(password)
    );

    if (found) {
      setUser(found.user);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(found.user)); } catch { /* noop */ }
      setAuthModalOpen(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }, []);

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  return (
    <UserAuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      openAuthModal,
      closeAuthModal,
      authModalOpen,
    }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
  return ctx;
}
