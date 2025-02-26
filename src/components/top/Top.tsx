import { tryCustomerSession } from "@/lib/server/session/session_pages";
import TopClient from "./TopClient";

export default async function Top() {

    const customer = await tryCustomerSession();

    return(
        <>
        <TopClient customer={customer} />
        </>
    )
}
