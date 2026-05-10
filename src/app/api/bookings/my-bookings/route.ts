import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('User ID is required', 400);
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      include: {
        tourDate: {
          include: {
            tour: {
              include: {
                translations: {
                  where: {
                    locale: 'tr' // Basit test için varsayılan tr getiriliyor
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc',
      }
    });

    const formattedBookings = bookings.map(b => ({
      id: b.id,
      pax: b.pax,
      totalPrice: b.totalPrice,
      status: b.status,
      tourDate: b.tourDate.date,
      tourName: b.tourDate.tour.translations[0]?.title || 'Unknown Tour'
    }));

    return successResponse(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return errorResponse('Failed to fetch bookings', 500);
  }
}
