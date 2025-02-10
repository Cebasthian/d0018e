import { HasExpired } from "@/lib/util/dayjs";
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
            // Session token missing or invalid
            return BadRequest(); // placeholder, redirect to login?
        }
        
        const session = await GetSessionByToken(session_token.value)
        if(!session) {
            // Session not found or expired
            return InternalError(); // placeholder, redirect to login?
        }        

        /*
            In GetSessionByToken we are only fetching non-expired sessions
            which means that this function will always return true
            ig this could be a fallback incase something weird happens in the database.

            we could fetch any session that isnt expired and then delete them if they are.
            TODO: Find any way to delete expired sessions inside database.
            
            TODO: Make sure this doesnt cause any weird timezone errors
        */
        if(HasExpired(session.expiry_date)) {
            // Expired session, login again
            return BadRequest(); // placeholder, redirect?
        }

        return routeHandler(req, session.customer)
    }
}