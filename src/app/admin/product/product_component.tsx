import type { GetProducts } from "@/service/product";
import { PromiseReturnType } from "@prisma/client/extension";
import Image from "next/image";
import Link from "next/link";
import styles from "./admin-product.module.css";

type ProductProps = {
    product: PromiseReturnType<typeof GetProducts>[0];
};

export const Product = ({ product }: ProductProps) => {
    return (
        <>
            <Link
                style={{
                    color: "black",
                    textDecoration: "none",
                }}
                href={`/admin/product/${product.product_id}`}
            >
                <div className={styles.productCard}>
                    <h3>{product.name}</h3>
                    <span>Product description: {product.description}</span>
                    <span>Price: {product.price} SEK</span>
                    <span>Tag: {product.tag}</span>
                    <span>
                        Is product visable:{" "}
                        {product.available ? "Public" : "Hidden"}
                    </span>
                    <span>Stock XS: {product.stock?.XS}</span>
                    <span>Stock S: {product.stock?.S}</span>
                    <span>Stock M: {product.stock?.M}</span>
                    <span>Stock L: {product.stock?.L}</span>
                    <span>Stock XL: {product.stock?.XL}</span>
                    <Image
                        src={product.images[0]?.url}
                        width={"260"}
                        height={"260"}
                        alt={""}
                    />
                </div>
            </Link>
        </>
    );
};
