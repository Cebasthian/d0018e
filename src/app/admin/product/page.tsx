import { enforceAdminSession } from "@/lib/server/session/session_pages";
import { GetProducts } from "@/service/product";
import Link from "next/link";
import styles from "./admin-product.module.css";
import LogoutButton from "./logout";
import { Product } from "./product_component";

export default async function AdminProductPage() {
    await enforceAdminSession();

    const products = await GetProducts();

    return (
        <>
        <div className={styles.links}>
            <Link href="/admin/product/create">Create</Link>
            <Link href="orders/">Go to order management</Link>
            <LogoutButton/>
        </div>
        <div className={styles.container}>
            {products.map(p => (<Product key={p.product_id} product={p}/>))}
        </div>
        </>
    );
}
