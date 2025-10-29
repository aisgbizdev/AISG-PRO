import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
  "postgresql://sg_db_e74u_user:Xfk27js9LPv1Ud1YkwhxI3kfYkO7Y3iu@dpg-d40gfpuuk2gs73a3af70-a/sg_db_e74u",
  ssl: { rejectUnauthorized: false },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

pool.connect()
  .then(() => console.log("🟢 Database pool connected"))
  .catch((err) => console.error("🔴 Database connection failed:", err));

app.get("/", (req, res) => {
  res.json({ status: "AiSG Backend Active 🚀" });
});

app.get("/audit", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, role, score, status FROM audits ORDER BY id DESC LIMIT 50;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching audit data:", err);
    res.status(500).json({ error: "Failed to fetch audits" });
  }
});

app.get("/logs", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, time, message FROM logs ORDER BY id DESC LIMIT 20;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// 🧩 POST: Tambah Audit Baru
app.post("/audit", async (req, res) => {
  try {
    const { name, role, score, status } = req.body;
    if (!name || !role || !score || !status)
      return res.status(400).json({ error: "All fields required" });

    await pool.query(
      "INSERT INTO audits (name, role, score, status) VALUES ($1, $2, $3, $4)",
      [name, role, score, status]
    );

    // Tambahkan log otomatis
    const now = new Date().toISOString();
    await pool.query(
      "INSERT INTO logs (time, message) VALUES ($1, $2)",
      [now, `New audit added: ${name} (${role}) - ${status}`]
    );

    res.json({ success: true, message: "Audit added successfully" });
  } catch (err) {
    console.error("Error inserting audit:", err);
    res.status(500).json({ error: "Failed to add audit" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} and bound to 0.0.0.0`);
});
