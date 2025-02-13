import { prisma } from "@/lib/server/prisma";

export async function addToBasket(item: {
    customer_ssn: string;
    product_id: string;
    added_on: Date;
    size: string;
}) {
    return prisma.basketItem.create({
        data: item,
    });
}

export async function removeFromBasket({
    customer_ssn,
    id
}: {
    customer_ssn: string;
    id: number;
}) {
    return prisma.basketItem.delete({
        where: {
            customer_ssn,
            id
        }
    })
}
