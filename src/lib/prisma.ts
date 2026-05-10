import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma2: PrismaClient };

export const prisma = globalForPrisma.prisma2 || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma2 = prisma;
