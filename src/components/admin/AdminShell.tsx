'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/lib/admin-auth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/tours', label: 'Turlar', icon: '🗺️' },
  { href: '/admin/manifesto', label: 'Manifesto', icon: '📋' },
  { href: '/admin/guides', label: 'Rehberler', icon: '🧑‍🏫' },
  { href: '/admin/buses', label: 'Otobüsler', icon: '🚌' },
  { href: '/admin/blog', label: 'Blog', icon: '📝' },
];

export default function AdminShell({ children, currentPath }: { children: React.ReactNode; currentPath: string }) {
  const { user, logout, isAuthenticated, loading } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/admin/login');
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-50"><div className="w-8 h-8 border-3 border-ice-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex w-64 bg-neutral-900 text-white flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ice-500 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none">
                <circle cx="18" cy="18" r="14" stroke="#fff" strokeWidth="2" />
                <path d="M18 8L19.5 16L18 17.5L16.5 16L18 8Z" fill="#fff" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm">WeAreShorex</div>
              <div className="text-[10px] text-neutral-400 tracking-wider uppercase">Admin Panel</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentPath === item.href ? 'bg-ice-500/20 text-ice-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-khaki-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.username}</div>
              <div className="text-xs text-neutral-500">Yönetici</div>
            </div>
            <button onClick={() => { logout(); router.push('/admin/login'); }} className="text-neutral-500 hover:text-red-400 transition-colors p-1" title="Çıkış">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 w-72 bg-neutral-900 z-50 lg:hidden p-4">
              <div className="flex items-center justify-between mb-6 px-2">
                <span className="font-bold text-white">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="text-neutral-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium min-h-[48px] ${currentPath === item.href ? 'bg-ice-500/20 text-ice-400' : 'text-neutral-400 hover:text-white'}`}>
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-neutral-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-lg font-bold text-neutral-900 hidden sm:block">
            {navItems.find(n => n.href === currentPath)?.label || 'Admin'}
          </h1>
          <Link href="/" className="text-sm text-ice-600 hover:text-ice-700 font-medium">← Siteye Dön</Link>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
