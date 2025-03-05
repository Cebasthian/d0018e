"use client"

import { http } from "@/lib/client/httpRequester"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
    
    const router = useRouter()
    
    return(
        <a href="#" onClick={async () => {
            await http.get("/api/admin/account/logout")
            router.push("/admin/login")
        }}>Logout</a>
    )
}