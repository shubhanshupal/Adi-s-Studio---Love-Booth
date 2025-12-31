import { GoogleGenAI } from "@google/genai";

// Helper to safely get the API key without crashing if process is undefined
const getClient = () => {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    return new GoogleGenAI({ apiKey });
}

export const generateRomanticMessage = async (): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Write a very short, cute, two-line romantic fortune or love note for a photo booth strip. It should be sweet, encouraging, and perfect for a girlfriend. Max 15 words.",
    });

    return response.text?.trim() || "You are my favorite notification.";
  } catch (error) {
    console.error("Error generating message:", error);
    return "Every moment with you is magic.";
  }
};

export const generateCheer = async (): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Write a short, 5-word sparkly cheer for a girl taking photos.",
        });
        return response.text?.trim() || "You look amazing!";
    } catch (e) {
        return "You look amazing!";
    }
}