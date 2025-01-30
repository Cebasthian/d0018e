"use client"

import { http } from "@/lib/client/httpRequester";
import { FormEvent, useState } from "react";
import styles from "./account-create.module.css";

export default function CreateAccountForm() {

    const [success, setSuccess] = useState(false)
    const [disabledSubmit, setDisabledSubmit] = useState(false)

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setSuccess(false)
        setDisabledSubmit(true)
        e.preventDefault();

        console.log(e)
        
        const formData = new FormData(e.currentTarget);

        const email = formData.get("email")
        const password = formData.get("password")
        const ssn = formData.get("ssn")
        const name = formData.get("name")
        const address = formData.get("address")
        const phone_nr = formData.get("phone_nr")
        
        // const {
        //     email,
        //     password,
        //     ssn,
        //     name,
        //     address,
        //     phone_nr
        // } = e.target

        const res = await http.post("/api/account", {
            email,
            password,
            ssn,
            name,
            address,
            phone_nr
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
        <form onSubmit={onSubmit} className={styles.form}>
            <FormInput name="email">E-Mail</FormInput>
            <FormInput name="password" password>Password</FormInput>
            <FormInput name="ssn">Social Security Number</FormInput>
            <FormInput name="name">Full Name</FormInput>
            <FormInput name="address">Address</FormInput>
            <FormInput name="phone_nr">Phone Number</FormInput>
            <b className={styles.success}>{success ? "Success" : ""}</b>
            <input disabled={disabledSubmit} type="submit" />
        </form>
        </>
    )
}

type FormInputProps = {
    children: React.ReactNode,
    name: string,
    password?: boolean,
}

const FormInput = ({
    children,
    name,
    password
}: FormInputProps) => {
    return(
        <>
        <label>
            <span>{children}</span>
            <input type={password ? "password" : "text"} name={name} />
        </label>
        </>
    )
}