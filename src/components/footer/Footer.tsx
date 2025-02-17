import styles from "./footer.module.css";

export default async function Footer() {
    return(
        <>
        <div className={styles.footer}>
            <span>Copyright &copy; {new Date().getFullYear()}</span>
            
            <span>{["Samuel Melander", "Sebastian Moestam"].sort(() => {
                const coin = Math.floor(Math.random()*2)
                if(coin === 0) return -1;
                return 1;
            }).join(" & ")}</span>

            <span>|</span>
            <span>LTU</span>
        </div>
        </>
    )
}