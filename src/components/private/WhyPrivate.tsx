'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const features = [
  { key: 'guide', icon: '👤', group: '🚌 15-40', private: '👤 1' },
  { key: 'schedule', icon: '⏰', group: '⏰ Fixed', private: '🎯 Flexible' },
  { key: 'vehicle', icon: '🚐', group: '🚌 Bus', private: '🚐 Luxury' },
  { key: 'stops', icon: '📍', group: '3-4', private: '∞ Unlimited' },
  { key: 'lunch', icon: '🍽️', group: '🏪 Tourist', private: '⭐ Curated' },
  { key: 'photos', icon: '📸', group: '❌', private: '✅ Pro' },
];

export default function WhyPrivate() {
  const t = useTranslations('vipPage.whyPrivate');
  return (
    <section className="py-16 sm:py-20 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ice-500/3 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">{t('badge')}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-neutral-800/50 overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-neutral-800/50">
            <div className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider" />
            <div className="p-4 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider border-x border-neutral-800/30">{t('group')}</div>
            <div className="p-4 text-center">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold uppercase tracking-wider">{t('private')}</span>
            </div>
          </div>
          {/* Rows */}
          {features.map((f, i) => (
            <motion.div key={f.key} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`grid grid-cols-3 ${i < features.length - 1 ? 'border-b border-neutral-800/30' : ''}`}>
              <div className="p-4 flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm font-medium text-neutral-300">{t(`features.${f.key}`)}</span>
              </div>
              <div className="p-4 flex items-center justify-center text-sm text-neutral-500 border-x border-neutral-800/30">{f.group}</div>
              <div className="p-4 flex items-center justify-center text-sm font-semibold text-amber-300">{f.private}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
