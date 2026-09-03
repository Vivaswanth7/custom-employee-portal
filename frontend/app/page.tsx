"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                setLoading(false);
                return;
            }

            // Store authentication information
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard");
        } catch (err) {
            setError("Unable to connect to server");
        }

        setLoading(false);
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f4f7fb",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "white",
                    padding: "40px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            marginBottom: "8px",
                            color: "#111827",
                        }}
                    >
                        Employee Portal
                    </h1>

                    <p style={{ color: "#6b7280" }}>
                        Sign in to access your workspace
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "#374151",
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "15px",
                        }}
                    />

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "#374151",
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "20px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "15px",
                        }}
                    />

                    {error && (
                        <div
                            style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                padding: "12px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                fontSize: "14px",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            background: "#111827",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div
                    style={{
                        marginTop: "25px",
                        padding: "15px",
                        background: "#f9fafb",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#6b7280",
                    }}
                >
                    <strong>Demo accounts</strong>
                    <br />
                    Admin: admin@test.com
                    <br />
                    HR: hr@test.com
                    <br />
                    Sales: sales@test.com
                    <br />
                    Support: support@test.com
                    <br />
                    Finance: finance@test.com
                </div>
            </div>
        </main>
    );
}