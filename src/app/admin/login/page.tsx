import { tryAdminSession } from "@/lib/server/session/session_pages";
import { redirect } from "next/navigation";
import AdminLoginPageClient from "./client";

export default async function AdminLoginPage() {
    const admin = await tryAdminSession()
    if(admin !== null) {
        redirect("/admin/product")
    }

    return(
        <>
        <AdminLoginPageClient/>
        </>
    )
}