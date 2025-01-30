import { prisma } from "@/lib/server/prisma";
import { DeepPartial } from "@/types";
import { Customer } from "@prisma/client";

export async function CreateAccount(data: Customer) {
    return await prisma.customer.create({
        data: {
            ...data,
            shopping_basket: {}
        },
        include: {
            shopping_basket: true
        }
    });
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