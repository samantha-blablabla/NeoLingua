
import { UserStats, CriteriaType, Badge } from '../types';
import { BADGES } from '../components/BadgeGallery';

/**
 * Kiểm tra xem người dùng có đủ điều kiện mở khóa huy hiệu mới không.
 * Trả về danh sách các huy hiệu vừa được mở khóa.
 */
export const checkAndUnlockBadges = (stats: UserStats): string[] => {
  const newlyUnlocked: string[] = [];

  BADGES.forEach(badge => {
    // Nếu đã mở khóa rồi thì bỏ qua
    if (stats.unlockedBadges.includes(badge.id)) return;

    let isEligible = false;

    switch (badge.id) {
      case 'newbie':
        isEligible = stats.lessonsCompleted >= 1;
        break;
      case 'urban-legend':
        isEligible = stats.streak >= 7;
        break;
      case 'perfectionist':
        isEligible = stats.perfectTests >= 10;
        break;
      case 'social-butterfly':
        isEligible = stats.podcastsCompleted >= 5;
        break;
      // Các huy hiệu khác như 'midnight-hustle' hoặc 'fast-learner' 
      // sẽ cần logic đặc thù hơn khi thực hiện hành động.
    }

    if (isEligible) {
      newlyUnlocked.push(badge.id);
    }
  });

  return newlyUnlocked;
};

/**
 * Lưu trạng thái huy hiệu vào localStorage
 */
export const saveUnlockedBadges = (badgeIds: string[]) => {
  const stats = JSON.parse(localStorage.getItem('neolingua_stats') || '{}');
  const updatedStats = {
    ...stats,
    unlockedBadges: Array.from(new Set([...(stats.unlockedBadges || []), ...badgeIds]))
  };
  localStorage.setItem('neolingua_stats', JSON.stringify(updatedStats));
};
