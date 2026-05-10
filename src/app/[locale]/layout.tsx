import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, locales, type Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_LOCALE_MAP: Record<Locale, string> = {
  tr: 'tr_TR', en: 'en_US', ru: 'ru_RU', de: 'de_DE', it: 'it_IT', ar: 'ar_SA', pl: 'pl_PL', es: 'es_ES',
};

const META_TITLE: Record<Locale, string> = {
  tr: 'WeAreShorex — Kuşadası Tur Rezervasyonu',
  en: 'WeAreShorex — Kuşadası Shore Excursions',
  ru: 'WeAreShorex — Береговые экскурсии в Кушадасы',
  de: 'WeAreShorex — Kuşadası Landausflüge',
  it: 'WeAreShorex — Escursioni a Terra a Kuşadası',
  ar: 'WeAreShorex — رحلات الشاطئ في كوشاداسي',
  pl: 'WeAreShorex — Wycieczki brzegowe w Kuşadası',
  es: 'WeAreShorex — Excursiones en Kuşadası',
};

const META_DESC: Record<Locale, string> = {
  tr: 'Kuşadası ve çevresindeki en iyi turları keşfedin. Efes, Pamukkale, tekne turları, doğa yürüyüşleri ve daha fazlası.',
  en: 'Discover the best tours in and around Kuşadası. Ephesus, Pamukkale, boat trips, nature hikes and more.',
  ru: 'Откройте для себя лучшие туры в Кушадасы и окрестностях. Эфес, Памуккале, морские прогулки и многое другое.',
  de: 'Entdecken Sie die besten Touren in und um Kuşadası. Ephesus, Pamukkale, Bootstouren, Naturwanderungen und mehr.',
  it: 'Scopri i migliori tour a Kuşadası e dintorni. Efeso, Pamukkale, gite in barca, escursioni nella natura e altro.',
  ar: 'اكتشف أفضل الجولات في كوشاداسي وضواحيها. أفسس، باموكالي، رحلات القوارب والمشي في الطبيعة والمزيد.',
  pl: 'Odkryj najlepsze wycieczki w Kuşadası i okolicach. Efez, Pamukkale, rejsy, wędrówki i wiele więcej.',
  es: 'Descubre los mejores tours en y alrededor de Kuşadası. Éfeso, Pamukkale, viajes en barco, caminatas y más.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;

  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `https://weareshorex.com/${l}`;
  }

  return {
    title: { default: META_TITLE[loc] || META_TITLE.en, template: '%s | WeAreShorex' },
    description: META_DESC[loc] || META_DESC.en,
    authors: [{ name: 'WeAreShorex' }],
    creator: 'WeAreShorex',
    openGraph: {
      type: 'website',
      locale: OG_LOCALE_MAP[loc] || 'en_US',
      url: `https://weareshorex.com/${locale}`,
      siteName: 'WeAreShorex',
    },
    alternates: {
      canonical: `https://weareshorex.com/${locale}`,
      languages: alternateLanguages,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
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
