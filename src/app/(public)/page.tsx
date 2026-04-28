import HeroSection from '@/components/hero/HeroSection';
import TourGrid from '@/components/tours/TourGrid';
import mockData from '@/data/mockData.json';
import { Tour } from '@/types';
import { JsonLdScript, generateBreadcrumbJsonLd } from '@/lib/seo';

export default function Home() {
  const tours = mockData.tours as Tour[];

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Turlar', url: '/#tours' },
  ];

  return (
    <>
      <JsonLdScript data={generateBreadcrumbJsonLd(breadcrumbs)} />
      <HeroSection />
      <TourGrid tours={tours} />
    </>
  );
}
