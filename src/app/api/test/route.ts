import { CreateProduct } from "@/service/product";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {

    // await prisma.product.createMany({
    //     data: products
    // })
    for(let i = 0; i < products.length; i++) {
        await CreateProduct(products[i])
    }

    return NextResponse.json({success: true})
}

const products: Prisma.ProductCreateInput[] = [
    {
        name: "Ugh Minimal Wear",
        description: "yes",
        tag: "ugh",
        price: 100,
    },{
        name: "Vintage Extra",
        description: "idk",
        tag: "vintage",
        price: 200,
    },{
        name: "Vintage Deluxe",
        description: "lorem ipsum",
        tag: "vintage",
        price: 50,
    },{
        name: "Ugh FN",
        description: "gold gold gold",
        tag: "ugh",
        price: 500,
    },
]