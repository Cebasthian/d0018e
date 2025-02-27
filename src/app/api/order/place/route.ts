import { BadRequest, SuccessResponse } from "@/lib/server/httpStatus";
import { prisma } from "@/lib/server/prisma";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { clearBasket } from "@/service/basket";
import { placeOrder } from "@/service/order";

export const GET = async (req: Request) => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { processed: 'asc' }, // unprocessed orders come first
        include: {
          customer: true,
          order_items: true,
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