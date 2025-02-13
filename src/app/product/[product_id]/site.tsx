"use client"
import { http } from "@/lib/client/httpRequester";
import { useCustomer } from "@/lib/client/useCustomer";
import { type FullProduct } from "@/service/product";

export default function SpecificProductPage({product}: {product: FullProduct}) {

    const {customer, refresh} = useCustomer();

    const addToCart = async () => {
        if(!customer) return;

        const res = await http.post("/api/basket/add", {
            product_id: product.product_id,
            size: "XL"
        })

        if(res.status === 200) {
            refresh()
            console.log(await res.json())    
        }

    }

    return(
        <>
        <pre>{JSON.stringify(product, null, 4)}</pre>
        {customer !== undefined ? (
            <button onClick={addToCart}>Add to basket (XL)</button>
        ) : "Not logged in"}
        <pre>{JSON.stringify(customer, null, 4)}</pre>
        </>
    )
}