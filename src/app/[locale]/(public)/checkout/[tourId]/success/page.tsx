'use client';

import { useState, useEffect, useRef, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useCurrency } from '@/lib/currency';
import { LANGUAGE_LABELS, LANGUAGE_FLAGS } from '@/types';

interface BookingResult {
  id: string;
  tourId: string;
  date: string;
  count: number;
  language: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialNotes?: string;
  totalPrice: number;
  createdAt: string;
}

export default function SuccessPage({ params }: { params: Promise<{ tourId: string }> }) {
  const { tourId } = use(params);
  const { formatPrice } = useCurrency();
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const confettiDone = useRef(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('booking-result');
    if (raw) {
      setBooking(JSON.parse(raw));
      // Clean up sessionStorage
      sessionStorage.removeItem('checkout-data');
    }
  }, []);

  // Fire confetti
  useEffect(() => {
    if (booking && !confettiDone.current) {
      confettiDone.current = true;
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#0EA5E9', '#B8A88A', '#F59E0B', '#10B981'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#0EA5E9', '#B8A88A', '#F59E0B', '#10B981'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();

      // Big burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#0EA5E9', '#B8A88A', '#F59E0B', '#10B981', '#EC4899'],
        });
      }, 300);
    }
  }, [booking]);

  const handleSaveNote = () => {
    if (!note.trim()) return;
    // In a real app this would update the booking's specialNotes
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  };

  const refCode = booking?.id ? booking.id.toUpperCase().replace('BK-', 'BA-') : 'BA-000';

  if (!booking) {
    return (
      <main className="min-h-screen bg-neutral-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Rezervasyon bilgisi bulunamadı.</p>
          <Link href="/" className="text-ice-600 hover:text-ice-700 font-medium">Ana Sayfaya Dön</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-ice-50/30 via-neutral-50 to-white pt-16 lg:pt-20 pb-12">
      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center gap-0 mb-8">
          {[{ n: 1, label: 'Bilgiler' }, { n: 2, label: 'Ödeme' }, { n: 3, label: 'Onay' }].map((step, i) => (
            <div key={step.n} className="flex items-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-ice-500 text-white">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">✓</span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-0.5 bg-ice-400 mx-1" />}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white rounded-3xl border border-neutral-100 shadow-xl p-6 sm:p-8 text-center mb-6">

            {/* Checkmark */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
              <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.6 }} />
              </motion.svg>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
              🎉 Rezervasyonunuz Onaylandı!
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-neutral-500 mb-6">
              Onay detayları e-posta adresinize gönderilmiştir.
            </motion.p>

            {/* Booking Details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              className="bg-neutral-50 rounded-2xl p-5 text-left space-y-3 border border-neutral-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Referans Kodu</span>
                <span className="font-mono font-bold text-ice-600 text-base">{refCode}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Misafir</span>
                <span className="font-medium text-neutral-700">{booking.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Tarih</span>
                <span className="font-medium text-neutral-700">{new Date(booking.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Kişi Sayısı</span>
                <span className="font-medium text-neutral-700">{booking.count} kişi</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Dil</span>
                <span className="font-medium text-neutral-700">{LANGUAGE_FLAGS[booking.language]} {LANGUAGE_LABELS[booking.language]}</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
                <span className="font-bold text-neutral-900">Toplam Ödeme</span>
                <span className="text-xl font-bold text-ice-600">{formatPrice(booking.totalPrice)}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Manifesto Note */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6 mb-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-1 flex items-center gap-2">
              📝 Özel Notunuzu Ekleyin
            </h2>
            <p className="text-sm text-neutral-400 mb-4">Alerji, engelli durumu, çocuk koltuğu vb. bilgilerinizi ekleyin — rehberimiz ve ekibimiz sizin için hazırlıklı olsun.</p>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              rows={3} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 resize-y mb-3"
              placeholder="Örn: Laktoz intoleransım var, glutensiz yemek tercih ediyorum..." aria-label="Özel manifesto notu" />
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSaveNote}
                className="px-5 py-2.5 bg-ice-500 hover:bg-ice-600 text-white font-medium rounded-xl text-sm min-h-[44px]"
                aria-label="Notu kaydet">
                Notu Kaydet
              </motion.button>
              {noteSaved && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-emerald-600 font-medium">✓ Kaydedildi!</motion.span>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-3">

            {/* WhatsApp Share */}
            <a href={`https://wa.me/?text=${encodeURIComponent(`Bora Abi Tours ile tur rezervasyonum onaylandı! 🎉\nReferans: ${refCode}\nTur: ${tourId}\nTarih: ${booking.date}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors min-h-[48px]"
              aria-label="WhatsApp ile paylaş">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp ile Paylaş
            </a>

            <Link href="/" className="flex-1 py-3 bg-ice-500 hover:bg-ice-600 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors min-h-[48px]"
              aria-label="Ana sayfaya dön">
              Ana Sayfaya Dön
            </Link>

            <Link href="/#tours" className="flex-1 py-3 border-2 border-ice-500 text-ice-600 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-ice-50 transition-colors min-h-[48px]"
              aria-label="Turları keşfet">
              Turlarımızı Keşfedin
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
