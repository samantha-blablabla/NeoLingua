/**
 * Spaced Repetition Algorithm
 *
 * Implements a simplified SM-2 algorithm for vocabulary review scheduling
 * Based on SuperMemo's spaced repetition research
 */

export interface VocabReviewItem {
  vocabId: string;
  word: string;
  meaning: string;
  lessonId: string;

  // Review tracking
  reviewCount: number;           // How many times reviewed
  easeFactor: number;             // Difficulty multiplier (1.3 - 2.5)
  interval: number;               // Days until next review
  nextReviewDate: string;         // ISO date string
  lastReviewDate: string;         // ISO date string

  // Performance tracking
  correctStreak: number;          // Consecutive correct answers
  totalCorrect: number;           // Total correct reviews
  totalReviews: number;           // Total review attempts
}

export interface ReviewSession {
  sessionId: string;
  date: string;
  vocabReviewed: number;
  accuracy: number;
}

/**
 * Initial review intervals (in days)
 * Based on spaced repetition best practices
 */
const REVIEW_INTERVALS = {
  FIRST: 1,      // Review after 1 day
  SECOND: 3,     // Review after 3 days
  THIRD: 7,      // Review after 1 week
  FOURTH: 14,    // Review after 2 weeks
  FIFTH: 30,     // Review after 1 month
  SIXTH: 60,     // Review after 2 months
};

/**
 * Creates a new vocabulary review item when user first learns a word
 */
export function createVocabReviewItem(
  vocabId: string,
  word: string,
  meaning: string,
  lessonId: string
): VocabReviewItem {
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + REVIEW_INTERVALS.FIRST);

  return {
    vocabId,
    word,
    meaning,
    lessonId,
    reviewCount: 0,
    easeFactor: 2.5, // Default ease factor
    interval: REVIEW_INTERVALS.FIRST,
    nextReviewDate: nextReview.toISOString(),
    lastReviewDate: now.toISOString(),
    correctStreak: 0,
    totalCorrect: 0,
    totalReviews: 0,
  };
}

/**
 * Calculates next review date based on performance
 *
 * @param item - Current vocab item
 * @param quality - Answer quality (0-5)
 *   5: Perfect recall
 *   4: Correct with hesitation
 *   3: Correct with difficulty
 *   2: Incorrect but remembered
 *   1: Incorrect, barely remembered
 *   0: Complete blackout
 */
export function calculateNextReview(
  item: VocabReviewItem,
  quality: number
): VocabReviewItem {
  const isCorrect = quality >= 3;

  // Update performance tracking
  const newTotalReviews = item.totalReviews + 1;
  const newTotalCorrect = item.totalCorrect + (isCorrect ? 1 : 0);
  const newCorrectStreak = isCorrect ? item.correctStreak + 1 : 0;

  // Calculate new ease factor (SM-2 algorithm)
  let newEaseFactor = item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Clamp ease factor between 1.3 and 2.5
  newEaseFactor = Math.max(1.3, Math.min(2.5, newEaseFactor));

  // Calculate new interval
  let newInterval: number;

  if (quality < 3) {
    // If answered incorrectly, reset to first interval
    newInterval = REVIEW_INTERVALS.FIRST;
  } else {
    // If answered correctly, increase interval
    if (item.reviewCount === 0) {
      newInterval = REVIEW_INTERVALS.FIRST;
    } else if (item.reviewCount === 1) {
      newInterval = REVIEW_INTERVALS.SECOND;
    } else {
      // Use ease factor to calculate next interval
      newInterval = Math.round(item.interval * newEaseFactor);
    }
  }

  // Calculate next review date
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    ...item,
    reviewCount: item.reviewCount + 1,
    easeFactor: newEaseFactor,
    interval: newInterval,
    nextReviewDate: nextReview.toISOString(),
    lastReviewDate: now.toISOString(),
    correctStreak: newCorrectStreak,
    totalCorrect: newTotalCorrect,
    totalReviews: newTotalReviews,
  };
}

/**
 * Gets all vocabulary items that are due for review
 */
export function getDueReviews(items: VocabReviewItem[]): VocabReviewItem[] {
  const now = new Date();

  return items
    .filter(item => new Date(item.nextReviewDate) <= now)
    .sort((a, b) => {
      // Sort by next review date (oldest first)
      return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
    });
}

/**
 * Gets vocabulary items due for review in the next N days
 */
export function getUpcomingReviews(items: VocabReviewItem[], days: number = 7): VocabReviewItem[] {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + days);

  return items
    .filter(item => {
      const reviewDate = new Date(item.nextReviewDate);
      return reviewDate > now && reviewDate <= futureDate;
    })
    .sort((a, b) => {
      return new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime();
    });
}

/**
 * Calculates mastery level based on performance metrics
 * Returns: 'learning' | 'reviewing' | 'mastered'
 */
export function getMasteryLevel(item: VocabReviewItem): 'learning' | 'reviewing' | 'mastered' {
  const accuracy = item.totalReviews > 0 ? item.totalCorrect / item.totalReviews : 0;

  if (item.reviewCount < 3) {
    return 'learning';
  } else if (item.correctStreak >= 5 && accuracy >= 0.8 && item.interval >= REVIEW_INTERVALS.FOURTH) {
    return 'mastered';
  } else {
    return 'reviewing';
  }
}

/**
 * Saves review items to localStorage
 */
export function saveReviewItems(items: VocabReviewItem[]): void {
  localStorage.setItem('neolingua_vocab_reviews', JSON.stringify(items));
}

/**
 * Loads review items from localStorage
 */
export function loadReviewItems(): VocabReviewItem[] {
  const saved = localStorage.getItem('neolingua_vocab_reviews');
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load review items:', error);
    return [];
  }
}

/**
 * Saves review session to history
 */
export function saveReviewSession(session: ReviewSession): void {
  const saved = localStorage.getItem('neolingua_review_history');
  const history: ReviewSession[] = saved ? JSON.parse(saved) : [];

  history.push(session);

  // Keep only last 30 sessions
  if (history.length > 30) {
    history.shift();
  }

  localStorage.setItem('neolingua_review_history', JSON.stringify(history));
}

/**
 * Gets review statistics
 */
export function getReviewStats(items: VocabReviewItem[]): {
  total: number;
  learning: number;
  reviewing: number;
  mastered: number;
  dueToday: number;
  dueThisWeek: number;
} {
  const dueToday = getDueReviews(items);
  const dueThisWeek = getUpcomingReviews(items, 7);

  const stats = items.reduce(
    (acc, item) => {
      const level = getMasteryLevel(item);
      acc[level]++;
      return acc;
    },
    { learning: 0, reviewing: 0, mastered: 0 }
  );

  return {
    total: items.length,
    ...stats,
    dueToday: dueToday.length,
    dueThisWeek: dueThisWeek.length,
  };
}
