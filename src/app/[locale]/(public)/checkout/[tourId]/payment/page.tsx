'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import { useUserAuth } from '@/lib/user-auth';
import { useCurrency } from '@/lib/currency';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

interface CheckoutData {
  tourId: string;
  tourTitle: string;
  tourImage: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  language: string;
  count: number;
  specialNotes: string;
  unitPrice: number;
  totalPrice: number;
  date: string;
}

function getCardType(num: string): 'visa' | 'mastercard' | 'unknown' {
  const clean = num.replace(/\s/g, '');
  if (clean.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
  return 'unknown';
}

function formatCardNumber(val: string): string {
  const clean = val.replace(/\D/g, '').slice(0, 16);
  return clean.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val: string): string {
  const clean = val.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
  return clean;
}

export default function PaymentPage({ params }: { params: Promise<{ tourId: string }> }) {
  const { tourId } = use(params);
  const router = useRouter();
  const { createBooking } = useAdminStore();
  const { user } = useUserAuth();
  const { formatPrice } = useCurrency();

  const t = useTranslations('payment');
  const tc = useTranslations('common');

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [card, setCard] = useState({ holder: '', number: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [show3DS, setShow3DS] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = sessionStorage.getItem('checkout-data');
    if (raw) {
      setCheckoutData(JSON.parse(raw));
    } else {
      router.replace(`/checkout/${tourId}`);
    }
  }, [tourId, router]);

  if (!checkoutData) {
    return <main className="min-h-screen pt-20 flex items-center justify-center"><p className="text-neutral-400">{tc('loading')}</p></main>;
  }

  const cardType = getCardType(card.number);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!card.holder.trim()) e.holder = '!';
    if (card.number.replace(/\s/g, '').length < 16) e.number = '!';
    if (card.expiry.length < 5) e.expiry = '!';
    if (card.cvv.length < 3) e.cvv = '!';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setProcessing(false);
    setShow3DS(true);
    await new Promise(r => setTimeout(r, 2500));
    setShow3DS(false);

    const booking = {
      id: `bk-${Date.now()}`,
      tourId: checkoutData.tourId,
      date: checkoutData.date,
      count: checkoutData.count,
      language: checkoutData.language,
      customerName: checkoutData.customerName,
      customerEmail: checkoutData.customerEmail,
      customerPhone: checkoutData.customerPhone,
      specialNotes: checkoutData.specialNotes || undefined,
      userId: user?.id,
      status: 'confirmed' as const,
      totalPrice: checkoutData.totalPrice,
      createdAt: new Date().toISOString(),
    };

    createBooking(booking);
    sessionStorage.setItem('booking-result', JSON.stringify(booking));
    router.push(`/checkout/${tourId}/success`);
  };

  return (
    <main className="min-h-screen pt-16 lg:pt-20 pb-12">
      <div className="bg-khaki-50 border-b border-khaki-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link href="/" className="hover:text-ice-500 transition-colors">{tc('home')}</Link>
            <span>/</span>
            <Link href={`/checkout/${tourId}`} className="hover:text-ice-500 transition-colors">{tc('reservation')}</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium">{tc('payment')}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center gap-0 mb-8">
          {[{ n: 1, label: tc('steps') }, { n: 2, label: tc('payment') }, { n: 3, label: tc('confirmation') }].map((step, i) => (
            <div key={step.n} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step.n <= 2 ? 'bg-ice-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{step.n <= 1 ? '✓' : step.n}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < 2 && <div className={`w-8 sm:w-16 h-0.5 mx-1 ${i === 0 ? 'bg-ice-400' : 'bg-neutral-200'}`} />}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-7">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-ice-50 flex items-center justify-center text-ice-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{t('title')}</h1>
                <p className="text-xs text-neutral-400">{t('ssl')}</p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 mb-6 border border-neutral-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">{checkoutData.tourTitle} — {checkoutData.count} {tc('person')}</span>
                <span className="font-bold text-ice-600 text-lg">{formatPrice(checkoutData.totalPrice)}</span>
              </div>
            </div>

            {/* Card Preview */}
            <div className="relative mb-6 h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900 p-5 sm:p-6 text-white shadow-xl">
              <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
                {cardType === 'visa' && <div className="text-2xl font-black italic tracking-wider opacity-90">VISA</div>}
                {cardType === 'mastercard' && (
                  <div className="flex items-center gap-0">
                    <div className="w-8 h-8 rounded-full bg-red-500 opacity-80" />
                    <div className="w-8 h-8 rounded-full bg-amber-400 -ml-3 opacity-80" />
                  </div>
                )}
                {cardType === 'unknown' && <div className="text-xl opacity-40">💳</div>}
              </div>
              <div className="absolute bottom-14 sm:bottom-16 left-5 sm:left-6">
                <div className="text-lg sm:text-xl tracking-[0.25em] font-mono opacity-90">
                  {card.number || '•••• •••• •••• ••••'}
                </div>
              </div>
              <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-50 mb-0.5">{t('holder')}</div>
                  <div className="text-sm font-medium tracking-wide opacity-90">{card.holder || '••••••'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider opacity-50 mb-0.5">{t('expiry')}</div>
                  <div className="text-sm font-medium opacity-90">{card.expiry || 'MM/YY'}</div>
                </div>
              </div>
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 w-10 h-7 rounded-md bg-amber-300/60 border border-amber-400/40" />
            </div>

            {/* Card Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="card-holder" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('holder')}</label>
                <input id="card-holder" type="text" value={card.holder}
                  onChange={e => setCard(p => ({ ...p, holder: e.target.value.toUpperCase() }))}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-ice-500 ${errors.holder ? 'border-red-300' : 'border-neutral-200'}`} />
                {errors.holder && <p className="text-red-500 text-xs mt-1">{errors.holder}</p>}
              </div>

              <div>
                <label htmlFor="card-number" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('number')}</label>
                <div className="relative">
                  <input id="card-number" type="text" value={card.number}
                    onChange={e => setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                    className={`w-full px-4 py-3 pr-16 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-ice-500 font-mono tracking-wider ${errors.number ? 'border-red-300' : 'border-neutral-200'}`}
                    placeholder="4242 4242 4242 4242" maxLength={19} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <span className={`text-xs font-bold italic ${cardType === 'visa' ? 'text-blue-600' : 'text-neutral-300'}`}>VISA</span>
                    <div className="flex -space-x-1.5">
                      <div className={`w-4 h-4 rounded-full ${cardType === 'mastercard' ? 'bg-red-500' : 'bg-neutral-200'}`} />
                      <div className={`w-4 h-4 rounded-full ${cardType === 'mastercard' ? 'bg-amber-400' : 'bg-neutral-200'}`} />
                    </div>
                  </div>
                </div>
                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="card-expiry" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('expiry')}</label>
                  <input id="card-expiry" type="text" value={card.expiry}
                    onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-ice-500 font-mono ${errors.expiry ? 'border-red-300' : 'border-neutral-200'}`}
                    placeholder="MM/YY" maxLength={5} />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label htmlFor="card-cvv" className="block text-sm font-medium text-neutral-700 mb-1.5">{t('cvv')}</label>
                  <input id="card-cvv" type="password" value={card.cvv}
                    onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-ice-500 font-mono ${errors.cvv ? 'border-red-300' : 'border-neutral-200'}`}
                    placeholder="•••" maxLength={4} />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handlePay} disabled={processing}
              className="w-full mt-6 py-4 bg-ice-500 hover:bg-ice-600 disabled:bg-ice-300 text-white font-bold rounded-xl text-base transition-colors shadow-lg shadow-ice-500/20 min-h-[52px] flex items-center justify-center gap-2">
              {processing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  {t('processing')}
                </>
              ) : (
                <>🔒 {formatPrice(checkoutData.totalPrice)} {t('pay')}</>
              )}
            </motion.button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1">🔒 {t('sslBadge')}</span>
              <span>•</span>
              <span className="flex items-center gap-1">💳 {t('safePay')}</span>
              <span>•</span>
              <span className="flex items-center gap-1">✓ {t('freeCancel')}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3D Secure Overlay */}
      <AnimatePresence>
        {show3DS && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ice-50 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="w-8 h-8 border-3 border-ice-200 border-t-ice-500 rounded-full" style={{ borderWidth: 3 }} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('secure3d')}</h3>
              <p className="text-sm text-neutral-500 mb-4">{t('secure3dDesc')}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('secureConn')}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
