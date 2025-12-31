
import { UserStats, Badge } from '../types';
import { BADGES } from '../components/BadgeGallery';

/**
 * Checks for newly unlocked badges based on the latest user stats.
 * Returns an array of IDs for badges that were JUST unlocked in this check.
 */
export const checkAndUnlockBadges = (stats: UserStats): string[] => {
  const newlyUnlocked: string[] = [];

  BADGES.forEach(badge => {
    // Skip if already unlocked
    if (stats.unlockedBadges.includes(badge.id)) return;

    let isEligible = false;

    switch (badge.id) {
      case 'newbie':
        // Task: Check if user completed their 1st Lesson
        isEligible = stats.lessonsCompleted >= 1;
        break;
      case 'urban-legend':
        isEligible = stats.streak >= 7;
        break;
      case 'midnight-hustle':
        // Logic for night time study could be added here
        break;
      case 'perfectionist':
        isEligible = stats.perfectTests >= 10;
        break;
      case 'street-smart':
        // Task: Listen continuously 5 days or 5 podcasts
        isEligible = stats.streak >= 5 || stats.podcastsCompleted >= 5;
        break;
      case 'fast-learner':
        break;
    }

    if (isEligible) {
      newlyUnlocked.push(badge.id);
    }
  });

  return newlyUnlocked;
};

/**
 * Persist user stats to local storage.
 * Equivalent to AsyncStorage in React Native for web.
 */
export const syncUserStats = (stats: UserStats) => {
  localStorage.setItem('neolingua_stats', JSON.stringify(stats));
};
