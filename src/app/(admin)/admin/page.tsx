'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminDashboardPage() {
  const store = useAdminStore();

  const stats = [
    { label: 'Toplam Satış', value: `€${store.totalRevenue.toLocaleString('tr-TR')}`, icon: '💰', color: 'bg-ice-50 text-ice-600 border-ice-100' },
    { label: 'Bugünkü Rezervasyon', value: store.todayBookings.toString(), icon: '🎫', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Doluluk Oranı', value: `%${store.averageOccupancy}`, icon: '📊', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Aktif Turlar', value: store.tours.length.toString(), icon: '🗺️', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  ];

  const popularTours = store.tours
    .map(t => ({ name: t.title.length > 18 ? t.title.slice(0, 18) + '…' : t.title, reviews: t.reviewCount }))
    .sort((a, b) => b.reviews - a.reviews);

  const upcomingTours = store.tours.map(t => {
    const booked = store.getOccupancy(t.id);
    const totalCap = t.tourBuses.reduce((s, tb) => {
      const bus = store.buses.find(b => b.id === tb.busId);
      return s + (bus?.capacity || 0);
    }, 0);
    const occ = totalCap > 0 ? Math.round((booked / totalCap) * 100) : 0;
    const languages = [...new Set(t.tourBuses.map(tb => tb.language))];
    return { ...t, occupancy: occ, booked, totalCap, languages };
  });

  return (
    <AdminShell currentPath="/admin">
      <div className="space-y-6 sm:space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border p-4 sm:p-5 ${s.color}`}>
              <span className="text-2xl">{s.icon}</span>
              <div className="text-2xl sm:text-3xl font-bold mt-2">{s.value}</div>
              <div className="text-sm opacity-70 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Aylık Satış Performansı</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={store.monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `€${v / 1000}k`} />
                  <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}`, 'Gelir']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={2} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">En Popüler Turlar</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularTours} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" width={130} />
                  <Tooltip formatter={(value) => [`${value} değerlendirme`, 'Popülerlik']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="reviews" fill="#0EA5E9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Upcoming Tours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Yaklaşan Turlar — Bugün</h2>
            <span className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">{upcomingTours.length} tur</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50 text-left">
                  {['Tur', 'Saat', 'Diller', 'Doluluk', 'Durum'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {upcomingTours.map((t) => (
                  <tr key={t.id} className="hover:bg-ice-50/30 transition-colors">
                    <td className="px-5 py-4"><div className="font-medium text-neutral-900 text-sm">{t.title}</div></td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{t.startTime}</td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      <div className="flex flex-wrap gap-1">
                        {t.languages.map((l: string) => (<span key={l} className="px-1.5 py-0.5 bg-ice-50 text-ice-700 text-xs rounded-md">{l.toUpperCase()}</span>))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.occupancy >= 90 ? 'bg-red-500' : t.occupancy >= 70 ? 'bg-amber-500' : 'bg-ice-500'}`} style={{ width: `${t.occupancy}%` }} />
                        </div>
                        <span className="text-xs font-medium text-neutral-600 w-14 text-right">{t.booked}/{t.totalCap}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {t.occupancy >= 90 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 animate-pulse">⚠️ Kritik</span>
                      ) : t.occupancy >= 50 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Dolmakta</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Müsait</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminShell>
  );
}
