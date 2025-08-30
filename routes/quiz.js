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

router.post("/create-quiz", async (req, res) => {
  try {
    const category = req?.body?.category || "Working Professional -> IT -> Software Developer";
    const subjects = req?.body?.subjects || "Python";
    const language = req?.body?.language || "English";
    const batchSize = parseInt(req?.body?.batchSize) || 5;
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a **highly skilled and precise quiz generator** that **natively understands ${language}**.
        ✅ Generate a quiz questions **directly in ${language}** using correct terminology and natural phrasing.
        ✅ All questions must be **unique, non-repetitive, and relevant to the given category and subjects**.
        ✅ Ensure **incorrect options** are plausible, closely related to the subject, and reflect common misconceptions.
        ✅ For programming questions:
            - Include 50% coding-output-related questions with **valid, runnable code snippets**.
            - Include a code snippet in the "code" field.
            - Example: "const x = 5; console.log(x);"
        🚨 **IMPORTANT RULES:**
        1. **Every question must have exactly four options.**
        2. The correct answer must always be **one of the four options provided**.
        3. Ensure there are **exactly ${batchSize} questions**, with no omissions or interruptions.
        4. Verify correctness, structure, and formatting of all outputs before finalizing the response.
        5. Adhere strictly to the JSON format provided below—no additional text, comments, or metadata.
        6. Double-check to ensure **all ${batchSize} questions are unique and accurate.**
        🚨 **CRITICAL RULE:**
            - Generate exactly ${batchSize} questions—no more, no less.
            - Stop generating after ${batchSize} questions.
        --
        **STRICT JSON FORMAT (NO EXTRA TEXT, ONLY VALID JSON ARRAY):**
                 [
                     {
                         "question": "सवाल (Meaningful question in ${language})",
                         "options": ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"],
                         "correct_answer": "सही विकल्प (From given options only)",
                         "subject": ${subjects},
                         "code": "const x = 5; console.log(x);"
                     },
                     {
                         "question": "प्रश्न (Meaningful question in ${language})",
                         "options": ["पर्याय A", "पर्याय B", "पर्याय C", "पर्याय D"],
                         "correct_answer": "योग्य पर्याय (From given options only)",
                         "subject": ${subjects},
                         "code": "const x = 5; console.log(x);"
                     }
                 ]
                ❌ **No explanations, no extra text—only return a valid JSON array!**`,
        },
        {
          role: "user",
          content: `Generate ${batchSize} **unique** quiz questions for:
                - **Category**: ${category}
                - **Subjects**: ${subjects}
                - **Language**: ${language}
                - **Ensure correct answers always match one of the provided options!**
                - **Include 50% coding questions for programming topics.**
                🚨 **CRITICAL INSTRUCTIONS**: Generate exactly ${batchSize} questions. Do not stop or truncate the response until all ${batchSize} questions are complete.
                - 🚨 Stop generating after ${batchSize} questions. Do not add extra questions.`,
        }
      ],
      max_completion_tokens: 512,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: process.env.AZURE_OPENAI_MODEL,
    });

    let contentBatch1 = response.choices[0].message.content.trim();
    contentBatch1 = contentBatch1
      .replace(/^```json\n?/g, "")
      .replace(/\n?```$/g, "")
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      .trim();
    res.json(
       JSON.parse(contentBatch1))
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
