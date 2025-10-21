const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) return res.status(400).json({ error: "Message required" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OpenAI API key" });

    // Using native fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are LOAI, a helpful AI assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("OpenAI response error:", data);
      return res.json({ reply: "Error: no response from OpenAI" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Server error:", err);
    res.json({ reply: `Server error: ${err.message}` });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LOAI AI running on port ${port}`));
