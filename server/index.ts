import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "✅ AiSG Backend Active", time: new Date().toISOString() });
});

// 🧠 DUMMY DATA — AiSG Audit Summary
const dummyAudits = [
  { id: 1, name: "Ernest Firman", role: "BM Cirebon", score: 87, status: "✅ Passed" },
  { id: 2, name: "Lisa Usfie", role: "CBO Jakarta", score: 91, status: "✅ Passed" },
  { id: 3, name: "Marvy Breemer", role: "RnD PM SGB Mini", score: 84, status: "⚠️ Coaching" },
  { id: 4, name: "Sumarlin Sidabutar", role: "MDP Trainer", score: 78, status: "⚠️ Re-Audit" },
  { id: 5, name: "Dessy Syafitrie", role: "Social Media", score: 89, status: "✅ Passed" },
];

// 🧩 Endpoint: /audit
app.get("/audit", (req, res) => {
  res.json(dummyAudits);
});

// 📋 DUMMY LOGS — for Reports Feed
const dummyLogs = [
  { time: "22:10", message: "Audit completed for Ernest Firman" },
  { time: "22:05", message: "New data synced from BD Cirebon" },
  { time: "21:58", message: "Performance report generated for SEM Manado" },
  { time: "21:40", message: "New user registered: Cahyo Purnomo" },
  { time: "21:20", message: "Backend health check OK" },
];

// 🧩 Endpoint: /logs
app.get("/logs", (req, res) => {
  res.json(dummyLogs);
});

// ✅ Run server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} and bound to 0.0.0.0`);
});
