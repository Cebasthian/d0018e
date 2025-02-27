import { BadRequest, SuccessResponse } from "@/lib/server/httpStatus";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { clearBasket } from "@/service/basket";
import { placeOrder } from "@/service/order";

/**
 * Place a new order on the items in your basket.
 * Uses session management.
 */
export const POST = withCustomerSession(async (req, customer) => {
    if(customer.basket_items.length <= 0) {
        return BadRequest("Cannot place an order with zero items.");
    }
    
    const body = await req.json();

    const { address, city, postalCode } = body;

    if (!isString(address) || !isString(city) || !isString(postalCode)) {
        return BadRequest("Invalid shipping details.");
    }

    const order = await placeOrder({address, city, postalCode}, customer)

    await clearBasket(customer.ssn);

    return SuccessResponse(order);
    
});

function isString(str: unknown) {
    return str && typeof str === "string";
}
