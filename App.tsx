
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson } from './services/geminiService';
import { LessonData, VocabularyItem, UserStats } from './types';
import GrainOverlay from './components/GrainOverlay';
import { HomeIcon, LibraryIcon, MedalIcon, FlashIcon, UserIcon, SparklesIcon, HeadphonesIcon } from './components/Icons';
import { lessonsData } from './lessons';
import PodcastScreen from './PodcastScreen';
import BadgeGallery from './components/BadgeGallery';

type ViewType = 'home' | 'library' | 'badges' | 'profile' | 'podcast';

const App: React.FC = () => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDay, setCurrentDay] = useState<string>("Monday");
  const [view, setView] = useState<ViewType>('home');
  const [userStats, setUserStats] = useState<UserStats>({
    lessonsCompleted: 0,
    streak: 5,
    perfectTests: 0,
    unlockedBadges: ['newbie']
  });

  const randomWord = useMemo(() => {
    const allWords = lessonsData.flatMap(lesson => lesson.vocab_set);
    return allWords.length ? allWords[Math.floor(Math.random() * allWords.length)] : null;
  }, []);

  const fetchNewLesson = useCallback(async (day: string) => {
    try {
      setLoading(true);
      const data = await generateLesson(1, day);
      setLesson(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewLesson(currentDay);
  }, [currentDay, fetchNewLesson]);

  const navItems: { id: ViewType; icon: any; label: string }[] = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'library', icon: LibraryIcon, label: 'Library' },
    { id: 'badges', icon: MedalIcon, label: 'Badges' },
    { id: 'profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-[#0A0A0A] shadow-2xl border-x border-zinc-900 overflow-hidden text-white font-sans">
      <GrainOverlay />
      
      {/* Dynamic Podcast View Overlays Entire App */}
      <AnimatePresence>
        {view === 'podcast' && lesson && (
          <PodcastScreen lesson={lesson} onBack={() => setView('home')} />
        )}
      </AnimatePresence>

      {/* Urban Header */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#CCFF00] flex items-center justify-center hard-shadow overflow-hidden border border-black/10">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ccff00" alt="Avatar" className="w-10 h-10 mt-1" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tighter opacity-40">Urban Learner</h2>
            <h1 className="text-lg font-heading font-extrabold -mt-1">Yo, Alex!</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 hard-shadow">
          <SparklesIcon size={14} color="#CCFF00" />
          <span className="text-[12px] font-black text-[#CCFF00]">{userStats.streak}D STREAK</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar space-y-6 pt-2">
        
        {view === 'home' && (
          <>
            {/* Hero Card: Today's Lesson */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/3] w-full bg-[#1C1C1E] rounded-[32px] p-8 flex flex-col justify-end overflow-hidden hard-shadow group cursor-pointer"
              onClick={() => {/* Navigate to lesson content */}}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#CCFF00]/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#CCFF00]/20 transition-colors" />
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-white"></div>
              
              <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest mb-2 block">Today's Lesson</span>
              <h2 className="text-4xl font-heading font-black leading-[0.9] tracking-tighter mb-4">
                {loading ? "SOẠN BÀI..." : (lesson?.topic || "URBAN KICKSTART")}
              </h2>
              
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-[#CCFF00] text-black rounded-xl text-[10px] font-black uppercase clay-accent">
                  Bắt đầu học
                </button>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">12 MINS</span>
              </div>
            </motion.section>

            {/* Grid Layout: Widgets */}
            <div className="grid grid-cols-2 gap-4">
              {/* Word of the Day Widget */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#BFA3FF] rounded-[28px] p-5 text-black hard-shadow flex flex-col justify-between aspect-square relative overflow-hidden"
              >
                <SparklesIcon size={16} color="black" className="mb-2" />
                <div>
                  <h3 className="text-[10px] font-black uppercase opacity-60 mb-1">Word of the day</h3>
                  <p className="text-xl font-heading font-black leading-tight mb-1">{randomWord?.word || "Pitch"}</p>
                  <p className="text-[10px] font-bold opacity-60 line-clamp-2">{randomWord?.meaning || "Lời giới thiệu ngắn"}</p>
                </div>
              </motion.div>

              {/* Quick Podcast Widget */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setView('podcast')}
                className="bg-[#1C1C1E] rounded-[28px] p-5 border border-zinc-800 hard-shadow flex flex-col justify-between aspect-square cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <HeadphonesIcon size={20} color="#CCFF00" />
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-1">Quick Podcast</h3>
                  <p className="text-lg font-heading font-black leading-tight text-white">Daily Studio</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Luyện nghe</p>
                </div>
              </motion.div>
            </div>
            
            {/* Recent Activity / Library Preview */}
            <section className="space-y-4 pt-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600">Thư viện của bạn</h3>
                  <button onClick={() => setView('library')} className="text-[10px] font-bold text-[#CCFF00] uppercase">Xem tất cả</button>
               </div>
               <div className="p-4 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-[#CCFF00]">
                    <FlashIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Grammar Spotlight</h4>
                    <p className="text-xs text-zinc-500">Present Perfect vs Past Simple</p>
                  </div>
               </div>
            </section>
          </>
        )}

        {view === 'badges' && (
          <div className="pt-4">
            <BadgeGallery unlockedBadges={userStats.unlockedBadges} />
          </div>
        )}

        {view === 'profile' && (
          <div className="pt-4 space-y-8">
            <section className="bg-zinc-900 rounded-[32px] p-8 hard-shadow border border-zinc-800 text-center">
              <div className="w-24 h-24 bg-[#CCFF00] rounded-full mx-auto mb-4 flex items-center justify-center hard-shadow">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ccff00" alt="Avatar" className="w-20 h-20" />
              </div>
              <h2 className="text-2xl font-heading font-black">Alex Urban</h2>
              <p className="text-xs font-bold text-zinc-500 uppercase mt-1">Fluent Tech Nomad • Lvl 12</p>
            </section>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-zinc-900 rounded-[24px] border border-zinc-800">
                <p className="text-2xl font-heading font-black text-[#CCFF00]">{userStats.lessonsCompleted}</p>
                <p className="text-[10px] font-black text-zinc-500 uppercase">Lessons</p>
              </div>
              <div className="p-5 bg-zinc-900 rounded-[24px] border border-zinc-800">
                <p className="text-2xl font-heading font-black text-[#BFA3FF]">{userStats.perfectTests}</p>
                <p className="text-[10px] font-black text-zinc-500 uppercase">Mastery</p>
              </div>
            </div>
          </div>
        )}

        {view === 'library' && (
          <div className="pt-4 space-y-4">
            <h3 className="text-2xl font-heading font-black mb-6">Archive</h3>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-zinc-900 rounded-[28px] border border-zinc-800 flex justify-between items-center opacity-50">
                <div>
                   <h4 className="font-bold">Topic {i+1} Coming Soon</h4>
                   <p className="text-xs text-zinc-500">Urban Essentials</p>
                </div>
                {/* Fixed: BookIcon was not defined or imported. Replaced with LibraryIcon which is available. */}
                <LibraryIcon size={20} color="#444" />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Floating Bottom Nav Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100]">
        <div className="floating-dock h-20 rounded-[40px] px-6 flex justify-between items-center shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setView(item.id)}
                className="relative flex flex-col items-center justify-center w-14 h-14 transition-all"
              >
                <Icon size={24} color={isActive ? "#CCFF00" : "#555"} />
                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="absolute -bottom-1 w-1.5 h-1.5 bg-[#CCFF00] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`text-[8px] font-black uppercase mt-1 tracking-tighter ${isActive ? 'text-[#CCFF00]' : 'text-zinc-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
