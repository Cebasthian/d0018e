import { GetSessionByToken } from "@/service/customer_session";
import { Customer } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { BadRequest, InternalError } from "../httpStatus";

export const withCustomerSession = (routeHandler: (req: NextRequest, customer: Customer) => NextResponse) => {
    return async (req: NextRequest) => {

        const cookieStore = await cookies();

        const session_token = cookieStore.get("session_token")
        if(!session_token || !session_token.value) {
            // Unauthorized
            return BadRequest(); // placeholder
        }
        const session = await GetSessionByToken(session_token.value)
        if(!session) {
            // Invalid session token
            return InternalError(); // placeholder
        }        

        return routeHandler(req, session.customer)
    }
}