'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';
import { LANGUAGE_LABELS } from '@/types';

export default function AdminGuidesPage() {
  const { guides, deleteGuide } = useAdminStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <AdminShell currentPath="/admin/guides">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Rehber Yönetimi</h2>
            <p className="text-sm text-neutral-500 mt-1">{guides.length} rehber kayıtlı</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <motion.div key={guide.id} layout className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-ice-100 rounded-full flex items-center justify-center text-lg font-bold text-ice-600">
                  {guide.name[0]}
                </div>
                <div>
                  <div className="font-bold text-neutral-900">{guide.name}</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-khaki-50 text-khaki-700 border border-khaki-200">
                    {guide.specialization}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex justify-between"><span>Puan</span><span className="font-medium">⭐ {guide.rating}</span></div>
                <div className="flex justify-between"><span>Tur Sayısı</span><span className="font-medium">{guide.tourCount}</span></div>
                <div className="flex justify-between"><span>Diller</span><span className="font-medium">{guide.languages.map(l => LANGUAGE_LABELS[l] || l).join(', ')}</span></div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
                <button className="flex-1 py-2 text-xs font-medium text-ice-600 bg-ice-50 hover:bg-ice-100 rounded-lg transition-colors min-h-[40px]">Düzenle</button>
                <button onClick={() => setDeleteId(guide.id)} className="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors min-h-[40px]">Sil</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2">Rehberi Sil</h3>
              <p className="text-sm text-neutral-500 mb-6">Bu rehberi silmek istediğinize emin misiniz?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg min-h-[44px]">İptal</button>
                <button onClick={() => { deleteGuide(deleteId); setDeleteId(null); }} className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg min-h-[44px]">Sil</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
