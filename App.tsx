
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson } from './services/geminiService';
import { LessonData, VocabularyItem, UserStats, Badge } from './types';
import { checkAndUnlockBadges, syncUserStats } from './services/badgeService';
import { playNaturalSpeech } from './services/speechService';
import GrainOverlay from './components/GrainOverlay';
import { HomeIcon, LibraryIcon, MedalIcon, UserIcon, SparklesIcon, HeadphonesIcon, FlameIcon } from './components/Icons';
import { lessonsData } from './lessons';
import PodcastScreen from './PodcastScreen';
import BadgeGallery, { BADGES } from './components/BadgeGallery';
import LessonDetailScreen from './LessonDetailScreen';
import SuccessScreen from './SuccessScreen';
import BadgePopup from './components/BadgePopup';

type ViewType = 'home' | 'library' | 'badges' | 'profile' | 'podcast' | 'lessonDetail' | 'success';

const WordOfTheDayWidget: React.FC<{ word: VocabularyItem }> = ({ word }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className="relative overflow-hidden bg-[#BFA3FF] rounded-[32px] p-6 text-black hard-shadow flex flex-col justify-center min-h-[160px]"
  >
    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-white"></div>
    <div className="z-10 w-full">
      <span className="text-[10px] font-sans font-black uppercase tracking-[0.25em] opacity-40 block mb-2">DAILY WORD</span>
      <h3 className="text-[2.6rem] font-heading font-black leading-none tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
        {word.word}
      </h3>
      <p className="text-[14px] font-sans font-semibold leading-relaxed opacity-80 mt-3 max-w-[95%]">
        {word.meaning}
      </p>
    </div>
  </motion.div>
);

