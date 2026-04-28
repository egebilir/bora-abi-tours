'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminBusesPage() {
  const { buses, deleteBus } = useAdminStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <AdminShell currentPath="/admin/buses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Otobüs Yönetimi</h2>
            <p className="text-sm text-neutral-500 mt-1">{buses.length} otobüs kayıtlı</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-neutral-50 text-left">
                  {['Araç Adı', 'Kapasite', 'Özellikler', 'Aksiyonlar'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-ice-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-neutral-900 text-sm">{bus.name}</div>
                      <div className="text-xs text-neutral-400">{bus.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-ice-50 text-ice-600">
                        {bus.capacity} kişi
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {bus.features.map((f, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-neutral-100 text-neutral-600">{f}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-ice-600 bg-ice-50 hover:bg-ice-100 rounded-lg transition-colors">Düzenle</button>
                        <button onClick={() => setDeleteId(bus.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2">Otobüsü Sil</h3>
              <p className="text-sm text-neutral-500 mb-6">Bu otobüsü silmek istediğinize emin misiniz?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg min-h-[44px]">İptal</button>
                <button onClick={() => { deleteBus(deleteId); setDeleteId(null); }} className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg min-h-[44px]">Sil</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
