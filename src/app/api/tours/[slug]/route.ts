import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params in Next.js 15+ 
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'tr';

    const tourTranslation = await prisma.tourTranslation.findUnique({
      where: {
        slug: slug,
      },
      include: {
        tour: {
          include: {
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
        },
      },
    });

    if (!tourTranslation) {
        return errorResponse('Tour not found', 404);
    }

    const { tour, ...translationData } = tourTranslation;

    const formattedTour = {
      id: tour.id,
      category: tour.category,
      basePrice: tour.basePrice,
      mainImage: tour.mainImage,
      translation: translationData,
      availableDates: tour.dates,
    };

    return successResponse(formattedTour);
  } catch (error) {
    console.error('Error fetching tour details:', error);
    return errorResponse('Failed to fetch tour details', 500);
  }
}
