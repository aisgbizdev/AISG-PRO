import express from "express";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ===============================
// 🧠 PostgreSQL Connection (Auto Reconnect)
// ===============================
const createPool = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Auto reconnect handler
  pool.on("error", (err) => {
    console.error("⚠️ Lost PostgreSQL connection. Retrying in 5s...", err.message);
    setTimeout(() => {
      console.log("🔁 Reconnecting to PostgreSQL...");
      globalThis.pool = createPool();
    }, 5000);
  });

  return pool;
};

const pool = createPool();

// ===============================
// ⚙️ Session Store
// ===============================
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      pool,
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "sg_secret_2025",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
  })
);

// ===============================
// ✅ Routes
// ===============================
app.get("/", async (req, res) => {
  res.send(`
    <h2>✅ AISG-PRO Backend Connected</h2>
    <p>Server is Live & Database Connected Successfully.</p>
  `);
});

// Database Health Check
app.get("/audit", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as server_time");
    res.send(`
      <h2>✅ AISG-PRO Backend Connected</h2>
      <p>Server is Live & Database Connected Successfully.</p>
      <p><b>Database Time:</b> ${result.rows[0].server_time}</p>
    `);
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

// New: Health Monitor Route
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ===============================
// 🚀 Start Server
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} and bound to 0.0.0.0`);
});

