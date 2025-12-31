
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson } from './services/geminiService';
import { LessonData, UserStats } from './types';
import GrainOverlay from './components/GrainOverlay';
import BadgeGallery from './components/BadgeGallery';
import { HomeIcon, LibraryIcon, MedalIcon, UserIcon, SparklesIcon, HeadphonesIcon, FlameIcon } from './components/Icons';
import PodcastScreen from './PodcastScreen';
import SuccessScreen from './SuccessScreen';
import LessonDetailScreen from './LessonDetailScreen';

const App: React.FC = () => {
  const [view, setView] = useState('home');
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStats] = useState<UserStats>({ 
    lessonsCompleted: 42, 
    streak: 7, 
    perfectTests: 12, 
    unlockedBadges: ['newbie', 'urban-legend'] 
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await generateLesson(1, "Monday");
        setLesson(data);
      } catch (err) {
        console.error("AI Generation failed, using fallback.");
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col max-w-md mx-auto border-x border-zinc-900 relative overflow-hidden font-sans">
      <GrainOverlay />
      
      <AnimatePresence mode="wait">
        {view === 'podcast' && lesson && (
          <PodcastScreen key="podcast" lesson={lesson} onBack={() => setView('home')} />
        )}
        {view === 'lessonDetail' && lesson && (
          <LessonDetailScreen key="detail" lesson={lesson} onFinish={() => setView('success')} onBack={() => setView('home')} />
        )}
        {view === 'success' && (
          <SuccessScreen key="success" streak={userStats.streak} onReturn={() => setView('home')} />
        )}
      </AnimatePresence>

      {/* Main Home Content */}
      <div className={`flex flex-col flex-1 ${view !== 'home' ? 'hidden' : ''}`}>
        <header className="p-8 pt-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(204,255,0,0.2)]">
              N
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">LEVEL 12</p>
              <h1 className="text-2xl font-heading font-black tracking-tight -mt-1 italic">Yo, Neo!</h1>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 flex items-center gap-2">
              <FlameIcon size={12} color="#CCFF00" />
              <span className="text-[10px] font-black text-[#CCFF00]">{userStats.streak} DAY STREAK</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 space-y-8 overflow-y-auto no-scrollbar pb-32">
          {/* Main Call to Action */}
          <section 
            onClick={() => !loading && setView('lessonDetail')} 
            className="group bg-[#1C1C1E] rounded-[40px] p-8 hard-shadow-accent cursor-pointer active:scale-95 transition-all relative overflow-hidden border border-white/5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/10 blur-3xl -mr-16 -mt-16" />
            <p className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.3em] mb-3">CURRENT MODULE</p>
            <h2 className="text-3xl font-heading font-black tracking-tighter leading-[0.9] mb-6">
              {loading ? "PREPARING..." : lesson?.topic}
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#1C1C1E] bg-zinc-800 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
                  </div>
                ))}
                <div className="pl-4 text-[9px] font-bold text-zinc-500 self-center uppercase tracking-widest">+12 learning</div>
              </div>
              <div className="w-12 h-12 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black group-hover:rotate-12 transition-transform shadow-lg">
                <SparklesIcon size={20} />
              </div>
            </div>
          </section>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setView('podcast')} 
              className="bg-[#1C1C1E] aspect-square rounded-[32px] p-6 border border-zinc-800 hard-shadow flex flex-col justify-between cursor-pointer group active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-colors">
                <HeadphonesIcon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">RADIO</p>
                <p className="text-lg font-heading font-black leading-tight tracking-tight">Urban<br/>Podcasts</p>
              </div>
            </div>
            
            <div className="bg-[#1C1C1E] aspect-square rounded-[32px] p-6 border border-zinc-800 hard-shadow flex flex-col justify-between group cursor-pointer active:scale-95 transition-all">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-[#BFA3FF] group-hover:bg-[#BFA3FF] group-hover:text-black transition-colors">
                <LibraryIcon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">LIBRARY</p>
                <p className="text-lg font-heading font-black leading-tight tracking-tight">Saved<br/>Vocab</p>
              </div>
            </div>
          </div>

          <BadgeGallery unlockedBadges={userStats.unlockedBadges} />
        </main>

        {/* Floating Bottom Nav */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-20 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[40px] px-8 flex justify-between items-center z-[100] shadow-2xl">
          <motion.div whileTap={{ scale: 0.9 }} className="text-[#CCFF00] p-2"><HomeIcon size={24} /></motion.div>
          <motion.div whileTap={{ scale: 0.9 }} className="text-zinc-600 p-2"><LibraryIcon size={24} /></motion.div>
          <motion.div whileTap={{ scale: 0.9 }} className="text-zinc-600 p-2"><MedalIcon size={24} /></motion.div>
          <motion.div whileTap={{ scale: 0.9 }} className="text-zinc-600 p-2"><UserIcon size={24} /></motion.div>
        </nav>
      </div>
    </div>
  );
};

export default App;
