
import { GoogleGenAI, Type } from "@google/genai";
import { LessonData } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là AI Architect cho NeoLingua. 
Nhiệm vụ: Soạn giáo án tiếng Anh đô thị 4-Sprint theo Roadmap 8 cấp độ.
- Cấp độ: 1-2 (Newbie), 3-4 (Street Smart), 5-6 (Hustler), 7-8 (Legend).
- Podcast: Thêm trường 'emotion' cho mỗi segment để hướng dẫn giọng đọc (ví dụ: 'energetic', 'calm', 'professional').
- Mission: 'real_world_mission' phải cực kỳ thực tế (ví dụ: Viết bio Tinder, gửi tin nhắn Slack cho sếp, v.v.).
- Ngôn ngữ: Giải thích bằng tiếng Việt, nội dung học tiếng Anh.
`;

export const generateLesson = async (level: number): Promise<LessonData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hãy soạn 01 bài học ngẫu nhiên cho Cấp độ ${level}.`,
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
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          warmup: {
            type: Type.OBJECT,
            properties: {
              intro: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          podcast_segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                vi: { type: Type.STRING },
                emotion: { type: Type.STRING }
              }
            }
          },
          vocab_spotlight: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING }, // Added to match VocabularyItem interface
                word: { type: Type.STRING },
                pronunciation: { type: Type.STRING }, // Added to match VocabularyItem interface
                meaning: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ["id", "word", "pronunciation", "meaning", "example"]
            }
          },
          daily_challenge: {
             type: Type.OBJECT,
             properties: {
               question: { type: Type.STRING },
               options: { type: Type.ARRAY, items: { type: Type.STRING } },
               correct_answer: { type: Type.STRING },
               urban_context: { type: Type.STRING }
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
