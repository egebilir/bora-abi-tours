import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import PrivateExcursionsClient from './PrivateExcursionsComposed';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale !== 'tr';
  return {
    title: isEn ? 'Private Excursions — VIP Tours in Kuşadası | WeAreShorex' : 'Özel Turlar — Kuşadası VIP Turları | WeAreShorex',
    description: isEn
      ? 'Book a private, tailor-made shore excursion in Kuşadası. Exclusive VIP tours to Ephesus, Pamukkale, and the Aegean coast with a personal guide.'
      : 'Kuşadası\'da özel, size özel kıyı turu rezervasyonu yapın. Kişisel rehber eşliğinde Efes, Pamukkale ve Ege kıyısında VIP turlar.',
    alternates: {
      canonical: `https://weareshorex.com/${locale}/private-excursions`,
      languages: Object.fromEntries(routing.locales.map(l => [l, `https://weareshorex.com/${l}/private-excursions`])),
    },
  };
}

export default async function PrivateExcursionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivateExcursionsClient />;
}
