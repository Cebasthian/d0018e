import { GetSessionByToken } from "@/service/customer_session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function enforceCustomerSession() {
    const cookieStore = await cookies();

    const session_token = cookieStore.get("session_token")
    if(!session_token || !session_token.value) {
        // Session token missing or invalid
        redirect("/login")
    }
    
    const session = await GetSessionByToken(session_token.value)
    if(!session) {
        // Session not found or expired
        redirect("/login")
    }     

    return session.customer;
}