'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdmin } from '@/lib/admin-auth';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast.success('Hoş geldiniz, Admin!');
        router.push('/admin');
      } else {
        toast.error('Geçersiz kullanıcı adı veya şifre');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ice-500 via-ice-600 to-ice-700 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ice-50 rounded-2xl mb-4">
              <svg viewBox="0 0 36 36" className="w-10 h-10" fill="none">
                <circle cx="18" cy="18" r="16" stroke="#0EA5E9" strokeWidth="2" />
                <path d="M18 6L20 16L18 18L16 16L18 6Z" fill="#0EA5E9" />
                <path d="M18 30L16 20L18 18L20 20L18 30Z" fill="#7C7755" />
                <path d="M6 18L16 16L18 18L16 20L6 18Z" fill="#0EA5E9" />
                <path d="M30 18L20 20L18 18L20 16L30 18Z" fill="#7C7755" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Bora Abi Tours</h1>
            <p className="text-neutral-500 text-sm mt-1">Admin Paneli Girişi</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:ring-2 focus:ring-ice-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 focus:ring-2 focus:ring-ice-500 focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-ice-500 hover:bg-ice-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-ice-500/25 disabled:opacity-60 min-h-[48px]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                'Giriş Yap'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
