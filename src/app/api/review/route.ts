import { BadRequest, HttpError } from "@/lib/server/httpStatus";
import { prisma } from "@/lib/server/prisma";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { NextResponse } from "next/server";

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

/**
 * Gets all reviews from a product id
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) return BadRequest("Missing product_id");

    try {
        const reviews = await prisma.review.findMany({
            where: { product_id },
            include: {
                customer: {
                    select: {
                        name: true,
                    },
                },
                replies: {
                    include: {
                        customer: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    omit: {
                        customer_ssn: true,
                    },
                },
            },
            omit: {
                customer_ssn: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        function buildReplyTreeRecursive(
            replies: Reply[],
            parentId: string | null = null
        ): Reply[] {
            return replies
                .filter((reply) => reply.parent_id === parentId)
                .map((reply) => {
                    return {
                        ...reply,
                        child_replies: buildReplyTreeRecursive(
                            replies,
                            reply.parent_id
                        ),
                    } as Reply;
                }
            );
        }

        function buildReplyTree(replies: Reply[]) {
            const roots: Reply[] = []
            const replyMap = new Map<string, Reply>()

            replies.forEach((reply) => {
                reply.child_replies= [];
                replyMap.set(reply.reply_id, reply)
            })

            replies.forEach((reply) => {
                if(reply.parent_id !== null) {
                    const parent = replyMap.get(reply.parent_id)
                    if(parent) {
                        parent.child_replies.push(reply)
                    }
                } else {
                    roots.push(reply)
                }
            })

            return roots

        }

        const formattedReviews = reviews.map((review) => {
            return {
                ...review,
                replies: buildReplyTree(review.replies.map(e => ({...e, child_replies: []})))
                // replies: buildReplyTreeRecursive(review.replies.map(e => ({...e, child_replies: []})))
            }
        })

        // const formattedReviews = reviews.map((review) => ({
        //     product_id: review.product_id,
        //     rating: review.rating,
        //     comment: review.comment,
        //     customer_ssn: review.customer_ssn,
        //     customer_name: review.customer.name,
        //     createdAt: review.createdAt.toISOString(),
        // }));

        return NextResponse.json(formattedReviews, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return BadRequest("Failed to fetch reviews");
    }
}

/**
 * Creates a new review
 */
export const POST = withCustomerSession(async (req, customer) => {
    const { product_id, rating, comment } = await req.json();

    // overkill, men användes när jag höll på och testa och tror inte den skadar, så den får stanna.
    if (
        !product_id ||
        typeof product_id !== "string" ||
        product_id.length < 1
    ) {
        return BadRequest("Invalid product ID");
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return BadRequest("Invalid rating value");
    }

    if (typeof comment !== "string" || comment.trim().length < 1) {
        return BadRequest("Invalid comment");
    }

    if (
        !(
            customer.orders.find((e) => {
                return (
                    e.processed &&
                    e.order_items.find((e) => e.product_id === product_id) !==
                        undefined
                );
            }) !== undefined
        )
    ) {
        return HttpError(
            400,
            "You haven't bought this item.",
            "HAVENT_BOUGHT_ITEM_ERROR"
        )();
    }

    const existingReview = await prisma.review.findFirst({
        where: {
            product_id: product_id.trim(),
            customer_ssn: customer.ssn,
        },
    });

    if (existingReview) {
        return HttpError(
            400,
            "You have already reviewed this product.",
            "DUPLICATE_REVIEW_ERROR"
        )();
    }

    const review = await prisma.review.create({
        data: {
            product_id: product_id.trim(),
            rating: rating,
            comment: comment.trim(),
            customer_ssn: customer.ssn,
        },
    });

    return NextResponse.json(review, { status: 201 });
});
