
import { GoogleGenAI, Type } from "@google/genai";
import { LessonData } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là Master English Tutor cho NeoLingua. 
Nhiệm vụ của bạn là soạn thảo nội dung bài học chất lượng cao theo phong cách Modern Urban.
- Ngôn ngữ giải thích: Tiếng Việt.
- Topic: Thực tế, đô thị, công nghệ.
- Cấu trúc: Nghiêm ngặt theo JSON schema.
- Đối tượng: Người đi làm, sinh viên hiện đại tại Việt Nam.
- Thứ 2 & 4: Kiến thức mới. Thứ 6: Kiểm tra tổng hợp.
`;

export const generateLesson = async (week: number, day: string): Promise<LessonData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Soạn giáo án cho Tuần ${week}, Ngày ${day}. 
    Nếu là Thứ 2: "Urban Kickstart - Mastering the First Impression" tại Meetup công nghệ.
    Nếu là Thứ 4: Order cafe qua app/thanh toán không tiền mặt.
    Nếu là Thứ 6: Bài kiểm tra tổng hợp.`,
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
              },
              required: ["word", "pronunciation", "meaning", "example"]
            }
          },
          grammar_focus: { type: Type.STRING },
          podcast_content: { type: Type.STRING },
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
        required: ["week", "day", "topic", "vocab_set", "grammar_focus", "podcast_content", "interactive_challenge"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as LessonData;
};
