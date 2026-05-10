import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const busId = parseInt(resolvedParams.id, 10);

    if (isNaN(busId)) {
      return errorResponse('Invalid bus ID', 400);
    }

    await prisma.bus.delete({
      where: { id: busId }
    });

    return successResponse({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    return errorResponse('Failed to delete bus', 500);
  }
}
