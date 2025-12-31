
import { GoogleGenAI, Type } from "@google/genai";
import { LessonData } from "../types";

export const generateLesson = async (): Promise<LessonData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Tạo một bài học tiếng Anh ngắn ngẫu nhiên cho người dùng Việt Nam. Bao gồm 1 từ vựng cao cấp, phiên âm, định nghĩa tiếng Việt, 1 ví dụ thực tế và 1 thử thách nhỏ để luyện tập.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vocabulary: { type: Type.STRING },
          pronunciation: { type: Type.STRING },
          definition: { type: Type.STRING },
          example: { type: Type.STRING },
          challenge: { type: Type.STRING },
        },
        required: ["vocabulary", "pronunciation", "definition", "example", "challenge"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as LessonData;
};
