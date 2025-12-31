
import { LessonData } from './types';

export const lessonsData: LessonData[] = [
  {
    id: "lvl1-1",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Cafe", "#Survival"],
    topic: "Cafe Ordering 101",
    warmup: {
      intro: "Học cách gọi món tại các quán Specialty Coffee hiện đại.",
      keywords: ["Espresso", "Latte", "Takeaway"]
    },
    podcast_segments: [
      { en: "I'd like a large latte to go, please.", vi: "Cho tôi một ly latte lớn mang đi.", emotion: "polite" },
      { en: "Sure! Would you like any sugar or oat milk in that?", vi: "Chắc chắn rồi! Bạn có muốn thêm đường hay sữa yến mạch không?", emotion: "cheerful" },
      { en: "No, just black coffee for me. Thanks!", vi: "Không, cho tôi cà phê đen thôi. Cảm ơn!", emotion: "energetic" }
    ],
    vocab_spotlight: [
      { id: "v1-1", word: "Takeaway", pronunciation: "/ˈteɪk.ə.weɪ/", meaning: "Đồ mang đi (không dùng tại quán).", example: "One Americano takeaway, please." },
      { id: "v1-2", word: "Specialty", pronunciation: "/ˈspeʃ.əl.ti/", meaning: "Đặc sản/Cao cấp (thường dùng cho cà phê chất lượng cao).", example: "I love this specialty coffee shop." }
    ],
    daily_challenge: {
      question: "Bạn dùng từ nào khi muốn mang đồ uống đi?",
      options: ["Stay", "Takeaway", "Here", "Inside"],
      correct_answer: "Takeaway",
      urban_context: "Bạn đang ở một quán Starbucks rất đông đúc tại trung tâm."
    },
    real_world_mission: {
      task: "Post a Cafe Story",
      platform: "IRL",
      description: "Hãy chụp một ly cà phê và chú thích bằng tiếng Anh: 'My daily caffeine fix. #UrbanLife'"
    }
  },
  {
    id: "lvl1-2",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Streets", "#Survival"],
    topic: "Asking for Directions",
    warmup: {
      intro: "Đừng để bị lạc giữa thành phố lớn. Hãy học cách hỏi đường như dân bản địa.",
      keywords: ["Intersection", "Straight", "Turn left"]
    },
    podcast_segments: [
      { en: "Excuse me, how do I get to the nearest metro station?", vi: "Xin lỗi, làm sao để tôi đến được ga tàu điện ngầm gần nhất?", emotion: "inquisitive" },
      { en: "Go straight for two blocks, then turn left at the intersection.", vi: "Đi thẳng hai dãy nhà, sau đó rẽ trái ở ngã tư.", emotion: "helpful" }
    ],
    vocab_spotlight: [
      { id: "v2-1", word: "Intersection", pronunciation: "/ˌɪn.təˈsek.ʃən/", meaning: "Ngã tư, điểm giao cắt giữa các con đường.", example: "Wait for me at the intersection." },
      { id: "v2-2", word: "Block", pronunciation: "/blɒk/", meaning: "Dãy nhà/Phố (khoảng cách giữa 2 ngã tư).", example: "The gym is just one block away." }
    ],
    daily_challenge: {
      question: "Giao điểm của hai con đường gọi là gì?",
      options: ["Road", "Intersection", "Bridge", "Park"],
      correct_answer: "Intersection",
      urban_context: "Bạn đang đứng giữa một ngã tư sầm uất và muốn hỏi đường."
    },
    real_world_mission: {
      task: "Google Maps Check",
      platform: "IRL",
      description: "Mở Google Maps, chuyển sang tiếng Anh. Tìm cụm từ 'Directions' và 'Start'."
    }
  },
  {
    id: "lvl1-3",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Work", "#Networking"],
    topic: "Coworking Space Basics",
    warmup: {
      intro: "Học cách giao tiếp cơ bản tại các không gian làm việc chung (Coworking Spaces).",
      keywords: ["Workspace", "Hot-desk", "Plug-in"]
    },
    podcast_segments: [
      { en: "Is this hot-desk available for the afternoon?", vi: "Chỗ ngồi linh hoạt này có trống vào buổi chiều không?", emotion: "polite" },
      { en: "Yes, just plug in and you're good to go!", vi: "Có chứ, cứ cắm điện vào là bạn có thể bắt đầu rồi!", emotion: "friendly" }
    ],
    vocab_spotlight: [
      { id: "v3-1", word: "Hot-desk", pronunciation: "/hɒt desk/", meaning: "Chỗ ngồi không cố định, ai đến trước dùng trước.", example: "I booked a hot-desk for today." },
      { id: "v3-2", word: "Plug-in", pronunciation: "/plʌɡ ɪn/", meaning: "Cắm điện/Kết nối thiết bị.", example: "Where can I plug in my laptop?" }
    ],
    daily_challenge: {
      question: "Loại bàn làm việc không cố định gọi là gì?",
      options: ["Office", "Home", "Hot-desk", "Library"],
      correct_answer: "Hot-desk",
      urban_context: "Bạn vừa bước vào một không gian Coworking tại Quận 1."
    },
    real_world_mission: {
      task: "WiFi Connection",
      platform: "IRL",
      description: "Hỏi mật khẩu WiFi bằng tiếng Anh: 'Excuse me, could I have the WiFi password?'"
    }
  },
  {
    id: "lvl1-4",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Shopping", "#Lifestyle"],
    topic: "Modern Retail Therapy",
    warmup: {
      intro: "Giao tiếp tại các cửa hàng thời trang hoặc Concept Store.",
      keywords: ["Fitting room", "Size", "Discount"]
    },
    podcast_segments: [
      { en: "Do you have this jacket in a smaller size?", vi: "Bạn có chiếc áo khoác này size nhỏ hơn không?", emotion: "polite" },
      { en: "Let me check the stock. The fitting room is over there.", vi: "Để tôi kiểm tra kho. Phòng thử đồ ở đằng kia nhé.", emotion: "helpful" }
    ],
    vocab_spotlight: [
      { id: "v4-1", word: "Fitting room", pronunciation: "/ˈfɪt.ɪŋ ruːm/", meaning: "Phòng thử đồ.", example: "Is the fitting room occupied?" }
    ],
    daily_challenge: {
      question: "Bạn đi đâu để mặc thử quần áo?",
      options: ["Fitting room", "Stock", "Counter", "Window"],
      correct_answer: "Fitting room",
      urban_context: "Bạn đang ở một cửa hàng Uniqlo."
    },
    real_world_mission: {
      task: "Check Label",
      platform: "IRL",
      description: "Xem nhãn mác quần áo và tìm các từ: 'Cotton', 'Polyester', 'Made in'."
    }
  },
  {
    id: "lvl1-5",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Dining", "#Social"],
    topic: "Booking a Table",
    warmup: {
      intro: "Cách đặt bàn tại một nhà hàng Urban Bistro sành điệu.",
      keywords: ["Reservation", "Window seat", "Party of two"]
    },
    podcast_segments: [
      { en: "I'd like to make a reservation for a party of two.", vi: "Tôi muốn đặt bàn cho nhóm hai người.", emotion: "professional" },
      { en: "Of course. Would you prefer a window seat?", vi: "Tất nhiên rồi. Bạn có thích ngồi cạnh cửa sổ không?", emotion: "polite" }
    ],
    vocab_spotlight: [
      { id: "v5-1", word: "Reservation", pronunciation: "/ˌrez.əˈveɪ.ʃən/", meaning: "Sự đặt chỗ trước.", example: "Do you have a reservation?" }
    ],
    daily_challenge: {
      question: "Cụm từ nào dùng để chỉ 'nhóm 2 người'?",
      options: ["Two group", "Party of two", "Double people", "Pair of friend"],
      correct_answer: "Party of two",
      urban_context: "Bạn đang gọi điện cho một nhà hàng rooftop."
    },
    real_world_mission: {
      task: "Table Talk",
      platform: "IRL",
      description: "Hãy thử đặt bàn online qua ứng dụng (như TableCheck) và đọc các điều khoản tiếng Anh."
    }
  },
  {
    id: "lvl1-6",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Gym", "#Wellness"],
    topic: "Gym Etiquette",
    warmup: {
      intro: "Giao tiếp tại phòng Gym hoặc trung tâm Fitness.",
      keywords: ["Set", "Rep", "Equipment"]
    },
    podcast_segments: [
      { en: "How many sets do you have left on this machine?", vi: "Bạn còn mấy hiệp nữa với máy này?", emotion: "polite" },
      { en: "Just one more set. Do you want to work in?", vi: "Chỉ một hiệp nữa thôi. Bạn có muốn tập chung không?", emotion: "energetic" }
    ],
    vocab_spotlight: [
      { id: "v6-1", word: "Set", pronunciation: "/set/", meaning: "Hiệp (tập hợp các lần lặp lại).", example: "I do 3 sets of 12 reps." }
    ],
    daily_challenge: {
      question: "Câu hỏi nào lịch sự khi muốn dùng chung máy tập?",
      options: ["Is this mine?", "Can I work in?", "Are you done?", "Go away"],
      correct_answer: "Can I work in?",
      urban_context: "Phòng Gym đang giờ cao điểm."
    },
    real_world_mission: {
      task: "Workout Bio",
      platform: "IRL",
      description: "Viết trạng thái: 'Crushing my morning workout. 3 sets of hustle!'"
    }
  },
  {
    id: "lvl1-7",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Transport", "#Survival"],
    topic: "Using Ride-Hailing Apps",
    warmup: {
      intro: "Giao tiếp với tài xế Grab/Uber hoặc qua ứng dụng.",
      keywords: ["Pick-up", "Drop-off", "Route"]
    },
    podcast_segments: [
      { en: "I'm at the main entrance for pick-up.", vi: "Tôi đang ở cổng chính để chờ xe đón.", emotion: "direct" },
      { en: "Got it. I'll follow the GPS route.", vi: "Đã rõ. Tôi sẽ đi theo lộ trình GPS.", emotion: "calm" }
    ],
    vocab_spotlight: [
      { id: "v7-1", word: "Pick-up", pronunciation: "/ˈpɪk.ʌp/", meaning: "Điểm đón khách.", example: "The pick-up point is clear." }
    ],
    daily_challenge: {
      question: "Điểm mà bạn muốn xuống xe gọi là gì?",
      options: ["Drop-off", "Pick-up", "Stay", "Go"],
      correct_answer: "Drop-off",
      urban_context: "Bạn đang chat với tài xế Grab."
    },
    real_world_mission: {
      task: "Ride Rating",
      platform: "IRL",
      description: "Để lại đánh giá tiếng Anh cho tài xế: 'Great service and safe route. 5 stars!'"
    }
  },
  {
    id: "lvl1-8",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Emergency", "#Survival"],
    topic: "Pharmacy & Basic Health",
    warmup: {
      intro: "Mua thuốc cơ bản và mô tả triệu chứng sức khỏe.",
      keywords: ["Painkiller", "Prescription", "Dizzy"]
    },
    podcast_segments: [
      { en: "I feel a bit dizzy. Do you have any painkillers?", vi: "Tôi thấy hơi chóng mặt. Bạn có thuốc giảm đau không?", emotion: "tired" },
      { en: "This is over-the-counter medication. No prescription needed.", vi: "Đây là thuốc không kê đơn. Không cần đơn thuốc đâu.", emotion: "helpful" }
    ],
    vocab_spotlight: [
      { id: "v8-1", word: "Painkiller", pronunciation: "/ˈpeɪnˌkɪl.ər/", meaning: "Thuốc giảm đau.", example: "I need a strong painkiller." }
    ],
    daily_challenge: {
      question: "Thuốc có thể mua mà không cần đơn của bác sĩ gọi là gì?",
      options: ["Drug", "Candy", "Over-the-counter", "Sugar"],
      correct_answer: "Over-the-counter",
      urban_context: "Bạn đang ở hiệu thuốc Pharmacity."
    },
    real_world_mission: {
      task: "Check Expiry",
      platform: "IRL",
      description: "Kiểm tra hạn sử dụng thuốc và tìm cụm từ 'Expiry Date' hoặc 'EXP'."
    }
  },
  {
    id: "lvl1-9",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Social", "#Meeting"],
    topic: "Meeting New Friends",
    warmup: {
      intro: "Bắt chuyện và giới thiệu bản thân tại một sự kiện Social.",
      keywords: ["Expat", "Native", "Background"]
    },
    podcast_segments: [
      { en: "Hi, I'm Minh. What brings you to this meetup?", vi: "Chào, mình là Minh. Điều gì đưa bạn đến buổi gặp mặt này thế?", emotion: "friendly" },
      { en: "I'm an expat living here. I want to meet locals.", vi: "Mình là người nước ngoài đang sống ở đây. Mình muốn gặp người bản địa.", emotion: "energetic" }
    ],
    vocab_spotlight: [
      { id: "v9-1", word: "Expat", pronunciation: "/ekˈspæt/", meaning: "Người nước ngoài sinh sống và làm việc tại một quốc gia khác.", example: "The city has a large expat community." }
    ],
    daily_challenge: {
      question: "Từ nào chỉ người nước ngoài định cư tại thành phố của bạn?",
      options: ["Alien", "Expat", "Native", "Tourist"],
      correct_answer: "Expat",
      urban_context: "Bạn đang ở một buổi Networking Cafe."
    },
    real_world_mission: {
      task: "Intro Card",
      platform: "IRL",
      description: "Viết một mẩu giấy nhỏ: 'Hi, I'm [Tên]. Happy to connect!'"
    }
  },
  {
    id: "lvl1-10",
    level: 1,
    roadmapStage: "Urban Newbie",
    tags: ["#Review", "#LevelUp"],
    topic: "Level 1 Final Review",
    warmup: {
      intro: "Ôn tập lại toàn bộ kiến thức quan trọng của Level 1.",
      keywords: ["Milestone", "Progress", "Mastery"]
    },
    podcast_segments: [
      { en: "You've reached a major milestone today!", vi: "Bạn đã đạt được một cột mốc quan trọng vào hôm nay!", emotion: "energetic" },
      { en: "I'm ready for the next level of the urban path.", vi: "Tôi đã sẵn sàng cho cấp độ tiếp theo của lộ trình đô thị.", emotion: "confident" }
    ],
    vocab_spotlight: [
      { id: "v10-1", word: "Milestone", pronunciation: "/ˈmaɪl.stəʊn/", meaning: "Cột mốc quan trọng trong một hành trình.", example: "Finishing Level 1 is a great milestone." }
    ],
    daily_challenge: {
      question: "Từ nào có nghĩa là 'cột mốc quan trọng'?",
      options: ["Stone", "Milestone", "Road", "Finish"],
      correct_answer: "Milestone",
      urban_context: "Bạn đang nhìn lại hành trình học tập của mình."
    },
    real_world_mission: {
      task: "Celebrate!",
      platform: "IRL",
      description: "Tự thưởng cho mình một ly specialty coffee và khoe Badge Level 1 lên mạng xã hội!"
    }
  }
];
