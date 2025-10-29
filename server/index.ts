import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

const { Pool } = pg;
const PgSession = connectPgSimple(session);

// koneksi database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(
  session({
    store: new PgSession({ pool }),
    secret: process.env.SESSION_SECRET || "aisg-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// route utama
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ AISG-PRO Backend Connected</h2>
    <p>Server is Live & Database Connected Successfully.</p>
  `);
});

// route audit (endpoint untuk frontend)
app.get("/audit", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();

    res.send(`
      <h2>✅ AISG-PRO Backend Connected</h2>
      <p>Server is Live & Database Connected Successfully.</p>
    `);
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).send("Internal Server Error: Database Connection Failed");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
