import { BadRequest, HttpError, SuccessResponse } from "@/lib/server/httpStatus";
import { prisma } from "@/lib/server/prisma";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { clearBasket } from "@/service/basket";
import { PlaceOrderAndDecrementStock } from "@/service/order";

// GET all orders for order management page.
/**
 * Get all orders
 */
export const GET = async (req: Request) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { processed: "asc" }, // unprocessed orders come first
            include: {
                customer: true,
                order_items: {
                    include: {
                        Product: true,
                    },
                },
            },
        });
        return SuccessResponse(orders);
    } catch (error) {
        console.error("Error retrieving orders", error);
        return BadRequest("Error retrieving orders");
    }
};

/**
 * Place a new order on the items in your basket.
 * Uses session management.
 */
export const POST = withCustomerSession(async (req, customer) => {
    if (customer.basket_items.length <= 0) {
        return BadRequest("Cannot place an order with zero items.");
    }

    const body = await req.json();

    const { address, city, postalCode } = body;

    if (!isString(address) || !isString(city) || !isString(postalCode)) {
        return BadRequest("Invalid shipping details.");
    }
    const empties = customer.basket_items.filter(item => {
        if(item.product.stock === null) return true;
        const value = item.product.stock[item.size as keyof typeof item.product.stock]
        if(value <= 0) return true;
        return false;
    })

    if(empties.length > 0) {
        return HttpError(500, "Unfortunately some item(s) are out of stock.", "ITEMS_OUT_OF_STOCK_ERROR")()
    }

    // const order = await PlaceOrder({address, city, postalCode}, customer)
    // await UpdateStockFromBasket(customer);

    try {

        const order = await PlaceOrderAndDecrementStock({address, city, postalCode}, customer)
        await clearBasket(customer.ssn);
        return SuccessResponse(order);
    } catch {
        return HttpError(500, "Unfortunately some stock is too low for some items.", "ITEMS_NOT_ENOUGH_STOCK_ERROR")()
    }
    
});

function isString(str: unknown) {
    return str && typeof str === "string";
}
