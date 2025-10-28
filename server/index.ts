import express from "express";
import session from "express-session";
import pkg from "pg";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

// === Database Connection ===
const hasDatabase = !!process.env.DATABASE_URL;
const PgSession = connectPgSimple(session);
let pool: any = null;

if (hasDatabase) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    console.log("✅ Database pool initialized");
  } catch (err) {
    console.error("❌ Failed to initialize DB pool:", err);
  }
}

// === Session Setup ===
app.use(
  session({
    store: hasDatabase
      ? new PgSession({
          pool: pool!,
        })
      : undefined,
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// === Route utama ===
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Server Berhasil Jalan!</h1>
    <p>Database: ${hasDatabase ? "Connected ✅" : "Not Connected ⚠️"}</p>
  `);
});

// === Endpoint Audit (GET) ===
app.get("/audit", async (req, res) => {
  if (!pool) {
    return res.json({
      status: "warning",
      message: "Database belum aktif, tapi server siap.",
      waktu_server: new Date().toISOString(),
    });
  }

  try {
    const result = await pool.query("SELECT NOW() AS waktu_server");
    res.json({
      status: "success",
      message: "Data audit berhasil diambil",
      waktu_server: result.rows[0].waktu_server,
    });
  } catch (error) {
    console.error("❌ Query error:", error);
    res.json({
      status: "warning",
      message: "Database belum diisi atau query gagal, tapi server aktif.",
      waktu_server: new Date().toISOString(),
    });
  }
});

// === Endpoint Report (POST) ===
app.post("/report", async (req, res) => {
  const { nama, skor, catatan } = req.body;

  if (!nama || !skor) {
    return res.status(400).json({ error: "Nama dan skor wajib diisi" });
  }

  console.log("📥 Report diterima:", req.body);

  res.json({
    status: "success",
    message: `Report dari ${nama} diterima`,
    data: { nama, skor, catatan },
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
