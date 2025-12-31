
export interface VocabularyItem {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  id: string;
  nuance_vi?: string; // Giải thích sâu về cách dùng trong thực tế
}

export interface PodcastSegment {
  en: string;
  vi: string;
  emotion?: string; 
  ambient_sound?: string; // Ví dụ: "coffee_shop_noise", "city_traffic"
}

export type RoadmapStage = 'Urban Newbie' | 'Street Smart' | 'Professional Hustler' | 'Urban Legend';

export interface Badge {
  id: string;
  title: string;
  description: string;
  howToUnlock: string;
  icon: string;
}

export interface LessonData {
  id: string;
  level: number;
  roadmapStage: RoadmapStage;
  tags: string[];
  topic: string;
  // Cập nhật thành song ngữ
  urban_logic?: {
    en: string;
    vi: string;
  }; 
  warmup: {
    intro: string;
    keywords: string[];
  };
  grammar_focus?: {
    point: string;
    vi_explain: string;
    example: string;
  };
  podcast_segments: PodcastSegment[];
  vocab_spotlight: VocabularyItem[];
  daily_challenge: {
    question: string;
    options: string[];
    correct_answer: string;
    urban_context: string;
    explanation_vi: string; 
  };
  real_world_mission: {
    task: string;
    platform: 'LinkedIn' | 'Twitter' | 'Slack' | 'Tinder' | 'Email' | 'IRL';
    description: string;
  };
}

export interface UserStats {
  currentLevel: number;
  lessonsCompleted: number;
  streak: number;
  unlockedBadges: string[];
  savedVocab: any[];
  favoriteLessons: string[];
  xp: number;
  perfectTests: number;
  podcastsCompleted: number;
}
