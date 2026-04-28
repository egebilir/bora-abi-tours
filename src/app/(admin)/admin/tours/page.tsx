'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';
import { CATEGORY_LABELS, LANGUAGE_FLAGS } from '@/types';

export default function AdminToursPage() {
  const { tours, buses, deleteTour, getOccupancy, updateTour } = useAdminStore();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = tours.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell currentPath="/admin/tours">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Tur Yönetimi</h2>
            <p className="text-sm text-neutral-500 mt-1">{tours.length} tur kayıtlı</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tur ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm outline-none focus:ring-2 focus:ring-ice-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-neutral-50 text-left">
                  {['Tur Adı', 'Kategori', 'Fiyat', 'Puan', 'Doluluk (Dil Bazlı)', 'Durum', 'Aksiyonlar'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((tour) => {
                  const booked = getOccupancy(tour.id);
                  const totalCap = tour.tourBuses.reduce((s, tb) => {
                    const bus = buses.find(b => b.id === tb.busId);
                    return s + (bus?.capacity || 0);
                  }, 0);
                  return (
                    <tr key={tour.id} className="hover:bg-ice-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-neutral-900 text-sm">{tour.title}</div>
                        <div className="text-xs text-neutral-400">{tour.id}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-khaki-50 text-khaki-700 border border-khaki-200">
                          {CATEGORY_LABELS[tour.category]?.tr}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-900">€{tour.price}</td>
                      <td className="px-5 py-4 text-sm text-neutral-600">⭐ {tour.rating}</td>
                      <td className="px-5 py-4">
                        {tour.tourBuses.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {tour.tourBuses.map((tb, i) => {
                              const bus = buses.find(b => b.id === tb.busId);
                              const cap = bus?.capacity || 0;
                              const pct = cap > 0 ? Math.round((tb.booked / cap) * 100) : 0;
                              return (
                                <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${pct >= 90 ? 'bg-red-50 text-red-700 border-red-200' : pct >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-ice-50 text-ice-700 border-ice-200'}`}>
                                  {LANGUAGE_FLAGS[tb.language] || ''} {tb.language.toUpperCase()}: {tb.booked}/{cap}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400">Araç atanmamış</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => updateTour(tour.id, { isOpen: !tour.isOpen })}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${tour.isOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}
                        >
                          {tour.isOpen ? '✅ Açık' : '🔴 Kapalı'}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/tours/${tour.id}`}
                            className="px-3 py-1.5 text-xs font-medium text-ice-600 bg-ice-50 hover:bg-ice-100 rounded-lg transition-colors">
                            Düzenle
                          </Link>
                          <button onClick={() => setDeleteId(tour.id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Turu Sil</h3>
              <p className="text-sm text-neutral-500 mb-6">Bu turu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors min-h-[44px]">İptal</button>
                <button onClick={() => { deleteTour(deleteId); setDeleteId(null); }} className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors min-h-[44px]">Sil</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
