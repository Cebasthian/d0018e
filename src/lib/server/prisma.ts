import { PrismaClient } from "@prisma/client";

const gloablPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = gloablPrisma.prisma || new PrismaClient({
    log: ["query"],
    omit: {
        customer: {
            password: true,
        },
        administrator: {
            password: true
        }
    },
});

if(process.env.NODE_ENV !== "production") gloablPrisma.prisma = prisma;