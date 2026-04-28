'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  locale: string;
  labels: {
    selectDate: string;
    dateNote: string;
    monthNames: string; // comma-separated
    weekDays: string;   // comma-separated (Mon,Tue,...)
    today: string;
  };
}

export default function DatePicker({ value, onChange, locale, labels }: DatePickerProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [direction, setDirection] = useState(0); // -1 prev, 1 next

  const monthNames = labels.monthNames.split(',').map(s => s.trim());
  const weekDays = labels.weekDays.split(',').map(s => s.trim());

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 60);
    return d;
  }, [today]);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Monday-based: 0=Mon, 6=Sun
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: { date: Date; inMonth: boolean; }[] = [];

    // Previous month padding
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth, -i);
      days.push({ date: d, inMonth: false });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(currentYear, currentMonth, i), inMonth: true });
    }

    // Next month padding (fill to 42 = 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(currentYear, currentMonth + 1, i), inMonth: false });
    }

    return days;
  }, [currentMonth, currentYear]);

  const canGoPrev = new Date(currentYear, currentMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = new Date(currentYear, currentMonth + 1, 1) <= maxDate;

  const goMonth = (dir: number) => {
    if (dir < 0 && !canGoPrev) return;
    if (dir > 0 && !canGoNext) return;
    setDirection(dir);
    setViewDate(new Date(currentYear, currentMonth + dir, 1));
  };

  const isDisabled = (date: Date) => {
    return date < today || date > maxDate;
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    const [y, m, d] = value.split('-').map(Number);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  };

  const isToday = (date: Date) => {
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  };

  const selectDate = (date: Date) => {
    if (isDisabled(date)) return;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
  };

  const formatSelectedDate = () => {
    if (!value) return '';
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const localeMap: Record<string, string> = { tr: 'tr-TR', en: 'en-US', ru: 'ru-RU', de: 'de-DE', it: 'it-IT', ar: 'ar-SA', pl: 'pl-PL' };
    return date.toLocaleDateString(localeMap[locale] || 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700">
        📅 {labels.selectDate} *
      </label>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-ice-50 to-ice-50/50 border-b border-neutral-100">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            disabled={!canGoPrev}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${canGoPrev ? 'hover:bg-white/80 text-neutral-700 active:scale-95' : 'text-neutral-300 cursor-not-allowed'}`}
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${currentYear}-${currentMonth}`}
              initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
              transition={{ duration: 0.2 }}
              className="text-base font-bold text-neutral-800"
            >
              {monthNames[currentMonth]} {currentYear}
            </motion.span>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => goMonth(1)}
            disabled={!canGoNext}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${canGoNext ? 'hover:bg-white/80 text-neutral-700 active:scale-95' : 'text-neutral-300 cursor-not-allowed'}`}
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Week Day Headers */}
        <div className="grid grid-cols-7 border-b border-neutral-100">
          {weekDays.map((day, i) => (
            <div key={i} className="py-2.5 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${currentYear}-${currentMonth}`}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="grid grid-cols-7 p-1.5 gap-0.5"
          >
            {calendarDays.map((day, i) => {
              const disabled = isDisabled(day.date) || !day.inMonth;
              const selected = isSelected(day.date);
              const todayMark = isToday(day.date);

              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => day.inMonth && selectDate(day.date)}
                  disabled={disabled}
                  className={`
                    relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all min-h-[44px]
                    ${disabled
                      ? 'text-neutral-200 cursor-not-allowed'
                      : selected
                        ? 'bg-ice-500 text-white shadow-lg shadow-ice-500/30 scale-105'
                        : todayMark
                          ? 'bg-ice-50 text-ice-700 font-bold ring-2 ring-ice-200 hover:bg-ice-100'
                          : 'text-neutral-700 hover:bg-neutral-100 active:scale-95'
                    }
                  `}
                >
                  {day.date.getDate()}
                  {todayMark && !selected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ice-500" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Selected Date Display */}
        {value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-4 py-3 bg-ice-50/50 border-t border-ice-100 flex items-center gap-2"
          >
            <span className="text-ice-600 text-lg">✓</span>
            <span className="text-sm font-medium text-ice-700">{formatSelectedDate()}</span>
          </motion.div>
        )}
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50/60 rounded-xl border border-amber-100/80">
        <span className="text-amber-500 text-base mt-0.5 shrink-0">ℹ️</span>
        <p className="text-xs text-amber-700 leading-relaxed">{labels.dateNote}</p>
      </div>
    </div>
  );
}
