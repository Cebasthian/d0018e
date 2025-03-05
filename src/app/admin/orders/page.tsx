import { enforceAdminSession } from "@/lib/server/session/session_pages";
import Orders_page from "./client";

export default async function AdminOrderPage() {
    const admin = await enforceAdminSession()
    console.log(admin)

    return(
        <>
        <Orders_page/>
        </>
    )
}