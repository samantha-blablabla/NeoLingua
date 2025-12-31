
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData } from './types';
import { CloseIcon, HeadphonesIcon, SparklesIcon, FlashIcon, LibraryIcon } from './components/Icons';

interface PodcastScreenProps {
  lesson: LessonData;
  onBack: () => void;
}

const AudioBars: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <div className="flex items-end justify-center gap-[2px] h-6">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        animate={isPlaying ? { height: [4, 16, 8, 20, 6, 14][i % 6], opacity: [0.5, 1, 0.7] } : { height: 3, opacity: 0.2 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
        className="w-[2px] bg-[#CCFF00] rounded-full"
      />
    ))}
  </div>
);

const PodcastScreen: React.FC<PodcastScreenProps> = ({ lesson, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<'all' | 'focus'>('all');
  const synth = window.speechSynthesis;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const segments = useMemo(() => lesson.podcast_segments, [lesson]);

  const playSegment = (index: number) => {
    synth.cancel();
    if (index < 0 || index >= segments.length) {
      setIsPlaying(false);
      return;
    }
    setCurrentSegmentIndex(index);
    const utterance = new SpeechSynthesisUtterance(segments[index].en);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    
    utterance.onstart = () => {
        setIsPlaying(true);
        itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    
    utterance.onend = () => {
      if (playbackMode === 'all' && index + 1 < segments.length) {
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
        playSegment(currentSegmentIndex);
      }
    }
  };

  useEffect(() => {
    return () => synth.cancel();
  }, []);

  return (
    <motion.div 
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} 
      className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col overflow-hidden text-white"
    >
      <header className="flex items-center justify-between p-6 h-16 z-50">
        <button onClick={() => { synth.cancel(); onBack(); }} className="p-2 text-zinc-600 hover:text-white transition-colors">
          <CloseIcon size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">NEO-RADIO FM</span>
          <span className="text-[10px] font-bold text-[#CCFF00]">104.2 DISTRICT 1</span>
        </div>
        <SparklesIcon size={18} className="text-[#CCFF00] opacity-40" />
      </header>

      {/* ZONE 1: Cover Art */}
      <div className="h-[30vh] flex items-center justify-center p-8">
        <motion.div 
          animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-48 aspect-square bg-[#1C1C1E] rounded-[40px] overflow-hidden border border-white/5 hard-shadow flex flex-col items-center justify-center text-center p-6"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/10 to-transparent opacity-20" />
           <HeadphonesIcon size={32} className="text-[#CCFF00] mb-3" />
           <h3 className="text-xs font-heading font-black uppercase tracking-tight leading-tight">{lesson.topic}</h3>
           <div className="mt-4"><AudioBars isPlaying={isPlaying} /></div>
        </motion.div>
      </div>

      {/* ZONE 2: Parallax Lyrics */}
      <div className="h-[45vh] overflow-y-auto px-10 no-scrollbar snap-y snap-mandatory">
        <div className="py-[15vh] space-y-20">
          {segments.map((seg, idx) => {
            const active = currentSegmentIndex === idx;
            return (
              <motion.div 
                key={idx} 
                ref={el => itemRefs.current[idx] = el} 
                onClick={() => playSegment(idx)}
                animate={{ opacity: active ? 1 : 0.15, scale: active ? 1.05 : 0.95, y: active ? 0 : 10 }}
                transition={{ duration: 0.5 }}
                className="relative snap-center cursor-pointer group"
              >
                {active && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.05, x: 0 }}
                    className="absolute -top-10 -left-6 text-7xl font-heading font-black text-white italic select-none pointer-events-none whitespace-nowrap"
                  >
                    {seg.en.split(' ')[0]}
                  </motion.div>
                )}
                <h4 className={`text-2xl font-heading font-black leading-tight tracking-tight ${active ? 'text-white' : 'text-zinc-600'}`}>
                  {seg.en}
                </h4>
                <AnimatePresence>
                  {active && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm font-medium text-[#CCFF00] mt-3 tracking-wide"
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

      {/* ZONE 3: Glassmorphism Controls */}
      <div className="h-[25vh] flex items-center justify-center p-8 z-50">
        <div className="w-full max-w-[340px] bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/10 rounded-[44px] p-6 flex items-center justify-between relative shadow-2xl">
          <button 
            onClick={() => setPlaybackMode('all')} 
            className={`w-10 h-10 flex flex-col items-center justify-center transition-all ${playbackMode === 'all' ? 'text-[#CCFF00]' : 'text-zinc-600'}`}
          >
            <LibraryIcon size={18} />
            <span className="text-[6px] font-black mt-1 uppercase">ALL</span>
          </button>

          <div className="flex items-center gap-6">
            <button onClick={() => playSegment(currentSegmentIndex - 1)} className="text-zinc-500 hover:text-white transition-colors">
              <svg width="24" height="24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
            </button>
            <button 
              onClick={togglePlay} 
              className="w-16 h-16 bg-[#CCFF00] rounded-[24px] flex items-center justify-center text-black clay-accent shadow-[0_10px_30px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
                {isPlaying ? (
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
                )}
            </button>
            <button onClick={() => playSegment(currentSegmentIndex + 1)} className="text-zinc-500 hover:text-white transition-colors">
              <svg width="24" height="24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
          </div>

          <button 
            onClick={() => setPlaybackMode('focus')} 
            className={`w-10 h-10 flex flex-col items-center justify-center transition-all ${playbackMode === 'focus' ? 'text-[#CCFF00]' : 'text-zinc-600'}`}
          >
            <FlashIcon size={18} />
            <span className="text-[6px] font-black mt-1 uppercase">ONE</span>
          </button>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-[44px] overflow-hidden">
            <motion.div 
              className="h-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]" 
              animate={{ width: `${((currentSegmentIndex + 1) / segments.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodcastScreen;
