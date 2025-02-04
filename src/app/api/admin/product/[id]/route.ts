import { InternalError, SuccessResponse } from "@/lib/server/httpStatus";
import { DeleteProductById } from "@/service/product";
import { NextRequest } from "next/server";




/**
 * Delete product
 */
export async function DELETE(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const id = (await params).id
    try {
        await DeleteProductById(id);
    } catch (error: unknown) {
        return InternalError(error);
    }

    return SuccessResponse();
}