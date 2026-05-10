import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const tours = await prisma.tour.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });

    const categories = tours.map((t) => ({
      name: t.category,
      count: t._count.category,
    }));

    return successResponse(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}
