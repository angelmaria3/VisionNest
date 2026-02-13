import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `
Create a practical step-by-step checklist to achieve this goal.

Goal: ${title}
Context: ${description}

Return ONLY a numbered list.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // Free model
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const text = data.choices[0].message.content;

    const tasks = text
      .split("\n")
      .filter((t) => t.trim() !== "")
      .map((t) => t.replace(/^\d+\.?\s*/, ""));

    res.json({ tasks });

  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
