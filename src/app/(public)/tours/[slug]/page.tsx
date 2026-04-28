import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mockData from '@/data/mockData.json';
import { Tour, MockData } from '@/types';
import { generateTourProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import TourDetailClient from './TourDetailClient';

const data = mockData as unknown as MockData;

export function generateStaticParams() {
  return data.tours.map((tour) => ({
    slug: tour.id,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = data.tours.find((t) => t.id === slug);
  if (!tour) return {};

  return {
    title: `${tour.title} | Bora Abi Tours`,
    description: tour.description,
    keywords: [tour.title, tour.titleEn, 'Kuşadası turları', tour.category, ...tour.highlights],
    openGraph: {
      title: `${tour.title} — Bora Abi Tours`,
      description: tour.description,
      url: `https://boraabitours.com/tours/${tour.id}`,
      images: [{ url: tour.image, width: 1200, height: 630, alt: tour.imageAlt || tour.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tour.title,
      description: tour.description,
      images: [tour.image],
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = data.tours.find((t) => t.id === slug);
  if (!tour) notFound();

  const relatedTours = data.tours.filter((t) => t.id !== tour.id).slice(0, 4);

  return (
    <>
      {/* JSON-LD */}
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
              { name: 'Ana Sayfa', url: 'https://boraabitours.com' },
              { name: 'Turlar', url: 'https://boraabitours.com/#tours' },
              { name: tour.title, url: `https://boraabitours.com/tours/${tour.id}` },
            ])
          ),
        }}
      />

      <TourDetailClient tour={tour} relatedTours={relatedTours} />
    </>
  );
}
