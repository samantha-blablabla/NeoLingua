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
  lessons: [lessonA1_1, lessonA1_2, lessonA1_3],
  estimatedWeeks: 4
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
  'a1-3': lessonA1_3
};

export const allModules = {
  'module-a1': moduleA1
};

export const allPaths = {
  'foundation-path': foundationPath
};
