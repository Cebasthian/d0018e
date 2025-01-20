import { PrismaClient } from "@prisma/client";

const gloablPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = gloablPrisma.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") gloablPrisma.prisma = prisma;