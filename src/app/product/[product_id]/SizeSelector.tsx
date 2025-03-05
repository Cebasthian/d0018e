"use client";

import { useCustomer } from "@/lib/client/useCustomer";
import type { GetProductById } from "@/service/product";
import { HttpErrorMessage } from "@/types";
import { PromiseReturnType } from "@prisma/client/extension";
import { useMemo, useState } from "react";
import styles from "./SizeSelector.module.css";

interface SizeSelectorProps {
    product: Exclude<PromiseReturnType<typeof GetProductById>, null>
}

export default function SizeSelector({
    product
}: SizeSelectorProps) {
    const [selectedSize, setSelectedSize] = useState(""); // Default size

    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    

    const { customer, refresh } = useCustomer();

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSuccess(false)
        setSelectedSize(e.target.value);
    };

    const handleAddToBasket = async () => {
        if(disabledButton) return;

        setSuccess(false)

        if([""].includes(selectedSize)) {
            setError("Please choose a size")
            return;
        }

        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/basket/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: product.product_id,
                    size: selectedSize,
                }),
            });
            if (res.ok) {
                //alert(`Added ${productName} (Size: ${selectedSize}) to your basket.`);
                await refresh()
                setSuccess(true)
            } else {
                setError("Something went wrong")
            }
        } catch (error) {
            console.error("Error adding product to basket:", error);
            // alert("Error occured while adding to basket.");
            setError((error as HttpErrorMessage).message)
        }

        setLoading(false)

    };

    const disabledButton = useMemo(() => {
        return selectedSize === "" || loading || success || customer === undefined
    }, [selectedSize, loading, success, customer])

    return (
        <>
        <span className={styles.error}>{error}</span>
        <div className={styles.sizeSelectorContainer}>
            <label htmlFor="size-select">Choose a size:</label>
            <select
                id="size-select"
                value={selectedSize}
                onChange={handleSizeChange}
                disabled={customer === undefined}
            >
                <option value="" disabled>Choose Size</option>
                <option disabled={(product.stock?.XS || 0) <= 0} value="XS">Extra Small</option>
                <option disabled={(product.stock?.S || 0) <= 0} value="S">Small</option>
                <option disabled={(product.stock?.M || 0) <= 0} value="M">Medium</option>
                <option disabled={(product.stock?.L || 0) <= 0} value="L">Large</option>
                <option disabled={(product.stock?.XL || 0) <= 0} value="XL">Extra Large</option>
            </select>
            <button disabled={disabledButton} className={[styles.addButton, success ? styles.success : ""].join(" ")} onClick={handleAddToBasket}>
                { customer === undefined ? "Log in to buy" : loading ? "Loading..." : success ? "Added" : "Add to basket"}
            </button>
            <p>Price: {product.price} SEK</p>
        </div>
        
        </>
    );
}
