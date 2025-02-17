import styles from "./footer.module.css"

export default async function Footer() {
    return(
        <>
        <div className={styles.footer}>
            <span>Copyright &copy; {new Date().getFullYear()}</span>
            <span>Samuel Melander &amp; Sebastian Moestam</span>
            <span>|</span>
            <span>LTU</span>
        </div>
        </>
    )
}