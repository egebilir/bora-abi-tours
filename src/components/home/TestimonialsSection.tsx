'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Testimonial {
  name: string;
  country: string;
  flag: string;
  tour: string;
  rating: number;
  image: string;
  textKey: string;
}

const testimonials: Testimonial[] = [
  { name: 'Anna Müller', country: 'Germany', flag: '🇩🇪', tour: 'Ephesus', rating: 5, image: '/images/testimonials/anna.png', textKey: 'anna' },
  { name: 'Carlos García', country: 'Spain', flag: '🇪🇸', tour: 'Pamukkale', rating: 5, image: '/images/testimonials/carlos.png', textKey: 'carlos' },
  { name: 'Sarah Thompson', country: 'United Kingdom', flag: '🇬🇧', tour: 'Boat Tour', rating: 5, image: '/images/testimonials/sarah.png', textKey: 'sarah' },
  { name: 'Markus Weber', country: 'Austria', flag: '🇦🇹', tour: 'Ephesus', rating: 5, image: '/images/testimonials/markus.png', textKey: 'markus' },
  { name: 'Elena Sokolova', country: 'Russia', flag: '🇷🇺', tour: 'Dalyan', rating: 5, image: '/images/testimonials/elena.png', textKey: 'elena' },
  { name: 'James Wilson', country: 'USA', flag: '🇺🇸', tour: 'Şirince', rating: 5, image: '/images/testimonials/james.png', textKey: 'james' },
];

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  // Show 3 on desktop, 1 on mobile
  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < 3; i++) {
      indices.push((active + i) % testimonials.length);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="py-16 sm:py-24 bg-khaki-50 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.05), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(124,119,85,0.04), transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-12 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold tracking-wide uppercase mb-4 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t('badge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-900 mb-3">{t('title')}</h2>
          <p className="text-neutral-500 text-base sm:text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* Cards — Desktop 3 / Mobile 1 */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Mobile: single card */}
          <div className="sm:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
              >
                <TestimonialCard testimonial={testimonials[active]} t={t} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop: 3 cards */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visibleIndices.map((idx) => (
                <motion.div
                  key={`${idx}-${testimonials[idx].textKey}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  layout
                >
                  <TestimonialCard testimonial={testimonials[idx]} t={t} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 min-w-[10px] min-h-[10px] ${i === active ? 'bg-ice-500 w-6' : 'bg-neutral-300 hover:bg-neutral-400'}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, t }: { testimonial: Testimonial; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-100 shadow-sm h-full flex flex-col">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-neutral-600 text-sm leading-relaxed flex-1 mb-5">
        &ldquo;{t(`reviews.${testimonial.textKey}`)}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" sizes="40px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{testimonial.name}</p>
          <p className="text-xs text-neutral-400">{testimonial.flag} {testimonial.country} · {testimonial.tour}</p>
        </div>
      </div>
    </div>
  );
}
