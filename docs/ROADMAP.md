# NeoLingua Development Roadmap

## 🎯 Vision
Transform NeoLingua into a comprehensive English learning platform with:
1. Clear learning path from beginner (A1) to advanced (C2)
2. Personalized curriculum for different learners
3. Engaging content with Street Talk Sandbox
4. AI Tutor for 24/7 support
5. Focus on quality over quantity

---

## 📊 Current State Analysis

### ✅ What We Have (Strong Foundation)
- Street Talk Sandbox - situational conversation practice
- Advanced vocab system (pronunciation, POS, examples)
- Natural TTS with Google Cloud Journey voice
- Beautiful, engaging UI/UX
- PWA support for mobile

### ❌ What We Need
- Learning path structure (A1 → C2)
- Systematic curriculum with lessons
- Personalization based on level/goals
- AI Tutor for Q&A support
- Progress tracking

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│         NEOLINGUA LEARNING PATH         │
├─────────────────────────────────────────┤
│                                         │
│  [1] Onboarding Quiz                    │
│      → Determine level (A1-C2)          │
│      → Identify goals (travel/work/etc) │
│      → Time availability                │
│                                         │
│  [2] Personalized Dashboard             │
│      → Your learning path               │
│      → Today's lesson                   │
│      → Progress tracking                │
│                                         │
│  [3] Core Learning Modules              │
│      A. Foundation (A1-A2)              │
│      B. Intermediate (B1-B2)            │
│      C. Advanced (C1-C2)                │
│                                         │
│  [4] Practice Sandbox                   │
│      → Street Talk (existing)           │
│      → More scenarios TBD               │
│                                         │
│  [5] AI Tutor                           │
│      → Answer questions 24/7            │
│      → Review mistakes                  │
│      → Suggest next steps               │
└─────────────────────────────────────────┘
```

---

## 📚 Curriculum Structure

### Level A: Foundation (A1-A2)
**Goal**: Basic survival English

#### Module A1: Survival English (3-4 weeks)
- **Lesson 1**: Greetings & Introductions
  - Vocab: Hello, Hi, How are you?, Nice to meet you
  - Grammar: Present simple (I am, You are)
  - Practice: Coffee shop greetings

- **Lesson 2**: Ordering Food & Drinks
  - Vocab: Menu items, quantities
  - Grammar: "Can I have...", "I'd like..."
  - Practice: Restaurant roleplay

- **Lesson 3**: Shopping & Numbers
  - Vocab: Prices, sizes, colors
  - Grammar: How much, How many
  - Practice: Clothing store

- **Lessons 4-8**: Daily basics (weather, family, hobbies, directions, phone)

#### Module A2: Daily Conversations (4-6 weeks)
- More complex daily situations
- Past tense introduction
- Expanding vocabulary

### Level B: Intermediate (B1-B2)
**Goal**: Confident workplace and travel English

#### Module B1: Workplace English
- Professional communication
- Email writing
- Meetings and presentations

#### Module B2: Travel & Culture
- Airport, hotel, cultural differences
- Idiomatic expressions

### Level C: Advanced (C1-C2)
**Goal**: Near-native fluency

#### Module C1: Professional Mastery
- Idioms, phrasal verbs
- Business negotiations

#### Module C2: Cultural Fluency
- Slang, humor, debates
- Media comprehension

---

## 📖 Lesson Structure Template

Every lesson follows this structure (20-30 minutes):

```
📚 LESSON STRUCTURE
├── 1. Warm-up (2-3 min)
│   └── Short video/audio introducing scenario
│
├── 2. Vocabulary (5-7 min)
│   ├── 10-15 core words
│   ├── Pronunciation (IPA)
│   ├── Example sentences
│   └── Flashcard review
│
├── 3. Grammar Point (3-5 min)
│   ├── Rule explanation (Vietnamese)
│   ├── Examples
│   └── Quick quiz
│
├── 4. Street Talk Practice (10-15 min)
│   ├── AI roleplay
│   ├── Real-time feedback
│   └── Urban upgrade suggestions
│
├── 5. Review & Homework (2-3 min)
│   ├── Summary
│   ├── Practice exercises
│   └── Next lesson preview
│
└── 6. AI Tutor Access
    └── Ask anything about the lesson
