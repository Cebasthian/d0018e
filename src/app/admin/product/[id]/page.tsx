import { GetProductById } from "@/service/product";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product } from "../product_component";
import EditProduct from "./EditProduct";

import styles from "./admin-product-edit.module.css";


export default async function AdminProductEditPage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params
    const product = await GetProductById(id);
    if(product == null) return notFound();

    
    return(
        <>
        <div className={styles.container}>
            <h1>Edit product</h1>
            <Link href="/admin/product">Back</Link>
            <Product product={product} />
            <EditProduct product={product} />
        </div>
        </>
    )
}