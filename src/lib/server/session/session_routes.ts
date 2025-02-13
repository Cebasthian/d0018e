import { HasExpired } from "@/lib/util/dayjs";
import { GetAdminSessionByToken } from "@/service/admin_session";
import { GetCustomerSessionByToken } from "@/service/customer_session";
import { Administrator } from "@prisma/client";
import { PromiseReturnType } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";
import { BadRequest, Unauthorized } from "../httpStatus";
import { getAdminSessionCookie, getCustomerSessionCookie } from "./cookieStore";

export type CustomerFromSessionType = Exclude<PromiseReturnType<typeof GetCustomerSessionByToken>, null>["customer"]

export const withCustomerSession = (routeHandler: (req: NextRequest, customer: CustomerFromSessionType) => NextResponse | Promise<NextResponse>) => {
    return async (req: NextRequest) => {
        const session_token = await getCustomerSessionCookie();

        if(!session_token || !session_token.value) {
            // Session token missing or invalid
            return Unauthorized("Session token invalid or missing"); // placeholder, redirect to login?
        }
        
        const session = await GetCustomerSessionByToken(session_token.value)
        if(!session) {
            // Session not found or expired
            return Unauthorized("Expired session"); // placeholder, redirect to login?
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
            return BadRequest("Expired session"); // placeholder, redirect?
        }

        return routeHandler(req, session.customer)
    }
}

export const withAdminSession = (routeHandler: (req: NextRequest, admin: Administrator) => NextResponse) => {
    return async (req: NextRequest) => {

        const session_token = await getAdminSessionCookie();
        
        if(!session_token || !session_token.value) {
            // Session token missing or invalid
            return Unauthorized("Session token invalid or missing"); // placeholder, redirect to login?
        }
        
        const session = await GetAdminSessionByToken(session_token.value)
        if(!session) {
            // Session not found or expired
            return Unauthorized("Expired session"); // placeholder, redirect to login?
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
            return BadRequest("Expired session"); // placeholder, redirect?
        }

        return routeHandler(req, session.administrator)
    }
}

