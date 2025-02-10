import { hashPassword } from "@/lib/server/hash";
import { BadRequest, SuccessResponse } from "@/lib/server/httpStatus";
import { GetAccountByCredentials } from "@/service/customer_account";
import { CreateCustomerSession } from "@/service/customer_session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const cookieStore = await cookies()
    cookieStore.set("session_token", session.session_token, { secure: true, expires: session.expiry_date, httpOnly: true });

    return SuccessResponse();
}

export async function GET() {
    const cookieStore = await cookies();
    console.log(cookieStore.get("session_token"))
    return NextResponse.json(cookieStore.get("session_token"))
}