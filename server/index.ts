import express from "express";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// PostgreSQL Connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Session Store
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

// Root Route
app.get("/", async (req, res) => {
  res.send(`
    <h2>✅ AISG-PRO Backend Connected</h2>
    <p>Server is Live & Database Connected Successfully.</p>
  `);
});

// Audit Route (Database Check)
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

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
