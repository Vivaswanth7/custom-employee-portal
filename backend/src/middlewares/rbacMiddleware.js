const pool = require("../config/db");

const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.userId) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }

            const result = await pool.query(
                `SELECT 1
                 FROM user_roles ur
                 JOIN role_permissions rp
                    ON ur.role_id = rp.role_id
                 JOIN permissions p
                    ON rp.permission_id = p.id
                 WHERE ur.user_id = $1
                 AND p.name = $2`,
                [req.user.userId, permissionName]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({
                    message: "Forbidden: insufficient permissions"
                });
            }

            next();

        } catch (error) {
            console.error("RBAC error:", error);

            res.status(500).json({
                message: "Authorization check failed"
            });
        }
    };
};

module.exports = requirePermission;