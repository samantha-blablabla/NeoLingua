/**
 * NeoLingua Curriculum Data Structure
 *
 * Defines the complete learning path from A1 to C2
 * Each lesson includes vocab, grammar, practice scenarios
 */

export interface VocabItem {
  word: string;
  pronunciation: string; // IPA format
  partOfSpeech: string; // (n), (v), (adj), etc.
  meaning: string; // Vietnamese
  exampleEN: string;
  exampleVI: string;
}

export interface GrammarPoint {
  title: string;
  explanationVi: string; // Vietnamese explanation
  examples: {
    en: string;
    vi: string;
  }[];
  quiz: {
    question: string;
    correctAnswer: string; // The answer text
    feedback: string;
  };
}

export interface PracticeScenario {
  scenarioId: string;
  title: string;
  description: string; // What this practice is about
  userRole: string; // Vietnamese: Your role in this scenario
  scenario: string; // Vietnamese: The scenario description
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedMinutes?: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  estimatedMinutes: number;

  // Content
  warmup: {
    type: 'text' | 'audio' | 'video';
    content: string;
    title: string;
  };

  vocabulary: VocabItem[];
  grammar: GrammarPoint;
  practice: PracticeScenario;

  // Review
  summary: string;
  homework: string;
  nextLessonId?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  lessons: Lesson[];
  estimatedWeeks: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  targetAudience: string[];
  estimatedMonths: number;
}

// ============================================
// SAMPLE LESSONS - Module A1
// ============================================

const lessonA1_1: Lesson = {
  id: 'a1-1',
  moduleId: 'module-a1',
  title: 'Greetings & Introductions',
  description: 'Learn how to greet people and introduce yourself in English',
  level: 'A1',
  estimatedMinutes: 25,

  warmup: {
    type: 'text',
    title: 'Meeting Someone New',
    content: `Imagine you're entering a coffee shop for the first time.
    A friendly barista greets you with a smile.
    How do you respond? Let's learn the basics of English greetings!`
  },

  vocabulary: [
    {
      word: 'hello',
      pronunciation: '/həˈloʊ/',
      partOfSpeech: '(interjection)',
      meaning: 'xin chào',
      exampleEN: 'Hello! How are you?',
      exampleVI: 'Xin chào! Bạn khỏe không?'
    },
    {
      word: 'hi',
      pronunciation: '/haɪ/',
      partOfSpeech: '(interjection)',
      meaning: 'chào (thân mật hơn)',
      exampleEN: 'Hi there! Nice to see you.',
      exampleVI: 'Chào bạn! Rất vui được gặp bạn.'
    },
    {
      word: 'name',
      pronunciation: '/neɪm/',
      partOfSpeech: '(n)',
      meaning: 'tên',
      exampleEN: "What's your name?",
      exampleVI: 'Tên bạn là gì?'
    },
    {
      word: 'nice',
      pronunciation: '/naɪs/',
      partOfSpeech: '(adj)',
      meaning: 'tốt, dễ chịu',
      exampleEN: 'Nice to meet you!',
      exampleVI: 'Rất vui được gặp bạn!'
    },
    {
      word: 'meet',
      pronunciation: '/miːt/',
      partOfSpeech: '(v)',
      meaning: 'gặp gỡ',
      exampleEN: "It's nice to meet you.",
      exampleVI: 'Rất vui được gặp bạn.'
    },
    {
      word: 'good morning',
      pronunciation: '/ɡʊd ˈmɔːrnɪŋ/',
      partOfSpeech: '(phrase)',
      meaning: 'chào buổi sáng',
      exampleEN: 'Good morning! How are you today?',
      exampleVI: 'Chào buổi sáng! Hôm nay bạn thế nào?'
    },
    {
      word: 'thanks',
      pronunciation: '/θæŋks/',
      partOfSpeech: '(interjection)',
      meaning: 'cảm ơn',
      exampleEN: "Thanks! I'm good.",
      exampleVI: 'Cảm ơn! Tôi ổn.'
    },
    {
      word: 'fine',
      pronunciation: '/faɪn/',
      partOfSpeech: '(adj)',
      meaning: 'ổn, khỏe',
      exampleEN: "I'm fine, thank you.",
      exampleVI: 'Tôi ổn, cảm ơn bạn.'
    }
  ],

  grammar: {
    title: 'Present Simple: To Be (I am, You are)',
    explanationVi: `
**Động từ "to be" (am/is/are)**

Trong tiếng Anh, chúng ta dùng "to be" để nói về bản thân và người khác:

- **I am** (Tôi là) - Viết tắt: **I'm**
- **You are** (Bạn là) - Viết tắt: **You're**
- **He/She is** (Anh ấy/Cô ấy là) - Viết tắt: **He's/She's**

**Ví dụ:**
- I am David. → I'm David.
- You are nice. → You're nice.
- She is from Vietnam. → She's from Vietnam.

**Lưu ý:** Người bản xứ thường dùng dạng viết tắt trong giao tiếp hàng ngày!
    `,
    examples: [
      {
        en: "I'm Sarah. Nice to meet you!",
        vi: "Tôi là Sarah. Rất vui được gặp bạn!"
      },
      {
        en: "You're very kind. Thank you!",
        vi: "Bạn rất tốt bụng. Cảm ơn!"
      },
      {
        en: "He's my friend from work.",
        vi: "Anh ấy là bạn tôi ở công ty."
      }
    ],
    quiz: {
      question: "How do you say 'Tôi là John' in English?",
      correctAnswer: "I am John",
      feedback: "Correct! We use 'I am' (or I'm) to introduce ourselves."
    }
  },

  practice: {
    scenarioId: 'practice-a1-1',
    title: 'Coffee Shop Greetings',
    description: 'Luyện tập chào hỏi và tự giới thiệu trong môi trường quán cà phê',
    userRole: 'Bạn là khách hàng bước vào quán cà phê',
    scenario: 'Bạn bước vào một quán cà phê ấm cúng. Nhân viên pha chế thân thiện chào bạn và bắt đầu trò chuyện.',
    difficulty: 'easy',
    estimatedMinutes: 10
  },

  summary: `
Today you learned:
✅ Basic greetings: Hello, Hi, Good morning
✅ How to introduce yourself: "I'm [name]"
✅ Polite phrases: Nice to meet you, Thanks
✅ Present simple with "to be" (am/are/is)
  `,

  homework: `
**Practice for tomorrow:**
1. Introduce yourself to 3 people in English
2. Practice all 8 vocabulary words with pronunciation
3. Review the grammar quiz
4. Try the Street Talk practice scenario again
  `,

  nextLessonId: 'a1-2'
};

