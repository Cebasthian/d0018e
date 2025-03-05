import { BadRequest, InternalError, SuccessResponse } from "@/lib/server/httpStatus";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { removeFromBasket } from "@/service/basket";

/**
 * Remove from basket
 */
export const DELETE = withCustomerSession(async (req, customer) => {
    const body = await req.json();

    const {
        id
    } = body;

    if(!id || typeof id !== "number") {
        return BadRequest("Invalid item id")
    }

    try {
        await removeFromBasket({id: id, customer_ssn: customer.ssn})
    } catch(error) {
        return InternalError(error)
    }

    return SuccessResponse();
})