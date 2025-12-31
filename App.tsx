
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData, UserStats, RoadmapStage } from './types';
import { generateLesson } from './services/geminiService';
import { lessonsData } from './lessons';
import GrainOverlay from './components/GrainOverlay';
import { 
  HomeIcon, LibraryIcon, MedalIcon, UserIcon, 
  SparklesIcon, FlameIcon, SoundHighIcon, FlashIcon, 
  HeadphonesIcon, CloseIcon 
} from './components/Icons';
import LessonDetailScreen from './LessonDetailScreen';
import SuccessScreen from './SuccessScreen';
import PodcastScreen from './PodcastScreen';
import BadgeGallery from './components/BadgeGallery';
import { playNaturalSpeech } from './services/speechService';
import { syncUserStats } from './services/badgeService';

type ViewType = 'home' | 'roadmap' | 'lessonDetail' | 'success' | 'profile' | 'podcast' | 'badges';

const ROADMAP_STEPS = [
  { id: 1, stage: 'Urban Newbie', title: 'Survival Mode', vi_title: 'Chế độ Sinh tồn', desc: 'Cafe, Streets & Basics', vi_desc: 'Cà phê, Đường phố & Cơ bản' },
  { id: 2, stage: 'Urban Newbie', title: 'City Explorer', vi_title: 'Khám phá Thành phố', desc: 'Shopping & Transit', vi_desc: 'Mua sắm & Di chuyển' },
  { id: 3, stage: 'Street Smart', title: 'Social Butterfly', vi_title: 'Bậc thầy Xã giao', desc: 'Making Connections', vi_desc: 'Kết nối & Kết bạn' },
  { id: 4, stage: 'Street Smart', title: 'Vibe Master', vi_title: 'Người tạo Vibe', desc: 'Daily Urban Life', vi_desc: 'Nhịp sống Đô thị' },
  { id: 5, stage: 'Professional Hustler', title: 'Career Starter', vi_title: 'Khởi đầu Sự nghiệp', desc: 'Office & Networking', vi_desc: 'Văn phòng & Kết nối' },
  { id: 6, stage: 'Professional Hustler', title: 'Tech Guru', vi_title: 'Phù thủy Công nghệ', desc: 'Trends & Innovation', vi_desc: 'Xu hướng & Đổi mới' },
  { id: 7, stage: 'Urban Legend', title: 'Deep Thinker', vi_title: 'Tư duy Sâu sắc', desc: 'Critical Discussions', vi_desc: 'Thảo luận Chuyên sâu' },
  { id: 8, stage: 'Urban Legend', title: 'Grandmaster', vi_title: 'Huyền thoại Thành thị', desc: 'Final Mastery', vi_desc: 'Làm chủ Ngôn ngữ' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('neolingua_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, favoriteLessons: parsed.favoriteLessons || [] };
    }
    return {
      currentLevel: 1,
      lessonsCompleted: 0,
      streak: 5,
      unlockedBadges: ['newbie'],
      savedVocab: [],
      favoriteLessons: [],
      xp: 450,
      perfectTests: 0,
      podcastsCompleted: 0
    };
  });

  useEffect(() => {
    syncUserStats(stats);
  }, [stats]);

  const startLevel = async (lvl: number) => {
    setLoading(true);
    try {
      let lesson = (lessonsData || []).find(l => l.level === lvl);
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

  const openPodcast = (lesson?: LessonData) => {
    if (lesson) {
      setCurrentLesson(lesson);
    } else {
      const defaultLesson = (lessonsData || []).find(l => l.level === stats.currentLevel) || (lessonsData || [])[0];
      setCurrentLesson(defaultLesson);
    }
    setView('podcast');
  };

  const handleToggleFavorite = (lessonId: string) => {
    setStats(prev => {
      const isFav = (prev.favoriteLessons || []).includes(lessonId);
      const newFavs = isFav 
        ? (prev.favoriteLessons || []).filter(id => id !== lessonId)
        : [...(prev.favoriteLessons || []), lessonId];
      return { ...prev, favoriteLessons: newFavs };
    });
  };

  const currentStep = useMemo(() => 
    ROADMAP_STEPS.find(s => s.id === stats.currentLevel) || ROADMAP_STEPS[0]
  , [stats.currentLevel]);

  const dailyWord = useMemo(() => {
    const lesson = (lessonsData || []).find(l => l.level === stats.currentLevel);
    return (lesson?.vocab_spotlight && lesson.vocab_spotlight[0]) || { word: 'Hustle', meaning: 'Nỗ lực không ngừng', pronunciation: '/ˈhʌs.əl/' };
  }, [stats.currentLevel]);

  const handleLessonFinish = () => {
    setStats(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
      xp: prev.xp + 100,
      currentLevel: Math.min(prev.currentLevel + 1, 8)
    }));
    setView('success');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-[#0A0A0A] text-white font-sans overflow-hidden border-x border-zinc-900">
      <GrainOverlay />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full pt-12 px-6 pb-32 overflow-y-auto no-scrollbar"
          >
            {/* Header - Spacing: px-2 */}
            <header className="flex justify-between items-center mb-10 px-2">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#CCFF00] flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                     <UserIcon size={24} />
                  </div>
                  <div>
                    <h1 className="text-xs font-sans font-black uppercase tracking-[0.2em] leading-none">Neo.Hustler</h1>
                    <p className="text-[10px] font-sans font-bold text-zinc-600 uppercase mt-1">Level {stats.currentLevel} Stage</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 rounded-full border border-white/5">
                     <FlameIcon size={14} color="#FF6B4A" />
                     <span className="text-[10px] font-sans font-black">{stats.streak}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 rounded-full border border-white/5">
                     <SparklesIcon size={14} color="#CCFF00" />
                     <span className="text-[10px] font-sans font-black">{stats.xp}</span>
                  </div>
               </div>
            </header>

            {/* Active Mission Card - Spacing: p-8 (32px) */}
            <section className="mb-8">
               <motion.div 
                 whileTap={{ scale: 0.98 }}
                 onClick={() => startLevel(stats.currentLevel)}
                 className="glass-card relative p-8 rounded-[48px] overflow-hidden group cursor-pointer transition-shadow hover:shadow-[0_0_40px_rgba(204,255,0,0.05)]"
               >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#CCFF00]/5 blur-[60px] rounded-full" />
                  <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-4">
                        <span className="text-[9px] font-sans font-black uppercase text-[#CCFF00] tracking-[0.3em] bg-[#CCFF00]/10 px-2 py-1 rounded-md">ACTIVE MISSION • 0{stats.currentLevel}</span>
                     </div>
                     <h3 className="text-[2.8rem] font-heading font-black tracking-tighter leading-[0.85] mb-2">{currentStep.title}</h3>
                     <h4 className="text-xl font-heading font-black text-white/40 tracking-tight leading-none mb-6">{currentStep.vi_title}</h4>
                     <p className="text-zinc-500 font-sans font-bold text-xs mb-8 leading-relaxed pr-8">
                       {currentStep.desc} • <span className="italic">{currentStep.vi_desc}</span>
                     </p>
                     <button className="px-8 py-4 bg-[#CCFF00] text-black rounded-2xl font-sans font-black text-[11px] uppercase tracking-[0.2em] clay-accent transition-transform hover:scale-105">
                        RESUME SPRINT
                     </button>
                  </div>
               </motion.div>
            </section>

            {/* Daily Word Section - Spacing: p-6 (24px) */}
            <section className="mb-8 px-2">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-zinc-600">Daily Urban Word</h2>
                  <SparklesIcon size={14} color="#FF6B4A" />
               </div>
               <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playNaturalSpeech(dailyWord.word)}
                  className="p-6 rounded-[32px] bg-zinc-900/40 border border-[#FF6B4A]/20 flex items-center justify-between group cursor-pointer relative overflow-hidden"
               >
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#FF6B4A]/5 blur-2xl rounded-full" />
                  <div className="flex-1 relative z-10">
                     <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl font-heading font-black tracking-tighter text-white group-hover:text-[#FF6B4A] transition-colors">{dailyWord.word}</h4>
                        <span className="text-[11px] font-sans font-bold text-zinc-600 italic tracking-tighter">{dailyWord.pronunciation}</span>
                     </div>
                     <p className="text-zinc-500 font-sans font-bold text-xs">{dailyWord.meaning}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-[#FF6B4A] shadow-[0_0_15px_rgba(255,107,74,0.1)] relative z-10">
                     <SoundHighIcon size={24} />
                  </div>
               </motion.div>
            </section>

            {/* Radio Flow - Spacing: p-6 (24px) */}
            <section className="mb-8 px-2">
               <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-zinc-600 mb-6">Radio Flow</h2>
               <div 
                  onClick={() => openPodcast()}
                  className="relative p-6 rounded-[40px] bg-[#BFA3FF] text-black overflow-hidden flex items-center justify-between group shadow-xl cursor-pointer"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                  <div className="relative z-10 flex-1">
                     <h4 className="text-2xl font-heading font-black tracking-tighter leading-none mb-2">Neo Radio FM</h4>
                     <p className="text-[10px] font-sans font-black opacity-60 uppercase tracking-[0.2em]">Ambient Learning Flow</p>
                     
                     <div className="flex items-center gap-1.5 mt-4 h-4">
                        {[1, 2, 3, 4, 3, 2, 5, 2, 3, 4, 1].map((h, i) => (
                           <motion.div 
                              key={i}
                              animate={{ height: ["4px", `${h*4}px`, "4px"] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                              className="w-1 bg-black/40 rounded-full"
                           />
                        ))}
                        <span className="text-[9px] font-sans font-black ml-2 uppercase opacity-40">Streaming Now</span>
                     </div>
                  </div>
                  <div className="w-16 h-16 bg-black rounded-[24px] flex items-center justify-center text-[#CCFF00] shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-105">
                     <HeadphonesIcon size={28} />
                  </div>
               </div>
            </section>

            {/* Action Grid - Spacing: p-6 (24px) */}
            <section className="grid grid-cols-2 gap-6 mb-10 px-2">
               <motion.div 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setView('badges')}
                 className="p-6 rounded-[36px] bg-zinc-900/30 border border-[#FF6B4A]/10 flex flex-col justify-between aspect-square cursor-pointer group"
               >
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B4A]/10 flex items-center justify-center text-[#FF6B4A] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,107,74,0.1)]">
                     <MedalIcon size={24} />
                  </div>
                  <div>
                     <h4 className="font-heading font-black text-xl uppercase leading-none tracking-tighter">Trophy<br/>Room</h4>
                     <p className="text-[9px] font-sans font-black text-zinc-600 uppercase mt-2 tracking-widest">Achievements</p>
                  </div>
               </motion.div>

               <motion.div 
                 className="p-6 rounded-[36px] bg-zinc-900/30 border border-white/5 flex flex-col justify-between aspect-square opacity-40 grayscale cursor-not-allowed"
               >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-500">
                     <LibraryIcon size={24} />
                  </div>
                  <div>
                     <h4 className="font-heading font-black text-xl uppercase leading-none tracking-tighter">Vocab<br/>Vault</h4>
                     <p className="text-[9px] font-sans font-black text-zinc-600 uppercase mt-2 tracking-widest">Library</p>
                  </div>
               </motion.div>
            </section>
          </motion.main>
        )}
        
        {/* roadmap, badges, podcast, lessonDetail views remain largely same but benefit from typography classes in index.html */}
        {view === 'badges' && (
           <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-16 px-6 pb-32 h-full overflow-y-auto no-scrollbar">
              <button onClick={() => setView('home')} className="mb-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                 <CloseIcon size={20} /> <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em]">Back to Hub</span>
              </button>
              <BadgeGallery unlockedBadges={stats.unlockedBadges || []} />
           </motion.div>
        )}

        {view === 'podcast' && currentLesson && (
          <PodcastScreen 
            lesson={currentLesson} 
            onBack={() => setView('home')} 
            onSelectLesson={openPodcast}
            favoriteLessons={stats.favoriteLessons || []}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {view === 'lessonDetail' && currentLesson && (
          <LessonDetailScreen lesson={currentLesson} onFinish={handleLessonFinish} onBack={() => setView('home')} />
        )}

        {view === 'success' && (
          <SuccessScreen streak={stats.streak} onReturn={() => setView('home')} />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[100]">
        <div className="floating-dock h-20 rounded-[40px] px-10 flex justify-between items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <button onClick={() => setView('home')} className="group flex flex-col items-center gap-1">
            <motion.div animate={{ y: view === 'home' ? -2 : 0 }}>
               <HomeIcon size={24} color={view === 'home' ? '#CCFF00' : '#555'} />
            </motion.div>
            <span className={`text-[8px] font-sans font-black uppercase tracking-widest ${view === 'home' ? 'text-[#CCFF00]' : 'text-zinc-700'}`}>HUB</span>
          </button>
          <button onClick={() => setView('roadmap')} className="group flex flex-col items-center gap-1">
            <motion.div animate={{ y: view === 'roadmap' ? -2 : 0 }}>
               <MedalIcon size={24} color={view === 'roadmap' ? '#CCFF00' : '#555'} />
            </motion.div>
            <span className={`text-[8px] font-sans font-black uppercase tracking-widest ${view === 'roadmap' ? 'text-[#CCFF00]' : 'text-zinc-700'}`}>PATH</span>
          </button>
          <button className="group flex flex-col items-center gap-1 opacity-30 cursor-not-allowed">
            <LibraryIcon size={24} color="#555" />
            <span className="text-[8px] font-sans font-black uppercase tracking-widest text-zinc-700">VAULT</span>
          </button>
          <button className="group flex flex-col items-center gap-1 opacity-30 cursor-not-allowed">
            <UserIcon size={24} color="#555" />
            <span className="text-[8px] font-sans font-black uppercase tracking-widest text-zinc-700">ME</span>
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center">
           <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-8">
                 <div className="absolute inset-0 border-4 border-[#CCFF00]/10 rounded-full" />
                 <div className="absolute inset-0 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-[#CCFF00] animate-pulse">Architecting Course...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
