import { prisma } from "@/lib/server/prisma";
import type { DeepPartial } from "@/types";
import type { Customer, Prisma } from "@prisma/client";
import { PromiseReturnType } from "@prisma/client/extension";

export const PRODUCT_INCLUDES: Prisma.ProductInclude = {
    stock: true,
    images: {
        orderBy: {
            list_index: "asc"
        }
    },
    reviews: {
        include: {
            customer: {
                select: {
                    name: true,
                }
            }
        }
    }
}

type GetProductsOptions = {
    amount?: number,
    offset?: number,
    tag?: string,
    orderBy?: {
        [field in keyof DeepPartial<Customer>]: "asc" | "desc"
    },
    publicOnly?: boolean
}

export async function GetProducts(options: GetProductsOptions = {}) {
    return prisma.product.findMany({
        where: {
            tag: options.tag,
            available: options.publicOnly ? true : undefined
        },
        include: PRODUCT_INCLUDES,
        take: options.amount,
        skip: options.offset,
        orderBy: options.orderBy || {
            price: "asc"
        }
    })
}

export type FullProduct = Exclude<PromiseReturnType<typeof GetProductById>, null>

export async function GetProductById(product_id: string) {
    return prisma.product.findUnique({
        where: {
            product_id
        },
        include: PRODUCT_INCLUDES,
    })
}

export async function CreateProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
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
    return prisma.image.create({
        data: {
            url: image_url,
            product_id: product_id,
            list_index: index,
        }
    })
}

export async function UpdateProduct(product_id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
        where: {
            product_id
        },
        data: data,
    })
}

export async function DeleteProductById(product_id: string) {
    return prisma.product.delete({
        where: {
            product_id
        }
    })
}