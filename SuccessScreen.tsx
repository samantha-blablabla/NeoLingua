
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlameIcon, SparklesIcon } from './components/Icons';

interface SuccessScreenProps {
  streak: number;
  onReturn: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ streak, onReturn }) => {
  useEffect(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col overflow-y-auto no-scrollbar"
    >
      {/* Background Glows */}
      <div className="fixed top-1/4 left-1/4 w-[60%] h-[40%] bg-[#FF6B4A]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[60%] h-[40%] bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex-1 flex flex-col items-center min-h-screen px-8 py-12 z-10">
        {/* Top Section: Celebration */}
        <div className="flex-1 flex flex-col items-center justify-center w-full space-y-10 py-10">
          
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
            <div className="absolute inset-0 bg-[#FF6B4A] blur-3xl opacity-20 rounded-full scale-150"></div>
            <div className="w-32 h-32 bg-[#FF6B4A] rounded-[40px] flex items-center justify-center text-white clay-accent shadow-[0_25px_50px_rgba(255,107,74,0.3)] relative z-10">
              <FlameIcon size={72} color="white" />
            </div>
          </motion.div>

          <div className="text-center space-y-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[3.5rem] font-heading font-black tracking-tighter text-white leading-[0.85] uppercase"
            >
              Vibe Check<br/><span className="text-[#FF6B4A]">Passed</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-zinc-500 font-sans font-medium text-[15px] max-w-[280px] mx-auto leading-relaxed"
            >
              Cậu vừa hoàn thành bài học hôm nay. Streak của cậu đã tăng thêm 1 ngày!
            </motion.p>
          </div>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="w-full max-w-[280px] bg-[#1C1C1E] rounded-[32px] p-8 border border-[#FF6B4A]/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[#FF6B4A]"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-sans font-black text-zinc-600 uppercase tracking-[0.3em]">CURRENT STREAK</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-heading font-black text-[#FF6B4A]">{streak}</span>
                <span className="text-xl font-heading font-black text-white uppercase opacity-40">Days</span>
              </div>
            </div>
            
            <div className="absolute top-4 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <SparklesIcon size={16} color="#FF6B4A" />
            </div>
          </motion.div>
        </div>

        {/* Action Button Section with SafeArea Padding */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full pb-[40px] mt-8"
        >
          <button 
            onClick={onReturn}
            className="w-full h-[56px] bg-[#CCFF00] text-black rounded-[20px] text-[12px] font-sans font-black uppercase tracking-[0.25em] clay-accent hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.2)]"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuccessScreen;
