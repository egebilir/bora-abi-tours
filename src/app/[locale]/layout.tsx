import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  return {
    title: {
      default: isEn
        ? 'Bora Abi Tours — Kuşadası Tour Booking'
        : 'Bora Abi Tours — Kuşadası Tur Rezervasyonu',
      template: '%s | Bora Abi Tours',
    },
    description: isEn
      ? 'Discover the best tours in and around Kuşadası. Ephesus, Pamukkale, boat trips, nature hikes and more. Professional guides, affordable prices.'
      : 'Kuşadası ve çevresindeki en iyi turları keşfedin. Efes, Pamukkale, tekne turları, doğa yürüyüşleri ve daha fazlası. Profesyonel rehberler, uygun fiyatlar.',
    keywords: isEn
      ? ['Kuşadası tours', 'Ephesus tour', 'Pamukkale day trip', 'Kuşadası boat tour', 'Turkey excursions']
      : ['Kuşadası turları', 'Efes turu', 'Pamukkale günübirlik', 'Kuşadası tekne turu', 'Ege turları'],
    authors: [{ name: 'Bora Abi Tours' }],
    creator: 'Bora Abi Tours',
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'tr_TR',
      url: `https://weareshorex.com/${locale}`,
      siteName: 'Bora Abi Tours',
    },
    alternates: {
      canonical: `https://weareshorex.com/${locale}`,
      languages: {
        tr: 'https://weareshorex.com/tr',
        en: 'https://weareshorex.com/en',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
