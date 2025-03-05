"use client";
import Icon from "@/components/icon/Icon";
import { http } from "@/lib/client/httpRequester";
import { useCustomer } from "@/lib/client/useCustomer";
import { CustomerFromSessionType } from "@/lib/server/session/session_routes";
import Image from "next/image";
import Link from "next/link";
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
        if(customer.basket_items.length === 0) {
            return(
                <div className={styles['empty-basket']}>
                    <p>
                        Your basket is empty. Add some products before placing an order. 
                        Visit the <Link href="/">Home Page</Link> for all our products.
                    </p>
                    
                </div>
            )
        }

        const basket = customer.basket_items.map((e) => {

            async function remove() {
                setDisabled(true)
                await http.delete("/api/basket/remove", {id: e.id})
                await refresh()
                setDisabled(false)
            }

            const outOfStock = (() => {
                return (e.product.stock?.[e.size as keyof typeof e.product.stock] || 0) <= 0
            })()

            return (
                <div key={e.id} className={[styles["cart-basket-item"], outOfStock ? styles['cart-item-no-stock'] : ""].join(" ")}>
                    <Image
                        src={e.product.images[0].url}
                        width={500}
                        height={500}
                        alt="Product Image"
                        className={styles["cart-basket-image"]}
                    />
                    <div className={styles["cart-basket-text"]}>
                        <span>{e.product.name}</span>
                        <span>Size: {e.size} {outOfStock ? <b>Out of stock</b> : ""}</span>
                        <Link href={`/product/${e.product_id}`}>Link</Link>
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

        return(
            <>
            <div className={styles["cart-basket"]}>{basket}</div>
            <div className={styles["cart-total"]}>
                <span>Total</span>
                <b>{totalPrice} SEK</b>
            </div>
            </>
        )
    }, [customer.basket_items, disabled, setDisabled, refresh, totalPrice]);

    return (
        <>
            <div className={styles.cart}>
            <h2>Shopping Basket</h2>
                {items}
            </div>
        </>
    );
}