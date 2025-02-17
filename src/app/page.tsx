import Footer from "@/components/footer/Footer";
import Top from "@/components/top/Top";
import { tryCustomerSession } from "@/lib/server/session/session_pages";
import { GetProducts } from "@/service/product";
import Link from "next/link";

export default async function Home() {

    const customer = await tryCustomerSession();
    const products = await GetProducts({publicOnly: true});

    return (
        <>
        <Top/>
        <main>

        </main>
        <Footer/>


        <Link href="/account/create">Create Account</Link> <br/>
        <Link href="/login">Login</Link> <br/>
        <Link href="/account">My account</Link>
        </>
    );
}
