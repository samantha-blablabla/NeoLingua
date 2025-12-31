
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData } from './types';
import { CloseIcon, LibraryIcon, FlashIcon, HeadphonesIcon } from './components/Icons';
import { lessonsData } from './lessons';

interface PodcastScreenProps {
  lesson: LessonData;
  onBack: () => void;
  onSelectLesson: (lesson: LessonData) => void;
  onFinished?: () => void;
}

const PodcastScreen: React.FC<PodcastScreenProps> = ({ lesson, onBack, onSelectLesson, onFinished }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const synth = window.speechSynthesis;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const segments = useMemo(() => {
    return lesson.podcast_segments.length > 0 ? lesson.podcast_segments : [
      { en: "Welcome back to Neo Radio.", vi: "Chào mừng bạn quay lại với Neo Radio." }
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
    utterance.rate = 0.95;
    
    utterance.onstart = () => {
      setIsPlaying(true);
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
  }, [lesson.id]);

  return (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col overflow-hidden text-white"
    >
      <AnimatePresence>
        {showLibrary && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-[250] bg-[#0A0A0A] p-8 overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-heading font-black tracking-tighter uppercase">Station<br/><span className="text-[#CCFF00]">Library</span></h2>
               <button onClick={() => setShowLibrary(false)} className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                  <CloseIcon size={20} />
               </button>
            </div>
            
            <div className="space-y-4 pb-12">
               {lessonsData.map((l) => (
                 <motion.div 
                   key={l.id}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => { onSelectLesson(l); setShowLibrary(false); setCurrentIdx(0); }}
                   className={`p-6 rounded-[32px] border transition-all cursor-pointer flex items-center justify-between ${
                     l.id === lesson.id ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-zinc-900/50 border-white/5'
                   }`}
                 >
                    <div>
                       <span className={`text-[8px] font-black uppercase tracking-widest ${l.id === lesson.id ? 'text-black/40' : 'text-zinc-600'}`}>LEVEL 0{l.level}</span>
                       <h4 className="text-lg font-heading font-black tracking-tight leading-none mt-1">{l.topic}</h4>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${l.id === lesson.id ? 'bg-black text-[#CCFF00]' : 'bg-zinc-800 text-zinc-500'}`}>
                       <HeadphonesIcon size={18} />
                    </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between px-6 pt-12 pb-4 shrink-0 bg-[#0A0A0A]">
        <button onClick={() => { synth.cancel(); onBack(); }} className="p-2 -ml-2 text-zinc-600 hover:text-white transition-colors">
          <CloseIcon size={22} />
        </button>
        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">NEO RADIO FM</span>
        <button onClick={() => setShowLibrary(true)} className="p-2 text-[#CCFF00]">
          <LibraryIcon size={22} />
        </button>
      </header>

      <div className="px-8 py-2 flex flex-col items-center shrink-0">
        <motion.div 
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 aspect-square rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border-4 border-zinc-900 relative"
        >
          <img 
            src={`https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800`} 
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

      <div className="pb-10 pt-6 flex flex-col items-center px-6 shrink-0 bg-[#0A0A0A] border-t border-white/5">
        <div className="w-full max-w-[360px] space-y-6">
          <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#CCFF00]"
              animate={{ width: `${((currentIdx + 1) / segments.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowLibrary(true)}
              className="flex flex-col items-center gap-1 group transition-all"
            >
              <div className="p-2 text-zinc-600 group-hover:text-[#CCFF00]">
                <LibraryIcon size={20} />
              </div>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-[#CCFF00]">LIBRARY</span>
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

            <button className="flex flex-col items-center gap-1 group transition-all">
              <div className="p-2 text-zinc-600 group-hover:text-[#FF6B4A]">
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
