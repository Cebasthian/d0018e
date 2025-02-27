import { BadRequest, InternalError, SuccessResponse } from "@/lib/server/httpStatus";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { isString } from "@/lib/util/lib";
import { UpdateAccount } from "@/service/customer_account";

/**
 * Update account
 */
export const PUT = withCustomerSession(async (req, customer) => {
    const body = await req.json();
    const {
        name,
        email,
        address,
        phone_nr,
    } = body;

    // if(!name && !email && !address && !phone_nr) {
    if(!isString(name) && !isString(email) && !isString(address) && !isString(phone_nr)) {
        return BadRequest("Nothing to update")
    }

    try {   
        await UpdateAccount(customer.ssn, {
            name: stringOrUndefined(name),
            email: stringOrUndefined(email),
            address: stringOrUndefined(address),
            phone_nr: stringOrUndefined(phone_nr)
        })
    } catch(error: unknown) {
        return InternalError(error);
    }
        
    return SuccessResponse();
})

function stringOrUndefined(x: unknown) {
    if(isString(x)) return x as string;
    return undefined;
}