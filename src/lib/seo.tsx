// =============================================
// JSON-LD Schema Generators (Schema.org)
// Product + AggregateRating + Offer for rich snippets
// =============================================

import { Tour } from '@/types';

const SITE_URL = 'https://weareshorex.com';
const SITE_NAME = 'WeAreShorex';

/**
 * Organization schema — site-wide, injected in root layout
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      'Kuşadası ve çevresindeki en iyi turları keşfedin. Efes, Pamukkale, tekne turları ve daha fazlası.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kuşadası',
      addressRegion: 'Aydın',
      addressCountry: 'TR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-256-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English', 'Russian', 'Italian', 'Arabic', 'Polish', 'German'],
    },
    sameAs: [
      'https://www.instagram.com/boraabitours',
      'https://www.facebook.com/boraabitours',
    ],
  };
}

/**
 * Product schema with AggregateRating and Offer — per tour card
 * This enables Google rich snippets (stars + price in search results)
 */
export function generateTourProductJsonLd(tour: Tour) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.titleEn,
    description: tour.descriptionEn,
    image: `${SITE_URL}${tour.image}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tour.rating.toString(),
      bestRating: '5',
      worstRating: '1',
      reviewCount: tour.reviewCount.toString(),
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/tours/${tour.id}`,
      priceCurrency: tour.currency,
      price: tour.price.toString(),
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
}

/**
 * TouristTrip schema — additional structured data per tour
 */
export function generateTouristTripJsonLd(tour: Tour) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.titleEn,
    description: tour.descriptionEn,
    touristType: tour.category,
    image: `${SITE_URL}${tour.image}`,
    offers: {
      '@type': 'Offer',
      price: tour.price.toString(),
      priceCurrency: tour.currency,
    },
  };
}

/**
 * BreadcrumbList schema — for navigation
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Renders a JSON-LD script tag from a schema object
 */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
