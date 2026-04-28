'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tour, TourCategory, LANGUAGE_LABELS } from '@/types';
import TourCard from './TourCard';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface TourGridProps {
  tours: Tour[];
}

const filterIcons: Record<string, string> = {
  all: '✨', cultural: '🏛️', nature: '🌿', boat: '⛵', daily: '☀️',
};

const priceRanges = [
  { key: 'all', label: 'all', min: 0, max: Infinity },
  { key: 'budget', label: '€0 – €35', min: 0, max: 35 },
  { key: 'mid', label: '€36 – €50', min: 36, max: 50 },
  { key: 'premium', label: '€51+', min: 51, max: Infinity },
];

export default function TourGrid({ tours }: TourGridProps) {
  const [activeFilter, setActiveFilter] = useState<TourCategory | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const t = useTranslations('tourGrid');
  const tc = useTranslations('categories');

  const allLanguages = useMemo(() => {
    const langSet = new Set<string>();
    tours.forEach((tour) => tour.languages?.forEach((l) => langSet.add(l)));
    return Array.from(langSet);
  }, [tours]);

  const filtered = useMemo(() => {
    let result = tours;
    if (activeFilter !== 'all') result = result.filter((tour) => tour.category === activeFilter);
    const pRange = priceRanges.find((p) => p.key === priceFilter);
    if (pRange && priceFilter !== 'all') result = result.filter((tour) => tour.price >= pRange.min && tour.price <= pRange.max);
    if (langFilter !== 'all') result = result.filter((tour) => tour.languages?.includes(langFilter));
    return result;
  }, [tours, activeFilter, priceFilter, langFilter]);

  const hasActiveAdvancedFilters = priceFilter !== 'all' || langFilter !== 'all';
  const categoryKeys: (TourCategory | 'all')[] = ['all', 'cultural', 'nature', 'boat', 'daily'];

  return (
    <section className="py-12 sm:py-20 bg-white" id="tours">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div className="text-center mb-10 sm:mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ice-50 text-ice-600 text-xs font-semibold tracking-wide uppercase mb-4 border border-ice-100">
            <span className="w-1.5 h-1.5 rounded-full bg-ice-500" />
            {t('title')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-neutral-900 mb-3 sm:mb-4">
            {t('subtitle')}
          </h2>
        </motion.div>

        {/* Category Filter bar */}
        <motion.div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap min-h-[44px] shrink-0',
                activeFilter === key
                  ? 'bg-ice-500 text-white border-ice-500 shadow-lg shadow-ice-500/20'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-ice-300 hover:text-ice-600 hover:bg-ice-50'
              )}
              id={`filter-${key}`}
            >
              <span>{filterIcons[key]}</span>
              {tc(key)}
            </button>
          ))}
        </motion.div>

        {/* Advanced filters toggle */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border min-h-[40px]',
              filtersExpanded || hasActiveAdvancedFilters
                ? 'bg-ice-50 text-ice-600 border-ice-200'
                : 'text-neutral-500 border-neutral-200 hover:border-ice-200 hover:text-ice-500'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            {t('advancedFilters')}
            {hasActiveAdvancedFilters && <span className="w-2 h-2 rounded-full bg-ice-500" />}
            <svg className={cn('w-4 h-4 transition-transform duration-300', filtersExpanded && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        {/* Advanced filters panel */}
        <AnimatePresence>
          {filtersExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="bg-neutral-50 rounded-2xl p-4 sm:p-6 mb-8 border border-neutral-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">💰 {t('priceRange')}</label>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((p) => (
                        <button key={p.key} onClick={() => setPriceFilter(p.key)}
                          className={cn('px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border min-h-[40px]', priceFilter === p.key ? 'bg-ice-500 text-white border-ice-500' : 'bg-white text-neutral-600 border-neutral-200 hover:border-ice-300')}>
                          {p.key === 'all' ? tc('all') : p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2.5">🗣️ {t('tourLang')}</label>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setLangFilter('all')}
                        className={cn('px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border min-h-[40px]', langFilter === 'all' ? 'bg-ice-500 text-white border-ice-500' : 'bg-white text-neutral-600 border-neutral-200 hover:border-ice-300')}>
                        {tc('all')}
                      </button>
                      {allLanguages.map((lang) => (
                        <button key={lang} onClick={() => setLangFilter(lang)}
                          className={cn('px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border min-h-[40px]', langFilter === lang ? 'bg-ice-500 text-white border-ice-500' : 'bg-white text-neutral-600 border-neutral-200 hover:border-ice-300')}>
                          {LANGUAGE_LABELS[lang] || lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {hasActiveAdvancedFilters && (
                  <div className="mt-4 pt-3 border-t border-neutral-200">
                    <button onClick={() => { setPriceFilter('all'); setLangFilter('all'); }} className="text-sm text-ice-600 hover:text-ice-700 font-medium min-h-[40px]">
                      ✕ {t('clearFilters')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 text-sm text-neutral-400 text-center">
          {filtered.length} {t('found')}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((tour, i) => (
              <motion.div key={tour.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
                <TourCard tour={tour} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-neutral-600 text-lg font-medium mb-2">{t('noResults')}</p>
            <p className="text-neutral-400 text-sm mb-6">{t('tryAgain')}</p>
            <button onClick={() => { setActiveFilter('all'); setPriceFilter('all'); setLangFilter('all'); }}
              className="px-5 py-2.5 bg-ice-500 text-white rounded-full text-sm font-medium hover:bg-ice-600 transition-colors min-h-[44px]">
              {t('showAll')}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
