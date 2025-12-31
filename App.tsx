
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData, UserStats } from './types';
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
import UrbanChat from './components/UrbanChat';
import { playNaturalSpeech } from './services/speechService';
import { syncUserStats } from './services/badgeService';

// Component nâng cấp: Magnetic Urban Reveal
// Tạo hiệu ứng card "hút" vào tầm mắt người dùng khi cuộn tới
const MagneticReveal: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 60, 
        rotateX: 12, 
        scale: 0.92,
        filter: 'blur(4px)'
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        scale: 1,
        filter: 'blur(0px)'
      }}
      viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] // Custom quint ease out
      }}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      className="w-full origin-bottom"
    >
      {children}
    </motion.div>
  );
};

type ViewType = 'home' | 'roadmap' | 'lessonDetail' | 'success' | 'profile' | 'podcast' | 'badges' | 'chat';

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
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full pt-16 px-6 pb-52 overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <header className="flex justify-between items-center mb-12 px-2">
               <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-2xl bg-[#CCFF00] flex items-center justify-center text-black shadow-[0_10px_30px_rgba(204,255,0,0.25)]"
                  >
                     <UserIcon size={28} />
                  </motion.div>
                  <div>
                    <h1 className="text-sm font-sans font-black uppercase tracking-[0.2em] leading-none">Neo.Hustler</h1>
                    <p className="text-[10px] font-sans font-bold text-zinc-600 uppercase mt-1.5">Level {stats.currentLevel} Stage</p>
                  </div>
               </div>
               <div className="flex gap-2.5">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-5 py-3 bg-zinc-900/80 rounded-full border border-white/5"
                  >
                     <FlameIcon size={16} color="#FF6B4A" />
                     <span className="text-xs font-sans font-black">{stats.streak}</span>
                  </motion.div>
               </div>
            </header>

            {/* Active Mission Card */}
            <MagneticReveal>
              <section className="mb-10">
                 <motion.div 
                   whileTap={{ scale: 0.97 }}
                   onClick={() => startLevel(stats.currentLevel)}
                   className="glass-card relative p-10 rounded-[56px] overflow-hidden group cursor-pointer border border-white/5 hover:border-[#CCFF00]/30 transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
                 >
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#CCFF00]/5 blur-[70px] rounded-full group-hover:bg-[#CCFF00]/10 transition-colors" />
                    <div className="relative z-10">
                       <div className="flex items-center gap-2 mb-6">
                          <span className="text-[10px] font-sans font-black uppercase text-[#CCFF00] tracking-[0.3em] bg-[#CCFF00]/10 px-3 py-1.5 rounded-md">MISSION • 0{stats.currentLevel}</span>
                       </div>
                       <h3 className="text-[3.2rem] font-heading font-black tracking-tighter leading-[0.8] mb-2">{currentStep.title}</h3>
                       <h4 className="text-2xl font-heading font-black text-white/30 tracking-tight leading-none mb-10">{currentStep.vi_title}</h4>
                       <p className="text-zinc-500 font-sans font-bold text-sm mb-12 leading-relaxed pr-6">
                         {currentStep.desc} • <span className="italic">{currentStep.vi_desc}</span>
                       </p>
                       <button className="w-full py-6 bg-[#CCFF00] text-black rounded-[28px] font-sans font-black text-xs uppercase tracking-[0.2em] clay-accent hover:scale-[1.02] transition-transform">
                          START SPRINT
                       </button>
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Street Talk Sandbox Card */}
            <MagneticReveal delay={0.05}>
              <section className="mb-10 px-1">
                 <motion.div 
                   whileTap={{ scale: 0.97 }}
                   onClick={() => setView('chat')}
                   className="p-10 rounded-[48px] bg-zinc-900/40 border border-[#CCFF00]/20 flex items-center justify-between group shadow-2xl cursor-pointer overflow-hidden relative"
                 >
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/10 to-transparent blur-3xl rounded-full pointer-events-none" 
                    />
                    <div className="relative z-10">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse" />
                          <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#CCFF00]">Live AI Coaching</span>
                       </div>
                       <h4 className="text-3xl font-heading font-black tracking-tighter leading-[0.85] mb-2 uppercase">Street Talk<br/>Sandbox</h4>
                       <p className="text-xs font-sans font-bold text-zinc-600 mt-2 italic">Luyện Slang đô thị cực cháy</p>
                    </div>
                    <div className="w-20 h-20 bg-[#CCFF00] rounded-[32px] flex items-center justify-center text-black shadow-[0_15px_35px_rgba(204,255,0,0.3)] group-hover:rotate-12 transition-transform duration-500">
                       <FlashIcon size={32} />
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Daily Word Section */}
            <MagneticReveal delay={0.1}>
              <section className="mb-10 px-2">
                 <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-zinc-700">Daily Urban Word</h2>
                    <SparklesIcon size={16} color="#FF6B4A" />
                 </div>
                 <motion.div 
                    whileTap={{ scale: 0.97 }}
                    onClick={() => playNaturalSpeech(dailyWord.word)}
                    className="p-8 rounded-[40px] bg-zinc-900/40 border border-[#FF6B4A]/20 flex items-center justify-between group cursor-pointer relative overflow-hidden transition-all hover:border-[#FF6B4A]/40"
                 >
                    <div className="flex-1 relative z-10">
                       <div className="flex items-center gap-4 mb-3">
                          <h4 className="text-3xl font-heading font-black tracking-tighter text-white group-hover:text-[#FF6B4A] transition-colors">{dailyWord.word}</h4>
                          <span className="text-xs font-sans font-bold text-zinc-600 italic tracking-tighter">{dailyWord.pronunciation}</span>
                       </div>
                       <p className="text-zinc-500 font-sans font-bold text-sm leading-snug pr-4">{dailyWord.meaning}</p>
                    </div>
                    <div className="w-16 h-16 rounded-[24px] bg-zinc-800/50 flex items-center justify-center text-[#FF6B4A] shadow-[0_0_15px_rgba(255,107,74,0.1)] relative z-10 group-hover:bg-[#FF6B4A]/10 transition-colors">
                       <SoundHighIcon size={28} />
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Radio Flow */}
            <MagneticReveal delay={0.15}>
              <section className="mb-12 px-2">
                 <h2 className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-zinc-700 mb-6 px-2">Ambient Radio</h2>
                 <motion.div 
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openPodcast()}
                    className="relative p-8 rounded-[48px] bg-[#BFA3FF] text-black overflow-hidden flex items-center justify-between group shadow-2xl cursor-pointer"
                 >
                    <div className="relative z-10 flex-1">
                       <h4 className="text-3xl font-heading font-black tracking-tighter leading-none mb-3">Neo Radio FM</h4>
                       <p className="text-[11px] font-sans font-black opacity-60 uppercase tracking-[0.2em]">Bilingual Flow Session</p>
                    </div>
                    <div className="w-20 h-20 bg-black rounded-[32px] flex items-center justify-center text-[#CCFF00] shadow-lg relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                       <HeadphonesIcon size={32} />
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Action Grid */}
            <MagneticReveal delay={0.2}>
              <section className="grid grid-cols-2 gap-6 mb-12 px-2">
                 <motion.div 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setView('badges')}
                   className="p-8 rounded-[40px] bg-zinc-900/30 border border-[#FF6B4A]/10 flex flex-col justify-between aspect-square cursor-pointer group hover:border-[#FF6B4A]/30 transition-all"
                 >
                    <div className="w-16 h-16 rounded-[24px] bg-[#FF6B4A]/10 flex items-center justify-center text-[#FF6B4A] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,107,74,0.1)]">
                       <MedalIcon size={32} />
                    </div>
                    <div>
                       <h4 className="font-heading font-black text-2xl uppercase leading-none tracking-tighter">Trophy<br/>Room</h4>
                       <p className="text-[10px] font-sans font-black text-zinc-700 uppercase mt-3 tracking-widest">Achievements</p>
                    </div>
                 </motion.div>

                 <motion.div 
                   className="p-8 rounded-[40px] bg-zinc-900/30 border border-white/5 flex flex-col justify-between aspect-square opacity-40 grayscale cursor-not-allowed"
                 >
                    <div className="w-16 h-16 rounded-[24px] bg-zinc-800/50 flex items-center justify-center text-zinc-500">
                       <LibraryIcon size={32} />
                    </div>
                    <div>
                       <h4 className="font-heading font-black text-2xl uppercase leading-none tracking-tighter">Vocab<br/>Vault</h4>
                       <p className="text-[10px] font-sans font-black text-zinc-700 uppercase mt-3 tracking-widest">Library</p>
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>
          </motion.main>
        )}
        
        {view === 'badges' && (
           <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-20 px-6 pb-40 h-full overflow-y-auto no-scrollbar">
              <button onClick={() => setView('home')} className="mb-10 w-full h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center gap-4 transition-colors active:scale-95">
                 <CloseIcon size={24} color="#666" /> 
                 <span className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-zinc-400">Back to Hub</span>
              </button>
              <BadgeGallery unlockedBadges={stats.unlockedBadges || []} />
           </motion.div>
        )}

        {view === 'roadmap' && (
           <motion.div 
             key="roadmap" 
             initial={{ opacity: 0, scale: 0.95 }} 
             animate={{ opacity: 1, scale: 1 }} 
             exit={{ opacity: 0, scale: 0.95 }}
             className="pt-20 px-6 pb-40 h-full overflow-y-auto no-scrollbar"
           >
              <header className="mb-12 px-2">
                 <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#CCFF00] mb-2">NEO LEARNING PATH</h2>
                 <h3 className="text-4xl font-heading font-black tracking-tighter leading-none uppercase">Your Urban<br/>Journey</h3>
              </header>

              <div className="relative space-y-4">
                 <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(stats.currentLevel / ROADMAP_STEPS.length) * 100}%` }}
                      className="w-full bg-[#CCFF00]"
                    />
                 </div>

                 {ROADMAP_STEPS.map((step, idx) => {
                    const isUnlocked = step.id <= stats.currentLevel;
                    const isCurrent = step.id === stats.currentLevel;
                    
                    return (
                      <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => isUnlocked && startLevel(step.id)}
                        className={`relative pl-20 py-8 flex flex-col group cursor-pointer ${!isUnlocked && 'opacity-30'}`}
                      >
                         <div className={`absolute left-0 w-14 h-14 rounded-2xl flex items-center justify-center border-2 z-10 transition-all ${
                           isCurrent ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]' : 
                           isUnlocked ? 'bg-zinc-900 border-[#CCFF00] text-[#CCFF00]' : 'bg-zinc-900 border-zinc-800 text-zinc-700'
                         }`}>
                            {isUnlocked ? <FlashIcon size={20} /> : <span className="font-black text-xs">{step.id}</span>}
                         </div>

                         <div>
                            <span className="text-[9px] font-sans font-black uppercase tracking-widest text-zinc-600">{step.stage}</span>
                            <h4 className={`text-2xl font-heading font-black tracking-tight leading-none mt-1 ${isCurrent ? 'text-[#CCFF00]' : 'text-white'}`}>{step.title}</h4>
                            <p className="text-xs font-sans font-bold text-zinc-500 mt-2">{step.desc}</p>
                         </div>
                         
                         {isCurrent && (
                           <div className="absolute right-0 top-1/2 -translate-y-1/2">
                              <div className="px-4 py-1.5 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full">
                                 <span className="text-[8px] font-black text-[#CCFF00] uppercase tracking-widest">ACTIVE</span>
                              </div>
                           </div>
                         )}
                      </motion.div>
                    );
                 })}
              </div>
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

        {view === 'chat' && (
          <UrbanChat 
            scenario="Ordering a complex custom coffee at a busy Quận 1 specialty cafe." 
            context_vi="Bạn đang đứng tại quầy một quán cà phê Specialty cực đông khách ở trung tâm Quận 1. Hãy thử gọi một món thật 'vibe' và xử lý các câu hỏi của Barista nhé!"
            onBack={() => setView('home')} 
          />
        )}

        {view === 'lessonDetail' && currentLesson && (
          <LessonDetailScreen lesson={currentLesson} onFinish={handleLessonFinish} onBack={() => setView('home')} />
        )}

        {view === 'success' && (
          <SuccessScreen streak={stats.streak} onReturn={() => setView('home')} />
        )}
      </AnimatePresence>

      {/* 🟢 BOTTOM FADE OVERLAY - Mượt mà như lụa */}
      <div className="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/95 to-transparent pointer-events-none z-[80]" />

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] z-[100]">
        <div className="floating-dock h-24 rounded-[48px] px-8 flex justify-between items-center shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] border border-white/5">
          <button onClick={() => setView('home')} className="flex-1 flex flex-col items-center justify-center h-full gap-2 active:scale-90 transition-transform">
            <motion.div animate={{ y: view === 'home' ? -3 : 0, scale: view === 'home' ? 1.1 : 1 }}>
               <HomeIcon size={28} color={view === 'home' ? '#CCFF00' : '#444'} />
            </motion.div>
            <span className={`text-[9px] font-sans font-black uppercase tracking-widest ${view === 'home' ? 'text-[#CCFF00]' : 'text-zinc-800'}`}>HUB</span>
          </button>
          
          <button onClick={() => setView('roadmap')} className="flex-1 flex flex-col items-center justify-center h-full gap-2 active:scale-90 transition-transform">
            <motion.div animate={{ y: view === 'roadmap' ? -3 : 0, scale: view === 'roadmap' ? 1.1 : 1 }}>
               <MedalIcon size={28} color={view === 'roadmap' ? '#CCFF00' : '#444'} />
            </motion.div>
            <span className={`text-[9px] font-sans font-black uppercase tracking-widest ${view === 'roadmap' ? 'text-[#CCFF00]' : 'text-zinc-800'}`}>PATH</span>
          </button>

          <button className="flex-1 flex flex-col items-center justify-center h-full gap-2 opacity-30 grayscale cursor-not-allowed">
            <LibraryIcon size={28} color="#222" />
            <span className="text-[9px] font-sans font-black uppercase tracking-widest text-zinc-900">VAULT</span>
          </button>

          <button className="flex-1 flex flex-col items-center justify-center h-full gap-2 opacity-30 grayscale cursor-not-allowed">
            <UserIcon size={28} color="#222" />
            <span className="text-[9px] font-sans font-black uppercase tracking-widest text-zinc-900">PROFILE</span>
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[1000] flex items-center justify-center">
           <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-12">
                 <div className="absolute inset-0 border-[6px] border-[#CCFF00]/10 rounded-full" />
                 <div className="absolute inset-0 border-[6px] border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-[14px] font-sans font-black uppercase tracking-[0.6em] text-[#CCFF00] animate-pulse">Designing Vibe...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
