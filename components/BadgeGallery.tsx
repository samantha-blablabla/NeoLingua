
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../types';
import { SneakerIcon, HeadphonesIcon, CoffeeIcon } from './Icons';

const ICON_MAP = {
  sneaker: SneakerIcon,
  headphones: HeadphonesIcon,
  coffee: CoffeeIcon,
};

interface BadgeGalleryProps {
  unlockedBadges: string[];
}

const BADGES: Badge[] = [
  { id: 'newbie', title: 'Newbie', description: 'Complete 1st lesson', icon: 'sneaker' },
  { id: 'urban-legend', title: 'Urban Legend', description: '7-day streak', icon: 'headphones' },
  { id: 'polyglot', title: 'Polyglot', description: '10 perfect tests', icon: 'coffee' },
];

const BadgeItem: React.FC<{ badge: Badge; isUnlocked: boolean; index: number }> = ({ badge, isUnlocked, index }) => {
  const Icon = ICON_MAP[badge.icon];
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "circOut" }}
      className="flex flex-col items-center gap-3"
    >
      <div 
        className={`w-24 h-24 rounded-3xl flex items-center justify-center relative transition-all duration-700
          ${isUnlocked 
            ? 'bg-[#1a1a1a] border border-[#CCFF00]/40 clay-accent shadow-[0_0_20px_rgba(204,255,0,0.1)]' 
            : 'bg-[#111] border border-zinc-800 opacity-40 grayscale'
          }`}
        style={{
          boxShadow: isUnlocked 
            ? '12px 12px 24px #050505, -12px -12px 24px #1a1a1a, inset 4px 4px 10px rgba(255,255,255,0.05), inset -4px -4px 10px rgba(0,0,0,0.4)'
            : 'none'
        }}
      >
        <Icon size={40} color={isUnlocked ? '#CCFF00' : '#444'} />
        {isUnlocked && (
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#CCFF00] rounded-full shadow-[0_0_10px_#CCFF00]" />
        )}
      </div>
      <div className="text-center">
        <p className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-[#CCFF00]' : 'text-zinc-600'}`}>
          {badge.title}
        </p>
        <p className="text-[8px] font-bold text-zinc-500 uppercase mt-0.5 max-w-[80px] leading-tight">
          {badge.description}
        </p>
      </div>
    </motion.div>
  );
};

const BadgeGallery: React.FC<BadgeGalleryProps> = ({ unlockedBadges }) => {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Achievement Gallery</h3>
        <span className="text-[10px] font-bold text-[#BFA3FF] uppercase">
          {unlockedBadges.length}/{BADGES.length} Unlocked
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {BADGES.map((badge, idx) => (
          <BadgeItem 
            key={badge.id} 
            badge={badge} 
            isUnlocked={unlockedBadges.includes(badge.id)} 
            index={idx}
          />
        ))}
      </div>
    </section>
  );
};

export default BadgeGallery;
