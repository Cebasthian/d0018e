"use client";

import { http } from "@/lib/client/httpRequester";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
    const [ssn, setSsn] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const login = async () => {
        console.log("Logging in with:", { ssn, password });
        const res = await http.post("/api/account/login", { ssn, password });
        const json = await res.json();
        if (json && json.success) {
            router.push("/account");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <input
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                    placeholder="SSN"
                    className={styles.inputField}
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={styles.inputField}
                />

                <div className={styles.toggleContainer}>
                    <input
                        type="checkbox"
                        id="passwordToggle"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className={styles.toggleCheckbox}
                    />
                    <label
                        htmlFor="passwordToggle"
                        className={styles.toggleLabel}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </label>
                </div>

                <button onClick={login} className={styles.loginButton}>
                    Login
                </button>
            </div>
        </div>
    );
}