const lessonA1_2: Lesson = {
  id: 'a1-2',
  moduleId: 'module-a1',
  title: 'Ordering Food & Drinks',
  description: 'Learn how to order food and drinks at restaurants and cafes',
  level: 'A1',
  estimatedMinutes: 25,

  warmup: {
    type: 'text',
    title: 'At the Coffee Shop',
    content: `You're at a coffee shop and want to order something.
    The menu looks great, but how do you order in English?
    Let's learn the essential phrases!`
  },

  vocabulary: [
    {
      word: 'coffee',
      pronunciation: '/ˈkɔːfi/',
      partOfSpeech: '(n)',
      meaning: 'cà phê',
      exampleEN: 'Can I get a coffee, please?',
      exampleVI: 'Cho tôi một ly cà phê được không?'
    },
    {
      word: 'latte',
      pronunciation: '/ˈlɑːteɪ/',
      partOfSpeech: '(n)',
      meaning: 'cà phê sữa',
      exampleEN: "I'll have a latte, please.",
      exampleVI: 'Cho tôi một ly cà phê sữa, làm ơn.'
    },
    {
      word: 'water',
      pronunciation: '/ˈwɔːtər/',
      partOfSpeech: '(n)',
      meaning: 'nước',
      exampleEN: 'Just water, thanks.',
      exampleVI: 'Chỉ cần nước thôi, cảm ơn.'
    },
    {
      word: 'please',
      pronunciation: '/pliːz/',
      partOfSpeech: '(adv)',
      meaning: 'làm ơn',
      exampleEN: 'Coffee, please.',
      exampleVI: 'Cà phê, làm ơn.'
    },
    {
      word: 'get',
      pronunciation: '/ɡet/',
      partOfSpeech: '(v)',
      meaning: 'lấy, có được',
      exampleEN: 'Can I get a menu?',
      exampleVI: 'Cho tôi xem thực đơn được không?'
    },
    {
      word: 'have',
      pronunciation: '/hæv/',
      partOfSpeech: '(v)',
      meaning: 'có, dùng (trong ngữ cảnh đặt món)',
      exampleEN: "I'll have the sandwich.",
      exampleVI: 'Tôi sẽ lấy bánh sandwich.'
    },
    {
      word: 'like',
      pronunciation: '/laɪk/',
      partOfSpeech: '(v)',
      meaning: 'muốn, thích',
      exampleEN: "I'd like a cappuccino.",
      exampleVI: 'Tôi muốn một ly cappuccino.'
    },
    {
      word: 'menu',
      pronunciation: '/ˈmenjuː/',
      partOfSpeech: '(n)',
      meaning: 'thực đơn',
      exampleEN: 'Can I see the menu?',
      exampleVI: 'Cho tôi xem thực đơn được không?'
    }
  ],

  grammar: {
    title: 'Polite Requests: Can I...? / I\'d like...',
    explanationVi: `
**Cách đặt món lịch sự trong tiếng Anh**

Có 3 cách phổ biến để đặt món:

1. **Can I get/have...?** (Tôi có thể lấy...?)
   - Thân thiện, tự nhiên
   - Ví dụ: "Can I get a coffee?"

2. **I'd like...** (Tôi muốn...)
   - Trang trọng hơn
   - I'd = I would
   - Ví dụ: "I'd like a latte, please."

3. **I'll have...** (Tôi sẽ lấy...)
   - Quyết đoán, tự tin
   - Ví dụ: "I'll have the sandwich."

**Đừng quên "please"!** - Luôn lịch sự nhé!
    `,
    examples: [
      {
        en: "Can I get a latte, please?",
        vi: "Cho tôi một ly latte được không?"
      },
      {
        en: "I'd like a cappuccino and a muffin.",
        vi: "Tôi muốn một ly cappuccino và một cái bánh muffin."
      },
      {
        en: "I'll have the special, thanks!",
        vi: "Tôi sẽ lấy món đặc biệt, cảm ơn!"
      }
    ],
    quiz: {
      question: "What's the most polite way to order?",
      correctAnswer: "I'd like a coffee, please",
      feedback: "I'd like... please is the most polite form!"
    }
  },

  practice: {
    scenarioId: 'practice-a1-2',
    title: 'Ordering at a Cafe',
    description: 'Luyện tập đặt món đồ uống và đồ ăn nhẹ tại quán cafe',
    userRole: 'Bạn là khách hàng đang muốn đặt món tại quán cafe',
    scenario: 'Bạn đứng trước quầy của một quán cafe đông khách. Nhân viên pha chế hỏi bạn muốn gọi món gì.',
    difficulty: 'easy',
    estimatedMinutes: 10
  },

  summary: `
Today you learned:
✅ Food & drink vocabulary
✅ Polite ordering phrases: Can I get...? I'd like... I'll have...
✅ Using "please" and "thanks"
✅ Practical cafe conversation
  `,

  homework: `
**Practice for tomorrow:**
1. Order something in English (even if just practice!)
2. Review all 8 vocabulary words
3. Practice the grammar quiz
4. Complete the Street Talk cafe scenario
  `,

  nextLessonId: 'a1-3'
};

