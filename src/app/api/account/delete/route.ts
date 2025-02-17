import { InternalError, SuccessResponse } from "@/lib/server/httpStatus";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { DeleteAccount } from "@/service/customer_account";

/**
 * Delete account
 */
export const DELETE = withCustomerSession(async (req, customer) => {
    try {
        await DeleteAccount(customer.ssn)
    } catch(error) {
        return InternalError(error)
    }

    return SuccessResponse();
})


// export async function DELETE(req: NextRequest) {
//     const searchParams = req.nextUrl.searchParams;

//     const ssn = searchParams.get("ssn");

//     if(!ssn) return BadRequest("Invalid ssn parameter");

//     try {
//         await DeleteAccount(ssn)
//     } catch(error: unknown) {
//         return InternalError(error);
//     }
        
//     return SuccessResponse();
// }