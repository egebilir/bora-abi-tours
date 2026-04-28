import HeroSection from '@/components/hero/HeroSection';
import TourGrid from '@/components/tours/TourGrid';
import mockData from '@/data/mockData.json';
import { Tour } from '@/types';
import { JsonLdScript, generateBreadcrumbJsonLd } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tours = mockData.tours as Tour[];

  const breadcrumbs = [
    { name: locale === 'en' ? 'Home' : 'Ana Sayfa', url: `/${locale}` },
    { name: locale === 'en' ? 'Tours' : 'Turlar', url: `/${locale}#tours` },
  ];

  return (
    <>
      <JsonLdScript data={generateBreadcrumbJsonLd(breadcrumbs)} />
      <HeroSection />
      <TourGrid tours={tours} />
    </>
  );
}
