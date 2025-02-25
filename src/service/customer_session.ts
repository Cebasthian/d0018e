import { prisma } from "@/lib/server/prisma";
import { CUSTOMER_SESSION_LIFESPAN } from "@/lib/util/constants";
import { CreateExpirationDate, Today } from "@/lib/util/dayjs";
// import { CUSTOMER_INCLUDES } from "./customer_account";

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
                gt: Today()
            }
        },
        include: {
            // customer: CUSTOMER_INCLUDES
            customer: {
                include: {
                    reviews: true,
                    basket_items: {
                        include: {
                            product: {
                                include: {
                                    images: true,
                                }
                            }
                        }
                    },
                    orders: {
                        include: {
                            order_items: {
                                include: {
                                    Product: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
} 