import express from "express";
import session from "express-session";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// 🧠 PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
  "postgresql://sg_db_e74u_user:Xfk27js9LPv1Ud1YkwhxI3kfYkO7Y3iu@dpg-d40gfpuuk2gs73a3af70-a/sg_db_e74u",
  ssl: { rejectUnauthorized: false },
});

// 🧩 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "aisg_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// 🟢 Connect to DB
pool.connect()
  .then(() => console.log("🟢 Database connected"))
  .catch((err) => console.error("🔴 Database error:", err));

// 🧩 Dummy user list
const USERS = [
  { username: "admin", password: "aisg123", role: "admin" },
  { username: "viewer", password: "viewonly", role: "viewer" },
];

// 🧩 Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  req.session.user = user;
  res.json({ message: "Login successful", role: user.role });
});

// 🧩 Logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

// 🧩 Middleware: Check login
function requireLogin(req, res, next) {
  if (!req.session.user)
    return res.status(403).json({ error: "Unauthorized" });
  next();
}

// 🧩 Middleware: Admin only
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin")
    return res.status(403).json({ error: "Admin access only" });
  next();
}

// 📊 Routes
app.get("/audit", requireLogin, async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, role, score, status FROM audits ORDER BY id DESC LIMIT 50;"
  );
  res.json(result.rows);
});

app.post("/audit", requireAdmin, async (req, res) => {
  const { name, role, score, status } = req.body;
  await pool.query(
    "INSERT INTO audits (name, role, score, status) VALUES ($1, $2, $3, $4)",
    [name, role, score, status]
  );
  const now = new Date().toISOString();
  await pool.query("INSERT INTO logs (time, message) VALUES ($1, $2)", [
    now,
    `New audit added by ${req.session.user.username}`,
  ]);
  res.json({ success: true });
});

app.get("/logs", requireLogin, async (req, res) => {
  const result = await pool.query(
    "SELECT id, time, message FROM logs ORDER BY id DESC LIMIT 20;"
  );
  res.json(result.rows);
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on port ${PORT}`)
);
