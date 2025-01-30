import { prisma } from "@/lib/server/prisma"
import type { SearchParams } from "next/dist/server/request/search-params"
import styles from "./account.module.css"
import EditAccount from "./EditAccount"

type AccountPageProps = {
    searchParams: Promise<SearchParams>
}

// TODO: Istället för att använda oss av searchParams så använder vi sessionManagement för att veta vem som är användaren
// Vi redirectar till typ /login eller /account/create om de inte är inloggade.

export default async function AccountPage({
    searchParams
}: AccountPageProps) {

    const ssn = (await searchParams)["ssn"]
    if(!ssn || typeof ssn !== "string") return (
        <>
        <p>invalid query parameter {'"ssn"'}</p>
        </>
    )
    
    const customer = await prisma.customer.findUnique({
        where: {
            ssn: ssn
        },
        include: {
            shopping_basket: true
        }
    })

    if(!customer) return (
        <>
        <p>unable to find customer</p>
        </>
    )

    return(
        <>
        <div className={styles.container}>
            <h1>Welcome {customer.name}</h1>
            <div>
                <p>Your bonus: {customer.bonus_points} p</p>
                <p>{customer.address}</p>
                <p>{customer.phone_nr}</p>
                <p>{customer.email}</p>
            </div>
            <br/>
            <div>
                <h2>Edit information</h2>
                <EditAccount customer={customer} />
            </div>
        </div>
        {/* <pre>{JSON.stringify(customer, null, 4)}</pre> */}
        </>
    )
}

