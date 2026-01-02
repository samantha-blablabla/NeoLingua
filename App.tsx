
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData, UserStats, VocabularyItem } from './types';
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
import Dashboard from './components/Dashboard';
import VocabVaultScreen from './VocabVaultScreen';
import { playNaturalSpeech } from './services/speechService';
import { syncUserStats } from './services/badgeService';

const MagneticReveal: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 12, scale: 0.92, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      className="w-full origin-bottom"
    >
      {children}
    </motion.div>
  );
};

type ViewType = 'home' | 'roadmap' | 'lessonDetail' | 'success' | 'profile' | 'podcast' | 'badges' | 'chat' | 'vault' | 'curriculum';

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
  const dailyWord = {
    word: "Ghosting",
    meaning: "Đột ngột cắt đứt liên lạc không lời giải thích trong các mối quan hệ xã hội hoặc công việc."
  };

  const [view, setView] = useState<ViewType>('home');
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('neolingua_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, savedVocab: parsed.savedVocab || [] };
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

  const toggleSaveVocab = (item: VocabularyItem) => {
    setStats(prev => {
      const exists = prev.savedVocab.find(v => v.id === item.id);
      const newVocab = exists 
        ? prev.savedVocab.filter(v => v.id !== item.id)
        : [...prev.savedVocab, item];
      return { ...prev, savedVocab: newVocab };
    });
  };

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
    <div className="min-h-screen max-w-md mx-auto relative bg-[#0A0A0A] text-white font-sans overflow-hidden border-x border-zinc-900 shadow-2xl">
      <GrainOverlay />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full pt-16 px-6 pb-40 overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <header className="flex justify-between items-center mb-12 px-2">
               <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-[20px] bg-[#CCFF00] flex items-center justify-center text-black shadow-[0_15px_35px_rgba(204,255,0,0.2)]"
                  >
                     <UserIcon size={28} />
                  </motion.div>
                  <div>
                    <h1 className="text-sm font-sans font-black uppercase tracking-[0.2em] leading-none">Neo.Hustler</h1>
                    <p className="text-[10px] font-sans font-bold text-zinc-600 uppercase mt-2">Level {stats.currentLevel} Stage</p>
                  </div>
               </div>
               <div className="flex gap-2.5">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-5 py-3 bg-zinc-900/40 backdrop-blur-xl rounded-full border border-white/5">
                     <FlameIcon size={16} color="#FF6B4A" />
                     <span className="text-xs font-sans font-black">{stats.streak}</span>
                  </motion.div>
               </div>
            </header>

            {/* Active Mission Card */}
            <MagneticReveal>
              <section className="mb-10">
                 <motion.div whileTap={{ scale: 0.98 }} onClick={() => startLevel(stats.currentLevel)} className="glass-card relative p-10 rounded-[56px] overflow-hidden group cursor-pointer shadow-2xl">
                    <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#CCFF00]/10 blur-[90px] rounded-full group-hover:bg-[#CCFF00]/15 transition-all duration-500" />
                    <div className="relative z-10">
                       <div className="flex items-center gap-2 mb-6">
                          <span className="text-[10px] font-sans font-black uppercase text-[#CCFF00] tracking-[0.3em] bg-[#CCFF00]/10 px-4 py-2 rounded-xl">MISSION • 0{stats.currentLevel}</span>
                       </div>
                       <h3 className="text-[3.5rem] font-heading font-black tracking-tighter leading-[0.8] mb-1">{ROADMAP_STEPS[stats.currentLevel-1]?.title}</h3>
                       <h4 className="text-2xl font-heading font-black text-white/20 tracking-tight leading-none mb-10">{ROADMAP_STEPS[stats.currentLevel-1]?.vi_title}</h4>
                       <p className="text-zinc-500 font-sans font-bold text-sm mb-12 leading-relaxed pr-6">{ROADMAP_STEPS[stats.currentLevel-1]?.desc}</p>
                       <button className="w-full py-6 bg-[#CCFF00] text-black rounded-[28px] font-sans font-black text-[13px] uppercase tracking-[0.25em] clay-accent hover:scale-[1.02] transition-all">START SPRINT</button>
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Curriculum Card - NEW STRUCTURED LEARNING */}
            <MagneticReveal delay={0.05}>
              <section className="mb-10" onClick={() => setView('curriculum')}>
                 <motion.div whileTap={{ scale: 0.98 }} className="p-10 rounded-[48px] bg-gradient-to-br from-[#CCFF00]/20 to-transparent border border-[#CCFF00]/30 flex items-center justify-between group shadow-xl cursor-pointer overflow-hidden relative">
                    <div className="relative z-10">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]" />
                          <span className="text-[10px] font-sans font-black uppercase tracking-widest text-[#CCFF00]">Structured Learning</span>
                       </div>
                       <h4 className="text-3xl font-heading font-black tracking-tighter leading-[0.85] uppercase text-[#CCFF00]">Learning<br/>Curriculum</h4>
                    </div>
                    <div className="w-20 h-20 bg-black rounded-[32px] flex items-center justify-center text-[#CCFF00] border border-[#CCFF00]/30 shadow-2xl group-hover:rotate-12 transition-all duration-500">
                       <LibraryIcon size={32} />
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Street Talk Sandbox Card */}
            <MagneticReveal delay={0.1}>
              <section className="mb-10" onClick={() => setView('chat')}>
                 <motion.div whileTap={{ scale: 0.98 }} className="p-10 rounded-[48px] bg-zinc-900/30 border border-white/5 flex items-center justify-between group shadow-xl cursor-pointer overflow-hidden relative">
                    <div className="relative z-10">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]" />
                          <span className="text-[10px] font-sans font-black uppercase tracking-widest text-zinc-500">Live AI Coaching</span>
                       </div>
                       <h4 className="text-3xl font-heading font-black tracking-tighter leading-[0.85] uppercase">Street Talk<br/>Sandbox</h4>
                    </div>
                    <div className="w-20 h-20 bg-zinc-900 rounded-[32px] flex items-center justify-center text-[#CCFF00] border border-white/10 shadow-2xl group-hover:rotate-12 transition-all duration-500">
                       <FlashIcon size={32} />
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Daily Word Section */}
            <MagneticReveal delay={0.1}>
              <section className="mb-10 px-2" onClick={() => playNaturalSpeech(dailyWord.word)}>
                 <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-zinc-700">Urban Lexicon</h2>
                    <SparklesIcon size={16} color="#FF6B4A" />
                 </div>
                 <motion.div whileTap={{ scale: 0.98 }} className="p-8 rounded-[40px] bg-zinc-900/20 border border-white/5 flex items-center justify-between group cursor-pointer relative overflow-hidden transition-all hover:bg-zinc-900/40">
                    <div className="flex-1 relative z-10">
                       <h4 className="text-3xl font-heading font-black tracking-tighter text-white group-hover:text-[#CCFF00] transition-colors">{dailyWord.word}</h4>
                       <p className="text-zinc-500 font-sans font-bold text-sm leading-snug mt-1 pr-6">{dailyWord.meaning}</p>
                    </div>
                    <div className="w-16 h-16 rounded-[24px] bg-zinc-900 border border-white/5 flex items-center justify-center text-[#CCFF00]"><SoundHighIcon size={24} /></div>
                 </motion.div>
              </section>
            </MagneticReveal>

            {/* Action Grid */}
            <MagneticReveal delay={0.15}>
              <section className="grid grid-cols-2 gap-6 mb-12 px-2 pb-20">
                 <motion.div 
                   whileTap={{ scale: 0.96 }}
                   onClick={() => setView('badges')}
                   className="p-9 aspect-[4/5] rounded-[48px] bg-zinc-900/20 border border-white/5 flex flex-col justify-between cursor-pointer group hover:bg-zinc-900/40 transition-all overflow-hidden"
                 >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                       <motion.div 
                         animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                         className="absolute inset-0 bg-[#FF6B4A] blur-[28px] rounded-full"
                       />
                       <div className="relative z-10 text-[#FF6B4A]">
                          <MedalIcon size={36} />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="font-heading font-black text-[1.8rem] uppercase leading-[0.9] tracking-tighter group-hover:text-[#FF6B4A] transition-colors">Trophy<br/>Room</h4>
                       <p className="text-[9px] font-sans font-black text-zinc-800 uppercase tracking-[0.25em]">ARCHIVE</p>
                    </div>
                 </motion.div>

                 <motion.div 
                   whileTap={{ scale: 0.96 }}
                   onClick={() => setView('vault')}
                   className="p-9 aspect-[4/5] rounded-[48px] bg-zinc-900/20 border border-white/5 flex flex-col justify-between cursor-pointer group hover:bg-zinc-900/40 transition-all overflow-hidden"
                 >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                       <motion.div 
                         animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                         transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                         className="absolute inset-0 bg-[#CCFF00] blur-[28px] rounded-full"
                       />
                       <div className="relative z-10 text-[#CCFF00]">
                          <LibraryIcon size={36} />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="font-heading font-black text-[1.8rem] uppercase leading-[0.9] tracking-tighter group-hover:text-[#CCFF00] transition-colors">Vocab<br/>Vault</h4>
                       <p className="text-[9px] font-sans font-black text-zinc-800 uppercase tracking-[0.25em]">LEXICON</p>
                    </div>
                 </motion.div>
              </section>
            </MagneticReveal>
          </motion.main>
        )}
        
        {view === 'vault' && (
           <VocabVaultScreen savedVocab={stats.savedVocab} onBack={() => setView('home')} onRemove={toggleSaveVocab} />
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
           <motion.div key="roadmap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="pt-20 px-6 pb-40 h-full overflow-y-auto no-scrollbar">
              <header className="mb-12 px-2">
                 <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#CCFF00] mb-2">NEO LEARNING PATH</h2>
                 <h3 className="text-4xl font-heading font-black tracking-tighter leading-none uppercase">Your Urban Journey</h3>
              </header>
              <div className="relative space-y-4">
                 {ROADMAP_STEPS.map((step, idx) => {
                    const isUnlocked = step.id <= stats.currentLevel;
                    return (
                      <motion.div key={step.id} onClick={() => isUnlocked && startLevel(step.id)} className={`relative pl-20 py-8 flex flex-col cursor-pointer transition-all ${!isUnlocked ? 'opacity-20 grayscale' : ''}`}>
                         <div className={`absolute left-0 w-14 h-14 rounded-[18px] flex items-center justify-center border-2 z-10 transition-all ${step.id === stats.currentLevel ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-700'}`}>
                            {isUnlocked ? <FlashIcon size={20} /> : <span className="font-black text-xs">{step.id}</span>}
                         </div>
                         <h4 className={`text-2xl font-heading font-black mt-1 ${step.id === stats.currentLevel ? 'text-[#CCFF00]' : 'text-white'}`}>{step.title}</h4>
                      </motion.div>
                    );
                 })}
              </div>
           </motion.div>
        )}

        {view === 'lessonDetail' && currentLesson && (
          <LessonDetailScreen lesson={currentLesson} savedVocabIds={stats.savedVocab.map(v => v.id)} onToggleSaveVocab={toggleSaveVocab} onFinish={handleLessonFinish} onBack={() => setView('home')} />
        )}

        {view === 'success' && <SuccessScreen streak={stats.streak} onReturn={() => setView('home')} />}
        {view === 'chat' && <UrbanChat scenario="Coffee shop vibes" context_vi="Học cách gọi cafe cực nghệ" onBack={() => setView('home')} />}
        {view === 'podcast' && currentLesson && <PodcastScreen lesson={currentLesson} favoriteLessons={stats.favoriteLessons} onToggleFavorite={() => {}} onBack={() => setView('home')} onSelectLesson={() => {}} />}
        {view === 'curriculum' && <Dashboard />}
      </AnimatePresence>

      {/* Subtle fade overlay at bottom - only for scroll aesthetic */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-[5]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] z-[100]">
        <div className="floating-dock h-24 rounded-[40px] px-8 flex justify-between items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
          <button onClick={() => setView('home')} className="flex-1 flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-transform">
            <HomeIcon size={26} color={view === 'home' ? '#CCFF00' : '#444'} />
            <span className={`text-[9px] font-sans font-black uppercase tracking-[0.15em] ${view === 'home' ? 'text-[#CCFF00]' : 'text-zinc-800'}`}>HUB</span>
          </button>
          <button onClick={() => setView('roadmap')} className="flex-1 flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-transform">
            <MedalIcon size={26} color={view === 'roadmap' ? '#CCFF00' : '#444'} />
            <span className={`text-[9px] font-sans font-black uppercase tracking-[0.15em] ${view === 'roadmap' ? 'text-[#CCFF00]' : 'text-zinc-800'}`}>PATH</span>
          </button>
          <button onClick={() => setView('vault')} className="flex-1 flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-transform">
            <LibraryIcon size={26} color={view === 'vault' ? '#CCFF00' : '#444'} />
            <span className={`text-[9px] font-sans font-black uppercase tracking-[0.15em] ${view === 'vault' ? 'text-[#CCFF00]' : 'text-zinc-800'}`}>VAULT</span>
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-[#0A0A0A] backdrop-blur-3xl z-[1000] flex flex-col items-center justify-center">
           <div className="w-12 h-12 border-2 border-[#CCFF00]/10 border-t-[#CCFF00] rounded-full animate-spin mb-6" />
           <p className="text-[12px] font-sans font-black uppercase tracking-[0.5em] text-[#CCFF00] animate-pulse">Designing Vibe...</p>
        </div>
      )}
    </div>
  );
};

export default App;
