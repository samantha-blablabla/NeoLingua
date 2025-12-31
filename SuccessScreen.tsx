
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
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-[#CCFF00]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-[#BFA3FF]/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="w-full bg-[#1C1C1E] rounded-[48px] p-10 relative overflow-hidden hard-shadow border border-zinc-800"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-white"></div>
        
        <div className="flex flex-col items-center text-center space-y-8 relative z-10">
          {/* Giant Celebration Icon */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-32 bg-[#CCFF00] rounded-[40px] flex items-center justify-center text-black clay-accent shadow-[0_20px_50px_rgba(204,255,0,0.3)]"
          >
            <FlameIcon size={64} color="black" />
          </motion.div>

          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-2"
            >
              <SparklesIcon size={16} color="#CCFF00" />
              <span className="text-[10px] font-sans font-black text-[#CCFF00] uppercase tracking-[0.4em]">SESSION COMPLETE</span>
            </motion.div>
            
            <h2 className="text-5xl font-heading font-black tracking-tighter text-white leading-[0.9] uppercase">
              You're<br/>Leveling Up!
            </h2>
          </div>

          {/* Stats Card */}
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 backdrop-blur-md rounded-[32px] p-6 border border-zinc-700/50">
              <p className="text-3xl font-heading font-black text-[#CCFF00] leading-none mb-1">+{1}</p>
              <p className="text-[9px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Lesson</p>
            </div>
            <div className="bg-zinc-800/50 backdrop-blur-md rounded-[32px] p-6 border border-zinc-700/50">
              <p className="text-3xl font-heading font-black text-[#BFA3FF] leading-none mb-1">{streak}</p>
              <p className="text-[9px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Day Streak</p>
            </div>
          </div>

          <p className="text-zinc-500 font-sans font-medium text-xs leading-relaxed max-w-[240px]">
            You've just conquered today's urban flow. Keep the momentum going!
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs mt-12"
      >
        <button 
          onClick={onReturn}
          className="w-full py-6 bg-[#CCFF00] text-black rounded-[28px] text-[12px] font-sans font-black uppercase tracking-[0.2em] clay-accent hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_rgba(204,255,0,0.2)]"
        >
          Back to Home
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessScreen;
