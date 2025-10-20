export default async function handler(req, res) {
  try {
    const prompt = req.query.prompt || "Hello from LOAI!";
    res.status(200).json({
      success: true,
      message: "LOAI AI API working fine ✅",
      prompt: prompt
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
