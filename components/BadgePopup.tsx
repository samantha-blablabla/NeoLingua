
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../types';
// Corrected import: BadgeSocialIcon was changed to BadgeRamenIcon
import { 
  BadgeRookieIcon, 
  BadgeLegendIcon, 
  BadgeOwlIcon, 
  BadgeSonicIcon, 
  BadgeMasterIcon, 
  BadgeRamenIcon,
  SparklesIcon 
} from './Icons';

// Corrected mapping: badge 'social' now maps to BadgeRamenIcon
const ICON_MAP: Record<string, any> = {
  sneaker: BadgeRookieIcon,
  headphones: BadgeLegendIcon,
  coffee: BadgeOwlIcon,
  flash: BadgeSonicIcon,
  medal: BadgeMasterIcon,
  social: BadgeRamenIcon
};

interface BadgePopupProps {
  badge: Badge | null;
  isVisible: boolean;
  onClose: () => void;
}

const ConfettiParticle: React.FC<{ index: number }> = ({ index }) => {
  const colors = ['#CCFF00', '#FFFFFF', '#3B82F6', '#FF6B4A'];
  const color = colors[index % colors.length];
  const size = Math.random() * 8 + 4;
  
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ 
        x: (Math.random() - 0.5) * 500, 
        y: (Math.random() - 0.5) * 500 - 150, 
        opacity: 0,
        scale: 1,
        rotate: 360
      }}
      transition={{ duration: 2, ease: "easeOut", delay: Math.random() * 0.3 }}
      className="absolute"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color,
        borderRadius: index % 3 === 0 ? '50%' : '2px'
      }}
    />
  );
};

const BadgePopup: React.FC<BadgePopupProps> = ({ badge, isVisible, onClose }) => {
  if (!badge) return null;
  const Icon = ICON_MAP[badge.icon] || BadgeMasterIcon;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          <motion.div 
            initial={{ scale: 0.7, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 100 }}
            className="relative w-full max-w-[340px] bg-[#121212] rounded-[48px] border border-[#CCFF00]/20 p-10 flex flex-col items-center text-center shadow-[0_0_100px_rgba(204,255,0,0.1)] overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              {[...Array(40)].map((_, i) => <ConfettiParticle key={i} index={i} />)}
            </div>

            <motion.div 
              initial={{ y: 40, scale: 0 }}
              animate={{ y: [40, -30, 0], scale: [0, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, type: "spring", stiffness: 200, damping: 15 }}
              className="w-40 h-40 bg-[#CCFF00]/5 rounded-[44px] flex items-center justify-center mb-10 relative z-10 border border-[#CCFF00]/10"
            >
              <Icon size={100} />
              <div className="absolute -top-4 -right-4">
                <SparklesIcon size={32} color="#CCFF00" className="animate-pulse" />
              </div>
            </motion.div>

            <div className="space-y-4 z-10">
              <h2 className="text-[#3B82F6] font-sans font-black text-[11px] tracking-[0.5em] uppercase">
                NEW ACHIEVEMENT
              </h2>
              <h3 className="text-4xl font-heading font-black text-white tracking-tighter uppercase leading-[0.9]">
                {badge.title}
              </h3>
              <p className="text-zinc-500 font-sans font-medium text-sm leading-relaxed max-w-[200px] mx-auto">
                {badge.description}
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="mt-12 w-full py-5 bg-[#CCFF00] text-black rounded-3xl font-sans font-black text-[13px] tracking-[0.2em] uppercase clay-accent shadow-[0_20px_40_rgba(204,255,0,0.2)]"
            >
              HELL YEAH!
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BadgePopup;
