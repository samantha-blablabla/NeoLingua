
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson } from './services/geminiService';
import { LessonData, ThemeColors } from './types';
import GrainOverlay from './components/GrainOverlay';
import { HomeIcon, BookIcon, FlashIcon, UserIcon, MoreIcon } from './components/Icons';

const App: React.FC = () => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewLesson = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await generateLesson();
      setLesson(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewLesson();
  }, [fetchNewLesson]);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-[#0A0A0A] shadow-2xl border-x border-zinc-900 overflow-hidden">
      <GrainOverlay />
      
      {/* Header */}
      <header className="p-6 pt-10 flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-heading font-extrabold tracking-tighter text-[#CCFF00]">
            NEOLINGUA
          </h1>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">
            Urban AI Learning
          </p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:border-[#CCFF00] transition-colors"
        >
          <UserIcon size={24} color="#CCFF00" />
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 no-scrollbar">
        
        {/* Statistics Bar */}
        <div className="flex gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 clay-card"
          >
            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">STREAK</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold text-[#FF6B4A]">12</span>
              <span className="text-xs text-zinc-400">Days</span>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 clay-card"
          >
            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">EXP</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-heading font-bold text-[#BFA3FF]">2,480</span>
              <span className="text-xs text-zinc-400">Total</span>
            </div>
          </motion.div>
        </div>

        {/* Today's Lesson Card */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-bold">Bài học hôm nay</h2>
            <button 
              onClick={fetchNewLesson}
              className="text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] hover:underline"
            >
              Làm mới
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={lesson ? lesson.vocabulary : 'loading'}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 100, damping: 15 }
              }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="relative group overflow-hidden bg-zinc-900 rounded-[32px] p-8 border border-zinc-800/50 clay-card min-h-[420px] flex flex-col justify-between"
            >
              {/* Grain Texture (Local) */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-white"></div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-20 flex-1">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#CCFF00]/20 border-t-[#CCFF00] rounded-full"
                  />
                  <p className="text-zinc-500 font-heading animate-pulse">AI đang soạn giáo án...</p>
                </div>
              ) : error ? (
                <div className="py-20 text-center flex-1 flex flex-col justify-center items-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button onClick={fetchNewLesson} className="px-6 py-2 bg-[#CCFF00] text-black font-bold rounded-full clay-accent">Thử lại</button>
                </div>
              ) : lesson ? (
                <>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="inline-block px-3 py-1 bg-[#CCFF00] text-black text-[10px] font-black rounded-full mb-3 uppercase tracking-tighter clay-accent">
                        WORD OF THE DAY
                      </span>
                      <h3 className="text-5xl font-heading font-black text-white tracking-tighter">
                        {lesson.vocabulary}
                      </h3>
                      <p className="text-[#BFA3FF] font-medium text-lg mt-1">
                        /{lesson.pronunciation}/
                      </p>
                    </motion.div>

                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800/50 clay-card">
                        <p className="text-zinc-400 text-sm leading-relaxed italic">
                          "{lesson.example}"
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-[#CCFF00] uppercase mb-1">Challenge</h4>
                        <p className="text-sm text-zinc-300">
                          {lesson.challenge}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="mt-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button className="w-full py-5 bg-[#CCFF00] text-black font-heading font-black text-lg rounded-[20px] shadow-[0_8px_0_0_#AACC00] active:shadow-none active:translate-y-1 transition-all clay-accent">
                      START PRACTICE
                    </button>
                  </motion.div>
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-[#BFA3FF] rounded-[28px] text-black clay-accent cursor-pointer"
          >
            <FlashIcon size={32} className="mb-4" />
            <h4 className="font-heading font-bold text-lg leading-tight">Flashcards</h4>
            <p className="text-[10px] font-black opacity-60 uppercase mt-1">24 Review Today</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-[#FF6B4A] rounded-[28px] text-black clay-accent cursor-pointer"
          >
            <BookIcon size={32} className="mb-4" />
            <h4 className="font-heading font-bold text-lg leading-tight">Grammar</h4>
            <p className="text-[10px] font-black opacity-60 uppercase mt-1">New Unit Available</p>
          </motion.div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/80 backdrop-blur-xl border-t border-zinc-800 px-8 py-4 flex justify-between items-center z-[50]">
        <button className="flex flex-col items-center gap-1 text-[#CCFF00]">
          <HomeIcon size={24} />
          <span className="text-[9px] font-bold uppercase">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-600 hover:text-white transition-colors">
          <BookIcon size={24} />
          <span className="text-[9px] font-bold uppercase">Library</span>
        </button>
        <motion.div 
          whileHover={{ scale: 1.1, y: -40 }}
          className="w-14 h-14 bg-[#CCFF00] rounded-full flex items-center justify-center -translate-y-8 shadow-xl shadow-[#CCFF00]/20 border-[6px] border-[#0A0A0A] clay-accent"
        >
          <FlashIcon size={28} color="black" />
        </motion.div>
        <button className="flex flex-col items-center gap-1 text-zinc-600 hover:text-white transition-colors">
          <UserIcon size={24} />
          <span className="text-[9px] font-bold uppercase">Stats</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-600 hover:text-white transition-colors">
          <MoreIcon size={24} />
          <span className="text-[9px] font-bold uppercase">Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
