import { GetProductById } from "@/service/product";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get a product by id
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
    const id = (await params).id
    return NextResponse.json(await GetProductById(id))
}