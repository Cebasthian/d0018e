import { SuccessResponse } from "@/lib/server/httpStatus";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    if(cookieStore.has("session_token")) {
        cookieStore.delete("session_token")
    }
    return SuccessResponse();
}