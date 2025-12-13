import { PrismaClient } from '@prisma/client';

// Extend the Node.js global object to store the Prisma client instance
// This prevents multiple instances in development environments (e.g., with hot-reloading)
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined;};

// Use the existing instance if it's available, otherwise create a new one
export const prisma = globalForPrisma.prisma ?? new PrismaClient({});

// Store the instance on the global object in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// Export the single instance
export default prisma;