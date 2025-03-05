import { enforceAdminSession } from "@/lib/server/session/session_pages";
import Link from "next/link";
import styles from "./admin-product-create.module.css";
import CreateProductForm from "./CreateProductForm";


export default async function AdminProductCreatePage() {

    await enforceAdminSession();

    return(
        <>
            <Link href="/admin/product">Back to all products</Link>
            <div className={styles.container}>
                <h1>Create new product</h1>
                <CreateProductForm />
            </div>
        </>
    );
}
