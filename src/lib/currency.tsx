'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// =============================================
// Currency definitions mapped to supported languages
// EUR is the base currency — all tour prices are stored in EUR
// =============================================

export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  flag: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
  { code: 'TRY', symbol: '₺', label: 'Türk Lirası', flag: '🇹🇷' },
  { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'RUB', symbol: '₽', label: 'Российский рубль', flag: '🇷🇺' },
  { code: 'SAR', symbol: '﷼', label: 'ريال سعودي', flag: '🇸🇦' },
  { code: 'PLN', symbol: 'zł', label: 'Polski Złoty', flag: '🇵🇱' },
  { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
];

// Fallback rates in case API is unreachable (approximate)
const FALLBACK_RATES: Record<string, number> = {
  EUR: 1,
  TRY: 38.5,
  USD: 1.08,
  RUB: 105,
  SAR: 4.05,
  PLN: 4.28,
  GBP: 0.85,
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (c: CurrencyInfo) => void;
  rates: Record<string, number>;
  convert: (amountInEur: number) => number;
  formatPrice: (amountInEur: number) => string;
  loading: boolean;
  lastUpdated: string | null;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(CURRENCIES[0]); // EUR default
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Restore saved currency from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bora-currency');
      if (saved) {
        const found = CURRENCIES.find((c) => c.code === saved);
        if (found) setCurrencyState(found);
      }
    } catch { /* SSR or storage unavailable */ }
  }, []);

  // Wrap setCurrency to also persist to localStorage
  const setCurrency = useCallback((c: CurrencyInfo) => {
    setCurrencyState(c);
    try { localStorage.setItem('bora-currency', c.code); } catch { /* noop */ }
  }, []);

  // Fetch live exchange rates from open.er-api.com (ECB-backed, free, no key)
  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
          next: { revalidate: 3600 }, // cache for 1 hour
        });
        if (!res.ok) throw new Error('Rate fetch failed');
        const data = await res.json();

        if (!cancelled && data.rates) {
          const filteredRates: Record<string, number> = { EUR: 1 };
          for (const c of CURRENCIES) {
            if (data.rates[c.code]) {
              filteredRates[c.code] = data.rates[c.code];
            }
          }
          setRates(filteredRates);
          setLastUpdated(data.time_last_update_utc || new Date().toISOString());
        }
      } catch {
        // Use fallback rates silently
        console.warn('Currency API unreachable, using fallback rates');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRates();
    return () => { cancelled = true; };
  }, []);

  const convert = useCallback(
    (amountInEur: number): number => {
      const rate = rates[currency.code] || 1;
      return Math.round(amountInEur * rate * 100) / 100;
    },
    [currency.code, rates]
  );

  const formatPriceFn = useCallback(
    (amountInEur: number): string => {
      const converted = convert(amountInEur);
      // Format with locale-appropriate separators
      const formatted = new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: currency.code === 'EUR' ? 0 : 0,
        maximumFractionDigits: currency.code === 'RUB' || currency.code === 'TRY' ? 0 : 2,
      }).format(converted);
      return `${currency.symbol} ${formatted}`;
    },
    [convert, currency.code, currency.symbol]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        convert,
        formatPrice: formatPriceFn,
        loading,
        lastUpdated,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
