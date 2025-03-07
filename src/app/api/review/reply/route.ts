import { BadRequest, SuccessResponse } from "@/lib/server/httpStatus";
import { prisma } from "@/lib/server/prisma";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { areStrings, isString } from "@/lib/util/lib";

export const POST = withCustomerSession(async (req, customer) => {
    const body = await req.json();

    const {
        review_id,
        comment,
        parent_id,
    } = body

    if(!areStrings([review_id, comment]) || !(parent_id === null || isString(parent_id) || parent_id === undefined)) {
        return BadRequest();
    }

    await prisma.reviewReply.create({
        data: {
            review_id: review_id,
            comment: comment,
            customer_ssn: customer.ssn,
            parent_id: parent_id || null
        }
    })


    return SuccessResponse();
})