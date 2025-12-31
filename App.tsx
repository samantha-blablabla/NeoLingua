
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson } from './services/geminiService';
import { LessonData, VocabularyItem, UserStats } from './types';
import GrainOverlay from './components/GrainOverlay';
import { HomeIcon, LibraryIcon, MedalIcon, FlashIcon, UserIcon, SparklesIcon, HeadphonesIcon } from './components/Icons';
import { lessonsData } from './lessons';
import PodcastScreen from './PodcastScreen';
import BadgeGallery from './components/BadgeGallery';
import LessonDetailScreen from './LessonDetailScreen';

type ViewType = 'home' | 'library' | 'badges' | 'profile' | 'podcast' | 'lessonDetail';

const WordOfTheDayWidget: React.FC<{ word: VocabularyItem }> = ({ word }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className="relative overflow-hidden bg-[#BFA3FF] rounded-[28px] p-6 text-black hard-shadow flex flex-col justify-between aspect-square"
  >
    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-white"></div>
    
    <div className="z-10 w-full">
      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] opacity-40 block mb-1">DAILY WORD</span>
      <h3 className="text-5xl font-heading font-black leading-[0.85] tracking-tighter break-words">
        {word.word}
      </h3>
    </div>

    <div className="z-10 w-full">
      <p className="text-sm font-sans font-medium leading-relaxed opacity-80">
        {word.meaning}
      </p>
    </div>
  </motion.div>
);

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
      // Fallback to local data if API fails
      setLesson(lessonsData[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewLesson(currentDay);
  }, [currentDay, fetchNewLesson]);

  const handleCompleteLesson = () => {
    setUserStats(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
      streak: prev.streak + 1
    }));
    setView('home');
  };

  const navItems: { id: ViewType; icon: any; label: string }[] = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'library', icon: LibraryIcon, label: 'Library' },
    { id: 'badges', icon: MedalIcon, label: 'Badges' },
    { id: 'profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-[#0A0A0A] shadow-2xl border-x border-zinc-900 overflow-hidden text-white font-sans selection:bg-[#CCFF00] selection:text-black">
      <GrainOverlay />
      
      <AnimatePresence>
        {view === 'podcast' && lesson && (
          <PodcastScreen lesson={lesson} onBack={() => setView('home')} />
        )}
        {view === 'lessonDetail' && lesson && (
          <LessonDetailScreen 
            lesson={lesson} 
            onFinish={handleCompleteLesson} 
            onBack={() => setView('home')} 
          />
        )}
      </AnimatePresence>

      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#CCFF00] flex items-center justify-center hard-shadow overflow-hidden border border-black/10">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ccff00`} alt="Avatar" className="w-10 h-10 mt-1" />
          </div>
          <div>
            <h2 className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-30">LEVEL 12</h2>
            <h1 className="text-xl font-heading font-black -mt-1 tracking-tighter">Yo, Alex!</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 hard-shadow">
          <SparklesIcon size={14} color="#CCFF00" />
          <span className="text-[11px] font-sans font-black text-[#CCFF00]">{userStats.streak} DAYS</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar space-y-6 pt-2">
        
        {view === 'home' && (
          <>
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => !loading && setView('lessonDetail')}
              className="relative aspect-[4/3] w-full bg-[#1C1C1E] rounded-[32px] p-8 flex flex-col justify-end overflow-hidden hard-shadow group cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#CCFF00]/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#CCFF00]/20 transition-colors" />
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-white"></div>
              
              <span className="text-[10px] font-sans font-bold text-[#CCFF00] uppercase tracking-[0.2em] mb-2 block">TODAY'S TOPIC</span>
              <h2 className="text-4xl font-heading font-black leading-[0.9] tracking-tighter mb-4 text-white">
                {loading ? "ĐANG SOẠN..." : (lesson?.topic || "URBAN FLOW")}
              </h2>
              
              <div className="flex items-center gap-2">
                <button 
                  className="px-5 py-2.5 bg-[#CCFF00] text-black rounded-xl text-[11px] font-sans font-black uppercase clay-accent group-hover:scale-105 transition-transform"
                >
                  {loading ? "Đợi chút..." : "Bắt đầu học"}
                </button>
                <span className="text-[10px] font-sans font-medium text-zinc-500 uppercase tracking-widest">12 MINS</span>
              </div>
            </motion.section>

            <div className="grid grid-cols-2 gap-4">
              {randomWord && <WordOfTheDayWidget word={randomWord} />}

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setView('podcast')}
                className="bg-[#1C1C1E] rounded-[28px] p-5 border border-zinc-800 hard-shadow flex flex-col justify-between aspect-square cursor-pointer hover:border-zinc-600 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <HeadphonesIcon size={20} color="#CCFF00" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]"></div>
                </div>
                <div>
                  <h3 className="text-[9px] font-sans font-bold text-zinc-500 uppercase tracking-widest mb-1">PODCAST</h3>
                  <p className="text-xl font-heading font-black leading-tight text-white">Daily Studio</p>
                  <p className="text-[10px] font-sans font-medium text-zinc-500 mt-1">Listening Practice</p>
                </div>
              </motion.div>
            </div>
            
            <section className="space-y-4 pt-4">
               <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-600">LIBRARY</h3>
                  <button onClick={() => setView('library')} className="text-[10px] font-sans font-black text-[#CCFF00] uppercase hover:underline">View All</button>
               </div>
               <div 
                 onClick={() => setView('lessonDetail')}
                 className="p-5 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-center gap-5 cursor-pointer hover:bg-zinc-900 transition-colors active:scale-[0.99]"
               >
                  <div className="w-11 h-11 rounded-2xl bg-zinc-800 flex items-center justify-center text-[#CCFF00] border border-zinc-700">
                    <FlashIcon size={22} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-sans font-bold text-sm text-white">Grammar Spotlight</h4>
                    <p className="text-xs font-sans font-medium text-zinc-500">Perfect vs Simple Past</p>
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
              <div className="w-24 h-24 bg-[#CCFF00] rounded-full mx-auto mb-4 flex items-center justify-center hard-shadow border border-black/10">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ccff00`} alt="Avatar" className="w-20 h-20" />
              </div>
              <h2 className="text-3xl font-heading font-black tracking-tighter">Alex Urban</h2>
              <p className="text-[11px] font-sans font-medium text-zinc-500 uppercase tracking-widest mt-1">Tech Nomad • Lvl 12</p>
            </section>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-zinc-900 rounded-[28px] border border-zinc-800">
                <p className="text-3xl font-heading font-black text-[#CCFF00]">{userStats.lessonsCompleted}</p>
                <p className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Lessons</p>
              </div>
              <div className="p-6 bg-zinc-900 rounded-[28px] border border-zinc-800">
                <p className="text-3xl font-heading font-black text-[#BFA3FF]">{userStats.perfectTests}</p>
                <p className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Mastery</p>
              </div>
            </div>
          </div>
        )}

        {view === 'library' && (
          <div className="pt-4 space-y-4">
            <h3 className="text-3xl font-heading font-black tracking-tighter mb-6">Archive</h3>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-zinc-900 rounded-[28px] border border-zinc-800 flex justify-between items-center opacity-40">
                <div className="space-y-1">
                   <h4 className="font-sans font-bold text-white">Topic {i+1} Coming Soon</h4>
                   <p className="text-xs font-sans font-medium text-zinc-500">Urban Essentials</p>
                </div>
                <LibraryIcon size={20} color="#333" />
              </div>
            ))}
          </div>
        )}

      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100]">
        <div className="floating-dock h-20 rounded-[40px] px-8 flex justify-between items-center shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setView(item.id)}
                className="relative flex flex-col items-center justify-center w-12 h-12 transition-all"
              >
                <Icon size={22} color={isActive ? "#CCFF00" : "#444"} className="transition-colors duration-300" />
                {isActive && (
                  <motion.div 
                    layoutId="nav-dot"
                    className="absolute -bottom-1.5 w-1 h-1 bg-[#CCFF00] rounded-full shadow-[0_0_8px_#CCFF00]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`text-[8px] font-sans font-bold uppercase mt-1.5 tracking-widest transition-colors duration-300 ${isActive ? 'text-[#CCFF00]' : 'text-zinc-700'}`}>
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
