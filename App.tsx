
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson } from './services/geminiService';
import { LessonData, UserStats } from './types';
import GrainOverlay from './components/GrainOverlay';
import { HomeIcon, LibraryIcon, MedalIcon, UserIcon, SparklesIcon, HeadphonesIcon } from './components/Icons';
import PodcastScreen from './PodcastScreen';
import SuccessScreen from './SuccessScreen';
import LessonDetailScreen from './LessonDetailScreen';

const App: React.FC = () => {
  const [view, setView] = useState('home');
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats] = useState<UserStats>({ lessonsCompleted: 0, streak: 5, perfectTests: 0, unlockedBadges: ['newbie'] });

  useEffect(() => {
    generateLesson(1, "Monday").then(data => { setLesson(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col max-w-md mx-auto border-x border-zinc-900 relative overflow-hidden">
      <GrainOverlay />
      <AnimatePresence>
        {view === 'podcast' && lesson && <PodcastScreen lesson={lesson} onBack={() => setView('home')} />}
        {view === 'lessonDetail' && lesson && <LessonDetailScreen lesson={lesson} onFinish={() => setView('success')} onBack={() => setView('home')} />}
        {view === 'success' && <SuccessScreen streak={userStats.streak} onReturn={() => setView('home')} />}
      </AnimatePresence>

      <header className="p-8 pt-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black font-black">A</div>
          <div><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LEVEL 12</p><h1 className="text-xl font-black -mt-1">Yo, Alex!</h1></div>
        </div>
        <div className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 flex items-center gap-2"><SparklesIcon size={12} color="#CCFF00" /><span className="text-[10px] font-black text-[#CCFF00]">{userStats.streak} DAYS</span></div>
      </header>

      <main className="flex-1 px-8 space-y-6 overflow-y-auto no-scrollbar pb-32">
        <section onClick={() => !loading && setView('lessonDetail')} className="bg-[#1C1C1E] rounded-[32px] p-8 hard-shadow cursor-pointer active:scale-95 transition-all">
          <p className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-widest mb-2">TODAY'S LESSON</p>
          <h2 className="text-3xl font-black tracking-tighter leading-none">{loading ? "LOADING..." : lesson?.topic}</h2>
          <button className="mt-6 px-6 py-2.5 bg-[#CCFF00] text-black rounded-xl text-[10px] font-black uppercase clay-accent">START NOW</button>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => setView('podcast')} className="bg-[#1C1C1E] aspect-square rounded-[28px] p-5 border border-zinc-800 hard-shadow flex flex-col justify-between cursor-pointer">
            <HeadphonesIcon size={20} color="#CCFF00" />
            <div><p className="text-[10px] font-bold text-zinc-500 uppercase">PODCAST</p><p className="text-lg font-black leading-tight">Urban Flow</p></div>
          </div>
          <div className="bg-[#1C1C1E] aspect-square rounded-[28px] p-5 border border-zinc-800 hard-shadow flex flex-col justify-between">
            <MedalIcon size={20} color="#BFA3FF" />
            <div><p className="text-[10px] font-bold text-zinc-500 uppercase">BADGES</p><p className="text-lg font-black leading-tight">Mastery</p></div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 bg-zinc-900/90 backdrop-blur-xl border border-white/5 rounded-[40px] px-10 flex justify-between items-center z-50 shadow-2xl">
        <HomeIcon size={22} className="text-[#CCFF00]" /><LibraryIcon size={22} className="text-zinc-600" /><MedalIcon size={22} className="text-zinc-600" /><UserIcon size={22} className="text-zinc-600" />
      </nav>
    </div>
  );
};

export default App;
