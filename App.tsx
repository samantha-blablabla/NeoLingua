
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLesson } from './services/geminiService';
import { LessonData, ThemeColors, VocabularyItem, UserStats } from './types';
import GrainOverlay from './components/GrainOverlay';
import { HomeIcon, BookIcon, FlashIcon, UserIcon, MoreIcon, SparklesIcon } from './components/Icons';
import { lessonsData } from './lessons';
import PodcastScreen from './PodcastScreen';
import BadgeGallery from './components/BadgeGallery';

const WordOfTheDayWidget: React.FC<{ word: VocabularyItem }> = ({ word }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    className="relative overflow-hidden bg-[#1C1C1E] rounded-[24px] p-5 border-[#CCFF00]/30 border-[0.5px] clay-card"
  >
    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-white"></div>
    <div className="flex items-center gap-2 mb-3">
      <SparklesIcon size={14} color="#BFA3FF" />
      <span className="text-[10px] font-heading font-black text-[#BFA3FF] uppercase tracking-[0.15em]">Word of the Day</span>
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-heading font-black text-white tracking-tighter">{word.word}</h3>
        <span className="text-xs text-zinc-500 font-medium italic">{word.pronunciation}</span>
      </div>
      <p className="text-sm font-medium text-[#CCFF00] mt-1 leading-tight">{word.meaning}</p>
    </div>
  </motion.div>
);

