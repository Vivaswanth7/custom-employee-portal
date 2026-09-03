const pool = require("../config/db");

const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const result = await pool.query(
            `SELECT 1
             FROM user_roles ur
             JOIN roles r ON ur.role_id = r.id
             WHERE ur.user_id = $1
             AND r.name = 'Admin'`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                message: "Forbidden: Admin access required"
            });
        }

        next();

    } catch (error) {
        console.error("Admin authorization error:", error);

        res.status(500).json({
            message: "Admin authorization check failed"
        });
    }
};

module.exports = requireAdmin;