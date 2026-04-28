'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuth } from '@/lib/user-auth';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

// =============================================
// AuthModal — Premium Login/Register Modal
// Mobile: bottom sheet | Desktop: centered modal
// =============================================

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, login, register } = useUserAuth();
  const t = useTranslations('auth');
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
      setError('!');
      return;
    }

    const success = login(form.email, form.password);
    if (success) {
      toast.success('✓');
      resetForm();
    } else {
      setError('!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('!');
      return;
    }

    if (form.password.length < 6) {
      setError('!');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('!');
      return;
    }

    const success = register(form.name, form.email, form.password);
    if (success) {
      toast.success('✓');
      resetForm();
    } else {
      setError('!');
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-neutral-200" />
            </div>

            <div className="px-6 pt-5 pb-4 sm:pt-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-neutral-900">
                  {tab === 'login' ? t('loginTitle') : t('registerTitle')}
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
            </div>

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
                  {t('loginBtn')}
                </button>
                <button
                  onClick={() => switchTab('register')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] ${
                    tab === 'register'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {t('registerBtn')}
                </button>
              </div>
            </div>

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
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('email')}</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('password')}</label>
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
                      {t('loginBtn')}
                    </motion.button>

                    <p className="text-center text-sm text-neutral-500">
                      {t('noAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('register')}
                        className="text-ice-600 font-medium hover:text-ice-700"
                      >
                        {t('orRegister')}
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
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('name')}</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('email')}</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('password')}</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 focus:border-transparent transition-all"
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('password')} ✓</label>
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="••••••••"
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
                      {t('registerBtn')}
                    </motion.button>

                    <p className="text-center text-sm text-neutral-500">
                      {t('hasAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="text-ice-600 font-medium hover:text-ice-700"
                      >
                        {t('orLogin')}
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
