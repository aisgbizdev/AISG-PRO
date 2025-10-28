import express from "express";
import session from "express-session";
import pkg from "pg";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 10000;

// 🔓 Izinkan koneksi dari mana pun (React/Vite, StackBlitz, dll)
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));

// Cek apakah ada DATABASE_URL
const hasDatabase = !!process.env.DATABASE_URL;
const PgSession = connectPgSimple(session);

// Setup session
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

// Route utama
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Server Berhasil Jalan!</h1>
    <p>Database: ${hasDatabase ? "Connected ✅" : "Not Connected ⚠️"}</p>
  `);
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
