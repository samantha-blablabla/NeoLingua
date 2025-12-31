
import { LessonData } from './types';

export const lessonsData: LessonData[] = [
  {
    "week": 1,
    "day": "Monday",
    "topic": "Urban Kickstart - Mastering the First Impression",
    "vocab_set": [
      {
        "word": "Elevator Pitch",
        "pronunciation": "/ˈeləveɪtər pɪtʃ/",
        "meaning": "Lời giới thiệu ngắn gọn, súc tích về bản thân hoặc ý tưởng.",
        "example": "I prepared a 30-second elevator pitch for the tech meetup."
      },
      {
        "word": "Network",
        "pronunciation": "/ˈnetwɜːrk/",
        "meaning": "Xây dựng mối quan hệ chuyên môn.",
        "example": "Events like this are great to network with industry leaders."
      },
      {
        "word": "Icebreaker",
        "pronunciation": "/ˈaɪsbreɪkər/",
        "meaning": "Câu nói hoặc hoạt động để phá tan bầu không khí ngượng ngùng.",
        "example": "Asking about their favorite tech stack is a good icebreaker."
      },
      {
        "word": "Insightful",
        "pronunciation": "/ˈɪnsaɪtfʊl/",
        "meaning": "Sâu sắc, có nhiều thông tin hữu ích.",
        "example": "That was an insightful presentation about AI."
      },
      {
        "word": "Follow-up",
        "pronunciation": "/ˈfɑːloʊ ʌp/",
        "meaning": "Hành động liên lạc lại sau buổi gặp mặt.",
        "example": "Don't forget to send a follow-up email after the meetup."
      }
    ],
    "grammar_focus": "Present Perfect vs Past Simple: Dùng Past Simple cho thời điểm cụ thể, Present Perfect cho trải nghiệm không rõ thời điểm.",
    /* Fix: Replaced podcast_content string with podcast_segments array to match LessonData interface */
    "podcast_segments": [
      {
        "en": "Hey everyone! Welcome to the Urban Tech Meetup.",
        "vi": "Chào mọi người! Chào mừng bạn đến với Urban Tech Meetup."
      },
      {
        "en": "It's so crowded here!",
        "vi": "Ở đây đông đúc quá!"
      },
      {
        "en": "I've just met some amazing developers from NeoLingua.",
        "vi": "Mình vừa gặp một vài lập trình viên tuyệt vời từ NeoLingua."
      },
      {
        "en": "I shared my elevator pitch and they seemed really impressed.",
        "vi": "Mình đã chia sẻ bài giới thiệu ngắn của mình và họ có vẻ rất ấn tượng."
      },
      {
        "en": "One of the speakers gave a very insightful talk on neural networks.",
        "vi": "Một trong những diễn giả đã có một bài nói chuyện rất sâu sắc về mạng nơ-ron."
      },
      {
        "en": "I'm definitely going to follow up with her on LinkedIn tomorrow.",
        "vi": "Mình chắc chắn sẽ liên lạc lại với cô ấy trên LinkedIn vào ngày mai."
      },
      {
        "en": "Networking in the city can be tiring, but it's worth it for the connections you make.",
        "vi": "Xây dựng mạng lưới quan hệ trong thành phố có thể mệt mỏi, nhưng nó xứng đáng với những kết nối bạn tạo ra."
      }
    ],
    "interactive_challenge": {
      "type": "quiz",
      "question": "Which word describes a short summary of yourself used at a meeting?",
      "options": ["Elevator Pitch", "Podcast", "Network", "Icebreaker"],
      "correct_answer": "Elevator Pitch"
    }
  }
];
