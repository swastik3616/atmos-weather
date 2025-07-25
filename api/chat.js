import fetch from 'node-fetch';

export default async function handler(req, res) {
  console.log("Incoming request body:", req.body); // LOG the request

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  console.log("Messages:", messages); // LOG messages

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  console.log("OPENAI_API_KEY present?", !!OPENAI_API_KEY); // LOG key presence

  if (!messages) {
    return res.status(400).json({ error: "No messages provided" });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key not set" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages
      })
    });

    const data = await openaiRes.json();
    console.log("OpenAI API raw response:", data); // LOG raw response

    if (!openaiRes.ok) {
      console.error("OpenAI API error:", data);
      return res.status(500).json({ error: data.error?.message || "OpenAI API error" });
    }

    const reply = data.choices?.[0]?.message?.content || "No response from OpenAI.";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Error contacting OpenAI:", err); // LOG catch error
    return res.status(500).json({ error: "Error contacting OpenAI" });
  }
}
