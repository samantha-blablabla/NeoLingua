
import { GoogleGenAI, Type } from "@google/genai";
import { LessonData } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là Master English Tutor cho NeoLingua. 
Nhiệm vụ của bạn là soạn thảo nội dung bài học chất lượng cao theo phong cách Modern Urban.
- Ngôn ngữ giải thích: Tiếng Việt.
- Topic: Thực tế, đô thị, công nghệ, phong cách sống hiện đại.
- Podcast: Chia nhỏ nội dung podcast thành các câu ngắn (segments), mỗi câu gồm bản gốc tiếng Anh (en) và bản dịch tiếng Việt (vi) sát nghĩa nhưng tự nhiên.
- Cấu trúc: Nghiêm ngặt theo JSON schema được cung cấp.
- Đảm bảo từ vựng có phiên âm chuẩn IPA.
- Cung cấp một ví dụ minh họa bằng tiếng Việt (grammar_example_vi) cho phần điểm ngữ pháp.
`;

export const generateLesson = async (week: number, day: string): Promise<LessonData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hãy soạn giáo án tiếng Anh cho Tuần ${week}, Ngày ${day}. Chủ đề phải xoay quanh văn hóa đô thị hiện đại hoặc công nghệ.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.INTEGER },
          day: { type: Type.STRING },
          topic: { type: Type.STRING },
          vocab_set: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                pronunciation: { type: Type.STRING },
                meaning: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["word", "pronunciation", "meaning", "example"]
            }
          },
          grammar_focus: { type: Type.STRING },
          grammar_example_vi: { type: Type.STRING },
          podcast_segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                vi: { type: Type.STRING }
              },
              required: ["en", "vi"]
            }
          },
          interactive_challenge: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correct_answer: { type: Type.STRING }
            },
            required: ["type", "question", "correct_answer"]
          }
        },
        required: ["week", "day", "topic", "vocab_set", "grammar_focus", "grammar_example_vi", "podcast_segments", "interactive_challenge"]
      }
    }
  });

  let text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  // Làm sạch text nếu model trả về markdown blocks
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  try {
    return JSON.parse(text) as LessonData;
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("Invalid AI response format");
  }
};