const App: React.FC = () => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<string>("Monday");
  const [view, setView] = useState<'home' | 'podcast' | 'profile'>('home');

  // Persistence simulation (Real app would use LocalStorage/Backend)
  const [userStats, setUserStats] = useState<UserStats>({
    lessonsCompleted: 0,
    streak: 1, // Start with 1 to help users visualize progress
    perfectTests: 0,
    unlockedBadges: []
  });

  const checkAchievements = useCallback((stats: UserStats) => {
    const newBadges = [...stats.unlockedBadges];
    let changed = false;

    if (stats.lessonsCompleted >= 1 && !newBadges.includes('newbie')) {
      newBadges.push('newbie');
      changed = true;
    }
    if (stats.streak >= 7 && !newBadges.includes('urban-legend')) {
      newBadges.push('urban-legend');
      changed = true;
    }
    if (stats.perfectTests >= 10 && !newBadges.includes('polyglot')) {
      newBadges.push('polyglot');
      changed = true;
    }

    if (changed) {
      setUserStats(prev => ({ ...prev, unlockedBadges: newBadges }));
      // Optional: Show a toast/celebration effect here
    }
  }, []);

  const handleCompleteChallenge = (isCorrect: boolean) => {
    if (!isCorrect) return;

    setUserStats(prev => {
      const nextStats = {
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
        // Mocking streak/perfect tests for demo purposes if it's correct
        perfectTests: currentDay === "Friday" ? prev.perfectTests + 1 : prev.perfectTests
      };
      checkAchievements(nextStats);
      return nextStats;
    });
    alert("Excellent! Challenge completed.");
  };

  const randomWord = useMemo(() => {
    const allWords = lessonsData.flatMap(lesson => lesson.vocab_set);
    if (allWords.length === 0) return null;
    return allWords[Math.floor(Math.random() * allWords.length)];
  }, []);

  const fetchNewLesson = useCallback(async (day: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await generateLesson(1, day);
      setLesson(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewLesson(currentDay);
  }, [currentDay, fetchNewLesson]);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative bg-[#0A0A0A] shadow-2xl border-x border-zinc-900 overflow-hidden text-white">
      <GrainOverlay />
      
      <AnimatePresence>
        {view === 'podcast' && lesson && (
          <PodcastScreen lesson={lesson} onBack={() => setView('home')} />
        )}
      </AnimatePresence>

      <header className="p-6 pt-10 flex justify-between items-end bg-gradient-to-b from-black to-transparent z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-heading font-extrabold tracking-tighter text-[#CCFF00]">NEOLINGUA</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            {view === 'profile' ? 'USER PROFILE' : `WEEK 1 • ${currentDay.toUpperCase()}`}
          </p>
        </motion.div>
        <motion.button 
          onClick={() => setView(view === 'profile' ? 'home' : 'profile')}
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border clay-accent transition-colors ${view === 'profile' ? 'bg-[#CCFF00] border-[#CCFF00]' : 'bg-zinc-900 border-zinc-800'}`}
        >
          <UserIcon size={24} color={view === 'profile' ? 'black' : '#CCFF00'} />
        </motion.button>
      </header>

      {view !== 'profile' && (
        <div className="px-6 flex gap-2 mb-4">
          {["Monday", "Wednesday", "Friday"].map((day) => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                currentDay === day ? "bg-[#CCFF00] text-black clay-accent" : "bg-zinc-900 text-zinc-500 border border-zinc-800"
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 pb-28 space-y-8 no-scrollbar">
        {view === 'home' && (
          <>
            {randomWord && <WordOfTheDayWidget word={randomWord} />}

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 space-y-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-[#CCFF00]/20 border-t-[#CCFF00] rounded-full" />
                  <p className="text-zinc-500 font-heading">AI đang soạn bài cho {currentDay}...</p>
                </motion.div>
              ) : lesson ? (
                <motion.div key={lesson.topic} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  <section className="bg-zinc-900 rounded-[32px] p-8 border border-zinc-800 clay-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/10 blur-3xl rounded-full -mr-16 -mt-16" />
                    <span className="text-[10px] font-black text-[#CCFF00] uppercase tracking-tighter block mb-2">Topic</span>
                    <h2 className="text-3xl font-heading font-black leading-tight">{lesson.topic}</h2>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Urban Vocabulary</h3>
                    <div className="space-y-3">
                      {lesson.vocab_set.map((v, i) => (
                        <div key={i} className="p-5 bg-zinc-900/50 rounded-[24px] border border-zinc-800/50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xl font-heading font-bold text-[#CCFF00]">{v.word}</h4>
                            <span className="text-[10px] font-medium text-zinc-500 italic">{v.pronunciation}</span>
                          </div>
                          <p className="text-sm text-zinc-300 mb-3">{v.meaning}</p>
                          <div className="bg-black/40 p-3 rounded-xl"><p className="text-xs text-zinc-400 italic">"{v.example}"</p></div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-[#BFA3FF] rounded-[32px] p-8 text-black clay-accent">
                    <h3 className="text-[10px] font-black uppercase mb-2 opacity-60">Grammar Focus</h3>
                    <p className="font-medium text-lg">{lesson.grammar_focus}</p>
                  </section>

                  <section className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Urban Podcast</h3>
                      <button onClick={() => setView('podcast')} className="text-[10px] font-bold text-[#CCFF00] flex items-center gap-1 hover:underline">
                        <FlashIcon size={12} /> GO TO STUDIO
                      </button>
                    </div>
                    <div className="p-6 bg-zinc-900 rounded-[32px] border border-zinc-800 clay-card cursor-pointer" onClick={() => setView('podcast')}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black shadow-lg shadow-[#CCFF00]/20">
                          <FlashIcon size={24} />
                        </div>
                        <div>
                          <p className="font-heading font-black text-lg">Luyện nghe song ngữ</p>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase">AI-Powered Voice Practice</p>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 italic">"Luyện tập phát âm và nghe hiểu với kịch bản thực tế..."</p>
                    </div>
                  </section>

                  <section className="pb-10">
                    <div className="bg-[#FF6B4A] rounded-[32px] p-8 text-black clay-accent">
                      <h3 className="text-[10px] font-black uppercase mb-3 opacity-60">Challenge</h3>
                      <p className="text-xl font-heading font-bold mb-6">{lesson.interactive_challenge.question}</p>
                      <div className="space-y-3">
                        {lesson.interactive_challenge.options?.map((opt) => (
                          <button 
                            key={opt} 
                            onClick={() => handleCompleteChallenge(opt === lesson.interactive_challenge.correct_answer)}
                            className="w-full py-4 px-6 bg-black/10 rounded-2xl text-left font-bold text-sm hover:bg-black/20"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        )}

        {view === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-10"
          >
            {/* User Info */}
            <section className="flex flex-col items-center py-6">
              <div className="w-24 h-24 bg-zinc-900 rounded-[32px] flex items-center justify-center border border-zinc-800 clay-card mb-4">
                <UserIcon size={48} color="#CCFF00" />
              </div>
              <h2 className="text-2xl font-heading font-black">Urban Learner</h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Level 12 • Technologist</p>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 text-center">
                <p className="text-2xl font-heading font-black text-[#CCFF00]">{userStats.streak}</p>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Streak</p>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 text-center">
                <p className="text-2xl font-heading font-black text-[#BFA3FF]">{userStats.lessonsCompleted}</p>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Lessons</p>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 text-center">
                <p className="text-2xl font-heading font-black text-[#FF6B4A]">{userStats.perfectTests}</p>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Perfect</p>
              </div>
            </section>

            {/* Badges Gallery */}
            <BadgeGallery unlockedBadges={userStats.unlockedBadges} />

            {/* Demo Controls */}
            <section className="p-6 bg-zinc-900/30 rounded-[32px] border border-dashed border-zinc-800">
               <p className="text-[10px] font-bold text-zinc-600 uppercase mb-4 text-center">Developer Simulation</p>
               <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setUserStats(prev => ({...prev, streak: 7}))}
                    className="py-2 bg-zinc-800 rounded-xl text-[9px] font-bold hover:bg-zinc-700"
                  >
                    Set 7-Day Streak
                  </button>
                  <button 
                    onClick={() => setUserStats(prev => ({...prev, perfectTests: 10}))}
                    className="py-2 bg-zinc-800 rounded-xl text-[9px] font-bold hover:bg-zinc-700"
                  >
                    Set 10 Tests
                  </button>
               </div>
               <button 
                onClick={() => checkAchievements(userStats)}
                className="w-full mt-2 py-2 bg-[#CCFF00] text-black rounded-xl text-[9px] font-black uppercase"
               >
                 Trigger Check
               </button>
            </section>
          </motion.div>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/80 backdrop-blur-xl border-t border-zinc-800 px-8 py-4 flex justify-between items-center z-[50]">
        <button className="flex flex-col items-center gap-1 text-[#CCFF00]" onClick={() => setView('home')}>
          <HomeIcon size={24} color={view === 'home' ? '#CCFF00' : '#444'} />
          <span className={`text-[9px] font-bold uppercase ${view === 'home' ? 'text-[#CCFF00]' : 'text-zinc-600'}`}>Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-600">
          <BookIcon size={24} color="#444" />
          <span className="text-[9px] font-bold uppercase">Archive</span>
        </button>
        <div onClick={() => setView('podcast')} className="w-14 h-14 bg-[#CCFF00] rounded-full flex items-center justify-center -translate-y-8 shadow-xl border-[6px] border-[#0A0A0A] clay-accent cursor-pointer">
          <FlashIcon size={28} color="black" />
        </div>
        <button className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-[#CCFF00]' : 'text-zinc-600'}`} onClick={() => setView('profile')}>
          <UserIcon size={24} color={view === 'profile' ? '#CCFF00' : '#444'} />
          <span className="text-[9px] font-bold uppercase">Profile</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-600"><MoreIcon size={24} color="#444" /><span className="text-[9px] font-bold uppercase">More</span></button>
      </nav>
    </div>
  );
};

export default App;
