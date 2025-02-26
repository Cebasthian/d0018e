import Footer from "@/components/footer/Footer";
import Top from "@/components/top/Top";
import { enforceCustomerSession } from "@/lib/server/session/session_pages";
import styles from "./checkout.module.css";
import CheckoutCart from "./CheckoutCart";
import CheckoutDetails from "./CheckoutDetails";

export default async function CheckoutPage() {

    const customer = await enforceCustomerSession();

    return(
        <>
        <Top/>
        <main className={styles.container}>
            <CheckoutDetails customer={customer}/>
            <div style={{borderLeft: "1px solid black", width: "1px", alignSelf: "stretch"}}></div>
            <CheckoutCart customer={customer}/>
        </main>
        <Footer/>
        </>
    )

}