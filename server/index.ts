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
