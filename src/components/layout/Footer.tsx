'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-neutral-900 text-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none">
                <circle cx="18" cy="18" r="16" stroke="#38BDF8" strokeWidth="2" />
                <path d="M18 6L20 16L18 18L16 16L18 6Z" fill="#38BDF8" />
                <path d="M18 30L16 20L18 18L20 20L18 30Z" fill="#9C9473" />
                <path d="M6 18L16 16L18 18L16 20L6 18Z" fill="#38BDF8" />
                <path d="M30 18L20 20L18 18L20 16L30 18Z" fill="#9C9473" />
              </svg>
              <span className="text-lg font-bold">
                Bora Abi <span className="text-ice-400">Tours</span>
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4 max-w-xs">
              {t('about')}
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Facebook', 'Twitter'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-ice-500 hover:text-white transition-all duration-300 text-sm" aria-label={s}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Tours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">{t('tours')}</h4>
            <ul className="space-y-2.5">
              {(['culturalTours', 'natureTours', 'boatTours', 'dailyTours', 'allTours'] as const).map((key) => (
                <li key={key}>
                  <a href="#tours" className="text-neutral-400 hover:text-ice-400 transition-colors text-sm">{t(key)}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">{t('company')}</h4>
            <ul className="space-y-2.5">
              {(['aboutUs', 'ourGuides', 'blog', 'career', 'contactLink'] as const).map((key) => (
                <li key={key}>
                  <a href="#" className="text-neutral-400 hover:text-ice-400 transition-colors text-sm">{t(key)}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-neutral-400">
                <svg className="w-4 h-4 mt-0.5 text-khaki-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Kuşadası Marina, Aydın, Türkiye
              </li>
              <li className="flex items-center gap-2.5 text-sm text-neutral-400">
                <svg className="w-4 h-4 text-khaki-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@weareshorex.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-neutral-400">
                <svg className="w-4 h-4 text-khaki-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +90 256 XXX XX XX
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-xs">
            © {new Date().getFullYear()} Bora Abi Tours. {t('rights')}
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <a href="#" className="hover:text-neutral-300 transition-colors">{t('privacy')}</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">{t('terms')}</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">{t('cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
