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
};

const services: Service[] = [
    {
        name: "Zoho People",
        description: "HR and employee management",
        endpoint: "/api/zoho/people",
        permission: "HR",
    },
    {
        name: "Zoho CRM",
        description: "Customer relationship management",
        endpoint: "/api/zoho/crm",
        permission: "Sales",
    },
    {
        name: "Zoho Desk",
        description: "Customer support and ticket management",
        endpoint: "/api/zoho/desk",
        permission: "Support",
    },
    {
        name: "Zoho Books",
        description: "Finance and accounting management",
        endpoint: "/api/zoho/books",
        permission: "Finance",
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
                `http://localhost:5000${service.endpoint}`,
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
                    `❌ ${service.name}: ${data.message || "Access denied"}`
                );
                setLoadingService("");
                return;
            }

            setMessage(`✅ ${data.message}`);
        } catch (error) {
            setMessage("Unable to connect to backend server.");
        }

        setLoadingService("");
    };

    if (!user) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                Loading...
            </main>
        );
    }

    const availableServices =
        user.role === "Admin"
            ? services
            : services.filter(
                  (service) => service.permission === user.role
              );

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f4f7fb",
                padding: "30px",
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "28px",
                                color: "#111827",
                            }}
                        >
                            Employee Dashboard
                        </h1>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#6b7280",
                            }}
                        >
                            Welcome, {user.name}
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        {/* Admin Panel - Admin only */}
                        {user.role === "Admin" && (
                            <button
                                onClick={() => router.push("/admin")}
                                style={{
                                    padding: "10px 18px",
                                    background: "#4f46e5",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                Admin Panel
                            </button>
                        )}

                        {/* Logout */}
                        <button
                            onClick={logout}
                            style={{
                                padding: "10px 18px",
                                background: "#111827",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* User Information */}
                <div
                    style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "14px",
                        marginBottom: "25px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >
                    <h2
                        style={{
                            marginTop: 0,
                            color: "#111827",
                        }}
                    >
                        Account Information
                    </h2>

                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>

                    <p>
                        <strong>Role:</strong>{" "}
                        <span
                            style={{
                                background: "#e0e7ff",
                                color: "#3730a3",
                                padding: "5px 10px",
                                borderRadius: "20px",
                                fontWeight: "600",
                            }}
                        >
                            {user.role}
                        </span>
                    </p>
                </div>

                {/* Services */}
                <h2
                    style={{
                        color: "#111827",
                        marginBottom: "15px",
                    }}
                >
                    Authorized Zoho Services
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {availableServices.map((service) => (
                        <div
                            key={service.name}
                            style={{
                                background: "white",
                                padding: "24px",
                                borderRadius: "14px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.05)",
                            }}
                        >
                            <h3
                                style={{
                                    marginTop: 0,
                                    color: "#111827",
                                }}
                            >
                                {service.name}
                            </h3>

                            <p
                                style={{
                                    color: "#6b7280",
                                    minHeight: "45px",
                                }}
                            >
                                {service.description}
                            </p>

                            <button
                                onClick={() => openService(service)}
                                disabled={
                                    loadingService === service.name
                                }
                                style={{
                                    width: "100%",
                                    padding: "11px",
                                    background: "#111827",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            >
                                {loadingService === service.name
                                    ? "Opening..."
                                    : "Open Service"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Result message */}
                {message && (
                    <div
                        style={{
                            marginTop: "25px",
                            padding: "16px",
                            background: "white",
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            color: "#374151",
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </main>
    );
}