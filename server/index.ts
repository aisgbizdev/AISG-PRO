import express from "express";
import session from "express-session";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
  "postgresql://sg_db_e74u_user:Xfk27js9LPv1Ud1YkwhxI3kfYkO7Y3iu@dpg-d40gfpuuk2gs73a3af70-a/sg_db_e74u",
  ssl: { rejectUnauthorized: false },
});

// 🧠 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Tes koneksi database
pool.connect()
  .then(() => console.log("🟢 Database pool connected"))
  .catch((err) => console.error("🔴 Database connection failed:", err));

// 🚀 ROUTE: Tes server
app.get("/", (req, res) => {
  res.json({ status: "AiSG Backend Active 🚀" });
});

// 🚀 ROUTE: Audit Data
app.get("/audit", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, role, score, status FROM audits ORDER BY id DESC LIMIT 50;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching audit data:", err);
    res.status(500).json({ error: "Failed to fetch audits" });
  }
});

// 🚀 ROUTE: Logs
app.get("/logs", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, time, message FROM logs ORDER BY id DESC LIMIT 20;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// ✅ Jalankan server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} and bound to 0.0.0.0`);
});
