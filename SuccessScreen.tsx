
import React from 'react';
import { motion } from 'framer-motion';
import { FlameIcon, SparklesIcon } from './components/Icons';

interface SuccessScreenProps {
  streak: number;
  onReturn: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ streak, onReturn }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-between px-8 py-16 overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Top Section: Celebration */}
      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-10 z-10">
        
        {/* Giant Flame Icon with "Haptic" Entrance */}
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ 
            scale: [0, 1.2, 1], 
            rotate: [0, -10, 10, -5, 5, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 0.6, 
            times: [0, 0.5, 1],
            rotate: { duration: 0.5, delay: 0.2 } 
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#CCFF00] blur-3xl opacity-20 rounded-full scale-150"></div>
          <div className="w-32 h-32 bg-[#CCFF00] rounded-[40px] flex items-center justify-center text-black clay-accent shadow-[0_25px_50px_rgba(204,255,0,0.3)] relative z-10">
            <FlameIcon size={72} color="black" />
          </div>
        </motion.div>

        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[3.5rem] font-heading font-black tracking-tighter text-white leading-[0.85] uppercase"
          >
            Vibe Check<br/>Passed
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-zinc-500 font-sans font-medium text-[15px] max-w-[280px] mx-auto leading-relaxed"
          >
            Cậu vừa hoàn thành bài học hôm nay. Streak của cậu đã tăng lên 1 ngày!
          </motion.p>
        </div>

        {/* Minimalist Streak Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          className="w-full max-w-[280px] bg-[#1C1C1E] rounded-[32px] p-8 border border-zinc-800/50 hard-shadow relative overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-white"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-sans font-black text-zinc-600 uppercase tracking-[0.3em]">CURRENT STREAK</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-heading font-black text-[#CCFF00]">{streak}</span>
              <span className="text-xl font-heading font-black text-white uppercase opacity-40">Days</span>
            </div>
          </div>
          
          {/* Decorative Sparkles */}
          <div className="absolute top-4 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <SparklesIcon size={16} color="#CCFF00" />
          </div>
        </motion.div>
      </div>

      {/* Footer: Action Button */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full z-10"
      >
        <button 
          onClick={onReturn}
          className="w-full py-7 bg-[#CCFF00] text-black rounded-[24px] text-[13px] font-sans font-black uppercase tracking-[0.25em] clay-accent hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.2)]"
        >
          Back to Home
        </button>
      </motion.div>

      {/* Ambient Noise Component is already handled by GrainOverlay in App.tsx */}
    </motion.div>
  );
};

export default SuccessScreen;
