import axios from "axios";
import fs from "fs";
import config from "../../config";


export const commonAIFunction = async (filePath: string, commonPrompt:{text:string}) => {
  // Convert image → Base64
  const imageBase64 = fs.readFileSync(filePath, "base64");

  // Call Gemini OCR
  const response = await axios.post(config.gemini_ai_url as string, {
    contents: [
      {
        parts: [
          commonPrompt
          ,
          {
            inlineData: {
              mimeType: "image/png",
              data: imageBase64,
            },
          },
        ],
      },
    ],
  });

  // Extract model text output
  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  // Use regex to capture first valid JSON block
  const match = text.match(/\{[\s\S]*?\}/);
  const cleanJson = match ? match[0] : "{}";

  // Try parsing safely
  try {
    return JSON.parse(cleanJson);
  } catch {
    return {};
  }
};
