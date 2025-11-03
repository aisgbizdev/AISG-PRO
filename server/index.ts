import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = Number(process.env.PORT) || 10000;

app.use(express.json());

// Allow frontend access
app.use(
  cors({
    origin: [
      "https://aisg-control-center.onrender.com",
      "https://aisg-pro-79ru.onrender.com",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Auto-create table + seed data
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS performance (
        id SERIAL PRIMARY KEY,
        month VARCHAR(20),
        score NUMERIC,
        growth NUMERIC,
        note TEXT
      );
    `);

    const check = await pool.query("SELECT COUNT(*) FROM performance;");
    if (Number(check.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO performance (month, score, growth, note) VALUES
        ('August', 72.5, 0.04, 'Stable performance with minor growth'),
        ('September', 78.9, 0.09, 'Improved overall engagement'),
        ('October', 85.2, 0.08, 'October Surge 🚀 8% improvement from last month!');
      `);
      console.log("✅ Table 'performance' created and seeded with sample data");
    } else {
      console.log("✅ Table 'performance' already has data");
    }
  } catch (err) {
    console.error("❌ Database init failed:", err);
  }
}

// Endpoints
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "AISG-PRO", time: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("✅ AISG-PRO Backend is live 🚀");
});

app.get("/api/performance", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM performance ORDER BY month ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Start server
app.listen(port, "0.0.0.0", async () => {
  console.log(`✅ AISG-PRO API running on port ${port}`);
  await initDatabase();
});