const lessonA1_3: Lesson = {
  id: 'a1-3',
  moduleId: 'module-a1',
  title: 'Numbers & Shopping',
  description: 'Learn numbers and how to shop in English',
  level: 'A1',
  estimatedMinutes: 25,

  warmup: {
    type: 'text',
    title: 'Shopping Time',
    content: `You're at a clothing store and found a nice shirt.
    But wait - how much does it cost? And what's your size?
    Let's learn numbers and shopping phrases!`
  },

  vocabulary: [
    {
      word: 'price',
      pronunciation: '/praɪs/',
      partOfSpeech: '(n)',
      meaning: 'giá cả',
      exampleEN: "What's the price?",
      exampleVI: 'Giá bao nhiêu?'
    },
    {
      word: 'how much',
      pronunciation: '/haʊ mʌtʃ/',
      partOfSpeech: '(phrase)',
      meaning: 'bao nhiêu (tiền)',
      exampleEN: 'How much is this?',
      exampleVI: 'Cái này bao nhiêu tiền?'
    },
    {
      word: 'dollar',
      pronunciation: '/ˈdɑːlər/',
      partOfSpeech: '(n)',
      meaning: 'đô la',
      exampleEN: "It's 20 dollars.",
      exampleVI: 'Nó 20 đô la.'
    },
    {
      word: 'cheap',
      pronunciation: '/tʃiːp/',
      partOfSpeech: '(adj)',
      meaning: 'rẻ',
      exampleEN: 'This is really cheap!',
      exampleVI: 'Cái này rẻ thật!'
    },
    {
      word: 'expensive',
      pronunciation: '/ɪkˈspensɪv/',
      partOfSpeech: '(adj)',
      meaning: 'đắt',
      exampleEN: "That's too expensive.",
      exampleVI: 'Cái đó đắt quá.'
    },
    {
      word: 'size',
      pronunciation: '/saɪz/',
      partOfSpeech: '(n)',
      meaning: 'kích cỡ',
      exampleEN: 'What size do you need?',
      exampleVI: 'Bạn cần size nào?'
    },
    {
      word: 'try',
      pronunciation: '/traɪ/',
      partOfSpeech: '(v)',
      meaning: 'thử',
      exampleEN: 'Can I try this on?',
      exampleVI: 'Tôi có thể thử cái này không?'
    },
    {
      word: 'buy',
      pronunciation: '/baɪ/',
      partOfSpeech: '(v)',
      meaning: 'mua',
      exampleEN: "I'll buy this one.",
      exampleVI: 'Tôi sẽ mua cái này.'
    }
  ],

  grammar: {
    title: 'Numbers & Questions (How much? How many?)',
    explanationVi: `
**Hỏi về số lượng và giá cả**

1. **How much** - Bao nhiêu (tiền)?
   - Dùng cho giá cả: "How much is this?"
   - Dùng cho danh từ không đếm được: "How much water?"

2. **How many** - Bao nhiêu (cái)?
   - Dùng cho danh từ đếm được: "How many apples?"

**Numbers 1-100:**
- 1-10: one, two, three, four, five, six, seven, eight, nine, ten
- 11-19: eleven, twelve, thirteen, fourteen, fifteen...
- 20, 30, 40: twenty, thirty, forty...
- 21, 22, 23: twenty-one, twenty-two, twenty-three...

**Prices:**
- $5 = "five dollars"
- $15.50 = "fifteen dollars and fifty cents" or "fifteen fifty"
    `,
    examples: [
      {
        en: "How much is this shirt?",
        vi: "Cái áo này giá bao nhiêu?"
      },
      {
        en: "It's twenty dollars.",
        vi: "Nó 20 đô la."
      },
      {
        en: "How many do you want?",
        vi: "Bạn muốn bao nhiêu cái?"
      }
    ],
    quiz: {
      question: "When asking about price, which is correct?",
      correctAnswer: "How much is this?",
      feedback: "How much is used for prices!"
    }
  },

  practice: {
    scenarioId: 'practice-a1-3',
    title: 'Shopping for Clothes',
    description: 'Luyện tập mua sắm quần áo và hỏi về giá cả, kích cỡ',
    userRole: 'Bạn là khách hàng muốn mua quần áo',
    scenario: 'Bạn đang ở cửa hàng quần áo và tìm thấy một chiếc áo đẹp. Nhân viên bán hàng đến hỏi bạn có cần giúp gì không.',
    difficulty: 'easy',
    estimatedMinutes: 10
  },

  summary: `
Today you learned:
✅ Numbers 1-100 in English
✅ Shopping vocabulary (price, size, buy, try)
✅ Questions: How much? How many?
✅ Talking about prices
  `,

  homework: `
**Practice for tomorrow:**
1. Count from 1-50 out loud in English
2. Practice asking prices: "How much is this?"
3. Review the vocabulary flashcards
4. Complete the shopping practice scenario
  `,

  nextLessonId: 'a1-4'
};

