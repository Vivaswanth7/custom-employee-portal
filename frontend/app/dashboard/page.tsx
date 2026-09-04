"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type Service = {
    name: string;
    description: string;
    endpoint: string;
    permission: string;
    icon: string;
    category: string;
};

const services: Service[] = [
    {
        name: "Zoho People",
        description: "HR and employee management",
        endpoint: "/api/zoho/people",
        permission: "HR",
        icon: "👥",
        category: "Human Resources",
    },
    {
        name: "Zoho CRM",
        description: "Customer relationship management",
        endpoint: "/api/zoho/crm",
        permission: "Sales",
        icon: "📊",
        category: "Sales",
    },
    {
        name: "Zoho Desk",
        description: "Customer support and ticket management",
        endpoint: "/api/zoho/desk",
        permission: "Support",
        icon: "🎧",
        category: "Support",
    },
    {
        name: "Zoho Books",
        description: "Finance and accounting management",
        endpoint: "/api/zoho/books",
        permission: "Finance",
        icon: "💰",
        category: "Finance",
    },
];

export default function Dashboard() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState("");
    const [loadingService, setLoadingService] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            router.push("/");
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [router]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/");
    };

    const openService = async (service: Service) => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        setLoadingService(service.name);
        setMessage("");

        try {
            const response = await fetch(
                `https://custom-employee-portal-hy5w.onrender.com${service.endpoint}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    `❌ ${service.name}: ${
                        data.message || "Access denied"
                    }`
                );
                setLoadingService("");
                return;
            }

            setMessage(`✅ ${data.message}`);
        } catch (error) {
            setMessage(
                "❌ Unable to connect to backend server."
            );
        }

        setLoadingService("");
    };

    if (!user) {
        return (
            <main className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your workspace...</p>
            </main>
        );
    }

    const availableServices =
        user.role === "Admin"
            ? services
            : services.filter(
                  (service) =>
                      service.permission === user.role
              );

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <main className="dashboard-page">
            {/* Decorative background */}
            <div className="dashboard-glow dashboard-glow-one"></div>
            <div className="dashboard-glow dashboard-glow-two"></div>

            <div className="dashboard-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="dashboard-header">

                    <div className="dashboard-brand">
                        <div className="dashboard-brand-icon">
                            👥
                        </div>

                        <div>
                            <h1>Employee Portal</h1>
                            <span>Workspace Dashboard</span>
                        </div>
                    </div>

                    <div className="dashboard-actions">

                        {user.role === "Admin" && (
                            <button
                                className="admin-button"
                                onClick={() =>
                                    router.push("/admin")
                                }
                            >
                                <span>⚙️</span>
                                Admin Panel
                            </button>
                        )}

                        <button
                            className="logout-button"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* =================================================
                    WELCOME BANNER
                ================================================= */}

                <section className="welcome-banner">

                    <div className="welcome-text">
                        <div className="welcome-label">
                            <span className="status-dot"></span>
                            Workspace active
                        </div>

                        <h2>
                            Welcome back, {user.name.split(" ")[0]}! 👋
                        </h2>

                        <p>
                            Access the tools and services available
                            for your role.
                        </p>
                    </div>

                    <div className="welcome-avatar">
                        {getInitials(user.name)}
                    </div>
                </section>

                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <section className="account-card">

                    <div className="section-title">
                        <div className="section-icon">
                            👤
                        </div>

                        <div>
                            <h2>Account Information</h2>
                            <p>Your employee account details</p>
                        </div>
                    </div>

                    <div className="account-details">

                        <div className="account-item">
                            <span className="account-label">
                                Full Name
                            </span>

                            <strong>{user.name}</strong>
                        </div>

                        <div className="account-item">
                            <span className="account-label">
                                Email Address
                            </span>

                            <strong>{user.email}</strong>
                        </div>

                        <div className="account-item">
                            <span className="account-label">
                                Role
                            </span>

                            <span className="role-badge">
                                <span>●</span>
                                {user.role}
                            </span>
                        </div>

                        <div className="account-item">
                            <span className="account-label">
                                Access Level
                            </span>

                            <strong>
                                {user.role === "Admin"
                                    ? "Full Access"
                                    : "Role Based Access"}
                            </strong>
                        </div>

                    </div>
                </section>

                {/* =================================================
                    SERVICES
                ================================================= */}

                <section className="services-section">

                    <div className="services-heading">

                        <div>
                            <span className="eyebrow">
                                APPLICATIONS
                            </span>

                            <h2>Authorized Zoho Services</h2>

                            <p>
                                Services available based on your
                                role and permissions.
                            </p>
                        </div>

                        <div className="service-count">
                            <strong>
                                {availableServices.length}
                            </strong>
                            <span>
                                {availableServices.length === 1
                                    ? "Service"
                                    : "Services"}{" "}
                                Available
                            </span>
                        </div>

                    </div>

                    <div className="services-grid">

                        {availableServices.map((service) => (
                            <div
                                className="service-card"
                                key={service.name}
                            >

                                <div className="service-card-top">

                                    <div className="service-icon">
                                        {service.icon}
                                    </div>

                                    <span className="service-status">
                                        <span></span>
                                        Authorized
                                    </span>

                                </div>

                                <div className="service-content">

                                    <span className="service-category">
                                        {service.category}
                                    </span>

                                    <h3>{service.name}</h3>

                                    <p>
                                        {service.description}
                                    </p>

                                </div>

                                <button
                                    className="service-button"
                                    onClick={() =>
                                        openService(service)
                                    }
                                    disabled={
                                        loadingService ===
                                        service.name
                                    }
                                >
                                    {loadingService ===
                                    service.name ? (
                                        <>
                                            <span className="button-spinner"></span>
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            Open Service
                                            <span className="button-arrow">
                                                →
                                            </span>
                                        </>
                                    )}
                                </button>

                            </div>
                        ))}

                    </div>
                </section>

                {/* =================================================
                    RESULT MESSAGE
                ================================================= */}

                {message && (
                    <div
                        className={`dashboard-message ${
                            message.startsWith("❌")
                                ? "message-error"
                                : "message-success"
                        }`}
                    >
                        <span className="message-icon">
                            {message.startsWith("❌")
                                ? "⚠️"
                                : "✓"}
                        </span>

                        <span>{message.replace(/^❌ |^✅ /, "")}</span>

                        <button
                            onClick={() => setMessage("")}
                            className="message-close"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="dashboard-footer">
                    <span>🔐 Secure Employee Workspace</span>
                    <span>•</span>
                    <span>Role-based access enabled</span>
                </footer>

            </div>
        </main>
    );
}
