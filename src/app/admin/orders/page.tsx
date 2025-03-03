"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
    order_id: string;
    customer_ssn: string;
    created_at: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postalcode: string;
    processed: boolean;
    customer: { name?: string; ssn: string };
};

const Orders_page = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch_orders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/order/place");
            const data = await res.json();
            if (res.ok) {
                setOrders(data.data || data);
            } else {
                setError(data.error || "Failed to load orders");
            }
        } catch (err) {
            setError("Failed to load orders");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetch_orders();
    }, []);

    const handle_process_order = async (orderId: string) => {
        try {
            const res = await fetch(`/api/order/place/${orderId}/process`, {
                method: "PUT",
            });
            const data = await res.json();
            if (res.ok) {
                fetch_orders(); // tryckt knapp => refresh
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (error) {
            alert("Failed to process order");
        }
    };

    const handle_revert_order = async (orderId: string) => {
        try {
            const res = await fetch(`/api/order/place/${orderId}/revert`, {
                method: "PUT",
            });
            const data = await res.json();
            if (res.ok) {
                fetch_orders(); // tryckt knapp => refresh
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (error) {
            alert("Failed to revert order status");
        }
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    return (  
        <>
        <Link href="/admin/product">Product dashboard</Link>
        <div>
            <h1>Admin Orders</h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {orders.map((order) => (
                    <li
                        key={order.order_id}
                        style={{
                            marginBottom: "20px",
                            borderBottom: "1px solid #ccc",
                            paddingBottom: "10px",
                        }}
                    >
                        <p>
                            <strong>Order ID:</strong> {order.order_id}
                        </p>
                        <p>
                            <strong>Customer SSN:</strong> {order.customer_ssn}
                        </p>
                        {order.customer && order.customer.name && (
                            <p>
                                <strong>Customer Name:</strong>{" "}
                                {order.customer.name}
                            </p>
                        )}
                        <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                        <p>
                            <strong>Shipping Address:</strong>{" "}
                            {order.shipping_address}, {order.shipping_city},{" "}
                            {order.shipping_postalcode}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            {order.processed ? "Processed" : "Processing"}
                        </p>
                        {!order.processed ? (
                            <button
                                onClick={() =>
                                    handle_process_order(order.order_id)
                                }
                            >
                                Mark as Processed
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    handle_revert_order(order.order_id)
                                }
                            >
                                Revert Status
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default Orders_page;
