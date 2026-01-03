# 🗺️ NeoLingua - Product Roadmap

> Lộ trình phát triển dựa trên nền tảng hiện có, tập trung vào hiệu quả giảng dạy thực tế

---

## 🎯 Nguyên tắc phát triển

1. **Xây dựng trên cái đang có** - Tận dụng tối đa foundation path, spaced repetition, 4-skill review
2. **Không nhồi nhét** - Mỗi tính năng phải có mục đích rõ ràng, không thêm tính năng vì nó "nghe hay"
3. **Hoàn thiện trước khi mở rộng** - Đảm bảo core features hoạt động tốt trước khi thêm mới
4. **Pedagogy first, technology second** - Phương pháp giảng dạy là trọng tâm, tech chỉ là công cụ

---

## ✅ Phase 0: Foundation (ĐÃ HOÀN THÀNH)

### Core Features
- [x] Lesson system với vocabulary + grammar + quiz
- [x] Spaced repetition (SM-2 algorithm)
- [x] 4-skill comprehensive review (Listening, Speaking, Reading, Writing)
- [x] Voice recognition cho Speaking
- [x] Smart Action Card với priority system
- [x] Progress tracking (streak, vocab count)
- [x] UrbanChat (street talk practice)

### Technical Foundation
- [x] React 19 + TypeScript + Vite
- [x] Framer Motion animations
- [x] Google TTS integration
- [x] Web Speech API integration
- [x] localStorage data persistence

---

## 🚀 Phase 1: Enhance Core Learning Experience

> **Mục tiêu:** Cải thiện chất lượng học tập trong bài học hiện tại

### 1.1 Listen & Repeat Section trong Lesson ⭐ **[PRIORITY HIGH]**

**Vấn đề hiện tại:**
- Lesson chỉ có vocab cards → quiz trực tiếp
- Thiếu giai đoạn "input" (nghe và làm quen) trước khi "output" (test)

**Giải pháp:**
Thêm phase "Listen & Repeat" sau vocabulary cards, trước quiz:

```typescript
// Lesson flow mới:
1. Vocabulary Cards (passive learning)
2. Listen & Repeat ⭐ NEW (active listening + shadowing)
3. Quiz (comprehension check)
4. Complete
```

**Implementation:**
- Mỗi từ vựng: Play audio → User click "Repeat" → Voice recognition check
- Highlight từ đang phát âm (visual feedback)
- Cho phép replay nhiều lần
- Không bắt buộc 100% đúng (threshold 70% để pass)

**Lý do quan trọng:**
- Theo TPR (Total Physical Response): Input nhiều lần trước khi output
- Giúp học sinh familiar với pronunciation trước khi bị test
- Giảm anxiety khi làm quiz

---

### 1.2 Better Feedback System ⭐ **[PRIORITY HIGH]**

**Vấn đề hiện tại:**
- Feedback chỉ có "Đúng ✓" hoặc "Sai ✗"
- Không giải thích tại sao sai, sai ở đâu

**Giải pháp:**
Feedback system 3 tầng:

```typescript
// Level 1: Immediate feedback
{
  correct: false,
  userAnswer: "I go to school yesterday",
  issue: "grammar", // grammar | spelling | word-choice | pronunciation
  highlight: "go" // highlight từ sai
}

// Level 2: Explanation
{
  explanation: "Need past tense 'went' (not 'go') because of 'yesterday'",
  rule: "Past time expressions (yesterday, last week) → Past Simple tense"
}

// Level 3: Hint (before showing answer)
{
  hint: "Think about the tense. Did this happen in the past?",
  partialAnswer: "I ____ to school yesterday" // show structure
}
```

**Implementation:**
- Analyze user answer bằng pattern matching
- Common mistakes database cho người Việt
- Hint system trước khi reveal đáp án
- Link đến grammar explanation (nếu có)

---

### 1.3 Mini-Stories cho mỗi Lesson ⭐ **[PRIORITY MEDIUM]**

**Vấn đề hiện tại:**
- Vocabulary được dạy rời rạc (word list)
- Khó nhớ vì thiếu context

**Giải pháp:**
Tạo 1 mini-story (3-5 câu) cho mỗi lesson, kết hợp tất cả vocabulary:

