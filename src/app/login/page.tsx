"use client"

import { http } from "@/lib/client/httpRequester"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    
    const [ssn, setSsn] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const login = async () => {
        const res = await http.post("/api/account/login", {ssn, password})
        const json = await res.json();
        if(json && json.success) {
            router.push("/account")
        }
    }

    return(
        <>
        <div>
            <input value={ssn} onChange={e => setSsn(e.target.value)} placeholder="SSN" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button onClick={login}>Login</button>
        </div>
        </>
    )
}