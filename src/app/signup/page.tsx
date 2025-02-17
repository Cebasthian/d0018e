import CreateAccountForm from "./form"
import styles from "./signup.module.css"

export default function CreateAccountPage() {
    
    return(
        <>
        <div className={styles.container}>
            <CreateAccountForm />
        </div>
        </>
    )
}