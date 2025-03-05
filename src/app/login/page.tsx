"use client";

import { http } from "@/lib/client/httpRequester";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
    const [ssn, setSsn] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const login = async () => {
        console.log("Logging in with:", { ssn, password });
        const res = await http.post("/api/account/login", { ssn, password });
        const json = await res.json();
        if (json && json.success) {
            router.push("/");
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
                <Link className={styles.home} href="/"><span>Home</span></Link>
                <h1>Social security number</h1>
                <input
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                    placeholder="SSN"
                    className={styles.inputField}
                    onKeyDown={handleKeyDown}
                />
                <h1>Password</h1>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={styles.inputField}
                    onKeyDown={handleKeyDown}
                />
                <label className={styles.toggleContainer}>
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
                </label>
                {error && <p className={styles.loginError}>{error}</p>}
                <button onClick={login} className={styles.loginButton}>
                    Login
                </button>
                <div className={styles["no-account"]}>
                    <span>
                        {"Don't have an account?"}{" "}
                        <Link href="/signup">Sign up</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
