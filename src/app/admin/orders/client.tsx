"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./orders.module.css";

type Order = {
    order_id: string;
    order_items: OrderItem[];
    customer_ssn: string;
    created_at: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postalcode: string;
    processed: boolean;
    customer: { name?: string; ssn: string };
};

type OrderItem = {
    id: number;
    order_id: string;
    product_id: string;
    price: number;
    size: string;
    Product?: { name: string };
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
            console.log(JSON.stringify(data, null, 2));
            if (res.ok) {
                setOrders(data.data || data);
            } else {
                setError(data.error || "Failed to load orders");
            }
        } catch {
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
                fetch_orders(); // press button => refresh
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch {
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
                fetch_orders(); // press button => refresh
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch {
            alert("Failed to revert order status");
        }
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <Link href="/admin/product">Go to product dashboard</Link>
            <h1 className={styles.title}>Admin Orders</h1>
            <ul className={styles.ordersList}>
                {orders.map((order) => {
                    const orderTotal = order.order_items.reduce(
                        (total, item) => total + item.price,
                        0
                    );
                    return (
                        <li className={styles.orderItem} key={order.order_id}>
                            <p>
                                <strong>Order ID:</strong> {order.order_id}
                            </p>

                            {/* ordered items area */}
                            <div className={styles.orderedItems}>
                                <h4>Ordered Items:</h4>
                                {order.order_items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.orderedItemDetail}
                                    >
                                        <p>
                                            <strong>Product name:</strong>{" "}
                                            {item.Product?.name}
                                        </p>
                                        <p>
                                            <strong>Product Id:</strong>{" "}
                                            {item.product_id}
                                        </p>
                                        <p>
                                            <strong>Price:</strong> {item.price}{" "}
                                            sek
                                        </p>
                                        <p>
                                            <strong>Size:</strong> {item.size}
                                        </p>
                                        {item.Product && (
                                            <p>
                                                <strong>Product Name:</strong>{" "}
                                                {item.Product.name}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <div className={styles.orderTotal}>
                                    <p>
                                        <strong>Total:</strong> {orderTotal} sek
                                    </p>
                                </div>
                            </div>

                            <p>
                                <strong>Customer SSN:</strong>{" "}
                                {order.customer_ssn}
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
                                {order.shipping_address}, <strong>city:</strong>{" "}
                                {order.shipping_city},{" "}
                                <strong>postal code:</strong>{" "}
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
                    );
                })}
            </ul>
        </div>
    );
};

export default Orders_page;