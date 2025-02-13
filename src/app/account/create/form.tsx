"use client";

import { http } from "@/lib/client/httpRequester";
import { FormEvent, useState } from "react";
import styles from "./account-create.module.css";

export default function CreateAccountForm() {
    const [success, setSuccess] = useState(false);
    const [disabledSubmit, setDisabledSubmit] = useState(false);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess(false);
        setDisabledSubmit(true);
        setShowErrorMessage(false);

        const formData = new FormData(e.currentTarget);
        
        const fields = ["email", "password", "ssn", "name", "address", "phone_nr"];
        
        const newErrors: Record<string, boolean> = {};
        let hasError = false;

        fields.forEach(field => {
            if(!formData.get(field)) {
                newErrors[field] = true;
                hasError = true;
            }
        });

        setErrors(newErrors);

        if(hasError) {
            setShowErrorMessage(true);
            setDisabledSubmit(false);
        }
        
        

        const email = formData.get("email");
        const password = formData.get("password");
        const ssn = formData.get("ssn");
        const name = formData.get("name");
        const address = formData.get("address");
        const phone_nr = formData.get("phone_nr");

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
            phone_nr,
        });

        if (res.status === 200) {
            setSuccess(true);
            setDisabledSubmit(false);
            setErrors({});
        } else {
            setTimeout(() => {
                setDisabledSubmit(false);
            }, 200);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Create Account</h2>
                <form onSubmit={onSubmit} className={styles.form}>
                    <FormInput name="email" error={errors.email}>E-Mail</FormInput>
                    <FormInput name="password" password error={errors.password}>
                        Password
                    </FormInput>
                    <FormInput name="ssn" error={errors.ssn}>Social Security Number</FormInput>
                    <FormInput name="name" error={errors.name}>Full Name</FormInput>
                    <FormInput name="address" error={errors.address}>Address</FormInput>
                    <FormInput name="phone_nr" error={errors.phone_nr}>Phone Number</FormInput>
                    {showErrorMessage && <b className={styles.error}>All fields must be filled.</b>}
                    <b className={styles.success}>{success ? "Success" : ""}</b>
                    <input
                        disabled={disabledSubmit}
                        type="submit"
                        className={styles.submitButton}
                    />
                </form>
            </div>
        </div>
    );
}

type FormInputProps = {
    children: React.ReactNode;
    name: string;
    password?: boolean;
    error?: boolean;
};

const FormInput = ({ children, name, password, error }: FormInputProps) => {
    const [touched, setTouched] = useState(false); // if touched input field.
    
    return (
        <>
            <label>
                <span>{children}</span>
                <input
                    type={password ? "password" : "text"}
                    name={name}
                    className={`${styles.input} ${error && touched ? styles.errorBorder : ""}`}
                    onBlur={(e) => setTouched(!e.target.value)}
                    onChange={(e) => setTouched(false)}
                />
            </label>
        </>
    );
};
