const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend (optional if you have a public folder)
app.use(express.static(path.join(__dirname, "public")));

// MOCK AI ENDPOINT (temporary, always replies)
app.post("/api/chat", (req, res) => {
  const message = req.body.message;
  if (!message) return res.status(400).json({ error: "Message required" });

  const mockReply = `LOAI says: I received your message -> "${message}"`;
  res.json({ reply: mockReply });
});

// Serve frontend index.html if needed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LOAI AI (mock) running on port ${port}`));
