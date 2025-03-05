"use client";
import Icon from "@/components/icon/Icon";
import { http } from "@/lib/client/httpRequester";
import { useCustomer } from "@/lib/client/useCustomer";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import { DateString } from "@/lib/util/dayjs";
import { areStrings, delay } from "@/lib/util/lib";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import styles from "./account.module.css";

type Props = {
    customer: CustomerFromSessionType;
};

export default function AccountPageClient({ customer: c }: Props) {
    const { customer, refresh, clear } = useCustomer(c);
    const router = useRouter();

    const [details, setDetails] = useImmer({
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone_nr: customer.phone_nr,
    });

    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const save = useCallback(async () => {
        setSuccess(false)

        if(!areStrings([details.name, details.email, details.address, details.phone_nr])) {
            setError("All fields must not be blank")
            return;
        }

        setError("")
        setDisabled(true)

        const res = await http.put("/api/account/update", details)

        await delay(200)

        if(res.ok) {
            setSuccess(true)
            await refresh();
        } else {
            setError((await res.json()).message)
        }

        setDisabled(false)

    }, [details, refresh])
    
    const del = async () => {
        if(!confirm("Are you sure you want to delete your account?")) return;

        const res = await http.delete("/api/account/delete", null)
        if(res.ok) {
            await clear();
            router.push("/")
        }
    }

    const logout = async () => {
        const res = await http.get("/api/account/logout")
        if(res.ok) {
            await clear();
            router.push("/")
        }
    }

    const orders = useMemo(() => {
        return customer.orders.map((o) => (
            <div key={o.order_id} className={styles.order}>
                <span>Date: {DateString(o.created_at)}</span>
                <span>
                    With <b>{o.order_items.length}</b> products at{" "}
                    <b>
                        {o.order_items.reduce(
                            (acc, item) => item.price + acc,
                            0
                        )}
                    </b>{" "}
                    SEK
                </span>
                <span>State: {o.processed ? "Delivering" : "Processing"}</span>
            </div>
        ));
    }, [customer.orders]);


    return (
        <>
            <div className={styles.container}>
                <div className={styles.details}>
                    <h1>Welcome {customer.name}</h1>
                    <div className={styles.information}>
                        <p className={styles.error}>{error}</p>
                        <label>
                            <span>Full Name</span>
                            <input value={details.name} onChange={e => setDetails(d => {d.name = e.target.value})} />
                        </label>
                        <label>
                            <span>Email</span>
                            <input value={details.email} onChange={e => setDetails(d => {d.email = e.target.value})} />
                        </label>
                        <label>
                            <span>Address</span>
                            <input value={details.address} onChange={e => setDetails(d => {d.address = e.target.value})} />
                        </label>
                        <label>
                            <span>Phone Number</span>
                            <input value={details.phone_nr} onChange={e => setDetails(d => {d.phone_nr = e.target.value})} />
                        </label>
                        <button disabled={disabled} className={[styles.save, success ? styles.success : ""].join(" ")} onClick={save}>
                            {
                                disabled ? "Loading..." :
                                    success ? (
                                        <>
                                        <span>Saved!</span>
                                        <Icon>check</Icon>
                                        </>
                                    ) : "Save"
                            }
                        </button>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles['account-buttons']}>
                        <button onClick={logout}>
                            <span>Logout</span>
                            <Icon>logout</Icon>
                        </button>
                        <button onClick={del} className={styles.delete}>
                            <span>Delete account</span>
                            <Icon>delete</Icon>
                        </button>

                    </div>
                </div>
                <div className={styles.divider}></div>


                <div className={styles.orders}>
                    <h1>Your orders</h1>
                    {orders}
                </div>
            </div>
        </>
    );
}
