import Link from "next/link";
import styles from "./admin-product-create.module.css";
import CreateProductForm from "./CreateProductForm";

export default function AdminProductCreatePage() {
    return (
        <>
            <Link href="/admin/product">Back to all products</Link>
            <div className={styles.container}>
                <h1>Create new product</h1>
                <CreateProductForm />
            </div>
        </>
    );
}
