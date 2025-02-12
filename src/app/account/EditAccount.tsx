"use client"
import { http } from "@/lib/client/httpRequester";
import type { Customer } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import styles from "./account.module.css";

export default function EditAccount({customer}: {customer: Customer}) {

    const [name, setName] = useState(customer.name)
    const [address, setAddress] = useState(customer.address)
    const [phone_nr, setPhoneNr] = useState(customer.phone_nr)

    const router = useRouter();

    const save = async () => { 
        const res = await http.put("/api/account", {
            name,
            address,
            phone_nr,
            ssn: customer.ssn
        })

        if(res.status === 200) {
            router.refresh();
        }
    }

    const del = useCallback(async () => {
        if(!confirm("Are you sure you want to delete your account?")) return;

        const res = await http.delete("/api/account?ssn="+customer.ssn, null)
        if(res.status === 200) {
            router.refresh();
        }
    }, [customer.ssn, router])

    const logout = async () => {
        const res = await http.get("/api/account/logout")
        if(res.status === 200) {
            router.push("/login")
        }
    }
    
    return(
        <>
        <div>
            <div className={styles['edit-container']}>
                <label>
                    <span>Full Name</span>
                    <input value={name} onChange={e => setName(e.currentTarget.value)} />
                </label>
                <label>
                    <span>Address</span>
                    <input value={address} onChange={e => setAddress(e.currentTarget.value)} />
                </label>
                <label>
                    <span>Phone Number</span>
                    <input value={phone_nr} onChange={e => setPhoneNr(e.currentTarget.value)} />
                </label>

                <button onClick={save}>Save</button>
            </div>
            <button onClick={logout} className={styles['delete-button']}>Logout</button>
            <button onClick={del} className={styles['delete-button']}>Delete Account</button>
        </div>
        </>
    )
}