"use client"
import { http } from "@/lib/client/httpRequester";
import { useCustomer } from "@/lib/client/useCustomer";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import { delay } from "@/lib/util/lib";
import { useCallback, useState } from "react";
import styles from "./checkout.module.css";

export default function CheckoutDetails({customer: c}: {customer:CustomerFromSessionType}) {

    const {customer, refresh} = useCustomer(c);

    const [address, setAddress] = useState(customer.address)
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const placeOrder = useCallback(async () => {
        if(loading || success) return;

        if(!address || !city || !postalCode) {
            setError("All fields are required")
            return;
        }

        setLoading(true)
        
        const body = {
            address,
            city,
            postalCode
        }

        try {
            const res = await http.post("/api/order/place", body)
            if(res.ok) {
                await delay(300)
                setSuccess(true)
                await refresh()
            }
        } catch {
            setError("Invalid fields")
        }
        
        
        setLoading(false)

    }, [address, city, postalCode, loading, success, refresh])

    return(
        <>
        <div className={styles.details}>
            <h2>Checkout Details</h2>
            <p className={styles.error}>{error}</p>
            <div className={styles.shipping}>
                <label>
                    <span>Address:</span>
                    <input value={address} onChange={e => setAddress(e.target.value)} />
                </label>
                <div>
                    <label>
                        <span>City:</span>
                        <input value={city} onChange={e => setCity(e.target.value)} />
                    </label>
                    <div className={styles.divider}></div>
                    <label>
                        <span>Postal Code:</span>
                        <input value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                    </label>
                </div>
            </div>
            <button onClick={placeOrder} disabled={loading} className={styles['place-order'] + (success ? " " + styles.success : "")}>{success ? "Order Placed!" : "Place Order"}</button>
        </div>
        </>
    )
}