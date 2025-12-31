
export interface VocabularyItem {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
}

export interface PodcastSegment {
  en: string;
  vi: string;
  startTime?: number;
}

export interface LessonData {
  week: number;
  day: string;
  topic: string;
  vocab_set: VocabularyItem[];
  grammar_focus: string;
  podcast_segments: PodcastSegment[];
  interactive_challenge: {
    type: string;
    question: string;
    options?: string[];
    correct_answer: string;
  };
}

export interface UserStats {
  lessonsCompleted: number;
  streak: number;
  perfectTests: number;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  howToUnlock: string;
  // Fix: Added 'social' to allow usage in BadgeGallery.tsx
  icon: 'sneaker' | 'headphones' | 'coffee' | 'flash' | 'medal' | 'social';
}

export enum ThemeColors {
  BACKGROUND = '#0A0A0A',
  ACCENT = '#CCFF00',
  SECONDARY_PURPLE = '#BFA3FF',
  SECONDARY_CORAL = '#FF6B4A',
  TEXT_PRIMARY = '#FFFFFF',
  TEXT_SECONDARY = '#A0A0A0'
}
