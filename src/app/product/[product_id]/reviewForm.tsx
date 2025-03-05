"use client";

import { useCustomer } from "@/lib/client/useCustomer";
import React, { useEffect, useState } from "react";
import styles from "./ReviewForm.module.css";

interface ReviewFormProps {
    product_id: string;
    onReviewSubmitted?: () => void;
}

export default function ReviewForm({
    product_id,
    onReviewSubmitted,
}: ReviewFormProps) {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [hasReviewed, setHasReviewed] = useState(false);
    const [isCheckingReview, setIsCheckingReview] = useState(true);

    const { customer } = useCustomer();

    useEffect(() => {
        if (!product_id) {
            setIsCheckingReview(false);
            return;
        }

        const checkReviewStatus = async () => {
            try {
                setIsCheckingReview(true);

                const res = await fetch(`/api/review?product_id=${product_id}`);
                if (!res.ok) throw new Error("Review check failed");

                const { hasReview } = await res.json();
                setHasReviewed(hasReview);
            } catch (error) {
                console.error("Review check error:", error);
                setError("Failed to check review status");
            } finally {
                setIsCheckingReview(false);
            }
        };

        // Trigger the review check
        checkReviewStatus();
    }, [product_id]); // Only re-run if product_id changes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!rating || !comment.trim()) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_id,
                    rating,
                    comment: comment.trim(),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Review submitted successfully!");
                setRating(null);
                setComment("");
                setHasReviewed(true);
                onReviewSubmitted?.();
            } else {
                setError(data.error || "Submission failed");
            }
        } catch {
            setError("Network error. Please try again.");
        }
    };

    if (isCheckingReview) {
        return (
            <div className={styles.reviewForm}>Checking review status...</div>
        );
    }

    if (!customer) {
        return (
            <div className={styles.reviewForm}>
                <p className={styles.error}>
                    Please <a href="/login">log in</a> to submit a review
                </p>
            </div>
        );
    }

    if (hasReviewed) {
        return (
            <div className={styles.reviewForm}>
                <p className={styles.info}>Your review has been submited!</p>
            </div>
        );
    }

    return (
        <form className={styles.reviewForm} onSubmit={handleSubmit}>
            <h3>Submit a Review</h3>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <div className={styles.rating}>
                <span>Rating:</span>
                {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num}>
                        <input
                            type="radio"
                            name="rating"
                            value={num}
                            checked={rating === num}
                            onChange={() => setRating(num)}
                        />
                        {num}
                    </label>
                ))}
            </div>

            <div className={styles.comment}>
                <label htmlFor="reviewComment">Comment:</label>
                <textarea
                    id="reviewComment"
                    name="comment"
                    rows={3}
                    placeholder="Write your review here."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
            </div>

            <button type="submit">Submit review</button>
        </form>
    );
}
