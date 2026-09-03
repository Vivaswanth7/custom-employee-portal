const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const zohoRoutes = require("./src/routes/zohoRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Zoho application routes
app.use("/api/zoho", zohoRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Custom Employee Portal Backend is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});