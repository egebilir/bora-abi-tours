'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCurrency, CURRENCIES } from '@/lib/currency';
import { useUserAuth } from '@/lib/user-auth';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

const categoryKeys = ['all', 'cultural', 'nature', 'boat', 'daily'] as const;

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { user, isAuthenticated, logout, openAuthModal } = useUserAuth();

  const t = useTranslations('header');
  const tc = useTranslations('categories');

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    const handleClick = () => { setLangOpen(false); setCurrencyOpen(false); setUserMenuOpen(false); };
    if (langOpen || currencyOpen || userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [langOpen, currencyOpen, userMenuOpen]);

  const handleLangChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  const textColor = scrolled ? 'text-neutral-600' : 'text-white/80';
  const hoverBg = scrolled ? 'hover:bg-neutral-100' : 'hover:bg-white/10';

  const userInitials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-ice-100/60'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
                  <circle cx="18" cy="18" r="16" stroke={scrolled ? '#0EA5E9' : '#fff'} strokeWidth="2" className="transition-colors duration-500" />
                  <path d="M18 6L20 16L18 18L16 16L18 6Z" fill={scrolled ? '#0EA5E9' : '#fff'} className="transition-colors duration-500" />
                  <path d="M18 30L16 20L18 18L20 20L18 30Z" fill={scrolled ? '#7C7755' : 'rgba(255,255,255,0.5)'} className="transition-colors duration-500" />
                  <path d="M6 18L16 16L18 18L16 20L6 18Z" fill={scrolled ? '#0EA5E9' : '#fff'} className="transition-colors duration-500" />
                  <path d="M30 18L20 20L18 18L20 16L30 18Z" fill={scrolled ? '#7C7755' : 'rgba(255,255,255,0.5)'} className="transition-colors duration-500" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className={cn('text-lg font-bold tracking-tight leading-tight transition-colors duration-500', scrolled ? 'text-neutral-900' : 'text-white')}>
                  Bora Abi <span className="text-ice-400">Tours</span>
                </span>
                <span className={cn('text-[10px] tracking-[0.2em] uppercase font-medium leading-none transition-colors duration-500', scrolled ? 'text-khaki-500' : 'text-white/60')}>
                  Discover Aegean
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {categoryKeys.map((key) => (
              <a key={key} href={key === 'all' ? '#tours' : `#tours?category=${key}`}
                className={cn('px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300', scrolled ? 'text-neutral-600 hover:text-ice-600 hover:bg-ice-50' : 'text-white/80 hover:text-white hover:bg-white/10')}>
                {tc(key)}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 200, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden sm:!w-[220px]">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search')} autoFocus
                      className={cn('w-full px-4 py-2 rounded-full text-sm outline-none transition-colors', scrolled ? 'bg-neutral-100 text-neutral-800 placeholder:text-neutral-400' : 'bg-white/15 text-white placeholder:text-white/50 backdrop-blur-sm')} />
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setSearchOpen(!searchOpen)} className={cn('relative z-10 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300', textColor, hoverBg)} aria-label={t('search')} id="search-toggle">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Language */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setLangOpen(!langOpen)} className={cn('flex items-center gap-1.5 px-2.5 py-2 sm:px-3 rounded-full text-sm font-medium transition-all duration-300 min-w-[44px] min-h-[44px] justify-center', textColor, hoverBg)} id="language-selector">
                <span className="text-base">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden min-w-[160px]">
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => handleLangChange(lang.code)}
                        className={cn('w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors min-h-[44px]', locale === lang.code ? 'bg-ice-50 text-ice-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50')}>
                        <span>{lang.flag}</span><span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setCurrencyOpen(!currencyOpen); setLangOpen(false); }} className={cn('flex items-center gap-1 px-2 py-2 sm:px-2.5 rounded-full text-sm font-medium transition-all duration-300 min-w-[40px] min-h-[44px] justify-center', textColor, hoverBg)} id="currency-selector">
                <span className="font-semibold">{currency.symbol}</span>
                <span className="hidden sm:inline text-xs opacity-70">{currency.code}</span>
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden min-w-[180px] max-h-[320px] overflow-y-auto">
                    {CURRENCIES.map((c) => (
                      <button key={c.code} onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                        className={cn('w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors min-h-[44px]', currency.code === c.code ? 'bg-ice-50 text-ice-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50')}>
                        <span>{c.flag}</span>
                        <span className="font-medium">{c.symbol}</span>
                        <span className="text-neutral-400 text-xs ml-auto">{c.code}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Auth */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setLangOpen(false); setCurrencyOpen(false); }}
                    className={cn('w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2', scrolled ? 'bg-ice-500 text-white border-ice-400' : 'bg-white/20 text-white border-white/40 backdrop-blur-sm')}
                    id="user-menu-toggle"
                  >
                    {userInitials}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden min-w-[200px]">
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <p className="text-sm font-medium text-neutral-900">{t('hello')}, {user?.name?.split(' ')[0]}</p>
                          <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                        </div>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors min-h-[44px]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          {t('logout')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button onClick={openAuthModal} className={cn('w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300', textColor, hoverBg)} aria-label={t('login')} id="auth-toggle">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </button>
              )}
            </div>

            {/* CTA */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="hidden sm:block">
              <a href="#tours" className="flex items-center gap-2 px-5 py-2.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-semibold rounded-full transition-colors duration-300 shadow-lg shadow-ice-500/25" id="cta-find-tour">
                {t('findTour')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>

            {/* Mobile Menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={cn('lg:hidden w-11 h-11 flex items-center justify-center rounded-full transition-colors', scrolled ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10')} aria-label="Menu" id="mobile-menu-toggle">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-100">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {categoryKeys.map((key) => (
                <a key={key} href={key === 'all' ? '#tours' : `#tours?category=${key}`} onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3.5 text-neutral-700 hover:text-ice-600 hover:bg-ice-50 rounded-xl text-base font-medium transition-colors min-h-[44px] flex items-center">
                  {tc(key)}
                </a>
              ))}

              {isAuthenticated ? (
                <div className="border-t border-neutral-100 mt-2 pt-2">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ice-500 text-white flex items-center justify-center text-sm font-bold">{userInitials}</div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                      <p className="text-xs text-neutral-400">{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-xl text-base font-medium transition-colors min-h-[44px] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <button onClick={() => { openAuthModal(); setMobileMenuOpen(false); }} className="mt-2 px-4 py-3.5 text-ice-600 hover:bg-ice-50 rounded-xl text-base font-medium transition-colors min-h-[44px] flex items-center gap-2 border-t border-neutral-100 pt-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {t('login')}
                </button>
              )}

              <a href="#tours" onClick={() => setMobileMenuOpen(false)} className="mt-3 flex items-center justify-center gap-2 px-5 py-3.5 bg-ice-500 text-white text-base font-semibold rounded-full min-h-[48px]">
                {t('findTour')}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
