"use client";
import { http } from "@/lib/client/httpRequester";
import { useRouter } from "next/navigation";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    price: "",
    stock: "",
    images: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (initialData) {
        await http.put(`/api/admin/products/${initialData.product_id}`, formData);
      } else {
        await http.post("/api/admin/products", formData);
      }
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add form fields for product properties */}
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}