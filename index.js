app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) return res.status(400).json({ error: "Message required" });

    // TEMPORARY MOCK RESPONSE for testing without OpenAI
    const mockReply = `LOAI says: I received your message -> "${message}"`;

    // Send it back like a real API
    return res.json({ reply: mockReply });

  } catch (err) {
    console.error("Server error:", err);
    res.json({ reply: `Server error: ${err.message}` });
  }
});
