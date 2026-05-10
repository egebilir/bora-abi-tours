import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'tr';
    const category = searchParams.get('category');

    const tours = await prisma.tour.findMany({
      where: {
        ...(category ? { category } : {}),
      },
      include: {
        translations: {
          where: {
            locale: lang,
          },
        },
        dates: {
          where: {
            date: {
              gte: new Date(),
            },
            remainingCapacity: {
              gt: 0,
            },
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    // Formatting the response so that translations array is flattened
    const formattedTours = tours.map((tour) => {
      const translation = tour.translations[0] || null;
      return {
        id: tour.id,
        category: tour.category,
        basePrice: tour.basePrice,
        mainImage: tour.mainImage,
        translation,
        availableDates: tour.dates,
      };
    });

    return successResponse(formattedTours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return errorResponse('Failed to fetch tours', 500);
  }
}
