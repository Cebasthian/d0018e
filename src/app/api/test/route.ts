import { InternalError } from "@/lib/server/httpStatus";
import { CreateProduct } from "@/service/product";
import { Prisma } from "@prisma/client";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {

    const p = path.join(process.cwd(), "products.csv")
    if(!(await fs.stat(p)).isFile()) return InternalError("File not found")

    const buffer = await fs.readFile(path.join(process.cwd(), "products.csv"))
    const csv = buffer.toString();

    const rows = csv.split("\n")
    // const metadata = rows.splice(0, 1)[0].split(";").map(e => e.trim());
    rows.splice(0,1)
    const products: Prisma.ProductCreateInput[] = rows.filter(e => (e.trim() !== "" && e[0] !== "#")).map(r => {
        const [name, description, tag, price, available, image] = r.split(";")
        return {
            name: name.trim(),
            description: description.trim(),
            tag: tag.trim(),
            price: parseFloat(price.trim()),
            available: available.trim() === "true",
            images: {
                create: {
                    url: image.trim()
                }
            }
        }
    })

    for(let i = 0; i < products.length; i++) {
        await CreateProduct(products[i])
    }

    return NextResponse.json({success: true})
}

