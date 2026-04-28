'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const destinations = [
  {
    title: 'KUŞADASI',
    description: 'Eşsiz koyları, masmavi denizi ve canlı atmosferi ile tatilin kalbi.',
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M32 8L28 28H8L24 38L18 58L32 46L46 58L40 38L56 28H36L32 8Z" strokeLinejoin="round" />
        <path d="M8 52C16 48 24 52 32 48C40 52 48 48 56 52" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'EFES',
    description: 'Binlerce yıllık tarihi, büyüleyici kalıntıları ve eşsiz mirası.',
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="12" y="24" width="40" height="32" rx="1" />
        <path d="M8 24H56" strokeLinecap="round" />
        <path d="M16 24V12L32 4L48 12V24" strokeLinejoin="round" />
        <rect x="22" y="34" width="8" height="22" rx="1" />
        <rect x="34" y="34" width="8" height="16" rx="1" />
        <circle cx="32" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: 'ŞİRİNCE',
    description: 'Tarihi taş evleri, yöresel lezzetleri ve huzur dolu atmosferiyle saklı bir cennet.',
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
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
  },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col overflow-hidden" id="hero">
      {/* ===== Background: 3 blended images ===== */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* 3-panel image collage */}
        <div className="absolute inset-0 flex">
          {/* Left — Kuşadası (boat-tour) */}
          <div className="relative flex-1">
            <Image
              src="/images/tours/boat-tour.png"
              alt="Kuşadası sahili ve turkuaz deniz manzarası"
              fill
              className="object-cover"
              priority
              sizes="33vw"
            />
          </div>
          {/* Center — Efes */}
          <div className="relative flex-[1.3]">
            <Image
              src="/images/tours/ephesus.png"
              alt="Efes Antik Kenti Celsus Kütüphanesi"
              fill
              className="object-cover"
              priority
              sizes="40vw"
            />
          </div>
          {/* Right — Şirince */}
          <div className="relative flex-1">
            <Image
              src="/images/tours/sirince.png"
              alt="Şirince Köyü taş evleri ve dar sokakları"
              fill
              className="object-cover"
              priority
              sizes="33vw"
            />
          </div>
        </div>

        {/* Blend overlays — smooth panel transitions */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, transparent 28%, rgba(0,0,0,0.15) 33%, transparent 38%, transparent 62%, rgba(0,0,0,0.15) 67%, transparent 72%)'
        }} />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2540]/70 via-[#1a2540]/50 to-[#1a2540]/80" />
        {/* Extra vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,20,40,0.4) 100%)'
        }} />
      </motion.div>

      {/* ===== Content ===== */}
      <motion.div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-20 pb-8" style={{ y: textY, opacity }}>
        {/* Top tagline — cursive */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3 mb-4 sm:mb-5"
        >
          {/* Small compass icon */}
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white/80" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <circle cx="16" cy="16" r="12" />
            <path d="M16 4V8M16 24V28M4 16H8M24 16H28" strokeLinecap="round" />
            <path d="M16 12L18 16L16 20L14 16L16 12Z" fill="currentColor" opacity={0.5} />
          </svg>
        </motion.div>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/80 mb-3 sm:mb-4"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Tarih, Doğa ve Kültür Bir Arada
        </motion.p>

        {/* Main heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-1 sm:mb-2"
          initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
        >
          KEŞFET, HİSSET,
        </motion.h1>

        {/* Cursive "Unutma!" */}
        <motion.div
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-6 sm:mb-8"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Unutma!
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/75 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Kuşadası&apos;nın eşsiz sahillerinden Efes&apos;in büyüleyici tarihine,
          Şirince&apos;nin huzur dolu sokaklarına uzanan unutulmaz bir yolculuk.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.a
            href="#tours"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,1)', color: '#1a2540' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 border-2 border-white text-white font-bold tracking-[0.15em] text-sm sm:text-base rounded-sm transition-all min-h-[52px]"
            id="hero-cta-explore"
            aria-label="Turlarımızı keşfedin"
          >
            TURLARIMIZI KEŞFEDİN
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* ===== Bottom — Destination Cards ===== */}
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {/* Glass backdrop */}
        <div className="bg-gradient-to-t from-[#1a2540]/90 to-transparent pt-6 pb-8 sm:pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-8">
              {destinations.map((dest, i) => (
                <motion.div
                  key={dest.title}
                  className="flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 + i * 0.15 }}
                >
                  {/* Icon */}
                  <div className="text-white/70 group-hover:text-white transition-colors duration-300 mb-2 sm:mb-3">
                    {dest.icon}
                  </div>
                  {/* Title */}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-[0.1em] mb-1 sm:mb-2">
                    {dest.title}
                  </h3>
                  {/* Description */}
                  <p className="text-[11px] sm:text-xs md:text-sm text-white/50 leading-relaxed max-w-[200px]">
                    {dest.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
          <motion.div className="w-1 h-1 rounded-full bg-white/50" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}
