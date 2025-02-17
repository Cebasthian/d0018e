import { tryCustomerSession } from "@/lib/server/session/session_pages";
import Link from "next/link";
import Icon from "../icon/Icon";
import styles from "./top.module.css";

export default async function Top() {

    const customer = await tryCustomerSession();

    const getCartAmount = () => {
        if(customer === null) return "";
        const count = customer.basket_items.length;
        if(count === 0) return "";

        let text: string = count + "";
        if(count > 9) text = "9+"


        return(
            <span className={styles['cart-amount']}>
                {text}
            </span>
        )

    }

    return(
        <>
        <div className={styles.top}>
            <div className={styles.left}>
                <Link href="/">T_SHIRT_COMPANY_INC</Link>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.right}>
                {customer !== null ? <NavButton icon="person" href="/account">My Account</NavButton> : <NavButton icon="login" href="/login">Login</NavButton>}
                <NavButton icon="shopping_cart" href="/checkout" style={{position: "relative"}}>
                <>
                <span>Checkout</span>
                {getCartAmount()}
                </>
                </NavButton>
            </div>
        </div>
        </>
    )
}

type NavButtonProps = {
    icon: string,
    children: React.ReactNode,
    href: string,
    style?: React.CSSProperties
}

function NavButton({
    icon,
    href,
    children,
    style
}: NavButtonProps) {
    return(
        <>
        <Link href={href} className={styles['nav-button']} style={style}>
            <span>{children}</span>
            <Icon>{icon}</Icon>
        </Link>
        </>
    )
}