import { GetProducts } from "@/service/product";
import Link from "next/link";
import styles from "./admin-product.module.css";
import { Product } from "./product_component";

export default async function AdminProductPage() {

    const products = await GetProducts();

    return(
        <>
        <Link href="/admin/product/create">Create</Link>
        <div className={styles.container}>
            {products.map(p => (<Product key={p.product_id} product={p}/>))}
        </div>
        </>
    )
}

