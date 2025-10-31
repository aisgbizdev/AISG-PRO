import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 10000;

// ✅ Izinkan akses dari frontend
app.use(
  cors({
    origin: [
      "https://aisg-control-center.onrender.com",
      "https://aisg-pro-79ru.onrender.com"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/api/performance", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM performance ORDER BY month ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ AISG-PRO API running on port ${port}`);
});
