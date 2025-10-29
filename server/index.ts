// 🧩 Coaching data
app.get("/coaching", requireLogin, async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, date, topic, result, impact FROM coaching ORDER BY date DESC LIMIT 50;"
  );
  res.json(result.rows);
});

app.post("/coaching", requireAdmin, async (req, res) => {
  const { name, date, topic, result, impact } = req.body;
  await pool.query(
    "INSERT INTO coaching (name, date, topic, result, impact) VALUES ($1, $2, $3, $4, $5)",
    [name, date, topic, result, impact]
  );
  res.json({ success: true });
});
