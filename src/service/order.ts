import { prisma } from "@/lib/server/prisma";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import { Today } from "@/lib/util/dayjs";
import { Prisma } from "@prisma/client";

export async function PlaceOrder(
    {
        address,
        city,
        postalCode,
    }: { address: string; city: string; postalCode: string },
    customer: CustomerFromSessionType
) {
    return prisma.order.create({
        data: {
            shipping_address: address,
            shipping_city: city,
            shipping_postalcode: postalCode,
            customer_ssn: customer.ssn,
            created_at: Today(),
            order_items: {
                createMany: {
                    data: customer.basket_items.map((item) => ({
                        price: item.product.price,
                        size: item.size,
                        product_id: item.product_id,
                    })),
                },
            },
        },
    });
    // return prisma.order.create({
    //     data: {
    //         ...order,
    //         customer_ssn:
    //     }
    // })
}

export async function UpdateStockFromBasket(customer: CustomerFromSessionType) {
    try {
        await prisma.$transaction(async (tx) => {
            for (const item of customer.basket_items) {
                const data:
                    | (Prisma.Without<
                          Prisma.StockUpdateInput,
                          Prisma.StockUncheckedUpdateInput
                      > &
                          Prisma.StockUncheckedUpdateInput)
                    | (Prisma.Without<
                          Prisma.StockUncheckedUpdateInput,
                          Prisma.StockUpdateInput
                      > &
                          Prisma.StockUpdateInput) = {};
                switch (item.size) {
                    case "XS":
                        data.XS = { decrement: 1 };
                        break;
                    case "S":
                        data.S = { decrement: 1 };
                        break;
                    case "M":
                        data.M = { decrement: 1 };
                        break;
                    case "L":
                        data.L = { decrement: 1 };
                        break;
                    case "XL":
                        data.XL = { decrement: 1 };
                        break;
                }
                await tx.stock.update({
                    where: {
                        product_id: item.product_id,
                    },
                    data,
                });
            }
        });
        return true;
    } catch {
        return false;
    }
}

export async function PlaceOrderAndDecrementStock(
    {
        address,
        city,
        postalCode,
    }: { address: string; city: string; postalCode: string },
    customer: CustomerFromSessionType
) {
    return await prisma.$transaction(async (tx) => {
        for (const item of customer.basket_items) {
            const data:
                | (Prisma.Without<
                      Prisma.StockUpdateInput,
                      Prisma.StockUncheckedUpdateInput
                  > &
                      Prisma.StockUncheckedUpdateInput)
                | (Prisma.Without<
                      Prisma.StockUncheckedUpdateInput,
                      Prisma.StockUpdateInput
                  > &
                      Prisma.StockUpdateInput) = {};
            switch (item.size) {
                case "XS":
                    data.XS = { decrement: 1 };
                    break;
                case "S":
                    data.S = { decrement: 1 };
                    break;
                case "M":
                    data.M = { decrement: 1 };
                    break;
                case "L":
                    data.L = { decrement: 1 };
                    break;
                case "XL":
                    data.XL = { decrement: 1 };
                    break;
            }
            await tx.stock.update({
                where: {
                    product_id: item.product_id,
                },
                data,
            });
        }

        return await tx.order.create({
            data: {
                shipping_address: address,
                shipping_city: city,
                shipping_postalcode: postalCode,
                customer_ssn: customer.ssn,
                created_at: Today(),
                order_items: {
                    createMany: {
                        data: customer.basket_items.map((item) => ({
                            price: item.product.price,
                            size: item.size,
                            product_id: item.product_id,
                        })),
                    },
                },
            },
        });
    });
}
