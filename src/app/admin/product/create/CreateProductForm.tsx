"use client";
import { http } from "@/lib/client/httpRequester";
import { FormEvent, useState } from "react";
import styles from "./admin-product-create.module.css";
import { CompressAndEncode } from "./compress_image";

export default function CreateProductForm() {
    const [success, setSuccess] = useState(false);
    const [disabledSubmit, setDisabledSubmit] = useState(false);
    const [image, setImage] = useState<File>();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setSuccess(false);
        setDisabledSubmit(true);
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const name = formData.get("name");
        const description = formData.get("description");
        const tag = formData.get("tag");
        let price: number;

        // Makes sure that price is a number.
        const priceValue = formData.get("price");
        if (!priceValue) price = NaN;
        else price = parseInt(priceValue?.toString());
        if (isNaN(price)) {
            alert("Price field is invalid"); // TODO: find some better way to do form validation
            return; // Early return so we don't send a bad price.
        }

        let compressedFile = "default";

        if (image) {
            const compressed = await CompressAndEncode<string>(image);

            compressedFile = compressed
                .split("application/octet-stream")
                .join("image/jpg");
        }

        const res = await http.post("/api/admin/product", {
            name,
            description,
            price,
            tag,
            images: [compressedFile],
        });

        if (res.status === 200) {
            setSuccess(true);
            setDisabledSubmit(false);
        } else {
            setTimeout(() => {
                setDisabledSubmit(false);
            }, 200);
        }
    };

    return (
        <>
            <form className={styles.formContainer} onSubmit={onSubmit}>
                <FormInput name="name">Product Name</FormInput>
                <FormInput name="description">Product Description</FormInput>
                <FormInput name="price" number>
                    Price
                </FormInput>
                <FormInput name="tag">Tag</FormInput>
                <input
                    type="file"
                    accept=".jpg"
                    name="image"
                    onChange={(e) => {
                        if (e.currentTarget.files?.[0]) {
                            const img = e.currentTarget.files[0];
                            setImage(img);
                            const fr = new FileReader();
                            fr.readAsArrayBuffer(img);
                            // const stream = img.stream()
                            // fr.readAsDataURL(img);
                            fr.onload = (e) => {
                                // setImage(fr.result as ArrayBuffer)
                            };
                        }
                    }}
                />
                <b className={styles.success}>{success ? "Success" : ""}</b>
                <input disabled={disabledSubmit} type="submit" />
            </form>
        </>
    );
}

type FormInputProps = {
    children: React.ReactNode;
    name: string;
    number?: boolean;
};
const FormInput = ({ children, name, number }: FormInputProps) => {
    return (
        <>
            <label>
                <span>{children}:</span>
                <input type={number ? "number" : "text"} name={name} />
            </label>
        </>
    );
};