// ============================================
// MODULE A1: Survival English
// ============================================

const moduleA1: Module = {
  id: 'module-a1',
  title: 'Survival English',
  description: 'Essential English for daily life - greetings, food, shopping, and basic conversations',
  level: 'A1',
  lessons: [lessonA1_1, lessonA1_2, lessonA1_3, lessonA1_4, lessonA1_5, lessonA1_6, lessonA1_7, lessonA1_8],
  estimatedWeeks: 8
};

// Lesson A1-4: Asking for Directions
const lessonA1_4: Lesson = {
  id: 'a1-4',
  moduleId: 'module-a1',
  title: 'Asking for Directions',
  description: 'Learn how to ask for and give simple directions in English',
  level: 'A1',
  estimatedMinutes: 25,
  nextLessonId: 'a1-5',

  warmup: {
    type: 'text',
    title: 'Finding Your Way',
    content: `You're visiting a new city and need to find the nearest subway station. A local person stops to help you. How do you ask for directions? Let's learn!`
  },

  vocabulary: [
    {
      word: 'where',
      pronunciation: '/weər/',
      partOfSpeech: '(adv)',
      meaning: 'ở đâu',
      exampleEN: 'Where is the bathroom?',
      exampleVI: 'Nhà vệ sinh ở đâu?'
    },
    {
      word: 'here',
      pronunciation: '/hɪr/',
      partOfSpeech: '(adv)',
      meaning: 'ở đây',
      exampleEN: "I'm here!",
      exampleVI: 'Tôi ở đây!'
    },
    {
      word: 'there',
      pronunciation: '/ðer/',
      partOfSpeech: '(adv)',
      meaning: 'ở đó, ở kia',
      exampleEN: 'The shop is over there.',
      exampleVI: 'Cửa hàng ở đằng kia.'
    },
    {
      word: 'left',
      pronunciation: '/left/',
      partOfSpeech: '(n)',
      meaning: 'bên trái',
      exampleEN: 'Turn left at the corner.',
      exampleVI: 'Rẽ trái ở góc đường.'
    },
    {
      word: 'right',
      pronunciation: '/raɪt/',
      partOfSpeech: '(n)',
      meaning: 'bên phải',
      exampleEN: 'The bank is on the right.',
      exampleVI: 'Ngân hàng ở bên phải.'
    },
    {
      word: 'straight',
      pronunciation: '/streɪt/',
      partOfSpeech: '(adv)',
      meaning: 'thẳng',
      exampleEN: 'Go straight ahead.',
      exampleVI: 'Đi thẳng phía trước.'
    },
    {
      word: 'near',
      pronunciation: '/nɪr/',
      partOfSpeech: '(prep)',
      meaning: 'gần',
      exampleEN: 'Is it near here?',
      exampleVI: 'Nó có gần đây không?'
    },
    {
      word: 'far',
      pronunciation: '/fɑːr/',
      partOfSpeech: '(adj)',
      meaning: 'xa',
      exampleEN: 'Is it far from here?',
      exampleVI: 'Nó có xa từ đây không?'
    }
  ],

  grammar: {
    title: 'Questions with "Where"',
    explanationVi: `
**Hỏi đường với "Where"**

Để hỏi vị trí, chúng ta dùng "Where is...?" hoặc "Where are...?"

- **Where is...?** (Dùng cho số ít)
  - Where is the station? (Nhà ga ở đâu?)
  - Where's the bathroom? (Nhà vệ sinh ở đâu?)

- **Where are...?** (Dùng cho số nhiều)
  - Where are the toilets? (Các nhà vệ sinh ở đâu?)

**Cách chỉ đường đơn giản:**

1. **Go straight** - Đi thẳng
   - "Go straight for 2 blocks"

2. **Turn left/right** - Rẽ trái/phải
   - "Turn left at the traffic light"

3. **It's on the left/right** - Nó ở bên trái/phải
   - "The cafe is on the right"
    `,
    examples: [
      {
        en: "Where is the nearest subway station?",
        vi: "Trạm tàu điện ngầm gần nhất ở đâu?"
      },
      {
        en: "Go straight and turn right.",
        vi: "Đi thẳng rồi rẽ phải."
      },
      {
        en: "It's very near, just 5 minutes walk.",
        vi: "Nó rất gần, chỉ 5 phút đi bộ thôi."
      }
    ],
    quiz: {
      question: "How do you ask 'Bưu điện ở đâu?' in English?",
      correctAnswer: "Where is the post office?",
      feedback: "Great! We use 'Where is...?' to ask for locations."
    }
  },

  practice: {
    scenarioId: 'practice-a1-4',
    title: 'Finding the Metro Station',
    description: 'Luyện tập hỏi đường và hiểu chỉ dẫn đơn giản',
    userRole: 'Bạn là du khách cần tìm trạm tàu điện ngầm',
    scenario: 'Bạn đang lạc đường ở một thành phố mới. Bạn cần đến trạm tàu điện ngầm nhưng không biết đường. Hãy hỏi người dân địa phương.',
    difficulty: 'easy',
    estimatedMinutes: 10
  },

  summary: `
Today you learned:
✅ How to ask "Where is...?"
✅ Direction vocabulary: left, right, straight, near, far
✅ Simple direction phrases
  `,

  homework: `
Practice asking for directions to 3 places near your home in English. Try using: "Where is the...?", "Is it near?", "How far is it?"
  `
};

