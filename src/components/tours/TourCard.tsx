'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Tour } from '@/types';
import { getCategoryIcon, getStarRating, cn } from '@/lib/utils';
import { JsonLdScript, generateTourProductJsonLd } from '@/lib/seo';
import { useCurrency } from '@/lib/currency';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

interface TourCardProps {
  tour: Tour;
  index: number;
}

const categoryColors: Record<string, string> = {
  cultural: 'bg-ice-100 text-ice-700 border-ice-200',
  nature: 'bg-khaki-50 text-khaki-700 border-khaki-200',
  boat: 'bg-blue-50 text-blue-700 border-blue-200',
  daily: 'bg-amber-50 text-amber-700 border-amber-200',
};

function StarRating({ rating }: { rating: number }) {
  const { full, half, empty } = getStarRating(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {half && (
        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <defs><clipPath id="half"><rect x="0" y="0" width="10" height="20" /></clipPath></defs>
          <path clipPath="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          <path className="text-neutral-200" fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-4 h-4 text-neutral-200" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TourCard({ tour, index }: TourCardProps) {
  const { formatPrice } = useCurrency();
  const t = useTranslations('tourCard');
  const tc = useTranslations('categories');
  const tsp = useTranslations('socialProof');
  const locale = useLocale();

  const useEn = locale !== 'tr';
  const title = useEn && tour.titleEn ? tour.titleEn : tour.title;
  const description = useEn && tour.descriptionEn ? tour.descriptionEn : tour.description;
  const isPopular = tour.rating >= 4.7 && tour.reviewCount >= 200;

  return (
    <>
      <JsonLdScript data={generateTourProductJsonLd(tour)} />
      <Link href={`/tours/${tour.id}`}>
      <motion.article
        className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer"
        layout
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
        whileHover={{ y: -6 }}
        id={`tour-card-${tour.id}`}
      >
        <div className="relative h-52 overflow-hidden">
          <Image
            src={tour.image}
            alt={tour.imageAlt || title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-3 left-3">
            <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm', categoryColors[tour.category])}>
              {getCategoryIcon(tour.category)} {tc(tour.category)}
            </span>
          </div>

          {/* Top-right badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {tour.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-900">
                ⭐ {t('featured')}
              </span>
            )}
            {isPopular && tour.isOpen && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse">
                🔥 {tsp('likelySellOut')}
              </span>
            )}
          </div>

          {!tour.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-full text-sm shadow-lg">
                {t('closed')}
              </span>
            </div>
          )}

          <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={false}>
            <span className="px-6 py-2.5 bg-white text-ice-600 font-semibold rounded-full shadow-xl text-sm">
              {t('details')}
            </span>
          </motion.div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-neutral-900 mb-1.5 group-hover:text-ice-600 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-4 mb-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tour.duration}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {tour.languages.length} {t('languages')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <StarRating rating={tour.rating} />
              <span className="text-sm font-medium text-neutral-700">{tour.rating}</span>
              <span className="text-xs text-neutral-400">({tour.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-ice-600">{formatPrice(tour.price)}</span>
              <span className="text-xs text-neutral-400 block">{t('perPerson')}</span>
            </div>
          </div>
        </div>
      </motion.article>
      </Link>
    </>
  );
}
