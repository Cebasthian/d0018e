import Footer from "@/components/footer/Footer";
import Top from "@/components/top/Top";
import { AlphanumericalSort } from "@/lib/util/sorter";
import { GetProducts } from "@/service/product";
import { PromiseReturnType } from "@prisma/client/extension";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
    const products = await GetProducts({ publicOnly: true });

    const tags: {
        [tag: string]: typeof products;
    } = {};

    products.forEach((p) => {
        if (tags[p.tag]) tags[p.tag].push(p);
        else tags[p.tag] = [p];
    });

    const getTags = () => {
        const arr: React.ReactNode[] = [];
        for (const tag of Object.keys(tags).sort(AlphanumericalSort)) {
            arr.push(
                <div key={tag}>
                    <h2>{tag.toLocaleUpperCase()}</h2>
                    <div className={styles.tag}>
                        {tags[tag].map((e) => (
                            <Product key={e.product_id} product={e} />
                        ))}
                    </div>
                </div>
            );
        }
        return arr;
    };

    return (
        <>
            <Top />
            <main className={styles.main}>
                {getTags()}

                {/* {products.map(e => <Product key={e.product_id} product={e} />)} */}
            </main>
            <Footer />
        </>
    );
}

type ProductProps = {
    product: PromiseReturnType<typeof GetProducts>[0];
};

function Product({ product }: ProductProps) {
    return (
        <>
            <Link
                style={{
                    color: "black",
                    textDecoration: "none",
                }}
                href={`/product/${product.product_id}`}
            >
                <div className={styles.product}>
                    {product.images.length > 0 ? (
                        <div className={styles['image-container']}>
                            <Image
                                src={product.images[0].url}
                                width={500}
                                height={500}
                                alt="Product Image"
                                className={styles['product-image']}
                                />
                        </div>
                    ) : (
                        ""
                    )}

                    <div className={styles['product-info']}>
                        <p>{product.name}</p>
                        <h3>{product.price} SEK</h3>
                    </div>
                </div>
            </Link>
        </>
    );
}