const App: React.FC = () => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<ViewType>('home');
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('neolingua_stats');
    return saved ? JSON.parse(saved) : {
      lessonsCompleted: 0,
      streak: 5,
      perfectTests: 0,
      podcastsCompleted: 0,
      unlockedBadges: []
    };
  });

  useEffect(() => {
    syncUserStats(userStats);
  }, [userStats]);

  /**
   * Task: checkAndReward logic
   * Triggered when a lesson or podcast ends to evaluate achievements.
   */
  const checkAndReward = useCallback(async (updatedStats: UserStats) => {
    const newlyUnlockedIds = checkAndUnlockBadges(updatedStats);
    
    if (newlyUnlockedIds.length > 0) {
      const badgeId = newlyUnlockedIds[0];
      const badgeData = BADGES.find(b => b.id === badgeId);
      
      if (badgeData) {
        setActiveBadge(badgeData);
        setShowBadgePopup(true);
        
        // Use the high-quality Neural voice for the reward announcement
        let voiceMessage = `Congratulations! You've unlocked the ${badgeData.title} badge!`;
        if (badgeId === 'newbie') {
          voiceMessage = "Congrats! You just earned the Urban Newbie badge";
        } else if (badgeId === 'street-smart') {
          voiceMessage = "Boom! Street Smart status unlocked. Keep that streak alive!";
        }

        await playNaturalSpeech(voiceMessage);
      }
      
      setUserStats(prev => ({
        ...prev,
        unlockedBadges: Array.from(new Set([...prev.unlockedBadges, ...newlyUnlockedIds]))
      }));
    }
  }, []);

  const fetchNewLesson = useCallback(async () => {
    try {
      setLoading(true);
      const data = await generateLesson(1, "Monday");
      setLesson(data);
    } catch (err) {
      console.error("AI Lesson generation failed, using fallback:", err);
      setLesson(lessonsData[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewLesson();
  }, [fetchNewLesson]);

  const handlePodcastFinished = () => {
    // 1. Play celebratory finish voice
    playNaturalSpeech("Amazing job! You finished the lesson.");
    
    setUserStats(prev => {
      const updated = { ...prev, podcastsCompleted: prev.podcastsCompleted + 1 };
      setTimeout(() => checkAndReward(updated), 1500); // Wait for first speech to end
      return updated;
    });
  };

  const handleLessonFinished = () => {
    // 1. Play celebratory finish voice
    playNaturalSpeech("Amazing job! You finished the lesson.");

    setUserStats(prev => {
      const updated = { ...prev, lessonsCompleted: prev.lessonsCompleted + 1 };
      setTimeout(() => checkAndReward(updated), 1500);
      return updated;
    });
    setView('success');
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
      
      <BadgePopup 
        badge={activeBadge} 
        isVisible={showBadgePopup} 
        onClose={() => setShowBadgePopup(false)} 
      />

      <AnimatePresence mode="wait">
        {view === 'podcast' && (
          <PodcastScreen 
            key="podcast" 
            lesson={lesson || lessonsData[0]} 
            onBack={() => setView('home')} 
            onFinished={handlePodcastFinished}
          />
        )}
        {view === 'lessonDetail' && lesson && (
          <LessonDetailScreen 
            key="lessonDetail"
            lesson={lesson} 
            onFinish={handleLessonFinished} 
            onBack={() => setView('home')} 
          />
        )}
        {view === 'success' && (
          <SuccessScreen 
            key="success"
            streak={userStats.streak} 
            onReturn={() => setView('home')} 
          />
        )}
      </AnimatePresence>

      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#CCFF00] flex items-center justify-center hard-shadow overflow-hidden border border-black/10">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ccff00`} alt="Avatar" className="w-10 h-10 mt-1" />
          </div>
          <div>
            <h2 className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-30 tracking-[0.1em]">LEVEL 12</h2>
            <h1 className="text-xl font-heading font-black -mt-1 tracking-tighter">Yo, Alex!</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 hard-shadow">
          <SparklesIcon size={14} color="#CCFF00" />
          <span className="text-[11px] font-sans font-black text-[#CCFF00]">{userStats.streak} DAYS</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar space-y-4 pt-2">
        
        {view === 'home' && (
          <>
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => !loading && setView('lessonDetail')}
              className="relative aspect-[16/10] w-full bg-[#1C1C1E] rounded-[32px] p-8 flex flex-col justify-end overflow-hidden hard-shadow group cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#CCFF00]/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#CCFF00]/20 transition-colors" />
              
              <span className="text-[10px] font-sans font-bold text-[#CCFF00] uppercase tracking-[0.2em] mb-2 block">TODAY'S TOPIC</span>
              <h2 className="text-3xl font-heading font-black leading-[0.9] tracking-tighter mb-4 text-white">
                {loading ? "ĐANG SOẠN..." : (lesson?.topic || "URBAN FLOW")}
              </h2>
              
              <div className="flex items-center gap-4">
                <button className="px-5 py-2.5 bg-[#CCFF00] text-black rounded-xl text-[11px] font-sans font-black uppercase clay-accent group-hover:scale-105 transition-transform">
                  {loading ? "Đợi chút..." : "Bắt đầu học"}
                </button>
                <span className="text-[10px] font-sans font-medium text-zinc-500 uppercase tracking-widest">12 MINS</span>
              </div>
            </motion.section>

            {lessonsData[0].vocab_set[0] && <WordOfTheDayWidget word={lessonsData[0].vocab_set[0]} />}

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setView('podcast')}
                className="bg-[#1C1C1E] rounded-[28px] p-5 border border-zinc-800 hard-shadow flex flex-col justify-between aspect-square cursor-pointer hover:border-zinc-600 transition-colors active:scale-95 group"
              >
                <div className="flex justify-between items-start">
                  <HeadphonesIcon size={20} color="#CCFF00" />
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#CCFF00]/10 rounded-full">
                    <div className="w-1 h-1 rounded-full bg-[#CCFF00] animate-pulse"></div>
                    <span className="text-[8px] font-black text-[#CCFF00] uppercase tracking-widest">LIVE</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[9px] font-sans font-bold text-zinc-500 uppercase tracking-widest mb-1">PODCAST</h3>
                  <p className="text-xl font-heading font-black leading-tight text-white group-hover:text-[#CCFF00] transition-colors">Midnight Hustle</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1C1C1E] rounded-[28px] p-5 border border-zinc-800 hard-shadow flex flex-col justify-between aspect-square"
              >
                <div className="flex justify-between items-start">
                  <FlameIcon size={20} color="#FF6B4A" />
                  <div className="text-[9px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Active</div>
                </div>
                <div>
                  <p className="text-3xl font-heading font-black leading-tight text-[#FF6B4A]">{userStats.streak}</p>
                  <p className="text-[10px] font-sans font-medium text-zinc-500 uppercase mt-1">Day Streak</p>
                </div>
              </motion.div>
            </div>
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
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ccff00`} alt="Avatar" className="w-20 h-20" />
              </div>
              <h2 className="text-3xl font-heading font-black tracking-tighter text-white">Alex Urban</h2>
              <p className="text-[11px] font-sans font-medium text-zinc-500 uppercase tracking-widest mt-1">Tech Nomad • Lvl 12</p>
            </section>
            
            <div className="bg-zinc-900 rounded-[32px] p-6 border border-zinc-800 space-y-6">
              <h4 className="text-[10px] font-sans font-black text-zinc-600 uppercase tracking-widest">USER STATS</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900">
                  <span className="text-[10px] font-bold text-zinc-600 block mb-1">PODCASTS</span>
                  <span className="text-xl font-black text-[#CCFF00]">{userStats.podcastsCompleted}</span>
                </div>
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900">
                  <span className="text-[10px] font-bold text-zinc-600 block mb-1">LESSONS</span>
                  <span className="text-xl font-black text-[#BFA3FF]">{userStats.lessonsCompleted}</span>
                </div>
              </div>

              <h4 className="text-[10px] font-sans font-black text-zinc-600 uppercase tracking-widest">DEVELOPER ZONE</h4>
              <button 
                onClick={() => handleLessonFinished()}
                className="w-full flex items-center justify-between p-4 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-2xl group transition-all"
              >
                <span className="text-sm font-bold text-[#CCFF00]">Simulate Lesson Finish (Trigger Badge)</span>
                <MedalIcon size={18} color="#CCFF00" className="group-hover:rotate-12 transition-transform" />
              </button>
              
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="w-full text-left py-3 text-red-500 text-sm font-bold border-t border-zinc-800 mt-2"
              >
                Reset App Data
              </button>
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
            const isActive = view === item.id || (view === 'podcast' && item.id === 'home');
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
