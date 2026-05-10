import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    return errorResponse('Failed to fetch buses', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, plateNumber, capacity, type } = body;

    if (!name || !plateNumber || !capacity || !type) {
      return errorResponse('All fields are required', 400);
    }

    const newBus = await prisma.bus.create({
      data: {
        name,
        plateNumber,
        capacity: Number(capacity),
        type,
      }
    });

    return successResponse(newBus, 201);
  } catch (error) {
    console.error('Error creating bus:', error);
    return errorResponse('Failed to create bus', 500);
  }
}
