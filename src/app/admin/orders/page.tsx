import { enforceAdminSession } from "@/lib/server/session/session_pages";
import Orders_page from "./client";

export default async function AdminOrderPage() {
    await enforceAdminSession()

    return(
        <>
        <Orders_page/>
        </>
    )
}