import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import OperasyonClient from './OperasyonClient';

export const dynamic = 'force-dynamic';

export default async function OperasyonPage() {
  const tours = await prisma.tour.findMany({
    include: {
      translations: { where: { locale: 'tr' } },
      dates: { orderBy: { date: 'asc' } },
    },
    orderBy: { id: 'desc' }
  });

  const totalBookings = await prisma.booking.count();
  
  const buses = await prisma.bus.findMany({
    orderBy: { capacity: 'desc' }
  });

  return (
    <AdminShell currentPath="/admin/operasyon">
      <OperasyonClient initialTours={tours} totalBookings={totalBookings} initialBuses={buses} />
    </AdminShell>
  );
}
