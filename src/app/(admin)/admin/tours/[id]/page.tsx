'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';
import { LANGUAGE_LABELS, LANGUAGE_FLAGS, TourBus } from '@/types';
import toast from 'react-hot-toast';

const langTabs = [
  { key: 'tr', label: '🇹🇷 Türkçe' },
  { key: 'en', label: '🇬🇧 English' },
];

export default function AdminTourEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { tours, guides, buses, updateTour, getOccupancy } = useAdminStore();
  const tour = tours.find(t => t.id === id);

  const [activeTab, setActiveTab] = useState('tr');
  const [form, setForm] = useState({
    title: '', titleEn: '',
    description: '', descriptionEn: '',
    fullDescription: '', fullDescriptionEn: '',
    price: 0,
    image: '', imageAlt: '', imageMetaDescription: '',
    meetingPoint: '', meetingPointEn: '',
    meetingPointLat: 0, meetingPointLng: 0,
    isOpen: true,
  });
  const [importantInfoTr, setImportantInfoTr] = useState<string[]>([]);
  const [importantInfoEn, setImportantInfoEn] = useState<string[]>([]);
  const [tourBuses, setTourBuses] = useState<TourBus[]>([]);
  const [newInfoTr, setNewInfoTr] = useState('');
  const [newInfoEn, setNewInfoEn] = useState('');

  // New bus form
  const [newBusForm, setNewBusForm] = useState({ busId: '', guideId: '', language: 'en' });

  useEffect(() => {
    if (tour) {
      setForm({
        title: tour.title, titleEn: tour.titleEn,
        description: tour.description, descriptionEn: tour.descriptionEn,
        fullDescription: tour.fullDescription || '', fullDescriptionEn: tour.fullDescriptionEn || '',
        price: tour.price,
        image: tour.image, imageAlt: tour.imageAlt || '', imageMetaDescription: tour.imageMetaDescription || '',
        meetingPoint: tour.meetingPoint, meetingPointEn: tour.meetingPointEn,
        meetingPointLat: tour.meetingPointLat || 0, meetingPointLng: tour.meetingPointLng || 0,
        isOpen: tour.isOpen,
      });
      setImportantInfoTr(tour.importantInfo || []);
      setImportantInfoEn(tour.importantInfoEn || []);
      setTourBuses(tour.tourBuses || []);
    }
  }, [tour]);

  if (!tour) {
    return <AdminShell currentPath="/admin/tours"><p className="text-neutral-500">Tur bulunamadı.</p></AdminShell>;
  }

  const booked = getOccupancy(tour.id);

  const handleSave = () => {
    updateTour(id, {
      title: form.title, titleEn: form.titleEn,
      description: form.description, descriptionEn: form.descriptionEn,
      fullDescription: form.fullDescription, fullDescriptionEn: form.fullDescriptionEn,
      price: form.price,
      image: form.image, imageAlt: form.imageAlt, imageMetaDescription: form.imageMetaDescription,
      meetingPoint: form.meetingPoint, meetingPointEn: form.meetingPointEn,
      meetingPointLat: form.meetingPointLat, meetingPointLng: form.meetingPointLng,
      isOpen: form.isOpen,
      importantInfo: importantInfoTr,
      importantInfoEn: importantInfoEn,
      tourBuses: tourBuses,
    });
  };

  const addBus = () => {
    if (!newBusForm.busId || !newBusForm.guideId) {
      toast.error('Araç ve rehber seçin');
      return;
    }
    setTourBuses(prev => [...prev, { ...newBusForm, booked: 0 }]);
    setNewBusForm({ busId: '', guideId: '', language: 'en' });
  };

  const removeBus = (index: number) => {
    setTourBuses(prev => prev.filter((_, i) => i !== index));
  };

  const fieldMap: Record<string, { title: string; desc: string; fullDesc: string }> = {
    tr: { title: 'title', desc: 'description', fullDesc: 'fullDescription' },
    en: { title: 'titleEn', desc: 'descriptionEn', fullDesc: 'fullDescriptionEn' },
  };
  const f = fieldMap[activeTab];

  return (
    <AdminShell currentPath="/admin/tours">
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => router.push('/admin/tours')} className="text-sm text-ice-600 hover:text-ice-700 mb-2 inline-flex items-center gap-1">← Turlar</button>
            <h2 className="text-2xl font-bold text-neutral-900">{tour.title}</h2>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
            className="px-6 py-2.5 bg-ice-500 hover:bg-ice-600 text-white font-semibold rounded-xl text-sm min-h-[44px]">
            Kaydet
          </motion.button>
        </div>

        {/* Status Toggle */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-neutral-900">Tur Durumu</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Satışa açık/kapalı durumunu kontrol edin</p>
            </div>
            <button
              onClick={() => setForm(prev => ({ ...prev, isOpen: !prev.isOpen }))}
              className={`relative w-14 h-8 rounded-full transition-colors ${form.isOpen ? 'bg-emerald-500' : 'bg-neutral-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${form.isOpen ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${form.isOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {form.isOpen ? '✅ Satışa Açık' : '🔴 Satış Kapalı'}
            </span>
          </div>
        </div>

        {/* Image Management */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-bold text-neutral-900 mb-4">📸 Görsel Yönetimi</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ana Görsel URL</label>
              <input type="text" value={form.image} onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Alt Metin (SEO)</label>
                <input type="text" value={form.imageAlt} onChange={e => setForm(prev => ({ ...prev, imageAlt: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Meta Açıklaması</label>
                <input type="text" value={form.imageMetaDescription} onChange={e => setForm(prev => ({ ...prev, imageMetaDescription: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
              </div>
            </div>
            {form.image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-neutral-100 max-w-xs">
                <img src={form.image} alt={form.imageAlt || 'Preview'} className="w-full h-40 object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Bus & Guide Assignment */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-bold text-neutral-900 mb-4">🚐 Araç & Rehber Ataması (Dil Bazlı)</h3>
          {/* Existing assignments */}
          <div className="space-y-3 mb-5">
            {tourBuses.map((tb, i) => {
              const bus = buses.find(b => b.id === tb.busId);
              const guide = guides.find(g => g.id === tb.guideId);
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="text-lg">{LANGUAGE_FLAGS[tb.language] || '🌐'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-800">{LANGUAGE_LABELS[tb.language] || tb.language}</div>
                    <div className="text-xs text-neutral-500">{bus?.name || tb.busId} • {guide?.name || tb.guideId} • {tb.booked} kişi</div>
                  </div>
                  <button onClick={() => removeBus(i)} className="px-2.5 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg min-h-[36px]">Kaldır</button>
                </div>
              );
            })}
            {tourBuses.length === 0 && <p className="text-sm text-neutral-400 italic">Henüz araç atanmamış.</p>}
          </div>
          {/* Add new */}
          <div className="border-t border-neutral-100 pt-4">
            <p className="text-sm font-medium text-neutral-700 mb-3">Yeni Araç Ekle</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={newBusForm.language} onChange={e => setNewBusForm(p => ({ ...p, language: e.target.value }))}
                className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500">
                {Object.entries(LANGUAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{LANGUAGE_FLAGS[k]} {v}</option>)}
              </select>
              <select value={newBusForm.busId} onChange={e => setNewBusForm(p => ({ ...p, busId: e.target.value }))}
                className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500">
                <option value="">Araç seçin...</option>
                {buses.map(b => <option key={b.id} value={b.id}>{b.name} ({b.capacity} kişi)</option>)}
              </select>
              <select value={newBusForm.guideId} onChange={e => setNewBusForm(p => ({ ...p, guideId: e.target.value }))}
                className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500">
                <option value="">Rehber seçin...</option>
                {guides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <button onClick={addBus} className="mt-3 px-4 py-2.5 bg-ice-500 hover:bg-ice-600 text-white text-sm font-medium rounded-xl min-h-[44px]">
              + Araç Ekle
            </button>
          </div>
        </div>

        {/* Language Tabs — Content editing */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-neutral-100">
            {langTabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors min-h-[48px] ${activeTab === tab.key ? 'text-ice-600 border-b-2 border-ice-500 bg-ice-50/50' : 'text-neutral-500 hover:text-neutral-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Başlık</label>
              <input type="text" value={(form as Record<string, string | number | boolean>)[f.title] as string}
                onChange={e => setForm(prev => ({ ...prev, [f.title]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kısa Açıklama</label>
              <textarea value={(form as Record<string, string | number | boolean>)[f.desc] as string}
                onChange={e => setForm(prev => ({ ...prev, [f.desc]: e.target.value }))}
                rows={3} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Detaylı Açıklama (SEO)</label>
              <textarea value={(form as Record<string, string | number | boolean>)[f.fullDesc] as string}
                onChange={e => setForm(prev => ({ ...prev, [f.fullDesc]: e.target.value }))}
                rows={8} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 resize-y font-mono text-xs leading-relaxed" />
              <p className="text-xs text-neutral-400 mt-1">Paragrafları boş satır ile ayırın. SEO anahtar kelimelerini doğal şekilde kullanın.</p>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-bold text-neutral-900 mb-4">⚠️ Önemli Bilgiler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* TR */}
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">🇹🇷 Türkçe</p>
              <div className="space-y-2 mb-3">
                {importantInfoTr.map((info, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-sm text-neutral-600 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-100">{info}</span>
                    <button onClick={() => setImportantInfoTr(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-600 text-xs px-2 py-1 min-h-[32px]">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newInfoTr} onChange={e => setNewInfoTr(e.target.value)} placeholder="Yeni madde..."
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
                <button onClick={() => { if (newInfoTr.trim()) { setImportantInfoTr(prev => [...prev, newInfoTr.trim()]); setNewInfoTr(''); } }}
                  className="px-3 py-2 bg-ice-500 text-white text-sm rounded-lg min-h-[40px]">+</button>
              </div>
            </div>
            {/* EN */}
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-2">🇬🇧 English</p>
              <div className="space-y-2 mb-3">
                {importantInfoEn.map((info, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-sm text-neutral-600 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-100">{info}</span>
                    <button onClick={() => setImportantInfoEn(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-600 text-xs px-2 py-1 min-h-[32px]">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newInfoEn} onChange={e => setNewInfoEn(e.target.value)} placeholder="New item..."
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
                <button onClick={() => { if (newInfoEn.trim()) { setImportantInfoEn(prev => [...prev, newInfoEn.trim()]); setNewInfoEn(''); } }}
                  className="px-3 py-2 bg-ice-500 text-white text-sm rounded-lg min-h-[40px]">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Point + Coordinates */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-bold text-neutral-900 mb-4">📍 Buluşma Noktası</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Adres (TR)</label>
              <input type="text" value={form.meetingPoint} onChange={e => setForm(prev => ({ ...prev, meetingPoint: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Address (EN)</label>
              <input type="text" value={form.meetingPointEn} onChange={e => setForm(prev => ({ ...prev, meetingPointEn: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Enlem (Lat)</label>
              <input type="number" step="0.0001" value={form.meetingPointLat} onChange={e => setForm(prev => ({ ...prev, meetingPointLat: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Boylam (Lng)</label>
              <input type="number" step="0.0001" value={form.meetingPointLng} onChange={e => setForm(prev => ({ ...prev, meetingPointLng: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
          </div>
          {form.meetingPointLat && form.meetingPointLng ? (
            <a href={`https://www.google.com/maps?q=${form.meetingPointLat},${form.meetingPointLng}`} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-ice-600 hover:text-ice-700">
              📍 Google Haritalar&apos;da Aç →
            </a>
          ) : null}
        </div>

        {/* Price */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
          <h3 className="font-bold text-neutral-900 mb-4">Fiyat</h3>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Fiyat (EUR)</label>
            <input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full max-w-xs px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
