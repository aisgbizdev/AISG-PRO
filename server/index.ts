import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = Number(process.env.PORT) || 10000;

// Middleware
app.use(express.json());

// CORS configuration (allow frontend + self)
app.use(
  cors({
    origin: [
      "https://aisg-control-center.onrender.com",
      "https://aisg-pro-79ru.onrender.com",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
  })
);

// PostgreSQL pool connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- Health Check Endpoint ---
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "AISG-PRO",
    time: new Date().toISOString()
  });
});

// --- Root Endpoint ---
app.get("/", (req, res) => {
  res.send("✅ AISG-PRO Backend is live 🚀");
});

// --- Performance Data API ---
app.get("/api/performance", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM performance ORDER BY month ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// --- Start Server ---
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ AISG-PRO API running on port ${port}`);
})
