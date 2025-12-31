
export interface VocabularyItem {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
}

export interface LessonData {
  week: number;
  day: string;
  topic: string;
  vocab_set: VocabularyItem[];
  grammar_focus: string;
  podcast_content: string;
  interactive_challenge: {
    type: string;
    question: string;
    options?: string[];
    correct_answer: string;
  };
}

export enum ThemeColors {
  BACKGROUND = '#0A0A0A',
  ACCENT = '#CCFF00',
  SECONDARY_PURPLE = '#BFA3FF',
  SECONDARY_CORAL = '#FF6B4A',
  TEXT_PRIMARY = '#FFFFFF',
  TEXT_SECONDARY = '#A0A0A0'
}
