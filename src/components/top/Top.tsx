import Icon from "../icon/Icon"
import styles from "./top.module.css"

export default async function Top() {
    return(
        <>
        <div className={styles.top}>
            <div className={styles.left}>
                LOGO
            </div>
            <div className={styles.divider}></div>
            <div className={styles.right}>
                <Icon>login</Icon>
                <Icon>shopping_cart</Icon>
            </div>
        </div>
        </>
    )
}