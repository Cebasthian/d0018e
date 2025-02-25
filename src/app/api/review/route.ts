import { BadRequest } from "@/lib/server/httpStatus";
import { prisma } from "@/lib/server/prisma";
import { withCustomerSession } from "@/lib/server/session/session_routes";
import { NextResponse } from "next/server";

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
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const formattedReviews = reviews.map((review) => ({
            product_id: review.product_id,
            rating: review.rating,
            comment: review.comment,
            customer_ssn: review.customer_ssn,
            customer_name: review.customer.name,
            createdAt: review.createdAt.toISOString(),
        }));

        return NextResponse.json(formattedReviews, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return BadRequest("Failed to fetch reviews");
    }
}

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

    const existingReview = await prisma.review.findFirst({
        where: {
            product_id: product_id.trim(),
            customer_ssn: customer.ssn,
        },
    });

    if (existingReview) {
        return BadRequest("You've already reviewed this product");
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
