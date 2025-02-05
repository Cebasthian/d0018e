"use client"
import { http } from "@/lib/client/httpRequester";
import { FormEvent, useState } from "react";
import styles from "./admin-product-create.module.css";

export default function CreateProductForm() {
    const [success, setSuccess] = useState(false)
    const [disabledSubmit, setDisabledSubmit] = useState(false)

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
            setSuccess(false)
            setDisabledSubmit(true)
            e.preventDefault();
            
            const formData = new FormData(e.currentTarget);
    
            const name = formData.get("name")
            const description = formData.get("description")
            const tag = formData.get("tag")
            let price: number;
            
            // Makes sure that price is a number.
            const priceValue = formData.get("price")
            if(!priceValue) price = NaN;
            else price = parseInt(priceValue?.toString())
            if(isNaN(price)) {
                alert("Price field is invalid") // TODO: find some better way to do form validation
                return; // Early return so we don't send a bad price.
            }
    
            const res = await http.post("/api/admin/product", {
                name,
                description,
                price,
                tag
            })
    
            if(res.status === 200) {
                setSuccess(true)
                setDisabledSubmit(false)
            } else {
                setTimeout(() => {
                    setDisabledSubmit(false)
                }, 200)
            }
        }

    return(
        <>
        <form className={styles.form} onSubmit={onSubmit}>
            <FormInput name="name">Product Name</FormInput>
            <FormInput name="description">Product Description</FormInput>
            <FormInput name="price" number>Price</FormInput>
            <FormInput name="tag">Tag</FormInput>
            <b className={styles.success}>{success ? "Success" : ""}</b>
            <input disabled={disabledSubmit} type="submit" />
        </form>
        </>
    )
}

type FormInputProps = {
    children: React.ReactNode,
    name: string,
    number?: boolean,
}
const FormInput = ({
    children,
    name,
    number
}: FormInputProps) => {
    return(
        <>
        <label>
            <span>{children}:</span>
            <input type={number ? "number" : "text"} name={name} />
        </label>
        </>
    )
}