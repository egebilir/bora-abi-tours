'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OperasyonClient({ initialTours, totalBookings, initialBuses }: { initialTours: any[], totalBookings: number, initialBuses: any[] }) {
  const [tours, setTours] = useState(initialTours);
  const [buses] = useState(initialBuses);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Hangi tarihe araç eklendiğini tutan state
  const [assigningBusToDate, setAssigningBusToDate] = useState<number | null>(null);

  const POSTHOG_SHARED_DASHBOARD_URL = "https://eu.posthog.com/embedded/8wh34fNX1r30EhUYEiQiuQsvC9LJqA"; 

  const toggleTourStatus = async (tourId: number) => {
    setLoadingId(`tour-${tourId}`);
    try {
      const res = await fetch(`/api/admin/tours/${tourId}/status`, { method: 'PATCH' });
      if (res.ok) {
        setTours(tours.map(t => t.id === tourId ? { ...t, isActive: !t.isActive } : t));
      }
    } catch (e) {
      alert('Hata oluştu');
    }
    setLoadingId(null);
  };

  const assignBusToDate = async (tourDateId: number, busCapacity: number) => {
    setLoadingId(`date-${tourDateId}`);
    try {
      const res = await fetch(`/api/admin/tour-dates/${tourDateId}/capacity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalSeats: busCapacity })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTours(tours.map(t => ({
          ...t,
          dates: t.dates.map((d: any) => d.id === tourDateId ? data.data.tourDate : d)
        })));
        setAssigningBusToDate(null);
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (e) {
      alert('Bağlantı hatası');
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Framer Motion Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="text-sm font-medium text-neutral-500">Sistem Sağlığı</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-1">%100</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">🎫</div>
            <h3 className="text-sm font-medium text-neutral-500">Canlı Satışlar</h3>
            <p className="text-3xl font-bold text-neutral-900 mt-1">{totalBookings} Rezervasyon</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-start justify-between">
          <div>
            <div className="text-2xl mb-2">📈</div>
            <h3 className="text-sm font-medium text-neutral-500">PostHog Analitik</h3>
          </div>
          <a href="https://eu.posthog.com" target="_blank" rel="noreferrer" className="mt-4 w-full text-center bg-ice-500 hover:bg-ice-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
            PostHog'a Git ↗
          </a>
        </motion.div>
      </div>

      {/* Embedded Live PostHog Dashboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
            Canlı Kullanıcı Trafiği (PostHog)
          </h2>
        </div>
        <div className="w-full bg-neutral-50 h-[400px] flex items-center justify-center relative">
          {POSTHOG_SHARED_DASHBOARD_URL ? (
            <iframe src={POSTHOG_SHARED_DASHBOARD_URL} className="w-full h-full border-none" title="PostHog Live Dashboard" />
          ) : (
            <div className="text-center px-4"><p className="text-sm text-neutral-500 max-w-md mx-auto">Please configure PostHog Link</p></div>
          )}
        </div>
      </motion.div>

      {/* Inventory Management Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Operasyonel Tur Envanteri</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Tur Detayı</th>
                <th className="px-6 py-4 font-semibold w-32">Durum</th>
                <th className="px-6 py-4 font-semibold w-1/2">Tarihler / Doluluk Oranı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {tours.map(tour => (
                <tr key={tour.id} className="hover:bg-ice-50/20 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-neutral-900 text-base">{tour.translations[0]?.title || `Tour #${tour.id}`}</div>
                    <div className="text-neutral-500 text-xs mt-1 font-medium">{tour.category} • €{tour.basePrice}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <button onClick={() => toggleTourStatus(tour.id)} disabled={loadingId === `tour-${tour.id}`} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${tour.isActive ? 'bg-ice-500' : 'bg-neutral-300'}`}>
                        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${tour.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-4">
                      {tour.dates.map((date: any) => {
                        const booked = date.capacity - date.remainingCapacity;
                        const occupancyPercent = date.capacity > 0 ? Math.round((booked / date.capacity) * 100) : 0;
                        const isAssigning = assigningBusToDate === date.id;
                        
                        return (
                          <div key={date.id} className="flex flex-col gap-2.5 bg-neutral-50 p-4 rounded-xl border border-neutral-100 transition-all">
                            <div className="flex justify-between items-center text-xs font-semibold text-neutral-700">
                              <span>{new Date(date.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              <span>{booked} / {date.capacity} Dolu</span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {/* Modern Progress Bar */}
                              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${occupancyPercent >= 90 ? 'bg-red-500' : occupancyPercent >= 60 ? 'bg-amber-500' : 'bg-ice-500'}`} style={{ width: `${occupancyPercent}%` }} />
                              </div>
                              
                              {/* Circular Plus Button */}
                              <button onClick={() => setAssigningBusToDate(isAssigning ? null : date.id)} disabled={loadingId === `date-${date.id}`} className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white border border-ice-200 text-ice-600 rounded-full shadow-sm hover:bg-ice-50 hover:border-ice-400 transition-colors font-bold text-lg leading-none" title="Araç Ekle">
                                {isAssigning ? '×' : '+'}
                              </button>
                            </div>

                            {/* Bus Assignment Dropdown/Modal Inline */}
                            <AnimatePresence>
                              {isAssigning && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 pt-3 border-t border-neutral-200">
                                  <div className="text-xs font-semibold text-neutral-600 mb-2">Bu tarihe atanacak aracı seçin:</div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {buses.length === 0 && <div className="text-xs text-neutral-500 col-span-2">Filoda araç yok. Lütfen Araç Filosu sayfasından araç ekleyin.</div>}
                                    {buses.map(bus => (
                                      <button key={bus.id} onClick={() => assignBusToDate(date.id, bus.capacity)} className="flex items-center justify-between px-3 py-2 bg-white border border-neutral-200 rounded-lg hover:border-ice-500 hover:bg-ice-50 transition-colors text-left">
                                        <div>
                                          <div className="text-xs font-bold text-neutral-900">{bus.name}</div>
                                          <div className="text-[10px] text-neutral-500">{bus.plateNumber}</div>
                                        </div>
                                        <div className="text-xs font-bold text-ice-600 bg-ice-100 px-2 py-0.5 rounded-full">+{bus.capacity}</div>
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