**Ví dụ với Lesson A1-1 (Greetings):**
```
Sarah is a new student. She arrives at school in the morning.
Teacher: "Good morning, Sarah! How are you?"
Sarah: "I'm fine, thank you! Nice to meet you."
Teacher: "Welcome to our class. Please, sit here."
Sarah: "Thank you very much!"
```

**Cách tích hợp:**
1. Thêm `story` field trong lesson data structure
2. Hiển thị story ở đầu lesson (như một "context setting")
3. Tái sử dụng story trong Reading comprehension exercises
4. Option: Audio play full story với pauses

**Benefit:**
- Vocabulary có context → nhớ lâu hơn
- Học được cách dùng từ trong câu thực tế
- Tạo mental image cho học sinh

---

### 1.4 Pronunciation Practice Module 🔊 **[PRIORITY MEDIUM]**

**Vấn đề hiện tại:**
- Speaking review chỉ test whole word
- Không dạy cách phát âm các âm khó

**Giải pháp:**
Thêm "Pronunciation Drills" section (optional, access từ Vault):

**Nội dung:**
```
📌 Difficult Sounds for Vietnamese Learners:
- /θ/ vs /s/: think, thank, three
- /ð/ vs /d/: this, that, them
- /v/ vs /w/: very, wet, vet
- /ʃ/ vs /s/: ship, sheep, shop
- Ending sounds: -ed (walked, played, wanted)
- Word stress: PHOto vs phoTOgraphy
```

**Implementation:**
- Minimal pairs practice: "ship" vs "sheep"
- Visual mouth position guide (illustration)
- Slow-motion audio playback (0.75x speed)
- Record & compare với native speaker
- Score based on phonetic similarity

**Tích hợp:**
- Link từ vocabulary card (nếu từ có âm khó)
- Standalone module trong Vault (practice anytime)

---

## 🎨 Phase 2: Enhanced Review System

> **Mục tiêu:** Làm cho review thú vị hơn, hiệu quả hơn, personalized hơn

### 2.1 Flexible Spaced Repetition ⭐ **[PRIORITY HIGH]**

**Vấn đề hiện tại:**
- Spaced repetition chỉ dựa vào thuật toán (SM-2)
- Không cho user tự đánh giá độ khó

**Giải pháp:**
Thêm self-assessment buttons sau mỗi review card:

```
[Again]  [Hard]  [Good]  [Easy]
  <1m     <10m     1d      4d
```

**Logic:**
- **Again**: Sai hoặc quên hoàn toàn → Review lại sau <1 phút (trong session hiện tại)
- **Hard**: Đúng nhưng khó nhớ → Review lại sau 10 phút → 1 ngày
- **Good**: Đúng, bình thường → Follow SM-2 intervals (1d → 3d → 7d...)
- **Easy**: Đúng, quá dễ → Nhảy xa hơn (7d thay vì 3d)

**Benefit:**
- User control retention schedule
- Từ khó được review nhiều hơn (không cần đợi đến ngày mai)
- Từ dễ không bị spam review

---

### 2.2 Review Modes Variety 🎯 **[PRIORITY MEDIUM]**

**Vấn đề hiện tại:**
- Comprehensive review đã tốt nhưng có thể bị overwhelming
- Thiếu quick review options

**Giải pháp:**
Thêm review modes cho user chọn:

```
📚 REVIEW MODES:
1. Quick Flashcard (3 phút) - Chỉ vocabulary cards, flip để xem nghĩa
2. Listening Only (5 phút) - Chỉ practice nghe
3. Speaking Only (5 phút) - Chỉ practice nói
4. Mix 4 Skills (10-15 phút) - Comprehensive (đang có)
5. Wrong Answers Review - Review lại những câu đã sai
```

**Implementation:**
- Dashboard review card → Show mode selection
- User chọn mode → Generate exercises accordingly
- Track performance per mode
- Suggest mode dựa trên weak skill (nếu Listening yếu → suggest Listening Only)

---

### 2.3 Collocations & Chunks Database 💡 **[PRIORITY LOW]**

**Vấn đề hiện tại:**
- Chỉ dạy single words
- Không dạy cách từ kết hợp với nhau

**Giải pháp:**
Bổ sung collocation data vào vocabulary:

```typescript
interface Vocabulary {
  word: string;
  meaning: string;
  example: string;

  // NEW:
  collocations?: string[]; // Common phrases
  chunks?: string[];       // Fixed expressions
}

// Example:
{
  word: "decision",
  collocations: ["make a decision", "tough decision", "final decision"],
  chunks: ["make up your mind", "reach a decision"]
}
```

