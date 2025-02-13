import { BadRequest, InternalError, SuccessResponse } from "@/lib/server/httpStatus";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { Today } from "@/lib/util/dayjs";
import { addToBasket } from "@/service/basket";

export const POST = withCustomerSession(async (req, customer) => {
    const body = await req.json();

    const {
        product_id,
        size
    } = body

    if(!product_id || typeof product_id !== "string" || !size || typeof size !== "string") {
        return BadRequest("Invalid product_id or size")
    }

    const added_on = Today();
    const customer_ssn = customer.ssn;

    try {
        await addToBasket({
            product_id,
            size,
            added_on,
            customer_ssn
        })
    } catch(error) {
        return InternalError(error)
    }

    return SuccessResponse();
})