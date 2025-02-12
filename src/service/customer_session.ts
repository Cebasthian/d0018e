import { prisma } from "@/lib/server/prisma";
import { CUSTOMER_SESSION_LIFESPAN } from "@/lib/util/constants";
import { CreateExpirationDate } from "@/lib/util/dayjs";
import { CUSTOMER_INCLUDES } from "./customer_account";

export async function CreateCustomerSession(ssn: string) {
    const expiry = CreateExpirationDate(CUSTOMER_SESSION_LIFESPAN);

    return prisma.customerSession.create({
        data: {
            customer_ssn: ssn,
            expiry_date: expiry
        }
    })
}

export async function GetCustomerSessionByToken(session_token: string) {
    return prisma.customerSession.findUnique({
        where: {
            session_token: session_token,
            expiry_date: {
                gt: new Date()
            }
        },
        include: {
            customer: {
                include: CUSTOMER_INCLUDES
            }
        }
    })
} 