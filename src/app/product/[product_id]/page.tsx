import Footer from "@/components/footer/Footer";
import Top from "@/components/top/Top";
import { GetProductById } from "@/service/product";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./product.module.css";
import ReviewSection from "./reviewSection";
import SizeSelector from "./SizeSelector";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ product_id: string }>;
}) {
    const { product_id } = await params;
    const product = await GetProductById(product_id);
    if (product == null) return notFound();

    return (
        <>
            <Top />
            <div className={styles.product_container}>
                <h1>{product.name}</h1>
                <h2>Product id: {product.product_id}</h2>
                <Image
                    className={styles.product_image}
                    src={product.images[0]?.url}
                    width={500}
                    height={500}
                    alt="image of product"
                />

                <SizeSelector
                    productId={product.product_id}
                    productName={product.name}
                    productPrice={product.price}
                />

                <div className={styles.description_container}>
                    <p>Description: {product.description}</p>
                </div>
            </div>

            <ReviewSection product_id={product_id} />

            {/*<pre>{JSON.stringify(product, null, 4)}</pre>*/}

            <Footer />
        </>
    );
}
