import { hashPassword } from "@/lib/server/hash";
import { BadRequest, SuccessResponse } from "@/lib/server/httpStatus";
import { createAdminSessionCookie } from "@/lib/server/session/cookieStore";
import { GetAdminByCredentials } from "@/service/admin_accounts";
import { CreateAdminSession } from "@/service/admin_session";
import { NextRequest } from "next/server";

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
    const customer = await GetAdminByCredentials(ssn, hashed);
    if(customer === null) {
        return BadRequest("Invalid credentials")
    }

    // Create session
    const session = await CreateAdminSession(ssn);

    // Set cookie
    await createAdminSessionCookie(session);

    return SuccessResponse();
}