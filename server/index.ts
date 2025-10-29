import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await pool.connect();
    console.log("🟢 Database connected successfully");

    // 🧩 Auto-create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS coaching (
        id SERIAL PRIMARY KEY,
        name TEXT,
        date TEXT,
        topic TEXT,
        result TEXT,
        impact TEXT
      );
    `;
    await pool.query(createTableQuery);
    console.log("✅ Table 'coaching' checked/created successfully");
  } catch (err) {
    console.error("🔴 Database connection failed:", err);
  }
})();

app.get("/", (req, res) => {
  res.send("✅ AISG-PRO Backend Connected");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});
