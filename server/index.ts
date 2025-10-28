import express from "express";
import session from "express-session";
import { Pool } from "pg";
import connectPgSimple from "connect-pg-simple";

const app = express();
const PORT = process.env.PORT || 10000;

// === Database check ===
const hasDatabase = !!process.env.DATABASE_URL;
const PgSession = connectPgSimple(session);

// === Session setup ===
app.use(
  session({
    store: hasDatabase
      ? new PgSession({
          pool: new Pool({ connectionString: process.env.DATABASE_URL }),
        })
      : undefined,
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// === Routes ===
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Server Berhasil Jalan!</h1>
    <p>Database: ${hasDatabase ? "Connected ✅" : "Not Connected ⚠️"}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
