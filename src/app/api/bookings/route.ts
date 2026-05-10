import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tourDateId, pax } = body;

    if (!userId || !tourDateId || !pax || typeof pax !== 'number' || pax <= 0) {
      return errorResponse('Missing or invalid required fields (userId, tourDateId, pax)', 400);
    }

    // 1. Transaction ile veri tutarlılığını garantiliyoruz
    const result = await prisma.$transaction(async (tx) => {
      // 2. Tur tarihini ve bağlı olduğu turu (fiyat için) getir
      const tourDate = await tx.tourDate.findUnique({
        where: { id: tourDateId },
        include: { tour: true }
      });

      if (!tourDate) {
        throw new Error('Tour date not found');
      }

      // 3. Kritik Kontrol: Yeterli kontenjan var mı?
      if (pax > tourDate.remainingCapacity) {
        throw new Error(`Not enough capacity. Only ${tourDate.remainingCapacity} spots remaining.`);
      }

      // 4. Toplam fiyat hesaplama
      const totalPrice = tourDate.tour.basePrice * pax;

      // 5. Rezervasyonu oluştur (Varsayılan durum PENDING)
      const newBooking = await tx.booking.create({
        data: {
          userId,
          tourDateId,
          pax,
          totalPrice,
          status: 'PENDING',
        },
      });

      // 6. Kontenjanı pax kadar düşür
      await tx.tourDate.update({
        where: { id: tourDateId },
        data: {
          remainingCapacity: {
            decrement: pax,
          },
        },
      });

      return newBooking;
    });

    return successResponse(result, 201);

  } catch (error: any) {
    console.error('Booking Error:', error);
    // Hata bizim fırlattığımız "Not enough capacity" ise mesajı kullanıcıya ilet
    const message = error.message || 'An error occurred while processing the booking';
    return errorResponse(message, 400);
  }
}
