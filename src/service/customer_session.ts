import { SESSION_LIFESPAN } from "@/lib/server/consts";
import { prisma } from "@/lib/server/prisma";
import { default as dayjs } from 'dayjs';
import { CUSTOMER_INCLUDES } from "./customer_account";

export async function CreateCustomerSession(ssn: string) {
    const expiry = dayjs().add(SESSION_LIFESPAN, "days")

    return prisma.customerSession.create({
        data: {
            customer_ssn: ssn,
            expiry_date: expiry.toDate()
        }
    })
}

export async function GetSessionByToken(session_token: string) {
    return prisma.customerSession.findUnique({
        where: {
            session_token: session_token,
        },
        include: {
            customer: {
                include: CUSTOMER_INCLUDES
            }
        }
    })
} 