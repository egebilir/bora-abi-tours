'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useCurrency } from '@/lib/currency';

const destinationIcons = [
  (
    <svg key="k" className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M32 8L28 28H8L24 38L18 58L32 46L46 58L40 38L56 28H36L32 8Z" strokeLinejoin="round" />
      <path d="M8 52C16 48 24 52 32 48C40 52 48 48 56 52" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg key="e" className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="12" y="24" width="40" height="32" rx="1" />
      <path d="M8 24H56" strokeLinecap="round" />
      <path d="M16 24V12L32 4L48 12V24" strokeLinejoin="round" />
      <rect x="22" y="34" width="8" height="22" rx="1" />
      <rect x="34" y="34" width="8" height="16" rx="1" />
      <circle cx="32" cy="16" r="3" />
    </svg>
  ),
  (
    <svg key="s" className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M8 36L20 24L32 36" strokeLinejoin="round" />
      <path d="M32 32L44 20L56 32" strokeLinejoin="round" />
      <rect x="8" y="36" width="24" height="20" rx="1" />
      <rect x="32" y="32" width="24" height="24" rx="1" />
      <rect x="16" y="42" width="6" height="8" rx="1" />
      <rect x="40" y="38" width="6" height="8" rx="1" />
      <path d="M50 46H56V56H50V46Z" />
      <path d="M14 56H52" strokeLinecap="round" />
    </svg>
  ),
];

const destKeys = ['kusadasi', 'efes', 'sirince'] as const;

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const t = useTranslations('hero');
  const td = useTranslations('destinations');
  const locale = useLocale();
  const { formatPrice } = useCurrency();

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col overflow-hidden" id="hero">
      {/* ===== Background: 3 blended images ===== */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 flex">
          <div className="relative flex-1">
            <Image src="/images/tours/boat-tour.png" alt="Kuşadası sahili ve turkuaz deniz manzarası" fill className="object-cover" priority sizes="33vw" />
          </div>
          <div className="relative flex-[1.3]">
            <Image src="/images/tours/ephesus.png" alt="Efes Antik Kenti Celsus Kütüphanesi" fill className="object-cover" priority sizes="40vw" />
          </div>
          <div className="relative flex-1">
            <Image src="/images/tours/sirince.png" alt="Şirince Köyü taş evleri ve dar sokakları" fill className="object-cover" priority sizes="33vw" />
          </div>
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 28%, rgba(0,0,0,0.15) 33%, transparent 38%, transparent 62%, rgba(0,0,0,0.15) 67%, transparent 72%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2540]/70 via-[#1a2540]/50 to-[#1a2540]/80" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,20,40,0.4) 100%)' }} />
      </motion.div>

      {/* ===== Content ===== */}
      <motion.div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 sm:pl-8 md:pl-12 sm:pr-6 pt-24 sm:pt-20 pb-8" style={{ y: textY, opacity }}>
        
        {/* Main Text Area */}
        <div className="flex flex-col items-start text-left max-w-2xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex items-center gap-3 mb-4 sm:mb-5">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-amber-200/70" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2}>
              <circle cx="16" cy="16" r="12" />
              <path d="M16 4V8M16 24V28M4 16H8M24 16H28" strokeLinecap="round" />
              <path d="M16 12L18 16L16 20L14 16L16 12Z" fill="currentColor" opacity={0.5} />
            </svg>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-amber-200/70 mb-3 sm:mb-4"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('tagline')}
          </motion.p>

          <motion.h1
            className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-[1.1] tracking-normal mb-1 sm:mb-2 whitespace-normal sm:whitespace-nowrap"
            style={{ fontFamily: 'var(--font-playfair)' }}
            initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }} animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          >
            {t('title')}
          </motion.h1>

          <motion.div
            className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white mb-6 sm:mb-8 leading-[1.1] tracking-normal whitespace-normal sm:whitespace-nowrap"
            style={{ fontFamily: 'var(--font-playfair)' }}
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-amber-300 italic pr-2">
              {t('titleCursive')}
            </span>
          </motion.div>

          <motion.p
            className="text-sm sm:text-base text-gray-100/80 max-w-lg mb-8 sm:mb-10 leading-relaxed pr-2"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
          >
            {t('subtitle')}
          </motion.p>

          <motion.div className="w-full" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}>
            <motion.a
              href="#tours"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,1)', color: '#1a2540' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 border-2 border-white text-white font-bold tracking-[0.15em] text-sm sm:text-base rounded-sm transition-all min-h-[52px] w-full sm:w-auto max-w-xs"
              id="hero-cta-explore"
            >
              {t('cta')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 sm:mt-10 text-xs sm:text-sm text-gray-200/90 font-medium"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.3 }}
          >
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-bold">4.9</span>
              <span className="text-gray-300">· {t('reviews')}</span>
            </div>
            
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></div>
            
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
                <path d="M12 10v4" />
                <path d="M12 2v3" />
              </svg>
              <span>{t('cruiseApproved')}</span>
            </div>

            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></div>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              <span>{t('returnGuarantee')}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Card (Mobile: stacked below, Desktop: Absolute right) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md lg:w-80 mt-12 lg:mt-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl px-6 py-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 z-20"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              {t('featuredTour')}
            </div>
            <div className="text-gray-200 text-xs flex items-center gap-1 font-medium bg-white/10 border border-white/10 px-2 py-1 rounded-md">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {t('duration')}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white/95 mb-3 leading-snug">{t('tourName')}</h3>
          
          <div className="flex items-end gap-2 mb-5">
            <span className="text-amber-200/60 text-xs font-bold tracking-wider mb-1 uppercase">{t('startingFrom')}</span>
            <span className="text-2xl font-bold text-amber-300 tracking-tight">{formatPrice(29.99)}<span className="text-sm text-amber-200/60 font-medium">{t('perPerson')}</span></span>
          </div>

          <div className="flex flex-col gap-2.5 mb-6 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2.5 text-xs text-gray-200">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                <svg className="w-2.5 h-2.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span>{t('highlight1')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-200">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                <svg className="w-2.5 h-2.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span>{t('highlight2')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-200">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                <svg className="w-2.5 h-2.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span>{t('highlight3')}</span>
            </div>
          </div>

          <a href={`/${locale}/checkout/efes-antik-kenti`} className="block w-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] text-center text-sm">
            {t('reserve')}
          </a>
        </motion.div>
      </motion.div>

      {/* ===== Bottom — Destination Cards ===== */}
      <motion.div className="relative z-10 w-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }}>
        <div className="bg-gradient-to-t from-[#1a2540]/90 to-transparent pt-6 pb-8 sm:pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-8">
              {destKeys.map((key, i) => (
                <motion.div
                  key={key}
                  className="flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 + i * 0.15 }}
                >
                  <div className="text-white/70 group-hover:text-white transition-colors duration-300 mb-2 sm:mb-3">
                    {destinationIcons[i]}
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-[0.1em] mb-1 sm:mb-2">
                    {td(`${key}.title`)}
                  </h3>
                  <p className="hidden sm:block text-[11px] sm:text-xs md:text-sm text-white/50 leading-relaxed max-w-[200px]">
                    {td(`${key}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="absolute bottom-6 right-6 md:right-12 z-20 hidden sm:block" animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
          <motion.div className="w-1 h-1 rounded-full bg-white/50" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}
