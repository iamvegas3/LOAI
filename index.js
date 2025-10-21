const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch"); // make sure node-fetch is in package.json

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  const message = req.body.message;
  if (!message) return res.status(400).json({ error: "Message required" });

  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const mockReply = `LOAI says: I received your message -> "${message}"`;

  // If no API key, return mock
  if (!HF_API_KEY) return res.json({ reply: mockReply });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();

    if (!data || data.error || !data[0]?.generated_text) {
      console.error("HF error, using mock:", data);
      return res.json({ reply: mockReply });
    }

    res.json({ reply: data[0].generated_text });

  } catch (err) {
    console.error("Server error, using mock:", err);
    res.json({ reply: mockReply });
  }
});

// Serve frontend index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LOAI AI (Hugging Face) running on port ${port}`));
