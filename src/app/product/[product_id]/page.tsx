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

    const sizes = (() => {
        const stock = product.stock;
        if(!stock) return ""

        // const keys: (keyof typeof stock)[] = Object.keys(stock)
        // for(let i = 0; i < keys.length; i++) {
        //     const val: string | number = stock[keys[i]]
        // }
        const arr: React.ReactNode[] = []

        for(const key in stock) {
            const val = stock[key as keyof typeof stock]
            if(typeof val === "string") continue;
            arr.push((
                <div key={key} className={styles.size}>
                    <span>{key}:</span>
                    <b>{val}</b>
                    <span>left</span>
                </div>
            ))
        }


        return arr;
    })()

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

                <div className={styles.description_container}>
                    <p>Description: {product.description}</p>
                    <div className={styles.sizes}>
                        <h4>Inventory: </h4>
                        {sizes}
                    </div>
                </div>

                <SizeSelector
                    product={product}
                />
            </div>

            <ReviewSection product_id={product_id} />

            {/*<pre>{JSON.stringify(product, null, 4)}</pre>*/}

            <Footer />
        </>
    );
}
