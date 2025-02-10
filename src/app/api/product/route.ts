import { SearchParamsUtils } from "@/lib/server/routeHelper";
import { GetProducts } from "@/service/product";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get all products
 */
export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;

    const amount = SearchParamsUtils.parseInt(params.get("amount"))
    const offset = SearchParamsUtils.parseInt(params.get("offset"))
    const tag = params.get("tag") || undefined

    return NextResponse.json(await GetProducts({
        amount,
        offset,
        tag
    }))
}