import { BadRequest, InternalError, SuccessResponse } from "@/lib/server/httpStatus";
import { CreateProduct, UpdateProduct } from "@/service/product";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



/**
 * Create a new product
 */
export async function POST(req: NextRequest) {
    const body: Prisma.ProductCreateInput = await req.json();

    const {
        name,
        price,
        description,
        tag,
        available
    } = body

    if(!name || !price) {
        return BadRequest("Invalid field name or price")
    }

    const product = await CreateProduct({
        name,
        price,
        description,
        tag,
        available
    })
    return NextResponse.json(product)
}

/**
 * Update product information
 */
export async function PUT(req: NextRequest) {
    const body: Prisma.ProductUpdateInput & {product_id: string} = await req.json();
    
    const {
        product_id,
        name,
        price,
        description,
        tag,
        available
    } = body

    if(!product_id) {
        return BadRequest("Invalid field product_id")
    }

    try {
        await UpdateProduct(product_id, {
            name,
            price,
            description,
            tag,
            available
        })
    } catch(error: unknown) {
        return InternalError(error)
    }
    return SuccessResponse();
}

