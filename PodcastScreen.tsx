
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData } from './types';
import { CloseIcon, HeadphonesIcon, LibraryIcon, FlashIcon } from './components/Icons';

interface PodcastScreenProps {
  lesson: LessonData;
  onBack: () => void;
}

const PodcastScreen: React.FC<PodcastScreenProps> = ({ lesson, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const synth = window.speechSynthesis;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const segments = useMemo(() => {
    return lesson.podcast_segments.length > 0 ? lesson.podcast_segments : [
      { en: "Welcome to NeoLingua Urban Radio.", vi: "Chào mừng bạn đến với Radio Đô thị NeoLingua." },
      { en: "Today's session focuses on high-speed city life.", vi: "Buổi học hôm nay tập trung vào nhịp sống hối hả của thành phố." },
      { en: "Mastering these phrases will level up your game.", vi: "Làm chủ các cụm từ này sẽ giúp bạn nâng tầm bản thân." },
      { en: "Stay consistent and keep that urban flow.", vi: "Hãy kiên trì và giữ vững nhịp điệu đô thị." }
    ];
  }, [lesson.podcast_segments]);

  const playSegment = (index: number) => {
    synth.cancel();
    if (index < 0 || index >= segments.length) {
      setIsPlaying(false);
      return;
    }
    
    setCurrentIdx(index);
    const utterance = new SpeechSynthesisUtterance(segments[index].en);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    
    utterance.onend = () => {
      if (index + 1 < segments.length) {
        playSegment(index + 1);
      } else {
        setIsPlaying(false);
      }
    };
    
    synth.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      synth.pause();
      setIsPlaying(false);
    } else {
      if (synth.paused) {
        synth.resume();
        setIsPlaying(true);
      } else {
        playSegment(currentIdx);
      }
    }
  };

  useEffect(() => {
    return () => synth.cancel();
  }, []);

  return (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[200] bg-[#121212] flex flex-col overflow-hidden text-white"
    >
      {/* Top Bar / SafeArea Simulation */}
      <header className="h-[8vh] flex items-center justify-between px-6 pt-4 shrink-0">
        <button onClick={() => { synth.cancel(); onBack(); }} className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
          <CloseIcon size={24} />
        </button>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">NEO RADIO FM</span>
        <div className="w-10" /> 
      </header>

      {/* ZONE 1: TOP (35%) - Cover Art */}
      <div className="h-[35vh] flex items-center justify-center px-8 shrink-0">
        <motion.div 
          animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[280px] aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-white/5 relative"
        >
          <img 
            src={`https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800`} 
            alt="Cover Art" 
            className="w-full h-full object-cover" // Equivalent to resizeMode: 'cover'
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-xl font-heading font-black leading-tight uppercase tracking-tighter truncate">
              {lesson.topic}
            </h3>
            <p className="text-[10px] font-black text-[#CCFF00] uppercase tracking-widest mt-1 opacity-80">
              URBAN FLOW EDITION
            </p>
          </div>
        </motion.div>
      </div>

      {/* ZONE 2: MIDDLE (40%) - Lyric Zone */}
      <div className="h-[40vh] px-[20px] overflow-y-auto no-scrollbar snap-y snap-mandatory shrink-0">
        <div className="py-[10vh] space-y-12">
          {segments.map((seg, idx) => {
            const active = currentIdx === idx;
            return (
              <motion.div
                key={idx}
                ref={el => itemRefs.current[idx] = el}
                onClick={() => playSegment(idx)}
                animate={{ 
                  opacity: active ? 1 : 0.2, 
                  scale: active ? 1 : 0.95,
                  x: active ? 0 : -5
                }}
                className="snap-center cursor-pointer transition-all duration-500"
              >
                <h4 className="text-[22px] font-heading font-extrabold leading-[1.2] tracking-tight text-white">
                  {seg.en}
                </h4>
                <AnimatePresence>
                  {active && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[14px] font-medium text-[#CCFF00] mt-[8px] tracking-wide"
                    >
                      {seg.vi}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ZONE 3: BOTTOM (25%) - Controls */}
      <div className="h-[25vh] flex flex-col items-center justify-center px-10 shrink-0">
        <div className="w-full max-w-[320px] space-y-8">
          {/* Progress Strip */}
          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#CCFF00]"
              animate={{ width: `${((currentIdx + 1) / segments.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button className="text-zinc-600 hover:text-white transition-colors">
              <LibraryIcon size={20} />
            </button>
            
            <div className="flex items-center gap-10">
              <button 
                onClick={() => playSegment(currentIdx - 1)}
                className="text-zinc-500 hover:text-white active:scale-90 transition-all disabled:opacity-20"
                disabled={currentIdx === 0}
              >
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-20 h-20 bg-[#CCFF00] rounded-[28px] flex items-center justify-center text-black shadow-[0_15px_40px_rgba(204,255,0,0.2)] hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              
              <button 
                onClick={() => playSegment(currentIdx + 1)}
                className="text-zinc-500 hover:text-white active:scale-90 transition-all disabled:opacity-20"
                disabled={currentIdx === segments.length - 1}
              >
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
            </div>

            <button className="text-zinc-600 hover:text-white transition-colors">
              <FlashIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodcastScreen;
