import { deleteAdminSessionCookie } from "@/lib/server/session/cookieStore";
import { NextResponse } from "next/server";

/**
 * Log out from admin account
 */
export async function GET(request: Request) {
    await deleteAdminSessionCookie();
    return NextResponse.redirect(new URL('/admin/login', request.url));
}