const { AzureOpenAI } = require("openai");
require("dotenv").config();
const express = require("express");
const router = express.Router();

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  apiVersion: "2024-04-01-preview",
});
let lastResponse = "";

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Construct messages array for OpenAI API
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant in a conversation. Always continue from the last response: "${lastResponse}". 
If you provide code, always format it inside triple backticks dont include coding language name inside code block. (for example, \`\`\` ... \`\`\`).`,
        },
        { role: "user", content: message },
      ],
    });

    console.log("OpenAI Response:", response);
    // Extract the AI's reply (assuming OpenAI API format)
    const aiReply =
      response.choices && response.choices[0] && response.choices[0].message
        ? response.choices[0].message.content
        : null;

    let contentBatch1 = aiReply;
    contentBatch1 = contentBatch1
      .replace(/^```json\n?/g, "")
      .replace(/\n?```$/g, "")
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      .trim();
    lastResponse = contentBatch1;
    res.json(contentBatch1);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
