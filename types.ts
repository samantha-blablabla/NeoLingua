
export interface VocabularyItem {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  id: string;
}

export interface PodcastSegment {
  en: string;
  vi: string;
  emotion?: string; // SSML-like hint: 'cheerful', 'serious', 'whisper'
}

export type RoadmapStage = 'Urban Newbie' | 'Street Smart' | 'Professional Hustler' | 'Urban Legend';

export interface LessonData {
  id: string;
  level: number; // 1 to 8
  roadmapStage: RoadmapStage;
  tags: string[];
  topic: string;
  warmup: {
    intro: string;
    keywords: string[];
  };
  podcast_segments: PodcastSegment[];
  vocab_spotlight: VocabularyItem[];
  daily_challenge: {
    question: string;
    options: string[];
    correct_answer: string;
    urban_context: string;
  };
  real_world_mission: {
    task: string;
    platform: 'LinkedIn' | 'Twitter' | 'Slack' | 'Tinder' | 'Email' | 'IRL';
    description: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  howToUnlock: string; // Added to resolve errors in BadgeGallery.tsx
  levelRequired?: number; // Made optional as it's not provided in the BadgeGallery static data
}

export interface UserStats {
  currentLevel: number;
  lessonsCompleted: number;
  streak: number;
  unlockedBadges: string[];
  savedVocab: any[];
  xp: number;
  perfectTests: number; // Added to resolve errors in badgeService.ts
  podcastsCompleted: number; // Added to resolve errors in badgeService.ts
}
