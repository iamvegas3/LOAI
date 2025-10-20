import 'dotenv/config';
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "MISTRAL_API_KEY missing!" });
    }

    const prompt = req.query.q || "Hello, who are you?";

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: "Mistral API error", details: data });
    }

    const answer = data.choices?.[0]?.message?.content || "No reply 😢";
    res.status(200).json({ reply: answer });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
