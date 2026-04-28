// =============================================
// Utility Functions
// =============================================

import { TourCategory } from '@/types';

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    TRY: '₺',
    GBP: '£',
  };
  return `${symbols[currency] || currency} ${price}`;
}

/**
 * Get category icon (emoji-free, for badge use)
 */
export function getCategoryIcon(category: TourCategory): string {
  const icons: Record<TourCategory, string> = {
    cultural: '🏛️',
    nature: '🌿',
    boat: '⛵',
    daily: '☀️',
  };
  return icons[category];
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Generate star rating display
 */
export function getStarRating(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

/**
 * classNames utility — merge conditional classes
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
