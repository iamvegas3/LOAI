export default async function handler(req, res) {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }],
      })
    });

    const data = await response.json();

    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "No reply" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