```

---

## 🎨 Personalization System

### Onboarding Quiz
Users answer 4 key questions:

1. **Current Level?**
   - Beginner (A1)
   - Basic (A2)
   - Intermediate (B1-B2)
   - Advanced (C1-C2)

2. **Learning Goal?**
   - Daily conversation
   - Travel
   - Work/Job interviews
   - Test prep (IELTS/TOEIC)
   - Study abroad

3. **Daily Time Available?**
   - 10-15 minutes
   - 30 minutes
   - 1 hour
   - 2+ hours

4. **Learning Style?**
   - Situational practice
   - Grammar-focused
   - Video/audio
   - Mix of all

**Result**: AI generates personalized learning path

---

## 🤖 AI Tutor Features

### Core Functions
1. **24/7 Q&A**: Answer any English question
2. **Mistake Review**: Identify common errors
3. **Practice Suggestions**: Recommend next topics
4. **Progress Tracking**: Show achievements
5. **Motivation**: Streaks, encouragement

### UI Design
```
┌─────────────────────────────┐
│  💬 AI Tutor                │
├─────────────────────────────┤
│  You: Why "have been" here? │
│                             │
│  AI: "Have been" is Present │
│      Perfect Continuous...  │
│      [Example]              │
│      [Practice] [More]      │
└─────────────────────────────┘
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation Setup (Week 1-2) ⭐ START HERE
**Priority**: Create core structure first

- [ ] Create curriculum data structure
- [ ] Design lesson template component
- [ ] Build lesson navigation system
- [ ] Create 3 sample lessons (A1.1, A1.2, A1.3)
- [ ] Integrate lessons with existing Street Talk

**Files to create**:
- `data/curriculum.ts` - Lesson data structure
- `components/Lesson.tsx` - Lesson component
- `components/LessonNav.tsx` - Navigation
- `components/Dashboard.tsx` - New home screen

### Phase 2: Onboarding (Week 3)
- [ ] Build onboarding quiz UI
- [ ] Create level assessment logic
- [ ] Generate personalized path
- [ ] Store user preferences

**Files to create**:
- `components/Onboarding.tsx`
- `components/QuizQuestion.tsx`
- `services/personalization.ts`

### Phase 3: Content Development (Week 4-5)
- [ ] Write 10 complete A1 lessons
- [ ] Create flashcard system
- [ ] Build quiz/exercise system
- [ ] Add progress tracking

**Files to create**:
- `components/Flashcard.tsx`
- `components/Quiz.tsx`
- `services/progress.ts`

### Phase 4: AI Tutor (Week 6-7)
- [ ] Build Q&A chatbot interface
- [ ] Integrate with Groq API
- [ ] Add mistake analysis
- [ ] Create suggestion engine

**Files to create**:
- `components/AITutor.tsx`
- `services/tutorAI.ts`

### Phase 5: Polish & Expand (Week 8+)
- [ ] More Street Talk scenarios
- [ ] Level B content
- [ ] Gamification (badges, streaks)
- [ ] Social features (optional)

---

## 📁 New File Structure

```
NeoLingua/
├── components/
│   ├── Dashboard.tsx (NEW - main learning hub)
│   ├── Onboarding.tsx (NEW - initial quiz)
│   ├── Lesson.tsx (NEW - lesson player)
│   ├── LessonNav.tsx (NEW - lesson navigation)
│   ├── Flashcard.tsx (NEW - vocab practice)
│   ├── Quiz.tsx (NEW - exercises)
│   ├── AITutor.tsx (NEW - Q&A chatbot)
│   ├── ProgressTracker.tsx (NEW - progress display)
│   └── UrbanChat.tsx (EXISTING - keep as is)
│
├── data/
│   ├── curriculum.ts (NEW - all lessons)
│   ├── vocabulary.ts (NEW - word lists)
│   └── scenarios.ts (EXISTING - Street Talk)
│
├── services/
│   ├── personalization.ts (NEW - quiz logic)
│   ├── progress.ts (NEW - track learning)
│   ├── tutorAI.ts (NEW - AI tutor)
│   ├── googleTTS.ts (EXISTING)
│   └── groqAPI.ts (EXISTING in UrbanChat)
│
└── docs/
    ├── ROADMAP.md (THIS FILE)
    ├── CURRICULUM.md (NEW - detailed lessons)
    └── GROQ-SETUP.md (EXISTING)
```

---

## 💡 Key Principles

1. **Focus on Core**: Quality curriculum > many features
2. **Keep Street Talk**: It's the killer feature, integrate it
3. **Incremental**: Build phase by phase, test each
4. **User-Centric**: Always ask "does this help learning?"
5. **Mobile-First**: Most users learn on mobile

---

## 📝 Next Immediate Steps

**Week 1 Priority**:
1. Create curriculum data structure (`data/curriculum.ts`)
2. Build basic Lesson component
3. Create 3 sample lessons
4. Test lesson flow

**Why this order?**:
- Need solid foundation before onboarding
- Sample lessons help validate structure
- Can test with real content early

---

## 🎯 Success Metrics

After implementation, measure:
- User completion rate per lesson
- Time spent in Street Talk practice
- AI Tutor question frequency
- User retention (7-day, 30-day)
- Learning progress (A1 → A2 advancement)

---

**Last Updated**: 2026-01-02
**Status**: Planning → Implementation Phase 1
