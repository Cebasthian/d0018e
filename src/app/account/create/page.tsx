import styles from "./account-create.module.css"
import CreateAccountForm from "./form"

export default function CreateAccountPage() {
    
    return(
        <>
        <div className={styles.container}>
            <h1>Create new account</h1>
            <CreateAccountForm />
        </div>
        </>
    )
}