"use client"
import { http } from "@/lib/client/httpRequester";
import { FullProduct } from "@/service/product";
import { useRouter } from "next/navigation";
import { useImmer } from "use-immer";
import styles from "./admin-product-edit.module.css";

export default function EditProduct({product: p}: {product: FullProduct}) {
    const [product, setProduct] = useImmer({...p})
    const router = useRouter();

    return(
        <>
        <div className={styles.edit}>

            <TextInput value={product.name} onChange={s => setProduct(p => {p.name = s})} >Name</TextInput>
            <TextInput value={product.description} onChange={s => setProduct(p => {p.description = s})} >Description</TextInput>
            <TextInput value={product.tag} onChange={s => setProduct(p => {p.tag = s})} >Tag</TextInput>

            <label>
                <span>Price:</span>
                <input type="number" value={product.price} onChange={e => setProduct(p => {p.price = +e.target.value})} />
            </label>

            <label>
                <span>Stock, XL:</span>
                <input type="number" value={product.stock?.XL || 0} onChange={e => setProduct(p => {
                    if(p.stock)
                    p.stock.XL = +e.target.value
                })} />
            </label>

            <label>
                <span>Available to the public:</span>
                <input type="checkbox" checked={product.available} onChange={e => setProduct(p => {p.available = e.target.checked})} />
            </label>
            

            <button onClick={async () => {
                const res = await http.put("/api/admin/product", product)
                const data = await res.json();
                if(data.success) {
                    router.refresh();
                }
            }}>Save</button>

            <button onClick={async () => {
                if(confirm("Are you sure you want to delete the product")) { // TODO: Do better
                    const res = await http.delete(`/api/admin/product/${p.product_id}`)
                    const data = await res.json();
                    if(data.success) {
                        router.back();
                    }
                }
            }}>Delete Product</button>
        </div>
        
        </>
    )
}

type TextInputProps = {
    children: React.ReactNode,
    value: string,
    onChange: (x: string) => void,
}

function TextInput({
    children,
    value,
    onChange
}: TextInputProps) {
    return(
        <>
        <label>
            <span>{children}:</span>
            <input onChange={e => onChange(e.target.value)} value={value}/>
        </label>
        </>
    )
}