**Cách dạy:**
- Trong vocabulary card: Show collocations
- Trong quiz: Fill-in exercise với collocations
  - "Yesterday I ____ a difficult decision." (make/do/take)
  - Correct: "made"

**Benefit:**
- Học từ trong context thực tế
- Tránh lỗi "do a decision" (phổ biến với người Việt)

---

## 🎮 Phase 3: Gamification & Motivation

> **Mục tiêu:** Tạo động lực học lâu dài, không bị bỏ cuộc

### 3.1 Achievement System 🏆 **[PRIORITY HIGH]**

**Implementation:**
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: 'streak' | 'vocab' | 'lessons' | 'accuracy' | 'skills';
    target: number;
  };
  unlocked: boolean;
  unlockedDate?: string;
}

// Examples:
achievements = [
  { id: 'vocab-100', title: 'Word Master', description: 'Learn 100 words', requirement: { type: 'vocab', target: 100 } },
  { id: 'streak-7', title: 'Week Warrior', description: '7 day streak', requirement: { type: 'streak', target: 7 } },
  { id: 'speak-50', title: 'Smooth Talker', description: 'Speak 50 words correctly', requirement: { type: 'skills', target: 50 } },
  { id: 'perfect-10', title: 'Perfectionist', description: '10 perfect scores in a row', requirement: { type: 'accuracy', target: 10 } }
]
```

**UI Display:**
- Badge showcase trong Dashboard/Profile
- Toast notification khi unlock achievement
- Progress bar cho achievements gần đạt được

---

### 3.2 Daily Challenge 📅 **[PRIORITY MEDIUM]**

**Concept:**
Mỗi ngày 1 mini-challenge khác nhau:

```
Monday: "Learn 10 new words"
Tuesday: "Review 20 flashcards"
Wednesday: "Speak 15 words perfectly"
Thursday: "Complete 1 lesson"
Friday: "Practice writing 5 sentences"
Weekend: "Mixed challenge"
```

**Implementation:**
- Generate challenge based on weekday
- Track completion in localStorage
- Reward: Bonus streak point hoặc special badge
- Show in Dashboard as "Today's Challenge" card

---

### 3.3 Weekly Progress Report 📊 **[PRIORITY LOW]**

**Concept:**
Mỗi Chủ Nhật, show summary của tuần:

```
📊 WEEKLY REPORT (Dec 25 - Dec 31)

🔥 Streak: 7 days (New record!)
📚 Words learned: 73 (+20% from last week)
🎯 Accuracy: 87%
⏱️ Study time: 3h 25m

💪 STRONGEST SKILL: Listening (92%)
🎯 FOCUS AREA: Writing (71%)

🏆 ACHIEVEMENTS UNLOCKED:
- Week Warrior 🔥
- Vocab Champion 📚
```

**Implementation:**
- Calculate stats from localStorage
- Show comparison với previous week
- Suggest focus area cho tuần tới
- Option to share (screenshot or social media)

---

## 🌍 Phase 4: Real-World Application

> **Mục tiêu:** Áp dụng tiếng Anh vào tình huống thực tế

### 4.1 Scenario-Based Learning 🎭 **[PRIORITY MEDIUM]**

**Concept:**
Thêm "Real-Life Scenarios" module (tương tự UrbanChat nhưng structured hơn):

```
SCENARIOS:
1. At the Airport ✈️
   - Check-in
   - Security check
   - Boarding announcement

2. At a Restaurant 🍽️
   - Making reservation
   - Ordering food
   - Paying the bill

3. Shopping 🛍️
   - Asking for prices
   - Trying clothes
   - Return/Exchange

4. Job Interview 💼
   - Self-introduction
   - Answering questions
   - Asking questions
```

**Implementation:**
- Role-play style: App plays staff, user plays customer
- Branching conversations (choices matter)
- Voice input required (speaking practice)
- Score based on appropriateness + fluency

**Integration:**
- Unlock scenarios sau khi complete certain lessons
- Link từ vocabulary (e.g., "airport" → link to Airport scenario)

---

### 4.2 Cultural Tips 🌐 **[PRIORITY LOW]**

**Concept:**
Thêm cultural notes vào lessons:

```typescript
interface Lesson {
  // ... existing fields
  culturalTips?: {
    title: string;
    content: string;
    relatedWords: string[];
  }[];
}

