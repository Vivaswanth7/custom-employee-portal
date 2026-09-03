"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    role: string;
};

type Role = {
    id: number;
    name: string;
    description: string;
};

type AuditLog = {
    id: number;
    action: string;
    resource: string;
    ip_address: string;
    created_at: string;
    user_name: string;
    user_email: string;
};

export default function AdminPage() {
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            router.push("/");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "Admin") {
            router.push("/dashboard");
            return;
        }

        loadAdminData(token);
    }, [router]);

    const loadAdminData = async (token: string) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [usersResponse, rolesResponse, logsResponse] =
                await Promise.all([
                    fetch("http://localhost:5000/api/admin/users", {
                        headers,
                    }),
                    fetch("http://localhost:5000/api/admin/roles", {
                        headers,
                    }),
                    fetch("http://localhost:5000/api/admin/audit-logs", {
                        headers,
                    }),
                ]);

            const usersData = await usersResponse.json();
            const rolesData = await rolesResponse.json();
            const logsData = await logsResponse.json();

            if (!usersResponse.ok) {
                setError(usersData.message || "Failed to load users");
                return;
            }

            setUsers(usersData.users || []);
            setRoles(rolesData.roles || []);
            setAuditLogs(logsData.auditLogs || []);
        } catch (error) {
            setError("Unable to connect to backend server.");
        }
    };

    // Update user role
    const updateUserRole = async (
        userId: number,
        roleName: string
    ) => {
        try {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/admin/users/${userId}/role`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        roleName,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to update role");
                return;
            }

            setMessage("User role updated successfully.");

            await loadAdminData(token);
        } catch (error) {
            setError("Unable to connect to backend server.");
        }
    };

    // Activate / deactivate user
    const updateUserStatus = async (
        userId: number,
        isActive: boolean
    ) => {
        try {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/admin/users/${userId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        isActive,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || "Failed to update user status"
                );
                return;
            }

            setMessage(data.message);

            await loadAdminData(token);
        } catch (error) {
            setError("Unable to connect to backend server.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/");
    };

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
                    maxWidth: "1200px",
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
                        <h1 style={{ margin: 0, color: "#111827" }}>
                            Admin Panel
                        </h1>

                        <p style={{ color: "#6b7280" }}>
                            Manage employees, roles and audit activity
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <button
                            onClick={() => router.push("/dashboard")}
                            style={{
                                padding: "10px 18px",
                                background: "#e5e7eb",
                                color: "#111827",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            Dashboard
                        </button>

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

                {/* Success message */}
                {message && (
                    <div
                        style={{
                            background: "#dcfce7",
                            color: "#166534",
                            padding: "15px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: "15px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Employee Users */}
                <section
                    style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "14px",
                        marginBottom: "25px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >
                    <h2 style={{ color: "#111827" }}>
                        Employee Users
                    </h2>

                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px",
                                        }}
                                    >
                                        Name
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px",
                                        }}
                                    >
                                        Email
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px",
                                        }}
                                    >
                                        Role
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px",
                                        }}
                                    >
                                        Status
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px",
                                        }}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td style={{ padding: "12px" }}>
                                            {user.name}
                                        </td>

                                        <td style={{ padding: "12px" }}>
                                            {user.email}
                                        </td>

                                        {/* Role dropdown */}
                                        <td style={{ padding: "12px" }}>
                                            <select
                                                value={user.role || ""}
                                                onChange={(e) =>
                                                    updateUserRole(
                                                        user.id,
                                                        e.target.value
                                                    )
                                                }
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: "7px",
                                                    border: "1px solid #d1d5db",
                                                    background: "white",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {roles.map((role) => (
                                                    <option
                                                        key={role.id}
                                                        value={role.name}
                                                    >
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Status */}
                                        <td
                                            style={{
                                                padding: "12px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {user.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </td>

                                        {/* Action */}
                                        <td style={{ padding: "12px" }}>
                                            <button
                                                onClick={() =>
                                                    updateUserStatus(
                                                        user.id,
                                                        !user.is_active
                                                    )
                                                }
                                                style={{
                                                    padding: "8px 14px",
                                                    background:
                                                        user.is_active
                                                            ? "#dc2626"
                                                            : "#16a34a",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "7px",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {user.is_active
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Roles */}
                <section
                    style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "14px",
                        marginBottom: "25px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >
                    <h2 style={{ color: "#111827" }}>
                        Roles
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "15px",
                        }}
                    >
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                style={{
                                    padding: "18px",
                                    background: "#f9fafb",
                                    borderRadius: "10px",
                                }}
                            >
                                <strong>{role.name}</strong>

                                <p
                                    style={{
                                        color: "#6b7280",
                                        fontSize: "14px",
                                    }}
                                >
                                    {role.description ||
                                        "Role permissions"}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Audit Logs */}
                <section
                    style={{
                        background: "white",
                        padding: "24px",
                        borderRadius: "14px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >
                    <h2 style={{ color: "#111827" }}>
                        Audit Logs
                    </h2>

                    {auditLogs.length === 0 ? (
                        <p style={{ color: "#6b7280" }}>
                            No audit logs available.
                        </p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "12px",
                                            }}
                                        >
                                            User
                                        </th>

                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "12px",
                                            }}
                                        >
                                            Action
                                        </th>

                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "12px",
                                            }}
                                        >
                                            Resource
                                        </th>

                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "12px",
                                            }}
                                        >
                                            Time
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {auditLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td style={{ padding: "12px" }}>
                                                {log.user_email}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                {log.action}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                {log.resource}
                                            </td>

                                            <td style={{ padding: "12px" }}>
                                                {new Date(
                                                    log.created_at
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}