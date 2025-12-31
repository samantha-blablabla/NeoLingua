
import { GoogleGenAI, Type } from "@google/genai";
import { LessonData } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là Master English Tutor cho NeoLingua. 
Nhiệm vụ của bạn là soạn thảo nội dung bài học chất lượng cao theo phong cách Modern Urban.
- Ngôn ngữ giải thích: Tiếng Việt.
- Topic: Thực tế, đô thị, công nghệ.
- Podcast: Chia nhỏ nội dung podcast thành các câu ngắn (segments), mỗi câu gồm bản gốc tiếng Anh (en) và bản dịch tiếng Việt (vi) sát nghĩa nhưng tự nhiên.
- Cấu trúc: Nghiêm ngặt theo JSON schema.
`;

export const generateLesson = async (week: number, day: string): Promise<LessonData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Soạn giáo án cho Tuần ${week}, Ngày ${day}. 
    Thứ 2: Urban Kickstart (Meetup công nghệ). 
    Thứ 4: Fintech & Cafe Culture. 
    Thứ 6: Review.`,
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
            }
          }
        },
        required: ["week", "day", "topic", "vocab_set", "grammar_focus", "podcast_segments", "interactive_challenge"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as LessonData;
};
