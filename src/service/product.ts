import { prisma } from "@/lib/server/prisma";
import { DeepPartial } from "@/types";
import { Customer, Product } from "@prisma/client";

type GetProductsOptions = {
    amount?: number,
    offset?: number,
    tag?: string,
    orderBy?: {
        [field in keyof DeepPartial<Customer>]: "asc" | "desc"
    }
}

export async function GetProducts(options: GetProductsOptions = {}) {
    return await prisma.product.findMany({
        where: {
            tag: options.tag
        },
        include: {
            // stock: true,
            images: {
                orderBy: {
                    list_index: "asc"
                }
            },
            // reviews: true
        },
        take: options.amount,
        skip: options.offset,
        orderBy: options.orderBy
    })
}

export async function GetProductById(product_id: string) {
    return await prisma.product.findUnique({
        where: {
            product_id
        },
        include: {
            stock: true,
            images: true,
            reviews: {
                include: {
                    customer: true
                }
            }
        }
    })
}

export async function CreateProduct(data: Product) {
    return await prisma.product.create({
        data: {
            ...data,
            stock: {
                create: {}
            }
        },
        include: {
            stock: true,
        },
    })
}

export async function AddImageToProduct(product_id: string, image_url: string, index?: number) {
    return await prisma.image.create({
        data: {
            url: image_url,
            product_id: product_id,
            list_index: index,
        }
    })
}