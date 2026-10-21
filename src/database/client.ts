import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export let isDatabaseConnected = false;

export const prisma =
  global.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    isDatabaseConnected = true;
    console.log('✅ Successfully connected to database');
  } catch (error) {
    isDatabaseConnected = false;
    console.warn('⚠️ Database connection warning (running in degraded or local mode):', (error as Error).message);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
