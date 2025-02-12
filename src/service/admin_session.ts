import { prisma } from "@/lib/server/prisma";
import { ADMIN_SESSION_LIFESPAN } from "@/lib/util/constants";
import { CreateExpirationDate } from "@/lib/util/dayjs";

export async function CreateAdminSession(ssn: string) {
    const expiry = CreateExpirationDate(ADMIN_SESSION_LIFESPAN);

    return prisma.administratorSesssion.create({
        data: {
            administrator_ssn: ssn,
            expiry_date: expiry
        }
    })
}

export async function GetAdminSessionByToken(session_token: string) {
    return prisma.administratorSesssion.findUnique({
        where: {
            session_token: session_token,
            expiry_date: {
                gt: new Date()
            }
        },
        include: {
            administrator: true
        }
    })
} 