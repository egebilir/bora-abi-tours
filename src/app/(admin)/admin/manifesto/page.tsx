'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';
import { LANGUAGE_FLAGS, LANGUAGE_LABELS } from '@/types';

export default function ManifestoPage() {
  const { tours, bookings, cancelBooking } = useAdminStore();
  const [filterTour, setFilterTour] = useState('all');
  const [cancelId, setCancelId] = useState<string | null>(null);

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const filtered = filterTour === 'all'
    ? confirmedBookings
    : confirmedBookings.filter(b => b.tourId === filterTour);

  const sortedBookings = [...filtered].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AdminShell currentPath="/admin/manifesto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">📋 Yolcu Manifestosu</h2>
            <p className="text-sm text-neutral-500 mt-1">{confirmedBookings.length} onaylı rezervasyon • {confirmedBookings.reduce((s, b) => s + b.count, 0)} toplam yolcu</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={filterTour} onChange={e => setFilterTour(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm outline-none focus:ring-2 focus:ring-ice-500">
              <option value="all">Tüm Turlar</option>
              {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
        </div>

        {/* Empty state */}
        {sortedBookings.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-neutral-700 mb-2">Henüz Rezervasyon Yok</h3>
            <p className="text-sm text-neutral-400">Rezervasyonlar burada otomatik olarak görünecektir.</p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-neutral-50 text-left">
                    {['Misafir', 'Tur', 'İletişim', 'Kişi', 'Dil', 'Özel Not', 'Tarih', 'Tutar', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {sortedBookings.map(booking => {
                    const tour = tours.find(t => t.id === booking.tourId);
                    return (
                      <tr key={booking.id} className="hover:bg-ice-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-medium text-neutral-900 text-sm">{booking.customerName}</div>
                          <div className="text-xs text-neutral-400 font-mono mt-0.5">{booking.id.toUpperCase().replace('BK-', 'BA-')}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-700">{tour?.title || booking.tourId}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-neutral-600">{booking.customerEmail}</div>
                          <div className="text-xs text-neutral-400 mt-0.5">{booking.customerPhone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-ice-50 text-ice-700 border border-ice-100">
                            {booking.count} kişi
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm">
                            {LANGUAGE_FLAGS[booking.language]} {LANGUAGE_LABELS[booking.language] || booking.language}
                          </span>
                        </td>
                        <td className="px-5 py-4 max-w-[200px]">
                          {booking.specialNotes ? (
                            <div className="flex items-start gap-1.5">
                              <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
                              <span className="text-sm text-neutral-600 line-clamp-2">{booking.specialNotes}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-neutral-500">
                          {new Date(booking.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-neutral-900">
                          €{booking.totalPrice}
                        </td>
                        <td className="px-5 py-4">
                          <button onClick={() => setCancelId(booking.id)}
                            className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors min-h-[32px]">
                            İptal
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setCancelId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Rezervasyonu İptal Et</h3>
              <p className="text-sm text-neutral-500 mb-6">Bu rezervasyonu iptal etmek istediğinize emin misiniz?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setCancelId(null)} className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors min-h-[44px]">Vazgeç</button>
                <button onClick={() => { cancelBooking(cancelId); setCancelId(null); }} className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors min-h-[44px]">İptal Et</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
