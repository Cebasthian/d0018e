import { GetAdminSessionByToken } from "@/service/admin_session";
import { GetCustomerSessionByToken } from "@/service/customer_session";
import { redirect } from "next/navigation";
import { getAdminSessionCookie, getCustomerSessionCookie } from "./cookieStore";

export async function enforceCustomerSession() {
    const session_token = await getCustomerSessionCookie();

    if(!session_token || !session_token.value) {
        // Session token missing or invalid
        redirect("/login")
    }
    
    const session = await GetCustomerSessionByToken(session_token.value)
    if(!session) {
        // Session not found or expired
        redirect("/login")
    }     

    return session.customer;
}

export async function enforceAdminSession() {
    const session_token = await getAdminSessionCookie();

    if(!session_token || !session_token.value) {
        // Session token missing or invalid
        redirect("/login")
    }
    
    const session = await GetAdminSessionByToken(session_token.value)
    if(!session) {
        // Session not found or expired
        redirect("/login")
    }     

    return session.administrator;
}