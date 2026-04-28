'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Tour, LANGUAGE_LABELS } from '@/types';
import { getCategoryIcon, getStarRating } from '@/lib/utils';
import { useCurrency } from '@/lib/currency';
import { useAdminStoreSafe } from '@/lib/admin-store';
import TourCard from '@/components/tours/TourCard';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

interface TourDetailClientProps {
  tour: Tour;
  relatedTours?: Tour[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function TourDetailClient({ tour, relatedTours = [] }: TourDetailClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('tourDetail');
  const tc = useTranslations('categories');
  const tcom = useTranslations('common');
  const tcard = useTranslations('tourCard');
  const tsp = useTranslations('socialProof');

  const starData = getStarRating(tour.rating);
  const starsStr = '★'.repeat(starData.full) + (starData.half ? '½' : '') + '☆'.repeat(starData.empty);
  const categoryLabel = tc(tour.category);
  const categoryIcon = getCategoryIcon(tour.category);
  const { formatPrice } = useCurrency();
  const store = useAdminStoreSafe();
  const [descExpanded, setDescExpanded] = useState(false);

  const useEn = locale !== 'tr';
  const title = useEn && tour.titleEn ? tour.titleEn : tour.title;
  const description = useEn && tour.descriptionEn ? tour.descriptionEn : tour.description;
  const fullDescription = useEn && tour.fullDescriptionEn ? tour.fullDescriptionEn : tour.fullDescription;
  const duration = useEn && tour.durationEn ? tour.durationEn : tour.duration;
  const meetingPoint = useEn && tour.meetingPointEn ? tour.meetingPointEn : tour.meetingPoint;
  const highlights = useEn && tour.highlightsEn?.length ? tour.highlightsEn : tour.highlights;
  const inclusions = tour.inclusions; // No En field in data — same for all
  const exclusions = tour.exclusions; // No En field in data — same for all
  const importantInfo = useEn && tour.importantInfoEn?.length ? tour.importantInfoEn : tour.importantInfo;
  const itinerary = tour.itinerary.map(step => ({
    time: step.time,
    title: useEn && step.titleEn ? step.titleEn : step.title,
    description: useEn && step.descriptionEn ? step.descriptionEn : step.description,
  }));

  const capacity = store?.getTourCapacity(tour.id) ?? { total: 0, booked: 0, available: 999 };
  const isSoldOut = capacity.available <= 0;
  const isPopular = tour.rating >= 4.7 && tour.reviewCount >= 200;

  // Simulated social proof (deterministic per tour, not random on every render)
  const viewerCount = useMemo(() => {
    const hash = tour.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 5 + (hash % 18); // 5-22 viewers
  }, [tour.id]);
  const bookedTodayCount = useMemo(() => {
    const hash = tour.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 2 + (hash % 8); // 2-9 booked today
  }, [tour.id]);

  const handleReserve = () => {
    if (isSoldOut || !tour.isOpen) return;
    router.push(`/checkout/${tour.id}`);
  };

  return (
    <main className="min-h-screen bg-neutral-50 pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <motion.div className="bg-white border-b border-neutral-100" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link href="/" className="hover:text-ice-500 transition-colors">{tcom('home')}</Link>
            <span>/</span>
            <Link href="/#tours" className="hover:text-ice-500 transition-colors">{tcom('tours')}</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium truncate">{title}</span>
          </nav>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <motion.div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-xl" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <Image src={tour.image} alt={tour.imageAlt || title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-neutral-700 shadow-sm">
                  {categoryIcon} {categoryLabel}
                </span>
                {tour.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/90 backdrop-blur-sm text-sm font-semibold text-amber-900 shadow-sm">
                    👑 {tcard('featured')}
                  </span>
                )}
              </div>
              {!tour.isOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-6 py-3 bg-red-600 text-white font-bold rounded-full text-lg shadow-lg">{t('closedSale')}</span>
                </div>
              )}
            </motion.div>

            {/* Social Proof Banner */}
            {tour.isOpen && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5}
                className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                  {viewerCount} {tsp('viewing')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
                  ✓ {tsp('bookedToday', { count: bookedTodayCount })}
                </span>
                {isPopular && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                    🔥 {tsp('likelySellOut')}
                  </span>
                )}
              </motion.div>
            )}

            {/* Title & quick info */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 leading-tight">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-neutral-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {meetingPoint}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t('startTime')}: {tour.startTime}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-amber-400 text-lg">{starsStr}</span>
                <span className="font-bold text-neutral-800">{tour.rating}</span>
                <span className="text-neutral-400">({tour.reviewCount})</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm font-medium text-neutral-600 mr-1">{t('languages')}:</span>
                {tour.languages.map((lang) => (
                  <span key={lang} className="inline-flex items-center px-2.5 py-1 rounded-full bg-ice-50 text-ice-700 text-xs font-medium border border-ice-100">
                    {LANGUAGE_LABELS[lang] || lang}
                  </span>
                ))}
              </div>
              <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">{description}</p>
            </motion.div>

            {/* Full Description — Expandable */}
            {fullDescription && (
              <motion.div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden" initial="hidden" animate="visible" variants={fadeUp} custom={2.5}>
                <button onClick={() => setDescExpanded(!descExpanded)} className="w-full flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 text-left group min-h-[56px]">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-ice-500 rounded-full" />
                    {t('readMore')}
                  </h2>
                  <motion.div animate={{ rotate: descExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-ice-50 text-ice-600 group-hover:bg-ice-100 transition-colors shrink-0 ml-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {descExpanded ? (
                    <motion.div key="full" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                        <div className="prose prose-neutral max-w-none">
                          {fullDescription.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="text-neutral-600 leading-relaxed text-[15px] sm:text-base mb-4 last:mb-0">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="preview" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 relative">
                        <p className="text-neutral-500 leading-relaxed text-sm line-clamp-3">{fullDescription.split('\n\n')[0]}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Highlights */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-ice-500 rounded-full" />
                {t('highlights')}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-neutral-100 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-ice-400 shrink-0" />
                    <span className="text-sm font-medium text-neutral-700">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Itinerary */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-ice-500 rounded-full" />
                {t('itinerary')}
              </h2>
              <div className="relative">
                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-ice-400 via-ice-300 to-khaki-300 rounded-full" />
                <div className="space-y-6">
                  {itinerary.map((step, i) => (
                    <motion.div key={i} className="relative flex gap-4 pl-0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}>
                      <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-white border-2 border-ice-400 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-ice-600">{step.time}</span>
                      </div>
                      <div className="flex-1 pb-2">
                        <h3 className="font-semibold text-neutral-800 mb-1">{step.title}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Inclusions / Exclusions */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {t('included')}
                </h3>
                <ul className="space-y-2.5">
                  {inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  {t('notIncluded')}
                </h3>
                <ul className="space-y-2.5">
                  {exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Meeting Point */}
            <motion.div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-100 shadow-sm" initial="hidden" animate="visible" variants={fadeUp} custom={5.5}>
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-ice-500 rounded-full" />
                📍 {t('meetingPoint')}
              </h2>
              <p className="text-neutral-600 mb-3">{meetingPoint}</p>
              {tour.meetingPointLat && tour.meetingPointLng && (
                <a href={`https://www.google.com/maps?q=${tour.meetingPointLat},${tour.meetingPointLng}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-ice-50 hover:bg-ice-100 text-ice-700 font-medium rounded-xl text-sm transition-colors border border-ice-100 min-h-[44px]">
                  📍 {t('mapLink')} →
                </a>
              )}
            </motion.div>

            {/* Important Info */}
            {tour.importantInfo && tour.importantInfo.length > 0 && (
              <motion.div className="bg-amber-50/50 rounded-2xl p-5 sm:p-6 border border-amber-100" initial="hidden" animate="visible" variants={fadeUp} custom={6}>
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-400 rounded-full" />
                  ⚠️ {t('importantInfo')}
                </h2>
                <ul className="space-y-2.5">
                  {importantInfo.map((info, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                      {info}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Right column — Sticky Reservation Card */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <motion.div className="lg:sticky lg:top-24" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-100 shadow-xl shadow-neutral-200/40">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-ice-600">{formatPrice(tour.price)}</span>
                  <span className="text-neutral-400 text-sm">{t('perPerson')}</span>
                </div>
                <div className="flex items-center gap-2 mb-6 pb-5 border-b border-neutral-100">
                  <span className="text-amber-400">{starsStr}</span>
                  <span className="font-semibold text-neutral-700">{tour.rating}</span>
                  <span className="text-neutral-400 text-sm">({tour.reviewCount})</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('duration')}</span>
                    <span className="font-medium text-neutral-700">{duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('startTime')}</span>
                    <span className="font-medium text-neutral-700">{tour.startTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('meetingPoint')}</span>
                    <span className="font-medium text-neutral-700 text-right max-w-[180px] truncate">{meetingPoint}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('languages')}</span>
                    <span className="font-medium text-neutral-700">{tour.languages.map(l => LANGUAGE_LABELS[l] || l).join(', ')}</span>
                  </div>
                </div>
                <motion.button whileHover={!isSoldOut && tour.isOpen ? { scale: 1.02 } : {}} whileTap={!isSoldOut && tour.isOpen ? { scale: 0.98 } : {}}
                  onClick={handleReserve} disabled={isSoldOut || !tour.isOpen}
                  className={`w-full py-3.5 font-bold rounded-xl text-base transition-colors min-h-[48px] ${isSoldOut || !tour.isOpen ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'bg-ice-500 hover:bg-ice-600 text-white shadow-lg shadow-ice-500/20'}`}>
                  {isSoldOut ? `🚫 ${t('soldOut')}` : !tour.isOpen ? `🔴 ${t('closedSale')}` : t('reserve')}
                </motion.button>
                <p className="text-center text-xs text-neutral-400 mt-3">{t('freeCancel')}</p>
                <motion.a href="https://wa.me/902560000000" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full py-3 border-2 border-green-500 text-green-600 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors min-h-[48px]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  {t('whatsapp')}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <motion.div className="mt-16" initial="hidden" animate="visible" variants={fadeUp} custom={7}>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-7 bg-ice-500 rounded-full" />
              🎯 {t('related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map((rt, i) => (
                <TourCard key={rt.id} tour={rt} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold text-ice-600">{formatPrice(tour.price)}</span>
            <span className="text-neutral-400 text-xs ml-1">{tcard('perPerson')}</span>
          </div>
          <motion.button whileTap={!isSoldOut && tour.isOpen ? { scale: 0.96 } : {}}
            onClick={handleReserve} disabled={isSoldOut || !tour.isOpen}
            className={`flex-1 max-w-[200px] py-3 font-bold rounded-xl text-sm transition-colors min-h-[48px] ${isSoldOut || !tour.isOpen ? 'bg-neutral-300 text-neutral-500' : 'bg-ice-500 hover:bg-ice-600 text-white'}`}>
            {isSoldOut ? t('soldOut') : !tour.isOpen ? t('closedSale') : t('reserve')}
          </motion.button>
        </div>
      </div>
    </main>
  );
}
