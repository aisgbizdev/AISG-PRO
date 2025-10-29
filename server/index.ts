import express from "express";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// PostgreSQL Connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Session Store pakai PostgreSQL
const PgStore = connectPgSimple(session);

app.use(
  session({
    store: new PgStore({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
    },
  })
);

app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Server Berhasil Jalan!</h1>
    <p>Database: Connected</p>
  `);
});

app.get("/audit", async (req, res) => {
  try {
    res.send(`
      <h2>✅ AISG-PRO Backend Connected</h2>
      <p>Server is Live & Database Connected Successfully.</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Internal Server Error: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
