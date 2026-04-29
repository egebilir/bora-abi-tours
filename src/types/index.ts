// =============================================
// WeAreShorex — Type Definitions
// =============================================

// ---------- Gallery ----------
export interface GalleryImage {
  url: string;
  alt: string;
  altEn: string;
}

// ---------- Tour Bus (Dil Bazlı Araç Ataması) ----------
export interface TourBus {
  busId: string;
  guideId: string;
  language: string; // 'en', 'tr', 'ru', 'es', 'de' vb.
  booked: number;   // O araçtaki mevcut doluluk
}

// ---------- Tour ----------
export interface Tour {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  currency: string;
  duration: string;
  durationEn: string;
  category: TourCategory;
  rating: number;
  reviewCount: number;
  highlights: string[];
  highlightsEn: string[];
  image: string;
  imageAlt: string;
  imageMetaDescription: string;
  featured: boolean;
  isOpen: boolean; // Satışa açık/kapalı — sadece admin manuel kapatır
  // Sprint 2 additions
  languages: string[];
  tourBuses: TourBus[]; // Dil bazlı araç atamaları
  itinerary: ItineraryStep[];
  inclusions: string[];
  inclusionsEn: string[];
  exclusions: string[];
  exclusionsEn: string[];
  gallery: GalleryImage[];
  meetingPoint: string;
  meetingPointEn: string;
  meetingPointLat: number;
  meetingPointLng: number;
  startTime: string;
  fullDescription: string;
  fullDescriptionEn: string;
  importantInfo: string[];
  importantInfoEn: string[];
}

export interface ItineraryStep {
  time: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export type TourCategory = 'cultural' | 'nature' | 'boat' | 'daily';

// ---------- Guide ----------
export interface Guide {
  id: string;
  name: string;
  languages: string[];
  specialization: string;
  specializationEn: string;
  rating: number;
  tourCount: number;
  avatar: string;
  bio: string;
  bioEn: string;
}

// ---------- Bus ----------
export interface Bus {
  id: string;
  name: string;
  capacity: number;
  features: string[];
  image: string;
}

// ---------- User (Üyelik Sistemi) ----------
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  bookings: string[]; // booking ID'leri
}

// ---------- Review ----------
export interface Review {
  id: string;
  tourId: string;
  userId: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  photos: string[];
  date: string;
  verified: boolean; // Satın almış mı?
}

// ---------- Booking ----------
export interface Booking {
  id: string;
  tourId: string;
  date: string;
  count: number;
  language: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialNotes?: string;
  userId?: string;
  status: 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

// ---------- Mock Data ----------
export interface MockData {
  tours: Tour[];
  guides: Guide[];
  buses: Bus[];
  reviews: Review[];
}

export const CATEGORY_LABELS: Record<TourCategory, { tr: string; en: string }> = {
  cultural: { tr: 'Kültürel', en: 'Cultural' },
  nature: { tr: 'Doğa', en: 'Nature' },
  boat: { tr: 'Tekne', en: 'Boat' },
  daily: { tr: 'Günlük', en: 'Daily' },
};

export const LANGUAGE_LABELS: Record<string, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  ru: 'Русский',
  fr: 'Français',
  it: 'Italiano',
  ar: 'العربية',
  pl: 'Polski',
  el: 'Ελληνικά',
  es: 'Español',
};

export const LANGUAGE_FLAGS: Record<string, string> = {
  tr: '🇹🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  ru: '🇷🇺',
  fr: '🇫🇷',
  it: '🇮🇹',
  ar: '🇸🇦',
  pl: '🇵🇱',
  el: '🇬🇷',
  es: '🇪🇸',
};
