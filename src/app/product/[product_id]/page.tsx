import Footer from "@/components/footer/Footer";
import Top from "@/components/top/Top";
import { GetProductById } from "@/service/product";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./product.module.css";
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
                    src={product.images[0].url}
                    width={500}
                    height={500}
                    alt="temp"
                />

<SizeSelector productId={product.product_id} productName={product.name} />

                <div className={styles.description_container}>
                    <p>Description: {product.description}</p>
                </div>
                
            </div>
            <div className={styles.review}>
                <h2>Reviews</h2>
                <form className={styles.reviewForm}>
                    <div className={styles.rating}>
                        <span>Rating:</span>
                        <label htmlFor="star1">
                            <input type="radio" id="star1" name="rating" /> 1
                        </label>
                        <label htmlFor="star2">
                            <input type="radio" id="star2" name="rating" /> 2
                        </label>
                        <label htmlFor="star3">
                            <input type="radio" id="star3" name="rating" /> 3
                        </label>
                        <label htmlFor="star4">
                            <input type="radio" id="star4" name="rating" /> 4
                        </label>
                        <label htmlFor="star5">
                            <input type="radio" id="star5" name="rating" /> 5
                        </label>
                    </div>
                    <div className={styles.comment}>
                        <label htmlFor="reviewComment">Comment:</label>
                        <textarea
                            id="reviewComment"
                            name="comment"
                            rows={3}
                            placeholder="Write your review here."
                        ></textarea>
                    </div>
                    <button type="submit">Submit review</button>
                </form>

                <div className={styles.review_list}>
                    <h3>Others reviews</h3>
                    {/*{reviews.map((rev, index) => (
                        <div key={index} className={styles.reviewItem}>
                            <div className={styles.reviewRating}>Rating: {rev.rating} / 5 </div>
                            <p className={styles.reviewComment}>{rev.comment}</p>
                        </div>
                    ))}*/}
                </div>
            </div>
            <Footer />
        </>
    );
}
