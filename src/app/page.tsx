import Footer from "@/components/footer/Footer";
import Top from "@/components/top/Top";
import { GetProducts } from "@/service/product";

export default async function Home() {
    const products = await GetProducts({publicOnly: true});

    return (
        <>
        <Top/>
        <main>
        
        </main>
        <Footer/>
        </>
    );
}
