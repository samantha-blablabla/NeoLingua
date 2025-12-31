
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData, PodcastSegment } from './types';
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
        animate={isPlaying ? { height: [4, 16, 8, 20, 6, 14][i % 6] } : { height: 3 }}
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
    if (index < 0 || index >= segments.length) return;
    setCurrentSegmentIndex(index);
    const utterance = new SpeechSynthesisUtterance(segments[index].en);
    utterance.onstart = () => {
        setIsPlaying(true);
        itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    utterance.onend = () => {
      if (playbackMode === 'all' && index + 1 < segments.length) playSegment(index + 1);
      else setIsPlaying(false);
    };
    synth.speak(utterance);
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col overflow-hidden text-white">
      <header className="flex items-center justify-between p-6 h-16">
        <button onClick={onBack} className="p-2 text-zinc-600 hover:text-white"><CloseIcon size={20} /></button>
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">NEO-RADIO 1.0</span>
        <SparklesIcon size={18} className="text-[#CCFF00] opacity-40" />
      </header>

      {/* ZONE 1: TOP 30% - Cover */}
      <div className="h-[30vh] flex items-center justify-center">
        <div className="relative w-48 aspect-square bg-[#1C1C1E] rounded-[32px] overflow-hidden border border-white/5 hard-shadow flex flex-col items-center justify-center text-center p-4">
           <HeadphonesIcon size={24} className="text-[#CCFF00] mb-2" />
           <h3 className="text-sm font-black uppercase tracking-tight">{lesson.topic}</h3>
           <AudioBars isPlaying={isPlaying} />
        </div>
      </div>

      {/* ZONE 2: MIDDLE 45% - Parallax Lyrics */}
      <div className="h-[45vh] overflow-y-auto px-10 no-scrollbar snap-y snap-mandatory">
        <div className="py-[15vh] space-y-20">
          {segments.map((seg, idx) => {
            const active = currentSegmentIndex === idx;
            return (
              <motion.div key={idx} ref={el => itemRefs.current[idx] = el} onClick={() => playSegment(idx)}
                animate={{ opacity: active ? 1 : 0.2, scale: active ? 1.05 : 0.95 }}
                className="relative snap-center cursor-pointer"
              >
                {active && <motion.div className="absolute -top-8 -left-4 text-6xl font-black text-white/5 italic select-none">{seg.en.split(' ')[0]}</motion.div>}
                <h4 className={`text-xl font-black leading-relaxed ${active ? 'text-white' : 'text-zinc-700'}`}>{seg.en}</h4>
                {active && <p className="text-sm font-medium text-[#CCFF00] mt-2">{seg.vi}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ZONE 3: BOTTOM 25% - Controls */}
      <div className="h-[25vh] flex items-center justify-center p-8">
        <div className="w-full max-w-[340px] bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex items-center justify-between relative shadow-2xl">
          <button onClick={() => setPlaybackMode('all')} className={playbackMode === 'all' ? 'text-[#CCFF00]' : 'text-zinc-600'}><LibraryIcon size={20} /></button>
          <div className="flex items-center gap-6">
            <button onClick={() => playSegment(currentSegmentIndex - 1)} className="text-zinc-500"><svg width="24" height="24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg></button>
            <button onClick={() => isPlaying ? synth.pause() : synth.resume()} className="w-14 h-14 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black clay-accent shadow-lg">
                {isPlaying ? <svg width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg width="24" height="24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={() => playSegment(currentSegmentIndex + 1)} className="text-zinc-500"><svg width="24" height="24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg></button>
          </div>
          <button onClick={() => setPlaybackMode('focus')} className={playbackMode === 'focus' ? 'text-[#CCFF00]' : 'text-zinc-600'}><FlashIcon size={20} /></button>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5"><motion.div className="h-full bg-[#CCFF00]" animate={{ width: `${((currentSegmentIndex+1)/segments.length)*100}%` }} /></div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodcastScreen;
