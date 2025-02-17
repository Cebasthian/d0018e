import { CreateProduct } from "@/service/product";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {

    // await prisma.product.createMany({
    //     data: products
    // })

    const products: Prisma.ProductCreateInput[] = [
        {
            name: "T-Shirt 1",
            description: "Shirt description",
            tag: "tag1",
            price: Math.floor(Math.random() * 900) + 100,
        },{
            name: "T-Shirt 2",
            description: "Shirt description",
            tag: "tag1",
            price: Math.floor(Math.random() * 900) + 100,
        },{
            name: "T-Shirt 3",
            description: "Shirt description",
            tag: "tag2",
            price: Math.floor(Math.random() * 900) + 100,
        },{
            name: "T-Shirt 4",
            description: "Shirt description",
            tag: "tag3",
            price: Math.floor(Math.random() * 900) + 100,
        },
    ]


    for(let i = 0; i < products.length; i++) {
        await CreateProduct(products[i])
    }

    return NextResponse.json({success: true})
}

