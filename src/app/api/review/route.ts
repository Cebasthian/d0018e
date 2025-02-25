import { prisma } from '@/lib/server/prisma';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    try {
        const {productId, rating, comment, customer_ssn} = await request.json();

        if (!productId || !rating || !comment || !customer_ssn) {
            return NextResponse.json({error: "missing required fields"}, {status: 400});
        }

        const review = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                customer_ssn,
                product: {connect: {id: Number(productId)}},
            },
        });

        return NextResponse.json(review, {status: 201});
    } catch(error) {
        return NextResponse.json({error: "failed to create review"}, {status: 500});
    }
}
