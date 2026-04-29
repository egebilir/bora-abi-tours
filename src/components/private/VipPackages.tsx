'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const packages = [
  { key: 'classic', image: '/images/tours/ephesus.png', duration: '6-7h', highlights: ['ephesus', 'sirince', 'lunch'], popular: true },
  { key: 'adventure', image: '/images/tours/pamukkale.png', duration: '10-12h', highlights: ['pamukkale', 'cleopatra', 'hierapolis'], popular: false },
  { key: 'sea', image: '/images/tours/boat-tour.png', duration: '5-6h', highlights: ['privateboating', 'swimming', 'bbq'], popular: false },
];

export default function VipPackages({ onSelect }: { onSelect: (pkg: string) => void }) {
  const t = useTranslations('vipPage.packages');
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-neutral-950 to-neutral-900 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('badge')}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {packages.map((pkg, i) => (
            <motion.div key={pkg.key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${pkg.popular ? 'border-amber-400/50 shadow-lg shadow-amber-500/10' : 'border-neutral-700/50 hover:border-neutral-600'}`}
              onClick={() => onSelect(pkg.key)}>
              {pkg.popular && (
                <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-amber-400 text-neutral-900 text-[10px] font-bold uppercase tracking-wider">
                  {t('popular')}
                </div>
              )}
              <div className="relative h-44 overflow-hidden">
                <Image src={pkg.image} alt={t(`${pkg.key}.name`)} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:640px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium">⏱ {pkg.duration}</span>
                </div>
              </div>
              <div className="p-5 bg-neutral-900">
                <h3 className="text-lg font-bold text-white mb-3">{t(`${pkg.key}.name`)}</h3>
                <ul className="space-y-2 mb-4">
                  {pkg.highlights.map(h => (
                    <li key={h} className="flex items-center gap-2 text-sm text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {t(`${pkg.key}.${h}`)}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600">{t('priceOnRequest')}</span>
                  <span className="text-amber-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t('customize')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p className="text-center text-neutral-600 text-sm mt-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {t('customNote')}
        </motion.p>
      </div>
    </section>
  );
}
