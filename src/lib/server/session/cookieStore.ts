import { AdministratorSesssion, CustomerSession } from "@prisma/client";
import { cookies } from "next/headers";
import { ADMIN_SESSION_TOKEN_NAME, CUSTOMER_SESSION_TOKEN_NAME } from "../../util/constants";




export async function getCustomerSessionCookie() {
    const cookieStore = await cookies();
    return cookieStore.get(CUSTOMER_SESSION_TOKEN_NAME)
}

export async function createCustomerSessionCookie(session: CustomerSession) {
    const cookieStore = await cookies()
    cookieStore.set(CUSTOMER_SESSION_TOKEN_NAME, session.session_token, { secure: true, expires: session.expiry_date, httpOnly: true });
}

export async function deleteCustomerSessionCookie() {
    const cookieStore = await cookies();
    if(cookieStore.has(CUSTOMER_SESSION_TOKEN_NAME)) {
        cookieStore.delete(CUSTOMER_SESSION_TOKEN_NAME)
    }
}




export async function getAdminSessionCookie() {
    const cookieStore = await cookies();
    return cookieStore.get(ADMIN_SESSION_TOKEN_NAME)
}

export async function createAdminSessionCookie(session: AdministratorSesssion) {
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_SESSION_TOKEN_NAME, session.session_token, { secure: true, expires: session.expiry_date, httpOnly: true });
}

export async function deleteAdminSessionCookie() {
    const cookieStore = await cookies();
    if(cookieStore.has(ADMIN_SESSION_TOKEN_NAME)) {
        cookieStore.delete(ADMIN_SESSION_TOKEN_NAME)
    }
}
