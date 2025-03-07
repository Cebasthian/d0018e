"use client";

import Icon from "@/components/icon/Icon";
import { http } from "@/lib/client/httpRequester";
import { useCallback, useEffect, useState } from "react";
import ReviewForm from "./reviewForm";
import styles from "./ReviewForm.module.css";

export interface Review {
    product_id: string;
    rating: number;
    comment: string;
    customer: {
        name: string;
    };
    createdAt: string;
    replies: Reply[];
    review_id: string;
}

type Reply = {
    comment: string;
    customer: {
        name: string;
    };
    parent_id: string | null;
    review_id: string;
    reply_id: string;
    child_replies: Reply[];
};

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
                    reviewList.map((review) => (<ReviewComponent review={review} key={review.review_id} />))
                ) : (
                    <p>No reviews yet. Be the first!</p>
                )}
            </div>
        </div>
    );
}


type ReviewProps = {
    review: Review
}

function ReviewComponent({
    review
}: ReviewProps) {

    const [reply, setReply] = useState("")

    const addReply = useCallback(async () =>{

        
        const res = await http.post("/api/review/reply", {
            comment: reply,
            review_id: review.review_id
        })

        if(res.ok) {
            alert("success")
        }

    }, [reply, review.review_id])


    return(
        <>
        <div
            className={styles.reviewItem}
        >
            <p>
                <strong>Rating:</strong> {review.rating}/5
            </p>
            <p>
                <strong>Comment:</strong> {review.comment}
            </p>
            <p>
                <strong>By:</strong> {review.customer.name}
            </p>
            <p>
                <strong>Date:</strong>{" "}
                {new Date(
                    review.createdAt
                ).toLocaleDateString()}
            </p>
            <div>

                <div>
                    {review.replies.map(e => <ReplyComponent reply={e} key={e.reply_id}/>)}
                </div>

            <label>
                <span>Reply</span>
                <input onChange={e => setReply(e.target.value)} value={reply}/>
            </label>

            <button onClick={addReply}>publish <Icon>reply</Icon></button>
            </div>
        </div>
        </>
    )
}

type ReplyProps = {
    reply: Reply
}

function ReplyComponent({
    reply
}: ReplyProps) {
    return(
        <div className={styles.reply}>
            <span>{reply.comment}</span>
            <div>
                {reply.child_replies.map(e => <ReplyComponent reply={e} key={e.reply_id}/>)}
            </div>
        </div>
    )
}