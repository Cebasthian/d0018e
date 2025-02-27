import { SuccessResponse } from "@/lib/server/httpStatus";
import { deleteAdminSessionCookie } from "@/lib/server/session/cookieStore";

export async function GET() {
    await deleteAdminSessionCookie();
    return SuccessResponse();
}