
import { GoogleGenAI, Type } from "@google/genai";
import { LessonData } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là Master English Tutor cho NeoLingua. 
Nhiệm vụ của bạn là soạn thảo nội dung bài học chất lượng cao theo phong cách Modern Urban.
- Ngôn ngữ giải thích: Tiếng Việt.
- Podcast: Chia nhỏ thành podcast_segments (en & vi).
- Cấu trúc: Nghiêm ngặt theo JSON schema.
- Topic: Đô thị, công nghệ, phong cách sống hiện đại.
`;

export const generateLesson = async (week: number, day: string): Promise<LessonData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Soạn giáo án tiếng Anh: Tuần ${week}, Ngày ${day}. Chủ đề đô thị/công nghệ.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
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
              }
            }
          },
          grammar_focus: { type: Type.STRING },
          podcast_segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                vi: { type: Type.STRING }
              }
            }
          },
          interactive_challenge: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correct_answer: { type: Type.STRING }
            }
          }
        },
        required: ["topic", "vocab_set", "grammar_focus", "podcast_segments"]
      }
    }
  });

  return JSON.parse(response.text.trim()) as LessonData;
};