// Lesson A1-5: At the Restaurant
const lessonA1_5: Lesson = {
  id: 'a1-5',
  moduleId: 'module-a1',
  title: 'At the Restaurant',
  description: 'Learn essential phrases for dining out and ordering food',
  level: 'A1',
  estimatedMinutes: 30,
  nextLessonId: 'a1-6',

  warmup: {
    type: 'text',
    title: 'Dining Out',
    content: `You're having dinner at a restaurant. The waiter approaches your table with a menu. What do you say? Let's learn restaurant English!`
  },

  vocabulary: [
    {
      word: 'table',
      pronunciation: '/ˈteɪbl/',
      partOfSpeech: '(n)',
      meaning: 'bàn (ăn)',
      exampleEN: 'A table for two, please.',
      exampleVI: 'Xin cho một bàn cho hai người.'
    },
    {
      word: 'menu',
      pronunciation: '/ˈmenjuː/',
      partOfSpeech: '(n)',
      meaning: 'thực đơn',
      exampleEN: 'Can I see the menu?',
      exampleVI: 'Cho tôi xem thực đơn được không?'
    },
    {
      word: 'order',
      pronunciation: '/ˈɔːrdər/',
      partOfSpeech: '(v/n)',
      meaning: 'gọi món / đơn hàng',
      exampleEN: 'Are you ready to order?',
      exampleVI: 'Bạn sẵn sàng gọi món chưa?'
    },
    {
      word: 'bill',
      pronunciation: '/bɪl/',
      partOfSpeech: '(n)',
      meaning: 'hóa đơn',
      exampleEN: 'Can I have the bill, please?',
      exampleVI: 'Cho tôi xin hóa đơn.'
    },
    {
      word: 'water',
      pronunciation: '/ˈwɔːtər/',
      partOfSpeech: '(n)',
      meaning: 'nước',
      exampleEN: 'A glass of water, please.',
      exampleVI: 'Cho tôi một ly nước.'
    },
    {
      word: 'delicious',
      pronunciation: '/dɪˈlɪʃəs/',
      partOfSpeech: '(adj)',
      meaning: 'ngon',
      exampleEN: 'This is delicious!',
      exampleVI: 'Món này ngon quá!'
    },
    {
      word: 'recommend',
      pronunciation: '/ˌrekəˈmend/',
      partOfSpeech: '(v)',
      meaning: 'gợi ý, khuyên',
      exampleEN: 'What do you recommend?',
      exampleVI: 'Bạn gợi ý món gì?'
    }
  ],

  grammar: {
    title: 'Modal Verb: Can (Requests)',
    explanationVi: `
**Dùng "Can" để nhờ vả lịch sự**

"Can" + chủ ngữ + động từ = yêu cầu lịch sự

**Cấu trúc:**

1. **Can I have...?** - Tôi có thể lấy...?
   - Can I have the menu? (Cho tôi xem thực đơn?)
   - Can I have some water? (Cho tôi xin nước?)

2. **Can you...?** - Bạn có thể...?
   - Can you recommend something? (Bạn có thể gợi ý gì không?)
   - Can you bring the bill? (Bạn mang hóa đơn được không?)

**Lưu ý:** Thêm "please" để lịch sự hơn!
- Can I have the bill, please? ✓
    `,
    examples: [
      {
        en: "Can I have a table for four?",
        vi: "Cho tôi một bàn cho bốn người được không?"
      },
      {
        en: "Can you bring me some water, please?",
        vi: "Bạn mang cho tôi ít nước được không?"
      },
      {
        en: "Can I see the dessert menu?",
        vi: "Tôi có thể xem thực đơn tráng miệng không?"
      }
    ],
    quiz: {
      question: "How do you politely ask for the bill?",
      correctAnswer: "Can I have the bill, please?",
      feedback: "Perfect! 'Can I have..., please?' is polite and natural."
    }
  },

  practice: {
    scenarioId: 'practice-a1-5',
    title: 'Dinner at Italian Restaurant',
    description: 'Luyện tập gọi món và giao tiếp tại nhà hàng',
    userRole: 'Bạn là thực khách đang đói và muốn thưởng thức bữa tối ngon',
    scenario: 'Bạn vào một nhà hàng Ý đông khách. Người phục vụ đưa thực đơn và chờ bạn gọi món. Bạn muốn thử món đặc sản của họ.',
    difficulty: 'easy',
    estimatedMinutes: 12
  },

  summary: `
Today you learned:
✅ Restaurant vocabulary: table, menu, order, bill
✅ Using "Can I/you...?" for polite requests
✅ How to order food and ask for recommendations
  `,

  homework: `
Write 3 sentences you would say at a restaurant using "Can I have...?" or "Can you...?". Practice saying them aloud!
  `
};

