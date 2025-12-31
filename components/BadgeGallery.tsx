
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../types';
import { 
  BadgeRookieIcon, 
  BadgeLegendIcon, 
  BadgeOwlIcon, 
  BadgeSonicIcon, 
  BadgeMasterIcon, 
  BadgeSocialIcon,
  CloseIcon 
} from './Icons';

const ICON_MAP: Record<string, any> = {
  sneaker: BadgeRookieIcon,
  headphones: BadgeLegendIcon,
  coffee: BadgeOwlIcon,
  flash: BadgeSonicIcon,
  medal: BadgeMasterIcon,
  social: BadgeSocialIcon
};

interface BadgeGalleryProps {
  unlockedBadges: string[];
}

export const BADGES: Badge[] = [
  { id: 'newbie', title: 'Urban Rookie', description: 'Hoàn thành bài học đầu tiên.', howToUnlock: 'Bắt đầu hành trình bằng việc hoàn thành 01 bài học bất kỳ.', icon: 'sneaker' },
  { id: 'urban-legend', title: 'Urban Legend', description: 'Duy trì 7 ngày liên tiếp.', howToUnlock: 'Học tiếng Anh mỗi ngày trong suốt 1 tuần không nghỉ.', icon: 'headphones' },
  { id: 'midnight-hustle', title: 'Night Owl', description: 'Học sau 10 giờ đêm.', howToUnlock: 'Hoàn thành một bài học trong khung giờ từ 22h - 04h sáng.', icon: 'coffee' },
  { id: 'fast-learner', title: 'Sonic Wave', description: 'Hoàn thành bài học dưới 5 phút.', howToUnlock: 'Tốc độ là chìa khóa. Hoàn thành bài học thật nhanh và chính xác.', icon: 'flash' },
  { id: 'perfectionist', title: 'Master Mind', description: '10 bài học đạt điểm tuyệt đối.', howToUnlock: 'Hoàn thành 10 thử thách mà không sai một câu nào.', icon: 'medal' },
  { id: 'social-butterfly', title: 'District 1 Star', description: 'Nghe 5 tập Podcast.', howToUnlock: 'Đắm mình trong văn hóa đô thị qua 05 tập Podcast Radio.', icon: 'social' },
];

const BadgeModal: React.FC<{ badge: Badge; isUnlocked: boolean; onClose: () => void }> = ({ badge, isUnlocked, onClose }) => {
  const Icon = ICON_MAP[badge.icon];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#1C1C1E] w-full max-w-xs rounded-[40px] p-8 border border-white/10 shadow-2xl flex flex-col items-center text-center relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
          <CloseIcon size={20} />
        </button>

        <div className={`w-32 h-32 rounded-[32px] flex items-center justify-center mb-6 transition-all duration-700 ${isUnlocked ? 'bg-[#CCFF00]/10 shadow-[0_0_40px_rgba(204,255,0,0.2)]' : 'grayscale brightness-50'}`}>
          <Icon size={80} color={isUnlocked ? "#CCFF00" : "#444"} />
        </div>

        <h3 className={`text-2xl font-heading font-black tracking-tighter mb-2 ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
          {badge.title}
        </h3>
        
        <p className="text-zinc-400 text-sm font-medium mb-6 leading-relaxed">
          {badge.description}
        </p>

        <div className="w-full p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest mb-1">CÁCH MỞ KHÓA</p>
          <p className="text-[11px] text-zinc-500 font-medium italic">{badge.howToUnlock}</p>
        </div>

        {isUnlocked ? (
          <div className="mt-6 px-6 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full">
            <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest">ĐÃ SỞ HỮU</span>
          </div>
        ) : (
          <div className="mt-6 px-6 py-2 bg-zinc-800 rounded-full">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">CHƯA MỞ KHÓA</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const BadgeGallery: React.FC<BadgeGalleryProps> = ({ unlockedBadges }) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-end px-2">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">COLLECTION</h3>
          <h2 className="text-3xl font-heading font-black tracking-tighter">Achievements</h2>
        </div>
        <div className="bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800">
           <span className="text-[12px] font-black text-[#CCFF00]">{unlockedBadges.length}/{BADGES.length}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-y-10 gap-x-4">
        {BADGES.map((badge, idx) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const Icon = ICON_MAP[badge.icon];
          
          return (
            <motion.div 
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedBadge(badge)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div 
                className={`w-24 h-24 rounded-[32px] flex items-center justify-center relative transition-all duration-500
                  ${isUnlocked 
                    ? 'bg-zinc-900 border border-[#CCFF00]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
                    : 'bg-zinc-900/30 border border-zinc-800/30 grayscale contrast-50 opacity-40'
                  } group-hover:scale-110 active:scale-95`}
              >
                <Icon size={56} color={isUnlocked ? '#CCFF00' : '#444'} />
                
                {isUnlocked && (
                  <motion.div 
                    layoutId={`glow-${badge.id}`}
                    className="absolute inset-0 rounded-[32px] bg-[#CCFF00]/5 blur-xl pointer-events-none"
                  />
                )}
              </div>
              
              <div className="text-center">
                <p className={`text-[9px] font-black uppercase tracking-[0.15em] truncate max-w-[90px] ${isUnlocked ? 'text-white' : 'text-zinc-700'}`}>
                  {badge.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <BadgeModal 
            badge={selectedBadge} 
            isUnlocked={unlockedBadges.includes(selectedBadge.id)} 
            onClose={() => setSelectedBadge(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default BadgeGallery;
