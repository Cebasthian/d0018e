import { BadRequest, InternalError, SuccessResponse } from "@/lib/server/httpStatus";
import { withCustomerSession } from "@/lib/server/session/session_routes";
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

    if(!name && !email && !address && !phone_nr) {
        return BadRequest("Nothing to update")
    }

    try {   
        await UpdateAccount(customer.ssn, {
            name,
            email,
            address,
            phone_nr
        })
    } catch(error: unknown) {
        return InternalError(error);
    }
        
    return SuccessResponse();
})



// export async function PUT(req: NextRequest) {
//     const body = await req.json();
//     const {
//         ssn,
//         name,
//         email,
//         address,
//         phone_nr,
//     } = body;

//     if(!ssn) return BadRequest("Invalid ssn field in body")

//     try {   
//         await UpdateAccount(ssn, {
//             name,
//             email,
//             address,
//             phone_nr
//         })
//     } catch(error: unknown) {
//         return InternalError(error);
//     }
        
//     return SuccessResponse();
// }