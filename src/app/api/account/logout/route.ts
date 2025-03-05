import { SuccessResponse } from "@/lib/server/httpStatus";
import { deleteCustomerSessionCookie } from "@/lib/server/session/cookieStore";

/**
 * Logout
 */
export async function GET() {
    await deleteCustomerSessionCookie();
    return SuccessResponse();
}