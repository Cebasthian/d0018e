import { prisma } from "@/lib/server/prisma";
import { DeepPartial } from "@/types";
import { Customer } from "@prisma/client";

export async function CreateAccount(data: Customer) {
    const customer = await prisma.customer.create({
        data,
        select: {
            ssn: true,
        }
    });

    await prisma.basket.create({
        data: {
            customer_ssn: data.ssn,
        }
    })

    return customer;
} 

export async function FindAccount(ssn: string) {
    return await prisma.customer.findUnique({
        where: {
            ssn: ssn,
        }
    })
}

export async function UpdateAccount(ssn: string, data: DeepPartial<Customer>) {
    return await prisma.customer.update({
        data: data,
        where: {
            ssn
        }
    })
}

export async function DeleteAccount(ssn: string) {
    return await prisma.customer.delete({
        where: {
            ssn: ssn
        }
    })
}