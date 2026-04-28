import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mockData from '@/data/mockData.json';
import { Tour, MockData } from '@/types';
import { generateTourProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import TourDetailClient from './TourDetailClient';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

const data = mockData as unknown as MockData;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    data.tours.map((tour) => ({
      locale,
      slug: tour.id,
    }))
  );
}

export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const tour = data.tours.find((t) => t.id === slug);
  if (!tour) return {};

  const useEn = locale !== 'tr';
  const title = useEn && tour.titleEn ? tour.titleEn : tour.title;
  const description = useEn && tour.descriptionEn ? tour.descriptionEn : tour.description;

  return {
    title: `${title} | Bora Abi Tours`,
    description,
    keywords: [tour.title, tour.titleEn, 'Kuşadası turları', tour.category, ...tour.highlights],
    openGraph: {
      title: `${title} — Bora Abi Tours`,
      description,
      url: `https://weareshorex.com/${locale}/tours/${tour.id}`,
      images: [{ url: tour.image, width: 1200, height: 630, alt: tour.imageAlt || title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [tour.image],
    },
    alternates: {
      canonical: `https://weareshorex.com/${locale}/tours/${tour.id}`,
      languages: Object.fromEntries(
        ['tr','en','ru','de','it','ar','pl'].map(l => [l, `https://weareshorex.com/${l}/tours/${tour.id}`])
      ),
    },
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const tour = data.tours.find((t) => t.id === slug);
  if (!tour) notFound();

  const relatedTours = data.tours.filter((t) => t.id !== tour.id).slice(0, 4);

  const useEn = locale !== 'tr';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateTourProductJsonLd(tour)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: useEn ? 'Home' : 'Ana Sayfa', url: `https://weareshorex.com/${locale}` },
              { name: useEn ? 'Tours' : 'Turlar', url: `https://weareshorex.com/${locale}#tours` },
              { name: useEn && tour.titleEn ? tour.titleEn : tour.title, url: `https://weareshorex.com/${locale}/tours/${tour.id}` },
            ])
          ),
        }}
      />

      <TourDetailClient tour={tour} relatedTours={relatedTours} />
    </>
  );
}
