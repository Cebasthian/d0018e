"use client";

import { useCallback, useEffect, useState } from "react";
import ReviewForm from "./reviewForm";
import styles from "./ReviewForm.module.css";

export interface Review {
    product_id: string;
    rating: number;
    comment: string;
    customer_ssn: string;
    customer_name: string;
    createdAt: string;
}

interface ReviewSectionProps {
    product_id: string;
}

export default function ReviewSection({ product_id }: ReviewSectionProps) {
    const [reviewList, setReviewList] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReviews = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(
                `/api/review?product_id=${product_id}`
            );
            if (!response.ok) throw new Error("Failed to fetch reviews");

            const data = await response.json();
            setReviewList(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setError("Failed to load reviews. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [product_id]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return (
        <div className={styles.reviewSection}>
            <ReviewForm
                product_id={product_id}
                onReviewSubmitted={fetchReviews}
            />

            <div className={styles.reviewList}>
                <h2>Reviews</h2>
                {isLoading ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : reviewList.length > 0 ? (
                    reviewList.map((review) => (
                        <div
                            key={`${review.product_id}-${review.customer_ssn}-${review.createdAt}`}
                            className={styles.reviewItem}
                        >
                            <p>
                                <strong>Rating:</strong> {review.rating}/5
                            </p>
                            <p>
                                <strong>Comment:</strong> {review.comment}
                            </p>
                            <p>
                                <strong>By:</strong> {review.customer_name}
                            </p>
                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first!</p>
                )}
            </div>
        </div>
    );
}
