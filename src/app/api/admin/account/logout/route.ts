import { SuccessResponse } from "@/lib/server/httpStatus";
import { deleteAdminSessionCookie } from "@/lib/server/session/cookieStore";

/**
 * Log out from admin account
 */
export async function GET() {
    await deleteAdminSessionCookie();
    return SuccessResponse();
}