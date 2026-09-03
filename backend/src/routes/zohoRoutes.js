const express = require("express");

const authenticateToken = require("../middlewares/authMiddleware");
const requirePermission = require("../middlewares/rbacMiddleware");
const {
    getBooksOrganization
} = require("../services/zohoService");

const router = express.Router();

// Zoho People
router.get(
    "/people",
    authenticateToken,
    requirePermission("view_zoho_people"),
    (req, res) => {
        res.json({
            message: "Authorized access to Zoho People",
            application: "Zoho People"
        });
    }
);

// Zoho CRM
router.get(
    "/crm",
    authenticateToken,
    requirePermission("view_zoho_crm"),
    (req, res) => {
        res.json({
            message: "Authorized access to Zoho CRM",
            application: "Zoho CRM"
        });
    }
);

// Zoho Desk
router.get(
    "/desk",
    authenticateToken,
    requirePermission("view_zoho_desk"),
    (req, res) => {
        res.json({
            message: "Authorized access to Zoho Desk",
            application: "Zoho Desk"
        });
    }
);

// Zoho Books - REAL API
router.get(
    "/books",
    authenticateToken,
    requirePermission("view_zoho_books"),
    async (req, res) => {
        try {
            const data = await getBooksOrganization(
                process.env.ZOHO_ORGANIZATION_ID
            );

            res.json({
                message: "Successfully connected to Zoho Books",
                application: "Zoho Books",
                organization: data
            });

        } catch (error) {
            console.error(
                "Zoho Books API error:",
                error.response?.data || error.message
            );

            res.status(500).json({
                message: "Failed to connect to Zoho Books"
            });
        }
    }
);

module.exports = router;