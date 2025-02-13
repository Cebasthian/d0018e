import { prisma } from "@/lib/server/prisma";
import { DeepPartial } from "@/types";
import { Customer, Prisma } from "@prisma/client";

export const CUSTOMER_INCLUDES: Prisma.CustomerInclude = {
    reviews: true,
    basket_items: {
        include: {
            product: true,
        }
    },
}


export async function CreateAccount(data: Customer) {
    return await prisma.customer.create({
        data: {
            ...data,
        },
        include: CUSTOMER_INCLUDES,
    });
} 

/**
 * TODO
 * @deprectated
 */
export async function GetAccountBySsn(ssn: string) {
    return await prisma.customer.findUnique({
        where: {
            ssn: ssn,
        },
        include: CUSTOMER_INCLUDES,
    })
}

export async function GetAccountByCredentials(ssn: string, hashed_password: string) {
    return prisma.customer.findUnique({
        where: {
            ssn: ssn,
            password: hashed_password
        }
    })
}

export async function UpdateAccount(ssn: string, data: DeepPartial<Customer>) {
    return await prisma.customer.update({
        data: data,
        where: {
            ssn
        },
    })
}

export async function DeleteAccount(ssn: string) {
    return await prisma.customer.delete({
        where: {
            ssn: ssn
        },
    })
}