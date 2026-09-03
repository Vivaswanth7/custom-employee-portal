const express = require("express");

const pool = require("../config/db");
const authenticateToken = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// Get all users
router.get(
    "/users",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT
                    u.id,
                    u.name,
                    u.email,
                    u.is_active,
                    u.created_at,
                    r.name AS role
                FROM users u
                LEFT JOIN user_roles ur
                    ON u.id = ur.user_id
                LEFT JOIN roles r
                    ON ur.role_id = r.id
                ORDER BY u.id
            `);

            res.json({
                users: result.rows
            });

        } catch (error) {
            console.error("Admin users error:", error);

            res.status(500).json({
                message: "Failed to retrieve users"
            });
        }
    }
);

// Get all roles
router.get(
    "/roles",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT id, name, description
                FROM roles
                ORDER BY id
            `);

            res.json({
                roles: result.rows
            });

        } catch (error) {
            console.error("Admin roles error:", error);

            res.status(500).json({
                message: "Failed to retrieve roles"
            });
        }
    }
);

// Get audit logs
router.get(
    "/audit-logs",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT
                    al.id,
                    al.action,
                    al.resource,
                    al.ip_address,
                    al.created_at,
                    u.name AS user_name,
                    u.email AS user_email
                FROM audit_logs al
                LEFT JOIN users u
                    ON al.user_id = u.id
                ORDER BY al.created_at DESC
                LIMIT 100
            `);

            res.json({
                auditLogs: result.rows
            });

        } catch (error) {
            console.error("Audit logs error:", error);

            res.status(500).json({
                message: "Failed to retrieve audit logs"
            });
        }
    }
);

// Update a user's role
router.put(
    "/users/:userId/role",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { roleName } = req.body;

            if (!roleName) {
                return res.status(400).json({
                    message: "Role name is required"
                });
            }

            const roleResult = await pool.query(
                `SELECT id
                 FROM roles
                 WHERE name = $1`,
                [roleName]
            );

            if (roleResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Role not found"
                });
            }

            const roleId = roleResult.rows[0].id;

            const userResult = await pool.query(
                `SELECT id, email
                 FROM users
                 WHERE id = $1`,
                [userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            await pool.query(
                `DELETE FROM user_roles
                 WHERE user_id = $1`,
                [userId]
            );

            await pool.query(
                `INSERT INTO user_roles (user_id, role_id)
                 VALUES ($1, $2)`,
                [userId, roleId]
            );

            await pool.query(
                `INSERT INTO audit_logs
                    (user_id, action, resource, ip_address)
                 VALUES ($1, $2, $3, $4)`,
                [
                    req.user.userId,
                    "UPDATE_ROLE",
                    `USER_${userId}`,
                    req.ip
                ]
            );

            res.json({
                message: "User role updated successfully"
            });

        } catch (error) {
            console.error("Update role error:", error);

            res.status(500).json({
                message: "Failed to update user role"
            });
        }
    }
);

// Activate or deactivate a user
router.put(
    "/users/:userId/status",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { isActive } = req.body;

            if (typeof isActive !== "boolean") {
                return res.status(400).json({
                    message: "isActive must be true or false"
                });
            }

            // Prevent admin from deactivating their own account
            if (
                Number(userId) === Number(req.user.userId) &&
                !isActive
            ) {
                return res.status(400).json({
                    message: "You cannot deactivate your own account"
                });
            }

            const userResult = await pool.query(
                `SELECT id, email
                 FROM users
                 WHERE id = $1`,
                [userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            await pool.query(
                `UPDATE users
                 SET is_active = $1
                 WHERE id = $2`,
                [isActive, userId]
            );

            await pool.query(
                `INSERT INTO audit_logs
                    (user_id, action, resource, ip_address)
                 VALUES ($1, $2, $3, $4)`,
                [
                    req.user.userId,
                    isActive
                        ? "ACTIVATE_USER"
                        : "DEACTIVATE_USER",
                    `USER_${userId}`,
                    req.ip
                ]
            );

            res.json({
                message: isActive
                    ? "User activated successfully"
                    : "User deactivated successfully"
            });

        } catch (error) {
            console.error(
                "Update user status error:",
                error
            );

            res.status(500).json({
                message: "Failed to update user status"
            });
        }
    }
);

module.exports = router;