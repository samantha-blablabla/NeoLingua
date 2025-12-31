
import { GoogleGenAI, Type } from "@google/genai";
import { LessonData } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là "Head of Curriculum" (Trưởng bộ phận học thuật) tại NeoLingua. 
Nhiệm vụ: Soạn giáo án tiếng Anh Đô Thị "Elite & Modern" (Song ngữ Anh-Việt).

PHƯƠNG PHÁP GIẢNG DẠY:
1. KHÔNG DÙNG TIẾNG ANH SGK: Ưu tiên Slang, Phrasal Verbs, và Urban Idioms.
2. URBAN LOGIC: Phải giải thích được "văn hóa ngầm" bằng cả tiếng Anh và tiếng Việt.
3. BILINGUAL DEPTH: Phần tiếng Việt phải "bắt trend", tự nhiên như cách Gen Z và Freelancer chuyên nghiệp nói chuyện.
4. PODCAST: Mô tả âm thanh môi trường (ambient_sound) để tạo không gian học tập sống động.
5. CHALLENGE: Phải là các tình huống thực tế, có phần giải thích (explanation_vi) tại sao câu trả lời đó lại "đúng vibe".

CẤU TRÚC JSON PHẢI CHÍNH XÁC THEO SCHEMA.
`;

export const generateLesson = async (level: number): Promise<LessonData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Soạn một giáo án siêu cấp "Urban 2.0" cho Level ${level}. Phần urban_logic phải có cả tiếng Anh (chuyên nghiệp) và tiếng Việt (tự nhiên).`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          level: { type: Type.NUMBER },
          roadmapStage: { type: Type.STRING },
          topic: { type: Type.STRING },
          urban_logic: { 
            type: Type.OBJECT,
            properties: {
              en: { type: Type.STRING },
              vi: { type: Type.STRING }
            }
          },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          warmup: {
            type: Type.OBJECT,
            properties: {
              intro: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          grammar_focus: {
            type: Type.OBJECT,
            properties: {
              point: { type: Type.STRING },
              vi_explain: { type: Type.STRING },
              example: { type: Type.STRING }
            }
          },
          podcast_segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                vi: { type: Type.STRING },
                emotion: { type: Type.STRING },
                ambient_sound: { type: Type.STRING }
              }
            }
          },
          vocab_spotlight: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                word: { type: Type.STRING },
                pronunciation: { type: Type.STRING },
                meaning: { type: Type.STRING },
                example: { type: Type.STRING },
                nuance_vi: { type: Type.STRING }
              }
            }
          },
          daily_challenge: {
             type: Type.OBJECT,
             properties: {
               question: { type: Type.STRING },
               options: { type: Type.ARRAY, items: { type: Type.STRING } },
               correct_answer: { type: Type.STRING },
               urban_context: { type: Type.STRING },
               explanation_vi: { type: Type.STRING }
             }
          },
          real_world_mission: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              platform: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text) as LessonData;
};
