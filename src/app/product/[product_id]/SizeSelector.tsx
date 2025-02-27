"use client";

import { useCustomer } from "@/lib/client/useCustomer";
import { useState } from "react";
import styles from "./SizeSelector.module.css";

interface SizeSelectorProps {
    productId: string;
    productName: string;
    productPrice: number;
}

export default function SizeSelector({
    productId,
    productName,
    productPrice,
}: SizeSelectorProps) {
    const [selectedSize, setSelectedSize] = useState("M"); // Default size

    const { refresh } = useCustomer();

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSize(e.target.value);
    };

    const handleAddToBasket = async () => {
        try {
            const res = await fetch("/api/basket/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    product_name: productName,
                    size: selectedSize,
                }),
            });
            if (res.ok) {
                //alert(`Added ${productName} (Size: ${selectedSize}) to your basket.`);
                refresh()
            } else {
                alert("Failed to add to basket.");
            }
        } catch (error) {
            console.error("Error adding product to basket:", error);
            alert("Error occured while adding to basket.");
        }
    };

    return (
        <div className={styles.sizeSelectorContainer}>
            <label htmlFor="size-select">Choose a size:</label>
            <select
                id="size-select"
                value={selectedSize}
                onChange={handleSizeChange}
            >
                <option value="XS">Extra Small</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
            </select>
            <button className={styles.addButton} onClick={handleAddToBasket}>
                Add to Basket
            </button>
            <p>Price: {productPrice} kr</p>
        </div>
    );
}
