import Footer from "@/components/footer/Footer";
import Top from "@/components/top/Top";
import { enforceCustomerSession } from "@/lib/server/session/session_pages";
import AccountPageClient from "./client";

export default async function AccountPage() {

    const customer = await enforceCustomerSession();
    
    return(
        <>
        <Top/>
        <AccountPageClient customer={customer} />
        <Footer/>
        </>
    )
}

