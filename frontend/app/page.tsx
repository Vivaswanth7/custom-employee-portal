"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard");
        } catch (err) {
            setError("Unable to connect to server");
        }

        setLoading(false);
    };

    const demoAccounts = [
        {
            role: "Admin",
            email: "admin@test.com",
            icon: "👤",
        },
        {
            role: "HR",
            email: "hr@test.com",
            icon: "👥",
        },
        {
            role: "Sales",
            email: "sales@test.com",
            icon: "📊",
        },
        {
            role: "Support",
            email: "support@test.com",
            icon: "🎧",
        },
        {
            role: "Finance",
            email: "finance@test.com",
            icon: "💰",
        },
    ];

    return (
        <main className="login-page">
            {/* Decorative background elements */}
            <div className="decorative-circle circle-one"></div>
            <div className="decorative-circle circle-two"></div>
            <div className="decorative-dots dots-one"></div>
            <div className="decorative-dots dots-two"></div>

            <section className="login-container">
                {/* LEFT BRANDING PANEL */}
                <div className="login-brand">
                    <div className="brand-content">
                        <div className="brand-icon">
                            <span>👥</span>
                        </div>

                        <h1>Employee Portal</h1>

                        <p className="brand-tagline">
                            Your workspace, your place.
                        </p>

                        {/* Security illustration */}
                        <div className="security-illustration">
                            <div className="laptop">
                                <div className="laptop-screen">
                                    <div className="shield">
                                        ✓
                                    </div>
                                </div>

                                <div className="laptop-base"></div>
                            </div>

                            <div className="plant">
                                🌿
                            </div>

                            <div className="lock">
                                🔒
                            </div>
                        </div>

                        <div className="brand-message">
                            <strong>Secure. Simple. Seamless.</strong>
                            <span>
                                Everything you need to do your best work.
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT LOGIN PANEL */}
                <div className="login-form-panel">
                    <div className="form-content">
                        <div className="welcome-section">
                            <h2>Welcome back! 👋</h2>
                            <p>Sign in to access your workspace</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            {/* EMAIL */}
                            <div className="input-group">
                                <label htmlFor="email">Email</label>

                                <div className="input-wrapper">
                                    <span className="input-icon">
                                        ✉
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="input-group password-group">
                                <label htmlFor="password">Password</label>

                                <div className="input-wrapper">
                                    <span className="input-icon">
                                        🔒
                                    </span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? "🙈" : "👁"}
                                    </button>
                                </div>
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div className="login-error">
                                    <span>⚠</span>
                                    {error}
                                </div>
                            )}

                            {/* SIGN IN */}
                            <button
                                type="submit"
                                className="signin-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <span className="arrow">→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* DEMO ACCOUNTS */}
                        <div className="demo-section">
                            <div className="demo-heading">
                                <span></span>
                                <p>Demo accounts</p>
                                <span></span>
                            </div>

                            <div className="demo-list">
                                {demoAccounts.map((account) => (
                                    <button
                                        key={account.role}
                                        type="button"
                                        className="demo-account"
                                        onClick={() => {
                                            setEmail(account.email);
                                            setPassword("");
                                            setError("");
                                        }}
                                    >
                                        <div className="demo-icon">
                                            {account.icon}
                                        </div>

                                        <div className="demo-details">
                                            <strong>
                                                {account.role}
                                            </strong>

                                            <span>
                                                {account.email}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="security-note">
                            <span>🛡️</span>
                            <span>Your data is secure with us</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}