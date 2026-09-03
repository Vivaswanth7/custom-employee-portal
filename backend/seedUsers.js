const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

const users = [
    {
        name: "Admin User",
        email: "admin@test.com",
        password: "Admin@123",
        role: "Admin"
    },
    {
        name: "HR User",
        email: "hr@test.com",
        password: "HR@123",
        role: "HR"
    },
    {
        name: "Sales User",
        email: "sales@test.com",
        password: "Sales@123",
        role: "Sales"
    },
    {
        name: "Support User",
        email: "support@test.com",
        password: "Support@123",
        role: "Support"
    },
    {
        name: "Finance User",
        email: "finance@test.com",
        password: "Finance@123",
        role: "Finance"
    }
];

async function seedUsers() {
    try {
        for (const user of users) {

            const passwordHash = await bcrypt.hash(user.password, 10);

            const userResult = await pool.query(
                `INSERT INTO users
                    (name, email, password_hash)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (email)
                 DO UPDATE SET
                    name = EXCLUDED.name,
                    password_hash = EXCLUDED.password_hash
                 RETURNING id`,
                [
                    user.name,
                    user.email,
                    passwordHash
                ]
            );

            const userId = userResult.rows[0].id;

            const roleResult = await pool.query(
                `SELECT id FROM roles WHERE name = $1`,
                [user.role]
            );

            const roleId = roleResult.rows[0].id;

            await pool.query(
                `INSERT INTO user_roles (user_id, role_id)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [userId, roleId]
            );

            console.log(
                `Created/updated ${user.email} → ${user.role}`
            );
        }

        console.log("Users seeded successfully!");

    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await pool.end();
    }
}

seedUsers();