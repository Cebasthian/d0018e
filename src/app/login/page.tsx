"use client";

import { http } from "@/lib/client/httpRequester";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [ssn, setSsn] = useState("");
    const [password, setPassword] = useState("");
    const [ssnExists, setSsnExists] = useState<boolean | null>(null);
    const router = useRouter();

    const check_ssn_for_account = async () => {
        if (ssn.trim().length === 0) return;

        try {
            const res = await http.get(`/api/account?ssn=${ssn}`);

            if (res.status === 200) {
                setSsnExists(true);
            } else {
                setSsnExists(false);
            }
        } catch (error) {
            setSsnExists(false);
        }
    };

    const login = async () => {
        console.log("Logging in with:" , {ssn, password});
        const res = await http.post("/api/account/login", { ssn, password });
        const json = await res.json();
        if (json && json.success) {
            router.push("/account");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                padding: "1rem",
            }}
        >
            <div style={{ width: "200px", position: "relative" }}>
                <input
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                    onBlur={check_ssn_for_account}
                    onFocus={() => setSsnExists(null)} // to hide the message about if the account exists or not.
                    placeholder="SSN"
                    style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        width: "200px",
                    }}
                />

                {/* does account exist window*/}
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        overflow: "hidden",
                        transition: "max-height 0.8s ease, opacity 0.3s ease",
                        maxHeight: ssnExists === false ? "50px" : "0px",
                        opacity: ssnExists === false ? 1 : 0,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "0.5rem",
                            marginTop: "0.5rem",
                            textAlign: "center",
                            color: ssnExists ? "" : "red",
                            fontSize: "0.9rem",
                        }}
                    >
                        {ssnExists ? "" : "No account found"}
                    </div>
                </div>
            </div>

            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                style={{
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    width: "200px",
                }}
            />

            <button
                onClick={login}
                style={{
                    padding: "0.5rem",
                    backgroundColor: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "200px",
                }}
            >
                Login
            </button>
        </div>
    );
}
