import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// --- setup static folder ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// --- main chat endpoint ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OpenAI API key" });

    // send message to OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are LOAI, a helpful AI assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 600,
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    const reply = response.data.choices[0].message?.content || "No response";
    res.json({ reply });
  } catch (err) {
    console.error("Error from AI:", err.message);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

// --- serve chat UI ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 LOAI web AI running on port ${PORT}`));
