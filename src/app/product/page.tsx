import { GetProducts } from "@/service/product";
import { PromiseReturnType } from "@prisma/client/extension";
import Link from "next/link";
import styles from "./products.module.css";

export default async function ProductsPage() {

    const products = await GetProducts();

    return(
        <>
        <div className={styles.container}>
            {products.map(e => <Product key={e.product_id} product={e} />)}
        </div>
        </>
    )
}

type ProductProps = {
    product: PromiseReturnType<typeof GetProducts>[0]
}

export function Product({
    product
}: ProductProps) {
    return(
        <>
        <Link style={{
            color: "black",
            textDecoration: "none"
        }} href={`/product/${product.product_id}`}>
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