import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function Page() {
    const admin = await prisma.admin.create({})
    
    return(
        <>
        <Link href={"/"}>Tillbaka</Link>
        <pre>
            {JSON.stringify(admin, null, 4)}
        </pre>
        </>
    )
}