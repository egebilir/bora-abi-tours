// =============================================
// Tour Content Translations Helper
// Provides localized tour content for all 7 languages
// TR and EN come from mockData.json, others from this file
// =============================================

export interface TourContentTranslation {
  title: string;
  description: string;
  fullDescription: string;
  duration: string;
  meetingPoint: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  importantInfo: string[];
  itinerary: { time: string; title: string; description: string }[];
}

type TranslationMap = Record<string, Record<string, TourContentTranslation>>;

// Import translations data
import translationsData from '@/data/tourContentTranslations.json';

const translations: TranslationMap = translationsData as TranslationMap;

/**
 * Get localized tour content.
 * - TR: uses tour's native TR fields
 * - EN: uses tour's En fields
 * - Others: uses tourContentTranslations.json, falls back to EN
 */
export function getLocalizedTourContent(
  tour: {
    id: string;
    title: string; titleEn: string;
    description: string; descriptionEn: string;
    fullDescription: string; fullDescriptionEn: string;
    duration: string; durationEn: string;
    meetingPoint: string; meetingPointEn: string;
    highlights: string[]; highlightsEn: string[];
    inclusions: string[]; inclusionsEn: string[];
    exclusions: string[]; exclusionsEn: string[];
    importantInfo: string[]; importantInfoEn: string[];
    itinerary: { time: string; title: string; titleEn: string; description: string; descriptionEn: string }[];
  },
  locale: string
): TourContentTranslation {
  // Turkish — use native fields
  if (locale === 'tr') {
    return {
      title: tour.title,
      description: tour.description,
      fullDescription: tour.fullDescription,
      duration: tour.duration,
      meetingPoint: tour.meetingPoint,
      highlights: tour.highlights,
      inclusions: tour.inclusions,
      exclusions: tour.exclusions,
      importantInfo: tour.importantInfo,
      itinerary: tour.itinerary.map(s => ({ time: s.time, title: s.title, description: s.description })),
    };
  }

  // English — use En fields
  if (locale === 'en') {
    return {
      title: tour.titleEn,
      description: tour.descriptionEn,
      fullDescription: tour.fullDescriptionEn,
      duration: tour.durationEn,
      meetingPoint: tour.meetingPointEn,
      highlights: tour.highlightsEn,
      inclusions: tour.inclusionsEn,
      exclusions: tour.exclusionsEn,
      importantInfo: tour.importantInfoEn,
      itinerary: tour.itinerary.map(s => ({ time: s.time, title: s.titleEn, description: s.descriptionEn })),
    };
  }

  // Other languages — use translations file, fallback to EN
  const tourTranslations = translations[tour.id]?.[locale];
  if (tourTranslations) {
    return tourTranslations;
  }

  // Fallback to English
  return {
    title: tour.titleEn,
    description: tour.descriptionEn,
    fullDescription: tour.fullDescriptionEn,
    duration: tour.durationEn,
    meetingPoint: tour.meetingPointEn,
    highlights: tour.highlightsEn,
    inclusions: tour.inclusionsEn,
    exclusions: tour.exclusionsEn,
    importantInfo: tour.importantInfoEn,
    itinerary: tour.itinerary.map(s => ({ time: s.time, title: s.titleEn, description: s.descriptionEn })),
  };
}
