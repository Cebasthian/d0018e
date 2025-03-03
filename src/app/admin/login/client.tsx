"use client";
import { http } from "@/lib/client/httpRequester";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin-login.module.css";

export default function AdminLoginPageClient() {
    const [ssn, setSsn] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const login = async () => {
        console.log("Logging in with:", { ssn, password });
        const res = await http.post("/api/admin/account/login", {
            ssn,
            password,
        });
        const json = await res.json();
        if (json && json.success) {
            router.push("/admin/product");
        } else if (res.status === 400) {
            // added for invalid credentail error message.
            setSsn("");
            setPassword("");
            setError("Invalid login credentials");
        }
    };

    // "enter" key to submit.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            login();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <h1>Admin Login</h1>
                <br />
                <label>
                    <h3>Social security number</h3>
                    <input
                        value={ssn}
                        onChange={(e) => setSsn(e.target.value)}
                        placeholder="SSN"
                        className={styles.inputField}
                        onKeyDown={handleKeyDown}
                    />
                </label>
                <label>
                    <h3>Password</h3>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={styles.inputField}
                        onKeyDown={handleKeyDown}
                    />
                </label>
                <label className={styles.toggleContainer}>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className={styles.toggleCheckbox}
                    />
                    <span
                        className={styles.toggleLabel}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </label>
                {error && <p className={styles.loginError}>{error}</p>}
                <button onClick={login} className={styles.loginButton}>
                    Login
                </button>
            </div>
        </div>
    );
}
