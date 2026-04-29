import type { MetadataRoute } from 'next';
import mockData from '@/data/mockData.json';
import blogData from '@/data/mockBlogData.json';

const BASE_URL = 'https://weareshorex.com';
const locales = ['tr', 'en', 'ru', 'de', 'it', 'ar', 'pl'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home pages per locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  }

  // Tour detail pages: each tour × each locale
  for (const tour of mockData.tours) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/tours/${tour.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  // Blog list page per locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Private excursions page per locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}/private-excursions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Blog detail pages: each published post × each locale
  for (const post of blogData.posts.filter(p => p.status === 'published')) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