// Lesson A1-6: Making Small Talk
const lessonA1_6: Lesson = {
  id: 'a1-6',
  moduleId: 'module-a1',
  title: 'Making Small Talk',
  description: 'Learn casual conversation topics like weather, hobbies, and weekend plans',
  level: 'A1',
  estimatedMinutes: 25,
  nextLessonId: 'a1-7',

  warmup: {
    type: 'text',
    title: 'Breaking the Ice',
    content: `You're waiting for the elevator with a colleague. There's an awkward silence. How do you start a friendly conversation? Let's learn small talk!`
  },

  vocabulary: [
    {
      word: 'weather',
      pronunciation: '/ˈweðər/',
      partOfSpeech: '(n)',
      meaning: 'thời tiết',
      exampleEN: 'The weather is nice today.',
      exampleVI: 'Thời tiết hôm nay đẹp.'
    },
    {
      word: 'weekend',
      pronunciation: '/ˌwiːkˈend/',
      partOfSpeech: '(n)',
      meaning: 'cuối tuần',
      exampleEN: 'What are your plans for the weekend?',
      exampleVI: 'Bạn có kế hoạch gì cho cuối tuần?'
    },
    {
      word: 'hobby',
      pronunciation: '/ˈhɒbi/',
      partOfSpeech: '(n)',
      meaning: 'sở thích',
      exampleEN: 'What are your hobbies?',
      exampleVI: 'Sở thích của bạn là gì?'
    },
    {
      word: 'favorite',
      pronunciation: '/ˈfeɪvərɪt/',
      partOfSpeech: '(adj/n)',
      meaning: 'yêu thích',
      exampleEN: "What's your favorite movie?",
      exampleVI: 'Phim yêu thích của bạn là gì?'
    },
    {
      word: 'like',
      pronunciation: '/laɪk/',
      partOfSpeech: '(v)',
      meaning: 'thích',
      exampleEN: 'I like reading books.',
      exampleVI: 'Tôi thích đọc sách.'
    },
    {
      word: 'enjoy',
      pronunciation: '/ɪnˈdʒɔɪ/',
      partOfSpeech: '(v)',
      meaning: 'tận hưởng, thích',
      exampleEN: 'I enjoy playing tennis.',
      exampleVI: 'Tôi thích chơi tennis.'
    },
    {
      word: 'usually',
      pronunciation: '/ˈjuːʒuəli/',
      partOfSpeech: '(adv)',
      meaning: 'thường xuyên',
      exampleEN: 'I usually go to the gym on Mondays.',
      exampleVI: 'Tôi thường đi gym vào thứ Hai.'
    }
  ],

  grammar: {
    title: 'Present Simple (Habits & Preferences)',
    explanationVi: `
**Thì Hiện Tại Đơn - Nói về thói quen và sở thích**

Dùng để nói về những việc bạn thường làm hoặc những điều bạn thích.

**Cấu trúc khẳng định:**

1. **I/You/We/They + động từ nguyên mẫu**
   - I like coffee. (Tôi thích cà phê.)
   - They play football. (Họ chơi bóng đá.)

2. **He/She/It + động từ + s/es**
   - She likes tea. (Cô ấy thích trà.)
   - He plays guitar. (Anh ấy chơi guitar.)

**Cấu trúc nghi vấn:**

1. **Do you/we/they + động từ?**
   - Do you like music? (Bạn có thích nhạc không?)

2. **Does he/she/it + động từ?**
   - Does she play tennis? (Cô ấy có chơi tennis không?)

**Từ thường gặp:** usually, often, sometimes, always, never
    `,
    examples: [
      {
        en: "I usually go for a walk on weekends.",
        vi: "Tôi thường đi dạo vào cuối tuần."
      },
      {
        en: "Do you like watching movies?",
        vi: "Bạn có thích xem phim không?"
      },
      {
        en: "She enjoys reading in her free time.",
        vi: "Cô ấy thích đọc sách trong thời gian rảnh."
      }
    ],
    quiz: {
      question: "How do you say 'Tôi thường chơi game vào tối thứ Sáu' in English?",
      correctAnswer: "I usually play games on Friday nights.",
      feedback: "Excellent! We use Present Simple with 'usually' for habits."
    }
  },

  practice: {
    scenarioId: 'practice-a1-6',
    title: 'Coffee Break Chat',
    description: 'Luyện tập trò chuyện nhẹ nhàng với đồng nghiệp',
    userRole: 'Bạn là nhân viên đang nghỉ giải lao',
    scenario: 'Bạn đang uống cà phê ở pantry văn phòng. Một đồng nghiệp mới đến ngồi cạnh. Hãy bắt chuyện về thời tiết, cuối tuần, hoặc sở thích.',
    difficulty: 'easy',
    estimatedMinutes: 10
  },

  summary: `
Today you learned:
✅ Small talk vocabulary: weather, weekend, hobby, favorite
✅ Present Simple for habits and preferences
✅ How to ask about likes and hobbies
  `,

  homework: `
Think about 3 of your hobbies or habits. Write them down using Present Simple (e.g., "I usually...", "I like...", "I enjoy...").
  `
};

