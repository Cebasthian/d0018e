import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

/**
 * Mark order as processed
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    try {
        const updatedOrder = await prisma.order.update({
            where: { order_id: orderId },
            data: { processed: true },
        });

        return NextResponse.json(
            { message: "Order marked as processed", order: updatedOrder },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}
