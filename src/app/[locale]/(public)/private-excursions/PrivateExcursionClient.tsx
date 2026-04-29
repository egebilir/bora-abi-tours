'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const experienceOptions = [
  { key: 'history', icon: '🏛️', image: '/images/tours/ephesus.png' },
  { key: 'nature', icon: '🌿', image: '/images/tours/pamukkale.png' },
  { key: 'boat', icon: '⛵', image: '/images/tours/boat-tour.png' },
  { key: 'wine', icon: '🍷', image: '/images/tours/sirince.png' },
  { key: 'adventure', icon: '🏔️', image: '/images/tours/dalyan.png' },
  { key: 'custom', icon: '✨', image: '/images/tours/ephesus.png' },
];

const groupSizes = ['1-2', '3-5', '6-10', '11-20', '20+'];

const arrivalTypes = [
  { key: 'cruise', icon: '🚢' },
  { key: 'hotel', icon: '🏨' },
  { key: 'airport', icon: '✈️' },
  { key: 'other', icon: '📍' },
];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

function DarkDatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [viewDate, setViewDate] = useState(() => {
    if (value) { const [y,m] = value.split('-').map(Number); return new Date(y, m-1, 1); }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [open, setOpen] = useState(false);

  const maxDate = useMemo(() => { const d = new Date(today); d.setMonth(d.getMonth() + 6); return d; }, [today]);
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let startDay = firstDay.getDay() - 1; if (startDay < 0) startDay = 6;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: { date: Date; inMonth: boolean }[] = [];
    for (let i = startDay - 1; i >= 0; i--) days.push({ date: new Date(currentYear, currentMonth, -i), inMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ date: new Date(currentYear, currentMonth, i), inMonth: true });
    const rem = 42 - days.length;
    for (let i = 1; i <= rem; i++) days.push({ date: new Date(currentYear, currentMonth + 1, i), inMonth: false });
    return days;
  }, [currentMonth, currentYear]);

  const canGoPrev = new Date(currentYear, currentMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = new Date(currentYear, currentMonth + 1, 1) <= maxDate;

  const isDisabled = (d: Date) => d < today || d > maxDate;
  const isSelected = (d: Date) => { if (!value) return false; const [y,m,dd] = value.split('-').map(Number); return d.getFullYear()===y && d.getMonth()===m-1 && d.getDate()===dd; };
  const isToday = (d: Date) => d.getFullYear()===today.getFullYear() && d.getMonth()===today.getMonth() && d.getDate()===today.getDate();

  const selectDate = (d: Date) => {
    if (isDisabled(d)) return;
    onChange(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
    setOpen(false);
  };

  const formatSelected = () => {
    if (!value) return null;
    const [y,m,d] = value.split('-').map(Number);
    const date = new Date(y, m-1, d);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div>
      {/* Trigger button */}
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-all min-h-[48px] flex items-center justify-between ${value ? 'bg-amber-500/10 border-amber-400/50 text-amber-300' : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-500 hover:border-neutral-600'}`}>
        <span>{value ? formatSelected() : 'Select a date...'}</span>
        <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {/* Calendar dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.25 }}
            className="mt-2 rounded-2xl border border-neutral-700/50 bg-neutral-900/95 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <button type="button" onClick={() => canGoPrev && setViewDate(new Date(currentYear, currentMonth - 1, 1))} disabled={!canGoPrev}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${canGoPrev ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-700 cursor-not-allowed'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="text-sm font-bold text-white">{MONTH_NAMES[currentMonth]} {currentYear}</span>
              <button type="button" onClick={() => canGoNext && setViewDate(new Date(currentYear, currentMonth + 1, 1))} disabled={!canGoNext}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${canGoNext ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-700 cursor-not-allowed'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-neutral-800">
              {WEEK_DAYS.map(d => <div key={d} className="py-2 text-center text-xs font-semibold text-neutral-600 uppercase">{d}</div>)}
            </div>
            {/* Days grid */}
            <div className="grid grid-cols-7 p-1.5 gap-0.5">
              {calendarDays.map((day, i) => {
                const disabled = isDisabled(day.date) || !day.inMonth;
                const selected = isSelected(day.date);
                const todayMark = isToday(day.date);
                return (
                  <button type="button" key={i} onClick={() => day.inMonth && selectDate(day.date)} disabled={disabled}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all min-h-[40px] ${
                      disabled ? 'text-neutral-700 cursor-not-allowed'
                      : selected ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                      : todayMark ? 'bg-amber-500/10 text-amber-400 font-bold ring-1 ring-amber-500/30 hover:bg-amber-500/20'
                      : 'text-neutral-300 hover:bg-neutral-800'
                    }`}>
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>
            {/* Selected display */}
            {value && (
              <div className="px-4 py-2.5 border-t border-neutral-800 flex items-center gap-2">
                <span className="text-amber-400 text-sm">✓</span>
                <span className="text-xs font-medium text-amber-300">{formatSelected()}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const steps = ['experience', 'details', 'contact'] as const;
type Step = typeof steps[number];

export default function PrivateExcursionClient() {
  const t = useTranslations('privateExcursions');
  const [currentStep, setCurrentStep] = useState<Step>('experience');
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [arrivalType, setArrivalType] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cruiseLine, setCruiseLine] = useState('');
  const [hotelName, setHotelName] = useState('');

  const stepIndex = steps.indexOf(currentStep);

  const toggleExperience = (key: string) => {
    setSelectedExperiences(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const canProceed = () => {
    if (currentStep === 'experience') return selectedExperiences.length > 0;
    if (currentStep === 'details') return groupSize !== '' && arrivalType !== '';
    if (currentStep === 'contact') return name && (email || phone);
    return false;
  };

  const handleSubmit = () => {
    if (!canProceed()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 pt-20 lg:pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('success.title')}</h1>
          <p className="text-neutral-400 text-lg mb-8 leading-relaxed">{t('success.desc')}</p>
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-6 mb-8 text-left">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">{t('form.name')}</span><span className="text-white font-medium">{name}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">{t('form.groupSize')}</span><span className="text-white font-medium">{groupSize} {t('form.people')}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">{t('form.experiences')}</span><span className="text-white font-medium">{selectedExperiences.map(k => t(`experiences.${k}`)).join(', ')}</span></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="https://wa.me/905321234567" target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors min-h-[48px]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="/" className="flex-1 py-3.5 border border-neutral-600 text-neutral-300 hover:text-white hover:border-neutral-400 font-semibold rounded-xl text-sm flex items-center justify-center transition-colors min-h-[48px]">
              {t('success.home')}
            </a>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-40 w-96 h-96 bg-ice-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-neutral-800/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-neutral-800/20 rounded-full" />
      </div>

      <div className="relative z-10 pt-16 sm:pt-20 pb-16 px-4 sm:px-6">
        {/* Header */}
        <motion.div className="text-center mb-12 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            {t('badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{t('title')}</h1>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">{t('subtitle')}</p>
        </motion.div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i <= stepIndex ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs sm:text-sm font-medium hidden sm:block ${i <= stepIndex ? 'text-amber-400' : 'text-neutral-600'}`}>{t(`steps.${step}`)}</span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Experience Selection */}
            {currentStep === 'experience' && (
              <motion.div key="experience" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('step1.title')}</h2>
                <p className="text-neutral-500 text-sm mb-8">{t('step1.subtitle')}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {experienceOptions.map((opt) => {
                    const selected = selectedExperiences.includes(opt.key);
                    return (
                      <motion.button
                        key={opt.key}
                        onClick={() => toggleExperience(opt.key)}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 group min-h-[140px] sm:min-h-[160px] ${selected ? 'border-amber-400 shadow-lg shadow-amber-500/20' : 'border-neutral-700/50 hover:border-neutral-600'}`}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Image src={opt.image} alt={t(`experiences.${opt.key}`)} fill className={`object-cover transition-all duration-500 ${selected ? 'scale-105 brightness-75' : 'brightness-50 group-hover:brightness-[0.6]'}`} sizes="(max-width:640px) 50vw, 33vw" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                          <span className="text-2xl sm:text-3xl mb-2">{opt.icon}</span>
                          <span className="text-white font-semibold text-sm sm:text-base">{t(`experiences.${opt.key}`)}</span>
                        </div>
                        {selected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {currentStep === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('step2.title')}</h2>
                <p className="text-neutral-500 text-sm mb-8">{t('step2.subtitle')}</p>

                <div className="space-y-6">
                  {/* Arrival type */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-3">{t('form.arrivalType')} *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {arrivalTypes.map(at => (
                        <button key={at.key} onClick={() => setArrivalType(at.key)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 min-h-[68px] ${arrivalType === at.key ? 'bg-amber-500/15 border-amber-400 text-amber-300' : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600'}`}>
                          <span className="text-xl">{at.icon}</span>
                          <span className="text-xs font-medium">{t(`arrivalTypes.${at.key}`)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conditional: Cruise Line */}
                  {arrivalType === 'cruise' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-sm font-semibold text-neutral-300 mb-3">{t('form.cruiseLine')}</label>
                      <input type="text" value={cruiseLine} onChange={e => setCruiseLine(e.target.value)}
                        placeholder={t('form.cruiseLinePlaceholder')}
                        className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors min-h-[48px]" />
                    </motion.div>
                  )}

                  {/* Conditional: Hotel name */}
                  {arrivalType === 'hotel' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-sm font-semibold text-neutral-300 mb-3">{t('form.hotelName')}</label>
                      <input type="text" value={hotelName} onChange={e => setHotelName(e.target.value)}
                        placeholder={t('form.hotelPlaceholder')}
                        className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors min-h-[48px]" />
                    </motion.div>
                  )}

                  {/* Group size */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-3">{t('form.groupSize')} *</label>
                    <div className="grid grid-cols-5 gap-2">
                      {groupSizes.map(size => (
                        <button key={size} onClick={() => setGroupSize(size)}
                          className={`py-3 rounded-xl text-sm font-medium border transition-all duration-200 min-h-[48px] ${groupSize === size ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600'}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Picker - Inline Calendar */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-3">📅 {t('form.preferredDate')}</label>
                    <DarkDatePicker value={preferredDate} onChange={setPreferredDate} />
                  </div>

                  {/* Special requests */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-3">{t('form.specialRequests')}</label>
                    <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} rows={3}
                      placeholder={t('form.specialPlaceholder')}
                      className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact */}
            {currentStep === 'contact' && (
              <motion.div key="contact" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('step3.title')}</h2>
                <p className="text-neutral-500 text-sm mb-8">{t('step3.subtitle')}</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{t('form.name')} *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors min-h-[48px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{t('form.email')}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors min-h-[48px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">{t('form.phone')} (WhatsApp)</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition-colors min-h-[48px]" />
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-8 p-5 rounded-2xl bg-neutral-800/30 border border-neutral-700/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    </div>
                    <div>
                      <p className="text-amber-400 font-semibold text-sm mb-1">{t('trust.title')}</p>
                      <p className="text-neutral-500 text-xs leading-relaxed">{t('trust.desc')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-10 gap-4">
            {stepIndex > 0 ? (
              <button onClick={() => setCurrentStep(steps[stepIndex - 1])}
                className="px-6 py-3.5 border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 font-medium rounded-xl text-sm transition-colors min-h-[48px]">
                {t('nav.back')}
              </button>
            ) : <div />}

            {currentStep === 'contact' ? (
              <button onClick={handleSubmit} disabled={!canProceed()}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 min-h-[48px] flex items-center gap-2 ${canProceed() ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/25' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}`}>
                {t('nav.submit')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </button>
            ) : (
              <button onClick={() => setCurrentStep(steps[stepIndex + 1])} disabled={!canProceed()}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 min-h-[48px] flex items-center gap-2 ${canProceed() ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/25' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'}`}>
                {t('nav.next')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
