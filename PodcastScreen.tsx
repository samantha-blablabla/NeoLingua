
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData } from './types';
import { CloseIcon, LibraryIcon, FlashIcon } from './components/Icons';

interface PodcastScreenProps {
  lesson: LessonData;
  onBack: () => void;
  onFinished?: () => void;
}

const PodcastScreen: React.FC<PodcastScreenProps> = ({ lesson, onBack, onFinished }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const synth = window.speechSynthesis;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const segments = useMemo(() => {
    return lesson.podcast_segments.length > 0 ? lesson.podcast_segments : [
      { en: "Welcome to NeoLingua Urban Radio.", vi: "Chào mừng bạn đến với Radio Đô thị NeoLingua." },
      { en: "Today's session focuses on high-speed city life.", vi: "Buổi học hôm nay tập trung vào nhịp sống hối hả của thành phố." },
      { en: "Mastering these phrases will level up your game.", vi: "Làm chủ các cụm từ này sẽ giúp bạn nâng tầm bản thân." },
      { en: "It's not just about the coffee; it's about the networking opportunities in these modern hubs.", vi: "Nó không chỉ nằm ở việc uống cà phê; mà còn là về những cơ hội kết nối tại các trung tâm hiện đại này." },
      { en: "Stay consistent and keep that urban flow.", vi: "Hãy kiên trì và giữ vững nhịp điệu đô thị." }
    ];
  }, [lesson.podcast_segments]);

  const playSegment = (index: number) => {
    synth.cancel();
    if (index < 0) {
      setIsPlaying(false);
      return;
    }

    if (index >= segments.length) {
      setIsPlaying(false);
      if (onFinished) onFinished();
      return;
    }
    
    setCurrentIdx(index);
    const utterance = new SpeechSynthesisUtterance(segments[index].en);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      // Đảm bảo phần text active nằm chính giữa màn hình, không bị che khuất
      itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    
    utterance.onend = () => {
      if (index + 1 < segments.length) {
        playSegment(index + 1);
      } else {
        setIsPlaying(false);
        if (onFinished) onFinished();
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
      transition={{ type: "spring", damping: 30, stiffness: 250 }}
      className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col overflow-hidden text-white"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 shrink-0 bg-[#0A0A0A]">
        <button onClick={() => { synth.cancel(); onBack(); }} className="p-2 -ml-2 text-zinc-600 hover:text-white transition-colors">
          <CloseIcon size={22} />
        </button>
        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">NEO RADIO FM</span>
        <div className="w-10" /> 
      </header>

      {/* Mini Cover Art */}
      <div className="px-8 py-2 flex flex-col items-center shrink-0">
        <motion.div 
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 aspect-square rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border-4 border-zinc-900 relative"
        >
          <img 
            src={`https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800`} 
            alt="Cover Art" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 bg-[#0A0A0A] rounded-full border border-zinc-800 shadow-inner" />
          </div>
        </motion.div>
        <div className="mt-4 text-center">
          <h3 className="text-[11px] font-heading font-black uppercase tracking-tight text-zinc-500">
            {lesson.topic}
          </h3>
          <p className="text-[8px] font-black text-[#CCFF00] uppercase tracking-[0.3em] mt-1 opacity-50">
            URBAN FLOW EDITION
          </p>
        </div>
      </div>

      {/* Lyrics Section - Tăng padding bottom lên 40vh để không bao giờ bị cắt chữ */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 px-8 overflow-y-auto no-scrollbar snap-y snap-mandatory"
      >
        <div className="pt-8 pb-[40vh] space-y-16">
          {segments.map((seg, idx) => {
            const active = currentIdx === idx;
            return (
              <motion.div
                key={idx}
                ref={el => itemRefs.current[idx] = el}
                onClick={() => playSegment(idx)}
                animate={{ 
                  opacity: active ? 1 : 0.15, 
                  scale: active ? 1 : 0.95,
                  filter: active ? 'blur(0px)' : 'blur(1px)'
                }}
                className="snap-center cursor-pointer transition-all duration-700 flex flex-col"
              >
                <h4 className={`text-[30px] font-heading font-black leading-[1.1] tracking-tighter ${active ? 'text-white' : 'text-zinc-600'}`}>
                  {seg.en}
                </h4>
                <AnimatePresence>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-visible"
                    >
                      <p className="text-[16px] font-sans font-bold text-[#CCFF00] leading-relaxed tracking-tight border-l-2 border-[#CCFF00] pl-4">
                        {seg.vi}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls Section */}
      <div className="pb-10 pt-6 flex flex-col items-center px-6 shrink-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent border-t border-white/5">
        <div className="w-full max-w-[360px] space-y-6">
          {/* Progress Bar */}
          <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]"
              animate={{ width: `${((currentIdx + 1) / segments.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Controls Dock with Text Labels */}
          <div className="flex items-center justify-between">
            {/* Play All Button with Text */}
            <button 
              onClick={() => playSegment(0)}
              className="flex flex-col items-center gap-1 group transition-all"
            >
              <div className="p-2 text-zinc-600 group-hover:text-[#CCFF00] transition-colors">
                <LibraryIcon size={20} />
              </div>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-[#CCFF00]">PLAY ALL</span>
            </button>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => playSegment(currentIdx - 1)}
                className="text-zinc-500 hover:text-white active:scale-90 transition-all disabled:opacity-10"
                disabled={currentIdx === 0}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center text-black shadow-[0_15px_40px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              
              <button 
                onClick={() => playSegment(currentIdx + 1)}
                className="text-zinc-500 hover:text-white active:scale-90 transition-all disabled:opacity-10"
                disabled={currentIdx === segments.length - 1}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
              </button>
            </div>

            {/* Focus Button with Text */}
            <button className="flex flex-col items-center gap-1 group transition-all">
              <div className="p-2 text-zinc-600 group-hover:text-[#FF6B4A] transition-colors">
                <FlashIcon size={20} />
              </div>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-[#FF6B4A]">FOCUS</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodcastScreen;
