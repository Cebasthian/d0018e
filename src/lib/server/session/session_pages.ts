import { GetAdminSessionByToken } from "@/service/admin_session";
import { GetCustomerSessionByToken } from "@/service/customer_session";
import { redirect } from "next/navigation";
import { getAdminSessionCookie, getCustomerSessionCookie } from "./cookieStore";
import { CustomerFromSessionType } from "./session_routes";

export async function enforceCustomerSession(): Promise<CustomerFromSessionType> {
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

export async function tryCustomerSession(): Promise<CustomerFromSessionType|null> {
    const session_token = await getCustomerSessionCookie();

    if(!session_token || !session_token.value) {
        // Session token missing or invalid
        return null;
    }
    
    const session = await GetCustomerSessionByToken(session_token.value)
    if(!session) {
        // Session not found or expired
        return null;
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

