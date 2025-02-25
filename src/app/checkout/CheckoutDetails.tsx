"use client"
import { useCustomer } from "@/lib/client/useCustomer";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import styles from "./checkout.module.css";

export default function CheckoutDetails({customer: c}: {customer:CustomerFromSessionType}) {

    const {customer, refresh} = useCustomer(c);

    return(
        <>
        <div className={styles.details}>


            
        </div>
        </>
    )
}