// Lesson A1-7: Using Public Transport
const lessonA1_7: Lesson = {
  id: 'a1-7',
  moduleId: 'module-a1',
  title: 'Using Public Transport',
  description: 'Learn how to buy tickets, ask about schedules, and navigate public transport',
  level: 'A1',
  estimatedMinutes: 30,
  nextLessonId: 'a1-8',

  warmup: {
    type: 'text',
    title: 'Taking the Train',
    content: `You need to catch a train to the airport. You're at the station ticket counter. How do you buy a ticket and ask about the departure time? Let's learn!`
  },

  vocabulary: [
    {
      word: 'ticket',
      pronunciation: '/ˈtɪkɪt/',
      partOfSpeech: '(n)',
      meaning: 'vé',
      exampleEN: 'I need a ticket to London.',
      exampleVI: 'Tôi cần một vé đến London.'
    },
    {
      word: 'platform',
      pronunciation: '/ˈplætfɔːrm/',
      partOfSpeech: '(n)',
      meaning: 'sân ga, peran',
      exampleEN: 'The train leaves from platform 3.',
      exampleVI: 'Tàu khởi hành từ sân ga số 3.'
    },
    {
      word: 'schedule',
      pronunciation: '/ˈʃedjuːl/',
      partOfSpeech: '(n)',
      meaning: 'lịch trình',
      exampleEN: 'What is the train schedule?',
      exampleVI: 'Lịch tàu là gì?'
    },
    {
      word: 'arrive',
      pronunciation: '/əˈraɪv/',
      partOfSpeech: '(v)',
      meaning: 'đến nơi',
      exampleEN: 'What time does the bus arrive?',
      exampleVI: 'Xe buýt đến lúc mấy giờ?'
    },
    {
      word: 'depart',
      pronunciation: '/dɪˈpɑːrt/',
      partOfSpeech: '(v)',
      meaning: 'khởi hành',
      exampleEN: 'The train departs at 3 PM.',
      exampleVI: 'Tàu khởi hành lúc 3 giờ chiều.'
    },
    {
      word: 'return',
      pronunciation: '/rɪˈtɜːrn/',
      partOfSpeech: '(adj/n)',
      meaning: 'khứ hồi',
      exampleEN: 'A return ticket, please.',
      exampleVI: 'Cho tôi một vé khứ hồi.'
    },
    {
      word: 'single',
      pronunciation: '/ˈsɪŋɡl/',
      partOfSpeech: '(adj)',
      meaning: 'một chiều',
      exampleEN: 'Just a single ticket.',
      exampleVI: 'Chỉ cần vé một chiều thôi.'
    }
  ],

  grammar: {
    title: 'Questions: "How do I...?"',
    explanationVi: `
**Hỏi cách thức với "How do I...?"**

Dùng để hỏi cách làm một việc gì đó.

**Cấu trúc:**

**How do I + động từ...?** - Làm thế nào để tôi...?

**Các câu hỏi phổ biến:**

1. **How do I get to...?** - Làm sao để đến...?
   - How do I get to the airport? (Làm sao để đến sân bay?)

2. **How do I buy...?** - Làm sao để mua...?
   - How do I buy a ticket? (Làm sao để mua vé?)

3. **How do I use...?** - Làm sao để dùng...?
   - How do I use this machine? (Làm sao để dùng máy này?)

**Trả lời:**
- You + động từ... (Bạn + động từ...)
- You can + động từ... (Bạn có thể + động từ...)

**Ví dụ:**
- Q: How do I get there?
- A: You take bus number 5. (Bạn bắt xe buýt số 5.)
    `,
    examples: [
      {
        en: "How do I get to platform 2?",
        vi: "Làm sao để đến sân ga số 2?"
      },
      {
        en: "You go down the stairs and turn left.",
        vi: "Bạn đi xuống cầu thang và rẽ trái."
      },
      {
        en: "How do I buy a ticket from this machine?",
        vi: "Làm sao để mua vé từ máy này?"
      }
    ],
    quiz: {
      question: "How do you ask 'Làm sao để đến sân bay?' in English?",
      correctAnswer: "How do I get to the airport?",
      feedback: "Perfect! 'How do I get to...?' is used to ask for directions."
    }
  },

  practice: {
    scenarioId: 'practice-a1-7',
    title: 'At the Train Station',
    description: 'Luyện tập mua vé và hỏi thông tin tàu',
    userRole: 'Bạn là hành khách cần mua vé tàu',
    scenario: 'Bạn đang ở ga tàu và cần đi đến sân bay. Bạn cần mua vé, hỏi giờ khởi hành, và tìm sân ga đúng.',
    difficulty: 'medium',
    estimatedMinutes: 12
  },

  summary: `
Today you learned:
✅ Transport vocabulary: ticket, platform, schedule, arrive, depart
✅ "How do I...?" questions for asking instructions
✅ How to buy tickets and ask about transport
  `,

  homework: `
Practice saying 3 questions you might ask at a train or bus station using "How do I...?". Write them down!
  `
};