// Example:
culturalTips: [
  {
    title: "Small Talk in English",
    content: "In English-speaking countries, 'How are you?' is often a greeting, not a real question. A simple 'I'm good, thanks!' is enough.",
    relatedWords: ["hello", "how are you", "good morning"]
  }
]
```

**Display:**
- Optional tooltip icon next to vocabulary
- Dedicated "Culture Corner" trong Vault
- Short, bite-sized tips (2-3 sentences max)

---

## 📈 Phase 5: Personalization & Analytics

> **Mục tiêu:** Tùy chỉnh trải nghiệm học tập cho từng user

### 5.1 Learning Preferences 🎨 **[PRIORITY MEDIUM]**

**Settings User có thể chọn:**
```typescript
interface UserPreferences {
  // Content preferences
  topics: ('travel' | 'business' | 'technology' | 'food' | 'daily-life')[];
  difficulty: 'slow-learner' | 'normal' | 'fast-learner';

  // Audio preferences
  voice: 'us-female' | 'us-male' | 'uk-female' | 'uk-male' | 'au-female';
  speechRate: 0.8 | 1.0 | 1.2; // Slow, Normal, Fast

  // Notification preferences
  dailyReminder: boolean;
  reminderTime: string; // "19:00"

  // Study preferences
  reviewMode: 'flashcard' | 'quiz' | 'mixed';
  reviewCount: 10 | 20 | 50; // Cards per session
}
```

**Implementation:**
- Settings page trong Vault
- Apply preferences across app
- Save to localStorage

---

### 5.2 Skills Radar Chart 📊 **[PRIORITY LOW]**

**Concept:**
Visualize 4 skills với radar chart:

```
      Listening
          /\
         /  \
Writing/    \Speaking
       \    /
        \  /
        Reading
```

**Implementation:**
- Calculate skill % từ comprehensive review results
- Update after each review session
- Show weak areas (suggest focus)
- Track improvement over time

---

## 🔧 Phase 6: Polish & Optimization

> **Mục tiêu:** Hoàn thiện trải nghiệm, fix bugs, optimize performance

### 6.1 Error Handling & Edge Cases ⚠️

- [ ] Handle offline mode gracefully
- [ ] Handle microphone permission denied
- [ ] Handle slow internet (show loading states)
- [ ] Handle localStorage quota exceeded
- [ ] Handle invalid audio playback

### 6.2 Performance Optimization ⚡

- [ ] Lazy load components (React.lazy)
- [ ] Optimize images (WebP format)
- [ ] Code splitting by route
- [ ] Reduce bundle size (tree shaking)
- [ ] Cache Google TTS responses

### 6.3 Accessibility ♿

- [ ] Keyboard navigation support
- [ ] Screen reader support (ARIA labels)
- [ ] High contrast mode
- [ ] Font size adjustment
- [ ] Reduce motion option

---

## 🎯 Implementation Priority Matrix

### Q1 2025 (Immediate)
1. ✅ Listen & Repeat Section (Phase 1.1)
2. ✅ Better Feedback System (Phase 1.2)
3. ✅ Flexible Spaced Repetition (Phase 2.1)
4. ✅ Achievement System (Phase 3.1)

### Q2 2025
5. Mini-Stories (Phase 1.3)
6. Review Modes Variety (Phase 2.2)
7. Daily Challenge (Phase 3.2)
8. Learning Preferences (Phase 5.1)

### Q3 2025
9. Pronunciation Practice (Phase 1.4)
10. Scenario-Based Learning (Phase 4.1)
11. Weekly Progress Report (Phase 3.3)

### Q4 2025
12. Collocations Database (Phase 2.3)
13. Cultural Tips (Phase 4.2)
14. Skills Radar Chart (Phase 5.2)

---

## 📝 Notes

**Design Philosophy:**
- Mỗi feature phải trả lời câu hỏi: "Điều này giúp học sinh học tốt hơn như thế nào?"
- Tránh feature creep - không thêm vì "nghe hay"
- User testing sau mỗi phase
- Iterate based on feedback

**Technical Debt:**
- Refactor spaced repetition logic (extract to service)
- Normalize data structure (curriculum → database-ready)
- Add proper error boundaries
- Write unit tests cho core logic

---

**Last Updated:** 2026-01-03
**Maintainer:** NeoLingua Team
