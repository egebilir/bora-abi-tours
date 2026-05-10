import { prisma } from '@/lib/prisma';
import AdminShell from '@/components/admin/AdminShell';
import FleetClient from './FleetClient';

export const dynamic = 'force-dynamic';

export default async function FleetPage() {
  const buses = await prisma.bus.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <AdminShell currentPath="/admin/fleet">
      <FleetClient initialBuses={buses} />
    </AdminShell>
  );
}