// Lesson A1-8: Emergency Situations
const lessonA1_8: Lesson = {
  id: 'a1-8',
  moduleId: 'module-a1',
  title: 'Emergency Situations',
  description: "Essential phrases for asking for help when you're in trouble or need assistance",
  level: 'A1',
  estimatedMinutes: 30,

  warmup: {
    type: 'text',
    title: 'When You Need Help',
    content: `You're lost in a foreign city and your phone battery died. You need help finding your hotel. What do you say? Let's learn important emergency phrases!`
  },

  vocabulary: [
    {
      word: 'help',
      pronunciation: '/help/',
      partOfSpeech: '(n/v)',
      meaning: 'giúp đỡ',
      exampleEN: 'Can you help me, please?',
      exampleVI: 'Bạn có thể giúp tôi không?'
    },
    {
      word: 'emergency',
      pronunciation: '/ɪˈmɜːrdʒənsi/',
      partOfSpeech: '(n)',
      meaning: 'tình huống khẩn cấp',
      exampleEN: 'This is an emergency!',
      exampleVI: 'Đây là tình huống khẩn cấp!'
    },
    {
      word: 'hospital',
      pronunciation: '/ˈhɒspɪtl/',
      partOfSpeech: '(n)',
      meaning: 'bệnh viện',
      exampleEN: 'I need to go to the hospital.',
      exampleVI: 'Tôi cần đến bệnh viện.'
    },
    {
      word: 'police',
      pronunciation: '/pəˈliːs/',
      partOfSpeech: '(n)',
      meaning: 'cảnh sát',
      exampleEN: 'Please call the police.',
      exampleVI: 'Làm ơn gọi cảnh sát.'
    },
    {
      word: 'lost',
      pronunciation: '/lɒst/',
      partOfSpeech: '(adj)',
      meaning: 'bị lạc',
      exampleEN: "I'm lost. Can you help me?",
      exampleVI: 'Tôi bị lạc. Bạn có thể giúp tôi không?'
    },
    {
      word: 'passport',
      pronunciation: '/ˈpɑːspɔːrt/',
      partOfSpeech: '(n)',
      meaning: 'hộ chiếu',
      exampleEN: 'I lost my passport.',
      exampleVI: 'Tôi mất hộ chiếu.'
    },
    {
      word: 'wallet',
      pronunciation: '/ˈwɒlɪt/',
      partOfSpeech: '(n)',
      meaning: 'ví tiền',
      exampleEN: 'My wallet was stolen.',
      exampleVI: 'Ví của tôi bị mất cắp.'
    }
  ],

  grammar: {
    title: 'Urgent Requests: "I need..." / "Can you help me...?"',
    explanationVi: `
**Xin giúp đỡ khi khẩn cấp**

Khi bạn cần giúp đỡ gấp, dùng các cấu trúc sau:

**1. I need... - Tôi cần...**
- I need help. (Tôi cần giúp đỡ.)
- I need a doctor. (Tôi cần bác sĩ.)
- I need to go to the hospital. (Tôi cần đến bệnh viện.)

**2. Can you help me...? - Bạn có thể giúp tôi...?**
- Can you help me? (Bạn có thể giúp tôi không?)
- Can you help me find my hotel? (Bạn có thể giúp tôi tìm khách sạn không?)
- Can you call the police? (Bạn có thể gọi cảnh sát không?)

**3. I lost... - Tôi mất/bị lạc...**
- I lost my phone. (Tôi mất điện thoại.)
- I'm lost. (Tôi bị lạc.)

**Lưu ý:** Nói "Excuse me" hoặc "Sorry" trước khi xin giúp đỡ!
- Excuse me, can you help me? ✓
    `,
    examples: [
      {
        en: "Excuse me, I need help. I'm lost.",
        vi: "Xin lỗi, tôi cần giúp đỡ. Tôi bị lạc."
      },
      {
        en: "Can you help me find a hospital?",
        vi: "Bạn có thể giúp tôi tìm bệnh viện không?"
      },
      {
        en: "I lost my passport. What should I do?",
        vi: "Tôi mất hộ chiếu. Tôi nên làm gì?"
      }
    ],
    quiz: {
      question: "How do you say 'Tôi cần bác sĩ' in English?",
      correctAnswer: "I need a doctor.",
      feedback: "Correct! 'I need...' is direct and clear in emergencies."
    }
  },

  practice: {
    scenarioId: 'practice-a1-8',
    title: 'Lost in the City',
    description: 'Luyện tập xin giúp đỡ khi gặp khó khăn',
    userRole: 'Bạn là du khách đang gặp vấn đề',
    scenario: 'Bạn bị lạc ở một thành phố lạ, điện thoại hết pin, và bạn không nhớ địa chỉ khách sạn. Hãy tìm người giúp đỡ.',
    difficulty: 'medium',
    estimatedMinutes: 10
  },

  summary: `
Today you learned:
✅ Emergency vocabulary: help, hospital, police, lost, passport
✅ How to ask for urgent help: "I need...", "Can you help me...?"
✅ What to say when you're lost or in trouble
  `,

  homework: `
Write down 3 emergency phone numbers in your country (police, ambulance, etc.) and practice saying "I need..." sentences for different emergencies.
  `
};

// ============================================
// LEARNING PATHS
// ============================================

export const foundationPath: LearningPath = {
  id: 'foundation-path',
  title: 'Foundation English (A1-A2)',
  description: 'Start from zero and build strong English basics',
  modules: [moduleA1], // More modules will be added
  targetAudience: ['Complete beginners', 'Basic learners', 'Daily conversation focus'],
  estimatedMonths: 3
};

// Export all lessons for easy access
export const allLessons = {
  'a1-1': lessonA1_1,
  'a1-2': lessonA1_2,
  'a1-3': lessonA1_3,
  'a1-4': lessonA1_4,
  'a1-5': lessonA1_5,
  'a1-6': lessonA1_6,
  'a1-7': lessonA1_7,
  'a1-8': lessonA1_8
};

export const allModules = {
  'module-a1': moduleA1
};

export const allPaths = {
  'foundation-path': foundationPath
};
