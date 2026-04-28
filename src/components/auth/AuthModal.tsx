'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuth } from '@/lib/user-auth';
import toast from 'react-hot-toast';

// =============================================
// AuthModal — Premium Giriş/Kayıt Modalı
// Mobil: bottom sheet | Desktop: centered modal
// =============================================

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, login, register } = useUserAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
  };

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    const success = login(form.email, form.password);
    if (success) {
      toast.success('Giriş başarılı!');
      resetForm();
    } else {
      setError('E-posta veya şifre hatalı');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    const success = register(form.name, form.email, form.password);
    if (success) {
      toast.success('Hesabınız oluşturuldu!');
      resetForm();
    } else {
      setError('Bu e-posta adresi zaten kayıtlı');
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          onClick={closeAuthModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag indicator (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-neutral-200" />
            </div>

            {/* Header */}
            <div className="px-6 pt-5 pb-4 sm:pt-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-neutral-900">
                  {tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                </h2>
                <button
                  onClick={closeAuthModal}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-neutral-500">
                {tab === 'login'
                  ? 'Hesabınıza giriş yaparak yorum yapabilirsiniz'
                  : 'Ücretsiz hesap oluşturarak yorum ve değerlendirme yapın'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="px-6 mb-4">
              <div className="flex bg-neutral-100 rounded-xl p-1">
                <button
                  onClick={() => switchTab('login')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] ${
                    tab === 'login'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => switchTab('register')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] ${
                    tab === 'register'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Üye Ol
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 pb-6 sm:pb-8">
              <AnimatePresence mode="wait">
                {tab === 'login' ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">E-posta</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="ornek@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Şifre</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="current-password"
                      />
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl"
                      >
                        {error}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 bg-ice-500 hover:bg-ice-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-ice-500/20 min-h-[48px]"
                    >
                      Giriş Yap
                    </motion.button>

                    <p className="text-center text-sm text-neutral-500">
                      Hesabınız yok mu?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('register')}
                        className="text-ice-600 font-medium hover:text-ice-700"
                      >
                        Hemen kaydolun
                      </button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ad Soyad</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Adınız Soyadınız"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">E-posta</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="ornek@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Şifre</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="En az 6 karakter"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Şifre Tekrar</label>
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="Şifrenizi tekrar girin"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="new-password"
                      />
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl"
                      >
                        {error}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3.5 bg-ice-500 hover:bg-ice-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-ice-500/20 min-h-[48px]"
                    >
                      Hesap Oluştur
                    </motion.button>

                    <p className="text-center text-sm text-neutral-500">
                      Zaten üye misiniz?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="text-ice-600 font-medium hover:text-ice-700"
                      >
                        Giriş yapın
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
