import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// SADECE ADMİNLER İÇİN: Dolmuş bir tura ekstra otobüs (kapasite) ekleme ucu
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const tourDateId = parseInt(resolvedParams.id, 10);

    if (isNaN(tourDateId)) {
      return errorResponse('Invalid tour date ID', 400);
    }

    const body = await request.json();
    const { additionalSeats } = body;

    // additionalSeats kontrolü (pozitif bir sayı olmalı)
    if (!additionalSeats || typeof additionalSeats !== 'number' || additionalSeats <= 0) {
      return errorResponse('additionalSeats must be a positive number', 400);
    }

    // Hem toplam capacity'i hem de remainingCapacity'i gönderilen sayı kadar artır
    const updatedTourDate = await prisma.tourDate.update({
      where: { id: tourDateId },
      data: {
        capacity: { increment: additionalSeats },
        remainingCapacity: { increment: additionalSeats },
      }
    });

    return successResponse({
      message: `${additionalSeats} extra seats added successfully!`,
      tourDate: updatedTourDate
    });
  } catch (error) {
    console.error('Error adding extra capacity:', error);
    return errorResponse('Failed to add extra capacity', 500);
  }
}
