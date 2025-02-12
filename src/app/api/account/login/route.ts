import { hashPassword } from "@/lib/server/hash";
import { BadRequest, SuccessResponse } from "@/lib/server/httpStatus";
import { createCustomerSessionCookie } from "@/lib/server/session/cookieStore";
import { GetAccountByCredentials } from "@/service/customer_account";
import { CreateCustomerSession } from "@/service/customer_session";
import { NextRequest } from "next/server";

/**
 * Login to an account
 */
export async function POST(req: NextRequest) {
    const body = await req.json()
    const {
        ssn,
        password
    } = body;

    // Validation
    if(
        !ssn || typeof ssn !== "string" || 
        !password || typeof password !== "string"
    ) {
        return BadRequest()
    }

    // Check if credentials exist
    const hashed = hashPassword(password)
    const customer = await GetAccountByCredentials(ssn, hashed);
    if(customer === null) {
        return BadRequest("Invalid credentials")
    }

    // Create session
    const session = await CreateCustomerSession(ssn);

    // Set cookie
    await createCustomerSessionCookie(session);

    return SuccessResponse();
}