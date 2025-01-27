import { prisma } from "@/lib/prisma"

export default async function Page() {
    
    const customer = await prisma.customer.findUnique({
        where: {
            ssn: "AABBCC"
        },
        include: {
            shopping_basket: true
        }
    })

    return(
        <>
        <pre>{JSON.stringify(customer, null, 4)}</pre>
        </>
    )
}