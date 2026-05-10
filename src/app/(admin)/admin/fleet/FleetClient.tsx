'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FleetClient({ initialBuses }: { initialBuses: any[] }) {
  const [buses, setBuses] = useState(initialBuses);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', plateNumber: '', capacity: '', type: 'SPRINTER' });

  const addBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBuses([data.data, ...buses]);
        setFormData({ name: '', plateNumber: '', capacity: '', type: 'SPRINTER' });
      } else {
        alert(data.error);
      }
    } catch {
      alert('Error adding bus');
    }
    setLoading(false);
  };

  const deleteBus = async (id: number) => {
    if (!confirm('Bu aracı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/buses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBuses(buses.filter(b => b.id !== id));
      }
    } catch {
      alert('Error deleting bus');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Araç & Filo Yönetimi</h1>
          <p className="text-sm text-neutral-500 mt-1">Sistemdeki araçları ve kapasitelerini yönetin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Yeni Araç Ekle</h2>
            <form onSubmit={addBus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Araç Adı / Modeli</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-ice-500/20 focus:border-ice-500" placeholder="Örn: Beyaz Sprinter" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Plaka</label>
                <input required type="text" value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-ice-500/20 focus:border-ice-500" placeholder="35 ABC 123" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Kapasite (Koltuk)</label>
                <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-ice-500/20 focus:border-ice-500" placeholder="15" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Araç Tipi</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-ice-500/20 focus:border-ice-500 bg-white">
                  <option value="SPRINTER">Minibüs (Sprinter/Crafter)</option>
                  <option value="MIDI">Midibüs</option>
                  <option value="COACH">Büyük Otobüs</option>
                </select>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-ice-500 hover:bg-ice-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {loading ? 'Ekleniyor...' : 'Aracı Filoya Ekle'}
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900">Mevcut Araçlar</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Araç</th>
                    <th className="px-6 py-4 font-semibold">Plaka</th>
                    <th className="px-6 py-4 font-semibold">Kapasite</th>
                    <th className="px-6 py-4 font-semibold text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {buses.length === 0 && (
                    <tr><td colSpan={4} className="p-6 text-center text-neutral-500">Henüz filoda araç yok.</td></tr>
                  )}
                  {buses.map(bus => (
                    <tr key={bus.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-neutral-900">{bus.name}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{bus.type}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-neutral-600">{bus.plateNumber}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ice-100 text-ice-700">
                          {bus.capacity} Koltuk
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteBus(bus.id)} className="text-red-500 hover:text-red-700 font-medium text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
