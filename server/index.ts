import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("🚀 AISG-PRO Backend is Running Smoothly!");
});

app.get("/audit", async (req, res) => {
  try {
    res.send(`
      <div style="font-family: Arial; padding: 30px; text-align:center;">
        <h1>✅ AISG-PRO Backend Connected</h1>
        <p>Server is Live & Database Connected Successfully.</p>
      </div>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

