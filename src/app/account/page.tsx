import { enforceCustomerSession } from "@/lib/server/session/session_pages";
import styles from "./account.module.css";
import Basket from "./basket";
import EditAccount from "./EditAccount";

// TODO: Istället för att använda oss av searchParams så använder vi sessionManagement för att veta vem som är användaren
// Vi redirectar till typ /login eller /account/create om de inte är inloggade.

export default async function AccountPage() {

    const customer = await enforceCustomerSession();

    // const ssn = (await searchParams)["ssn"]
    // if(!ssn || typeof ssn !== "string") return (
    //     <>
    //     <p>invalid query parameter {'"ssn"'}</p>
    //     </>
    // )
    
    // const customer = await prisma.customer.findUnique({
    //     where: {
    //         ssn: ssn
    //     },
    //     include: {
    //         shopping_basket: true
    //     }
    // })

    // if(!customer) return (
    //     <>
    //     <p>unable to find customer</p>
    //     </>
    // )

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
            <div>
                <h2>Basket</h2>
                <Basket customer={customer} />
                {/* <pre>{JSON.stringify(customer.basket_items, null, 4)}</pre> */}
            </div>
        </div>
        {/* <pre>{JSON.stringify(customer, null, 4)}</pre> */}
        </>
    )
}

