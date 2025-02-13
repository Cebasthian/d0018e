import { GetProductById } from "@/service/product";
import { notFound } from "next/navigation";
import SpecificProductPage from "./site";

export default async function ProductPage({params}: {params: Promise<{product_id: string}>}) {
    const { product_id } = await params
    const product = await GetProductById(product_id);
    if(product == null) return notFound();

    
    return(
        <>
        <SpecificProductPage product={product} />
        </>
    )
}