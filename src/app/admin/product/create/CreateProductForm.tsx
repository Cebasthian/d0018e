"use client"
import { http } from "@/lib/client/httpRequester";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./admin-product-create.module.css";



export default function CreateProductForm() {
    const [success, setSuccess] = useState(false)
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [imageError, setImageError] = useState("")
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          // Check for .jpg extension
          if (!file.name.toLowerCase().endsWith(".jpg")) {
            setImageError("Only .jpg files are allowed.");
            setSelectedImage(null);
            return;
          }
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          img.onload = () => {
            if (img.width > 500 || img.height > 500) {
              setImageError("Image dimensions must be 500x500 or less.");
              setSelectedImage(null);
            } else {
              setImageError("");
              setSelectedImage(file);
            }
            URL.revokeObjectURL(objectUrl);
          };
          img.src = objectUrl;
        }
      };


    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
            setSuccess(false)
            setDisabledSubmit(true)
            e.preventDefault();

            if (imageError) {
                alert("Please select a valid image before submitting.");
                setDisabledSubmit(false);
                return;
              }
            
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

            const imgData = new FormData();
            if(selectedImage) {
                imgData.append("file", selectedImage);

                const image_upload_response = await fetch("/api/admin/product/image/", {
                    method: "POST",
                    body: imgData,
                });
    
                if(!image_upload_response.ok) {
                    alert("Image upload failed.");
                    setDisabledSubmit(false);
                    return;
                }
            }

            // Construct the image URL using the selected file's name
            const imageUrl = selectedImage ? `/images/${selectedImage.name}` : "";

            const res = await http.post("/api/admin/product", {
                name,
                description,
                price,
                tag,
                images: {
                    createMany: {
                        data: [{
                            url: imageUrl
                        }]
                    }
                }
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
            <label>
                    <span>Product Image (max 500x500 and only jpg files):</span>
                    <input type="file" accept=".jpg" name="image" onChange={handleImageChange} />
                </label>
                {imageError && <p style={{ color: "red" }}>{imageError}</p>}
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