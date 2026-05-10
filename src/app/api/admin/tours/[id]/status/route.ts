import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// SADECE ADMİNLER İÇİN: Turun satış durumunu (aktif/pasif) tersine çeviren uç
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ dinamik param beklemesi
    const resolvedParams = await params;
    const tourId = parseInt(resolvedParams.id, 10);

    if (isNaN(tourId)) {
      return errorResponse('Invalid tour ID', 400);
    }

    // 1. Önce turun mevcut durumunu öğren
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      select: { isActive: true }
    });

    if (!tour) {
      return errorResponse('Tour not found', 404);
    }

    // 2. Durumu tam tersine (toggle) çevirerek güncelle
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: { isActive: !tour.isActive }
    });

    return successResponse({
      message: `Tour status changed to ${updatedTour.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      tour: updatedTour
    });
  } catch (error) {
    console.error('Error toggling tour status:', error);
    return errorResponse('Failed to toggle tour status', 500);
  }
}
