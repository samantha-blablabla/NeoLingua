/**
 * Add sample review items to localStorage for testing
 * Run this in browser console to populate review data
 */

const sampleReviews = [
  {
    vocabId: 'a1-1_hello',
    word: 'hello',
    meaning: 'xin chào',
    lessonId: 'a1-1',
    reviewCount: 0,
    easeFactor: 2.5,
    interval: 1,
    nextReviewDate: new Date().toISOString(), // Due today
    lastReviewDate: new Date().toISOString(),
    correctStreak: 0,
    totalCorrect: 0,
    totalReviews: 0
  },
  {
    vocabId: 'a1-1_goodbye',
    word: 'goodbye',
    meaning: 'tạm biệt',
    lessonId: 'a1-1',
    reviewCount: 0,
    easeFactor: 2.5,
    interval: 1,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: new Date().toISOString(),
    correctStreak: 0,
    totalCorrect: 0,
    totalReviews: 0
  },
  {
    vocabId: 'a1-1_please',
    word: 'please',
    meaning: 'làm ơn',
    lessonId: 'a1-1',
    reviewCount: 0,
    easeFactor: 2.5,
    interval: 1,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: new Date().toISOString(),
    correctStreak: 0,
    totalCorrect: 0,
    totalReviews: 0
  },
  {
    vocabId: 'a1-1_thank you',
    word: 'thank you',
    meaning: 'cảm ơn',
    lessonId: 'a1-1',
    reviewCount: 0,
    easeFactor: 2.5,
    interval: 1,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: new Date().toISOString(),
    correctStreak: 0,
    totalCorrect: 0,
    totalReviews: 0
  },
  {
    vocabId: 'a1-1_sorry',
    word: 'sorry',
    meaning: 'xin lỗi',
    lessonId: 'a1-1',
    reviewCount: 0,
    easeFactor: 2.5,
    interval: 1,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: new Date().toISOString(),
    correctStreak: 0,
    totalCorrect: 0,
    totalReviews: 0
  }
];

// Save to localStorage
localStorage.setItem('neolingua_vocab_reviews', JSON.stringify(sampleReviews));

console.log('✅ Added 5 sample review items!');
console.log('Reload the page to see the review card on Dashboard');
