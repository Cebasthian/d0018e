import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

/**
 * Revert state of processed order.
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    try {
        const updatedOrder = await prisma.order.update({
            where: { order_id: orderId },
            data: { processed: false },
        });

        return NextResponse.json(
            { message: "Order reverted to processing", order: updatedOrder },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error reverting order status:", error);
        return NextResponse.json(
            { error: "Failed to revert order status" },
            { status: 500 }
        );
    }
}
