
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData, UserStats, RoadmapStage } from './types';
import { generateLesson } from './services/geminiService';
import { lessonsData } from './lessons';
import GrainOverlay from './components/GrainOverlay';
import { 
  HomeIcon, LibraryIcon, MedalIcon, UserIcon, 
  SparklesIcon, FlameIcon, SoundHighIcon, FlashIcon, 
  HeadphonesIcon, SparklesIcon as StarIcon, CloseIcon 
} from './components/Icons';
import LessonDetailScreen from './LessonDetailScreen';
import SuccessScreen from './SuccessScreen';
import PodcastScreen from './PodcastScreen';
import BadgeGallery from './components/BadgeGallery';

type ViewType = 'home' | 'roadmap' | 'lessonDetail' | 'success' | 'profile' | 'podcast' | 'badges';

const ROADMAP_STEPS = [
  { id: 1, stage: 'Urban Newbie' as RoadmapStage, title: 'Survival Mode', desc: 'Cafe, Streets & Basics' },
  { id: 2, stage: 'Urban Newbie' as RoadmapStage, title: 'City Explorer', desc: 'Shopping & Transit' },
  { id: 3, stage: 'Street Smart' as RoadmapStage, title: 'Social Butterfly', desc: 'Making Connections' },
  { id: 4, stage: 'Street Smart' as RoadmapStage, title: 'Vibe Master', desc: 'Daily Urban Life' },
  { id: 5, stage: 'Professional Hustler' as RoadmapStage, title: 'Career Starter', desc: 'Office & Networking' },
  { id: 6, stage: 'Professional Hustler' as RoadmapStage, title: 'Tech Guru', desc: 'Trends & Innovation' },
  { id: 7, stage: 'Urban Legend' as RoadmapStage, title: 'Deep Thinker', desc: 'Critical Discussions' },
  { id: 8, stage: 'Urban Legend' as RoadmapStage, title: 'Grandmaster', desc: 'Final Mastery' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('neo_stats');
    return saved ? JSON.parse(saved) : {
      currentLevel: 1,
      lessonsCompleted: 0,
      streak: 5,
      unlockedBadges: ['newbie'],
      savedVocab: [],
      xp: 450,
      perfectTests: 0,
      podcastsCompleted: 0
    };
  });

  const startLevel = async (lvl: number) => {
    setLoading(true);
    try {
      let lesson = lessonsData.find(l => l.level === lvl && !stats.unlockedBadges.includes(l.id));
      if (!lesson) {
        lesson = await generateLesson(lvl);
      }
      setCurrentLesson(lesson);
      setView('lessonDetail');
    } catch (e) {
      alert("AI đang soạn giáo án, hãy thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = useMemo(() => 
    ROADMAP_STEPS.find(s => s.id === stats.currentLevel) || ROADMAP_STEPS[0]
  , [stats.currentLevel]);

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-[#0A0A0A] text-white font-sans overflow-hidden border-x border-zinc-900">
      <GrainOverlay />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full pt-12 px-6 pb-32 overflow-y-auto no-scrollbar"
          >
            {/* Minimal Header */}
            <header className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                     <UserIcon size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Hub / Central</span>
               </div>
               <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-white/5">
                     <FlameIcon size={14} color="#FF6B4A" />
                     <span className="text-[10px] font-black">{stats.streak}d</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-white/5">
                     <StarIcon size={14} color="#CCFF00" />
                     <span className="text-[10px] font-black">{stats.xp}xp</span>
                  </div>
               </div>
            </header>

            {/* Hero Section: Active Mission with Glassmorphism */}
            <section className="mb-10">
               <div className="flex justify-between items-end mb-4 px-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Active Mission</h2>
                  <span className="text-[8px] font-black text-[#CCFF00] uppercase tracking-widest bg-[#CCFF00]/10 px-2 py-0.5 rounded-full">Sprinting</span>
               </div>
               
               <motion.div 
                 whileTap={{ scale: 0.98 }}
                 onClick={() => startLevel(stats.currentLevel)}
                 className="glass-card relative p-8 rounded-[48px] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
               >
                  {/* Glowing background elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#CCFF00]/5 blur-[60px] rounded-full group-hover:bg-[#CCFF00]/10 transition-all duration-700" />
                  <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-[#BFA3FF]/5 blur-[60px] rounded-full" />
                  
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-[#CCFF00] rounded-lg flex items-center justify-center">
                           <FlashIcon size={14} color="black" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                           {currentStep.stage} • 0{stats.currentLevel}
                        </span>
                     </div>

                     <h3 className="text-[2.6rem] font-heading font-black tracking-tighter leading-[0.9] mb-3 text-white">
                        {currentStep.title}
                     </h3>
                     
                     <p className="text-zinc-500 text-xs font-medium mb-8 pr-10 leading-relaxed">
                        {currentStep.desc}. Complete this to unlock next urban tier.
                     </p>
                     
                     <div className="flex items-center justify-between">
                        <button className="px-8 py-3.5 bg-[#CCFF00] text-black rounded-2xl font-black text-[11px] uppercase tracking-widest clay-accent hover:scale-105 active:scale-95 transition-all">
                           RESUME MISSION
                        </button>
                        <div className="flex flex-col items-end">
                           <span className="text-[18px] font-heading font-black text-white leading-none">40%</span>
                           <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Progress</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </section>

            {/* Quick Access Grid */}
            <section className="grid grid-cols-2 gap-4 mb-10">
               <motion.div 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setView('podcast')}
                 className="p-6 rounded-[40px] bg-zinc-900/30 border border-white/5 flex flex-col justify-between aspect-square group relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#BFA3FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-[#BFA3FF] relative z-10">
                     <HeadphonesIcon size={24} />
                  </div>
                  <div className="relative z-10">
                     <h4 className="font-heading font-black text-xl leading-tight uppercase tracking-tighter">Neo<br/>Radio</h4>
                     <p className="text-[9px] font-black text-zinc-600 uppercase mt-1 tracking-widest group-hover:text-[#BFA3FF] transition-colors">Ambient Flow</p>
                  </div>
               </motion.div>

               <motion.div 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setView('badges')}
                 className="p-6 rounded-[40px] bg-zinc-900/30 border border-white/5 flex flex-col justify-between aspect-square group relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-[#CCFF00] relative z-10">
                     <MedalIcon size={24} />
                  </div>
                  <div className="relative z-10">
                     <h4 className="font-heading font-black text-xl leading-tight uppercase tracking-tighter">Urban<br/>Trophy</h4>
                     <p className="text-[9px] font-black text-zinc-600 uppercase mt-1 tracking-widest group-hover:text-[#CCFF00] transition-colors">{stats.unlockedBadges.length} UNLOCKED</p>
                  </div>
               </motion.div>
            </section>

            {/* Placement Test Promo - Simplified */}
            <section className="px-1 text-center">
               <button className="w-full p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center gap-4 hover:bg-white/10 transition-all group">
                  <div className="text-left">
                     <h4 className="font-heading font-black text-sm uppercase tracking-tight text-white group-hover:text-[#CCFF00] transition-colors">Jump to Street Smart?</h4>
                     <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Take the 15-min placement test</p>
                  </div>
                  <FlashIcon size={16} color="#444" className="group-hover:text-[#CCFF00] transition-colors" />
               </button>
            </section>
          </motion.main>
        )}

        {view === 'roadmap' && (
          <motion.main 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full pt-16 px-6 pb-32 overflow-y-auto no-scrollbar"
          >
            <header className="mb-10">
               <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.4em] mb-2 block">The Master Plan</span>
               <h1 className="text-[3.5rem] font-heading font-black tracking-tighter uppercase leading-[0.85]">The Hustle<br/><span className="text-[#CCFF00]">Path</span></h1>
            </header>

            <div className="space-y-4">
              {ROADMAP_STEPS.map((step, idx) => {
                const isLocked = step.id > stats.currentLevel;
                const isCurrent = step.id === stats.currentLevel;
                const isCompleted = step.id < stats.currentLevel;
                
                return (
                  <motion.div 
                    key={step.id}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    onClick={() => startLevel(step.id)}
                    className={`relative p-7 rounded-[36px] border transition-all cursor-pointer ${
                      isCurrent ? 'bg-[#1C1C1E] border-[#CCFF00]/50 shadow-[0_20px_40px_-10px_rgba(204,255,0,0.1)]' : 
                      isLocked ? 'bg-zinc-900/20 border-white/5 opacity-40 grayscale' : 'bg-zinc-900/50 border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-[#CCFF00]' : 'text-zinc-600'}`}>
                               STAGE 0{step.id}
                             </span>
                             {isCompleted && <StarIcon size={10} color="#CCFF00" />}
                          </div>
                          <h3 className={`text-2xl font-heading font-black tracking-tighter leading-none ${isLocked ? 'text-zinc-700' : 'text-white'}`}>{step.title}</h3>
                       </div>
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isCurrent ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20' : 'bg-zinc-800/50 text-zinc-600'}`}>
                          {isLocked ? <FlashIcon size={16} /> : <MedalIcon size={18} />}
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.main>
        )}

        {view === 'badges' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-16 px-6 pb-32 h-full overflow-y-auto no-scrollbar">
              <button onClick={() => setView('home')} className="mb-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                 <CloseIcon size={20} /> <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
              </button>
              <BadgeGallery unlockedBadges={stats.unlockedBadges} />
           </motion.div>
        )}

        {view === 'podcast' && currentLesson && (
          <PodcastScreen 
            lesson={currentLesson} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'lessonDetail' && currentLesson && (
          <LessonDetailScreen 
            lesson={currentLesson} 
            onFinish={() => setView('success')} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'success' && (
          <SuccessScreen streak={stats.streak} onReturn={() => setView('home')} />
        )}
      </AnimatePresence>

      {/* Navigation Dock - Glassmorphism style */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[100]">
        <div className="floating-dock h-20 rounded-[40px] px-10 flex justify-between items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <button onClick={() => setView('home')} className="group flex flex-col items-center gap-1">
            <motion.div animate={{ y: view === 'home' ? -2 : 0 }}>
               <HomeIcon size={22} color={view === 'home' ? '#CCFF00' : '#555'} />
            </motion.div>
            <span className={`text-[7px] font-black uppercase tracking-widest ${view === 'home' ? 'text-[#CCFF00]' : 'text-zinc-700'}`}>HUB</span>
          </button>
          <button onClick={() => setView('roadmap')} className="group flex flex-col items-center gap-1">
            <motion.div animate={{ y: view === 'roadmap' ? -2 : 0 }}>
               <MedalIcon size={22} color={view === 'roadmap' ? '#CCFF00' : '#555'} />
            </motion.div>
            <span className={`text-[7px] font-black uppercase tracking-widest ${view === 'roadmap' ? 'text-[#CCFF00]' : 'text-zinc-700'}`}>PATH</span>
          </button>
          <button className="group flex flex-col items-center gap-1 opacity-30">
            <LibraryIcon size={22} color="#555" />
            <span className="text-[7px] font-black uppercase tracking-widest text-zinc-700">VAULT</span>
          </button>
          <button className="group flex flex-col items-center gap-1">
            <UserIcon size={22} color={view === 'profile' ? '#CCFF00' : '#555'} />
            <span className={`text-[7px] font-black uppercase tracking-widest ${view === 'profile' ? 'text-[#CCFF00]' : 'text-zinc-700'}`}>ME</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center">
           <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                 <div className="absolute inset-0 border-4 border-[#CCFF00]/10 rounded-full" />
                 <div className="absolute inset-0 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CCFF00] animate-pulse">Architecting...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
