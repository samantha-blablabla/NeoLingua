
import { LessonData } from './types';

export const lessonsData: LessonData[] = [
  {
    id: "lvl1-urban-basics",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Vibe", "#Cafe"],
    topic: "The Third Place: Ordering with Confidence",
    urban_logic: {
      en: "In modern cities, coffee shops aren't just for drinking coffee; they are the 'Third Place'. Ordering fast, accurately, and with specific preferences shows you are a savvy urbanite who knows exactly what they want.",
      vi: "Tại các thành phố hiện đại, quán cà phê không chỉ là nơi uống nước mà là 'Không gian thứ ba'. Cách bạn gọi món nhanh, gọn, đúng ý thể hiện bạn là một người đô thị sành sỏi, biết mình muốn gì."
    },
    warmup: {
      intro: "Làm chủ 'Vibe' tại các quầy Specialty Coffee.",
      keywords: ["Barista", "Custom order", "House blend", "Draft"]
    },
    grammar_focus: {
      point: "Cấu trúc 'Can I get...' vs 'I want...'",
      vi_explain: "Trong môi trường dịch vụ nhanh, 'Can I get...' nghe lịch sự nhưng vẫn rất 'cool' và tự nhiên hơn 'I want...'.",
      example: "Can I get a double-shot espresso to go?"
    },
    podcast_segments: [
      { en: "Hey, what's good today?", vi: "Chào bạn, hôm nay có món gì xịn không?", emotion: "friendly", ambient_sound: "grinding_coffee_beans" },
      { en: "Our house blend is amazing. Highly recommend the cold brew on draft.", vi: "Hạt cà phê đặc trưng hôm nay rất ngon. Cực kỳ gợi ý bạn dùng cà phê ủ lạnh rót từ vòi.", emotion: "professional", ambient_sound: "pouring_liquid" },
      { en: "Sweet! I'll go with that. Oat milk, no sugar.", vi: "Tuyệt! Cho mình món đó nhé. Sữa yến mạch, không đường.", emotion: "energetic" }
    ],
    vocab_spotlight: [
      { 
        id: "v1-1", 
        word: "House blend", 
        pronunciation: "/haʊs blend/", 
        meaning: "Hạt cà phê đặc trưng của quán.", 
        example: "The house blend here has a nutty aftertaste.",
        nuance_vi: "Mỗi quán cà phê 'nghệ' thường tự phối trộn hạt theo công thức riêng. Gọi món này cho thấy bạn quan tâm đến chất lượng cà phê của quán."
      },
      { 
        id: "v1-2", 
        word: "Draft", 
        pronunciation: "/dræft/", 
        meaning: "Đồ uống được rót từ vòi (giống bia hơi).", 
        example: "I love their nitro cold brew on draft.",
        nuance_vi: "Hiện nay nhiều quán cà phê hiện đại dùng hệ thống vòi rót để giữ vị tươi mát và tạo lớp bọt mịn."
      }
    ],
    daily_challenge: {
      question: "Barista hỏi: 'How do you like your coffee?', bạn muốn nói 'Cho mình ít sữa yến mạch', câu nào chuẩn nhất?",
      options: ["With some oat milk, please.", "I want milk from oats.", "Put white water inside.", "Give me oat milk."],
      correct_answer: "With some oat milk, please.",
      urban_context: "Bạn đang đứng ở một quầy order rất đông khách tại Quận 1.",
      explanation_vi: "Cụm 'With [something], please' là cách ngắn gọn và chuyên nghiệp nhất để yêu cầu tùy chỉnh (customize) đồ uống của bạn."
    },
    real_world_mission: {
      task: "Be a Critic",
      platform: "IRL",
      description: "Đến một quán cà phê, chụp ảnh ly nước và đăng Story với caption: 'Trying the house blend today. Intense vibes!'"
    }
  }
];
