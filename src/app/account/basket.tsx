"use client"

import { http } from "@/lib/client/httpRequester";
import { useCustomer } from "@/lib/client/useCustomer";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import { BasketItem } from "@prisma/client";
import styles from "./account.module.css";

type BasketProps = {
    customer: CustomerFromSessionType
}

export default function Basket({customer: c}: BasketProps) {
    const { customer, refresh } = useCustomer(c)

    const del = async (id: number) => {
        const res = await http.delete("/api/basket/remove", {
            id: id,
            customer_ssn: customer.ssn
        })
        if(res.status === 200) {
            refresh();
        }
    }
    
    return(
        <>
        <div className={styles.container}>
            {customer.basket_items.map(e => <BasketItemComponent key={e.id} item={e} del={del} />)}
        </div>
        </>
    )
}

type BasketItemProps = {
    item: BasketItem,
    del: (id: number) => void
}

function BasketItemComponent({
    item,
    del
}: BasketItemProps) {

    return(
        <div className={styles['basket-item']}>
            <pre>{JSON.stringify(item, null, 4)}</pre>
            <button className={styles['delete-button']} onClick={e => del(item.id)}>Remove from basket</button>
        </div>
    )
}