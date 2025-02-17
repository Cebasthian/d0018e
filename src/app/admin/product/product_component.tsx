import type { GetProducts } from "@/service/product";
import { PromiseReturnType } from "@prisma/client/extension";
import Link from "next/link";
import styles from "./admin-product.module.css";

type ProductProps = {
    product: PromiseReturnType<typeof GetProducts>[0]
}

export const Product = ({
    product
}: ProductProps) => {
    return(
        <>
        <Link style={{
            color: "black",
            textDecoration: "none"
        }} href={`/admin/product/${product.product_id}`}>
        <div className={styles.product}>
            <h3>{product.name}</h3>
            <span>{product.description}</span>
            <span><b>{product.price}</b> SEK</span>
            <span>{product.tag}</span>
            <span>{product.available ? "Public" : "Hidden"}</span>
            <span>Stock XL: {product.stock?.XL}</span>
        </div>
        </Link>
        </>
    )
}