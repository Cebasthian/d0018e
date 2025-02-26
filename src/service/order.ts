import { prisma } from "@/lib/server/prisma";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import { Today } from "@/lib/util/dayjs";

export async function placeOrder(
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
