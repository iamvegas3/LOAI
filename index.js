import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body.message }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return res.status(500).json({ error: data.error.message });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LOAI AI running on port ${port}`));
