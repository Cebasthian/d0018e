"use client";
import Icon from "@/components/icon/Icon";
import { http } from "@/lib/client/httpRequester";
import { useCustomer } from "@/lib/client/useCustomer";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./checkout.module.css";

export default function CheckoutCart({
    customer: c,
}: {
    customer: CustomerFromSessionType;
}) {
    const { customer, refresh } = useCustomer(c);

    const [disabled, setDisabled] = useState(false)

    const totalPrice = useMemo(() => {
        let tot = 0;

        customer.basket_items.forEach((item) => {
            tot += item.product.price;
        });

        return tot;
    }, [customer.basket_items]);

    const items = useMemo(() => {
        return customer.basket_items.map((e) => {

            async function remove() {
                setDisabled(true)
                await http.delete("/api/basket/remove", {id: e.id})
                await refresh()
                setDisabled(false)
            }

            return (
                <div key={e.id} className={styles["cart-basket-item"]}>
                    <Image
                        src={e.product.images[0].url}
                        width={500}
                        height={500}
                        alt="Product Image"
                        className={styles["cart-basket-image"]}
                    />
                    <div className={styles["cart-basket-text"]}>
                        <span>{e.product.name}</span>
                        <span>{e.size}</span>
                    </div>
                    <div className={styles["cart-basket-price"]}>
                        <b>{e.product.price} SEK</b>
                        <button disabled={disabled} onClick={remove} className={styles['cart-basket-remove']} title="Remove from basket">
                            <Icon>delete</Icon>
                        </button>
                    </div>
                </div>
            );
        });
    }, [customer.basket_items, disabled, setDisabled, refresh]);

    return (
        <>
            <div className={styles.cart}>
                <div className={styles["cart-basket"]}>{items}</div>
                <div className={styles["cart-total"]}>
                    <span>Total</span>
                    <b>{totalPrice} SEK</b>
                </div>
            </div>
        </>
    );
}