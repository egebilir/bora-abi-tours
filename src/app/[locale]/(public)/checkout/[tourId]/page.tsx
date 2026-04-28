'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAdminStore } from '@/lib/admin-store';
import { useUserAuth } from '@/lib/user-auth';
import { useCurrency } from '@/lib/currency';
import { LANGUAGE_LABELS, LANGUAGE_FLAGS } from '@/types';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import DatePicker from '@/components/checkout/DatePicker';

export default function CheckoutPage({ params }: { params: Promise<{ tourId: string }> }) {
  const { tourId } = use(params);
  const router = useRouter();
  const locale = useLocale();
  const { tours, getTourCapacity } = useAdminStore();
  const { user } = useUserAuth();
  const { formatPrice } = useCurrency();

  const t = useTranslations('checkout');
  const tc = useTranslations('common');

  const tour = tours.find(t => t.id === tourId);
  const capacity = tour ? getTourCapacity(tourId) : { total: 0, booked: 0, available: 0 };
  const availableLanguages = tour ? [...new Set(tour.tourBuses.map(tb => tb.language))] : [];

  const isEn = locale !== 'tr';
  const tourTitle = isEn && tour?.titleEn ? tour.titleEn : tour?.title;

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    language: availableLanguages[0] || 'en',
    count: 1,
    preferredDate: '',
    specialNotes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (availableLanguages.length > 0 && !availableLanguages.includes(form.language)) {
      setForm(prev => ({ ...prev, language: availableLanguages[0] }));
    }
  }, [availableLanguages, form.language]);

  if (!tour) {
    return (
      <main className="min-h-screen bg-neutral-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">{tc('tourNotFound')}</p>
          <Link href="/" className="text-ice-600 hover:text-ice-700 font-medium">{tc('backHome')}</Link>
        </div>
      </main>
    );
  }

  const unitPrice = tour.price;
  const totalPrice = unitPrice * form.count;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = '!';
    if (!form.customerEmail.trim() || !/\S+@\S+\.\S+/.test(form.customerEmail)) e.customerEmail = '!';
    if (!form.customerPhone.trim() || form.customerPhone.replace(/\D/g, '').length < 10) e.customerPhone = '!';
    if (form.count < 1) e.count = '!';
    if (form.count > capacity.available) e.count = `Max ${capacity.available}`;
    if (!form.preferredDate) e.preferredDate = t('dateRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    sessionStorage.setItem('checkout-data', JSON.stringify({
      tourId: tour.id,
      tourTitle: tourTitle,
      tourImage: tour.image,
      tourImageAlt: tour.imageAlt,
      ...form,
      unitPrice,
      totalPrice,
      date: form.preferredDate,
    }));
    router.push(`/checkout/${tour.id}/payment`);
  };

  const dateLocaleMap: Record<string, string> = { tr: 'tr-TR', en: 'en-US', ru: 'ru-RU', de: 'de-DE', it: 'it-IT', ar: 'ar-SA', pl: 'pl-PL' };

  return (
    <main className="min-h-screen bg-neutral-50 pt-16 lg:pt-20 pb-24 lg:pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link href="/" className="hover:text-ice-500 transition-colors">{tc('home')}</Link>
            <span>/</span>
            <Link href={`/tours/${tour.id}`} className="hover:text-ice-500 transition-colors">{tourTitle}</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium">{tc('reservation')}</span>
          </nav>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center gap-0 mb-8">
          {[{ n: 1, label: tc('steps') }, { n: 2, label: tc('payment') }, { n: 3, label: tc('confirmation') }].map((step, i) => (
            <div key={step.n} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step.n === 1 ? 'bg-ice-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{step.n}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-0.5 bg-neutral-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Left — Form */}
          <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-7">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">📋 {t('title')}</h1>

              <div className="space-y-5">
                <div>
                  <label htmlFor="checkout-name" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('name')} *</label>
                  <input id="checkout-name" type="text" value={form.customerName}
                    onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-ice-500 ${errors.customerName ? 'border-red-300 bg-red-50' : 'border-neutral-200'}`} />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label htmlFor="checkout-email" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('email')} *</label>
                  <input id="checkout-email" type="email" value={form.customerEmail}
                    onChange={e => setForm(p => ({ ...p, customerEmail: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-ice-500 ${errors.customerEmail ? 'border-red-300 bg-red-50' : 'border-neutral-200'}`}
                    placeholder="email@example.com" />
                  {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('phone')} *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">📱</span>
                    <input id="checkout-phone" type="tel" value={form.customerPhone}
                      onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-ice-500 ${errors.customerPhone ? 'border-red-300 bg-red-50' : 'border-neutral-200'}`}
                      placeholder="+90 555 123 4567" />
                  </div>
                  {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-lang" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('language')}</label>
                    <select id="checkout-lang" value={form.language}
                      onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 bg-white">
                      {availableLanguages.map(l => (
                        <option key={l} value={l}>{LANGUAGE_FLAGS[l]} {LANGUAGE_LABELS[l] || l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('count')}</label>
                    <div className="flex items-center gap-0 border border-neutral-200 rounded-xl overflow-hidden">
                      <button onClick={() => setForm(p => ({ ...p, count: Math.max(1, p.count - 1) }))}
                        className="px-4 py-3 text-lg font-bold text-neutral-500 hover:bg-neutral-50 transition-colors min-w-[48px] min-h-[48px]">−</button>
                      <span className="flex-1 text-center text-lg font-bold text-neutral-900">{form.count}</span>
                      <button onClick={() => setForm(p => ({ ...p, count: Math.min(capacity.available, p.count + 1) }))}
                        className="px-4 py-3 text-lg font-bold text-neutral-500 hover:bg-neutral-50 transition-colors min-w-[48px] min-h-[48px]">+</button>
                    </div>
                    {errors.count && <p className="text-red-500 text-xs mt-1">{errors.count}</p>}
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <DatePicker
                    value={form.preferredDate}
                    onChange={(date) => { setForm(p => ({ ...p, preferredDate: date })); setErrors(e => { const n = { ...e }; delete n.preferredDate; return n; }); }}
                    locale={locale}
                    labels={{
                      selectDate: t('selectDate'),
                      dateNote: t('dateNote'),
                      monthNames: t('monthNames'),
                      weekDays: t('weekDays'),
                      today: t('today'),
                    }}
                  />
                  {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label htmlFor="checkout-notes" className="block text-sm font-medium text-neutral-700 mb-1.5">📝 {t('notes')}</label>
                  <textarea id="checkout-notes" value={form.specialNotes}
                    onChange={e => setForm(p => ({ ...p, specialNotes: e.target.value }))}
                    rows={3} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 resize-y"
                    placeholder={t('notesHint')} />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full mt-6 py-4 bg-ice-500 hover:bg-ice-600 text-white font-bold rounded-xl text-base transition-colors shadow-lg shadow-ice-500/20 min-h-[52px]">
                {t('next')}
              </motion.button>
            </div>
          </motion.div>

          {/* Right — Order Summary */}
          <motion.div className="lg:col-span-2 mt-6 lg:mt-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">📦 {t('summary')}</h2>

              <div className="relative h-36 rounded-xl overflow-hidden mb-4">
                <Image src={tour.image} alt={tour.imageAlt || tour.title} fill className="object-cover" sizes="300px" />
              </div>

              <h3 className="font-bold text-neutral-900 mb-3">{tourTitle}</h3>

              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">📅 {t('date')}</span>
                  <span className="font-medium text-neutral-700">
                    {form.preferredDate
                      ? new Date(form.preferredDate + 'T00:00:00').toLocaleDateString(dateLocaleMap[locale] || 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                      : <span className="text-neutral-400 italic">{t('selectDate')}</span>
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">🕐 {t('time')}</span>
                  <span className="font-medium text-neutral-700">{tour.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">👥 {t('people')}</span>
                  <span className="font-medium text-neutral-700">{form.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">🌐 {t('lang')}</span>
                  <span className="font-medium text-neutral-700">{LANGUAGE_FLAGS[form.language]} {LANGUAGE_LABELS[form.language]}</span>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">{t('unitPrice')}</span>
                  <span className="text-neutral-700">{formatPrice(unitPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">{form.count} × {formatPrice(unitPrice)}</span>
                  <span className="text-neutral-700">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">{t('serviceFee')}</span>
                  <span className="text-emerald-600 font-medium">{t('serviceIncluded')}</span>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-neutral-900">{t('total')}</span>
                  <span className="text-2xl font-bold text-ice-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                {t('guarantee')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
