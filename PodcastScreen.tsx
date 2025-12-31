
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { LessonData, PodcastSegment } from './types';
import { CloseIcon, HeadphonesIcon, SparklesIcon, FlashIcon, LibraryIcon } from './components/Icons';

interface PodcastScreenProps {
  lesson: LessonData;
  onBack: () => void;
}

const EPISODES = [
  { id: 1, title: "Coffee Shop Talk", desc: "Luyện nghe hội thoại đời thường" },
  { id: 2, title: "Tech Talk in District 1", desc: "Từ vựng công nghệ đô thị" },
  { id: 3, title: "Midnight Hustle", desc: "Podcast truyền động lực" }
];

const AudioBars: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <div className="flex items-end justify-center gap-[2px] h-6">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        animate={isPlaying ? {
          height: [4, 16, 8, 20, 6, 14][(i + i % 3) % 6],
          opacity: [0.4, 1, 0.6, 1, 0.5]
        } : { height: 3, opacity: 0.2 }}
        transition={isPlaying ? {
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.05
        } : { duration: 0.3 }}
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentEpisode = useMemo(() => {
    return EPISODES.find(ep => ep.title === lesson.topic) || EPISODES[2];
  }, [lesson.topic]);

  const segments: PodcastSegment[] = useMemo(() => {
    return lesson.podcast_segments.length > 0 ? lesson.podcast_segments : [
      { en: "Welcome to the NeoLingua Urban Podcast.", vi: "Chào mừng bạn đến với Podcast Đô thị NeoLingua." },
      { en: "Today we're diving into the midnight hustle of District 1.", vi: "Hôm nay chúng ta sẽ khám phá nhịp sống hối hả lúc nửa đêm ở Quận 1." },
      { en: "Stay focused, stay aesthetic.", vi: "Hãy tập trung và giữ vững phong cách." },
      { en: "Every small step leads to a bigger goal in this neon city.", vi: "Mỗi bước đi nhỏ đều dẫn đến mục tiêu lớn hơn trong thành phố neon này." },
      { en: "Let's master the language of the future together.", vi: "Hãy cùng nhau làm chủ ngôn ngữ của tương lai." }
    ];
  }, [lesson.podcast_segments]);

  const stopSpeech = () => {
    synth.cancel();
    setIsPlaying(false);
  };

  const playSegment = (index: number) => {
    stopSpeech();
    if (index < 0 || index >= segments.length) {
      setCurrentSegmentIndex(0);
      return;
    }

    setCurrentSegmentIndex(index);
    const segment = segments[index];
    const utterance = new SpeechSynthesisUtterance(segment.en);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlaying(true);
      // Tự động cuộn đến câu đang phát
      itemRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    };

    utterance.onend = () => {
      if (playbackMode === 'all') {
        if (index + 1 < segments.length) {
          playSegment(index + 1);
        } else {
          setIsPlaying(false);
        }
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

  const handleSkip = (direction: 'next' | 'prev') => {
    const nextIndex = direction === 'next' ? currentSegmentIndex + 1 : currentSegmentIndex - 1;
    if (nextIndex >= 0 && nextIndex < segments.length) {
      playSegment(nextIndex);
    }
  };

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col overflow-hidden text-white"
    >
      {/* Matte Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-zinc-950/50 pointer-events-none" />
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[30%] bg-[#CCFF00]/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="flex items-center justify-between p-6 z-20 h-16">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-600 hover:text-white transition-colors">
          <CloseIcon size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
          <span className="text-[10px] font-sans font-black text-zinc-400 uppercase tracking-[0.2em]">NEO-RADIO 10.4</span>
        </div>
        <button className="text-[#CCFF00] opacity-40">
          <SparklesIcon size={18} />
        </button>
      </header>

      {/* ZONE 1: TOP 30% - Cover Art (Thu nhỏ một chút để nhường chỗ cho Parallax Lyric) */}
      <div className="h-[30vh] flex flex-col items-center justify-center px-8 z-10">
        <motion.div 
          layoutId="podcast-cover"
          className="relative w-full max-w-[200px] aspect-square bg-[#1C1C1E] rounded-[32px] overflow-hidden hard-shadow group border border-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#CCFF00]/10 to-transparent opacity-30" />
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay bg-white"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center text-[#CCFF00] mb-3 shadow-lg">
              <HeadphonesIcon size={20} />
            </div>
            <h3 className="text-lg font-heading font-black text-white leading-tight tracking-tight uppercase">
              {lesson.topic || currentEpisode.title}
            </h3>
            <p className="text-[8px] font-sans font-bold text-zinc-500 uppercase tracking-widest mt-2">EPISODE 0{currentEpisode.id}</p>
          </div>

          <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center">
             <span className="text-[8px] font-black text-[#CCFF00] uppercase tracking-widest">HQ AUDIO</span>
             <AudioBars isPlaying={isPlaying} />
          </div>
        </motion.div>
      </div>

      {/* ZONE 2: MIDDLE 45% - Parallax Lyric Zone (Có thể kéo thả) */}
      <div 
        ref={scrollRef}
        className="h-[45vh] overflow-y-auto px-10 z-10 no-scrollbar snap-y snap-mandatory"
      >
        <div className="py-[15vh] space-y-24"> {/* Padding để câu đầu/cuối có thể nằm giữa màn hình */}
          {segments.map((seg, idx) => {
            const isActive = currentSegmentIndex === idx;
            return (
              <motion.div
                key={idx}
                ref={el => itemRefs.current[idx] = el}
                onClick={() => playSegment(idx)}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0.2,
                  scale: isActive ? 1.05 : 0.95,
                  y: isActive ? 0 : 10
                }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="relative cursor-pointer snap-center group"
              >
                {/* Ghost Parallax Background Text */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.05, x: 0 }}
                    className="absolute -top-6 -left-4 text-[4rem] font-heading font-black whitespace-nowrap pointer-events-none select-none text-white italic"
                  >
                    {seg.en.split(' ')[0]}
                  </motion.div>
                )}

                <div className="relative z-10 space-y-3">
                  <h4 className={`text-[22px] font-heading font-black leading-relaxed tracking-tight transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                    {seg.en}
                  </h4>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[14px] font-sans font-medium text-[#CCFF00] tracking-wide"
                      >
                        {seg.vi}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ZONE 3: BOTTOM 25% - Controls (Cố định dưới cùng) */}
      <div className="h-[25vh] flex flex-col items-center justify-center px-8 z-30 pb-10">
        <div className="w-full max-w-[340px] bg-[#1C1C1E]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-6 hard-shadow shadow-2xl relative">
          <div className="flex items-center justify-between">
            
            {/* Play All Mode */}
            <button 
              onClick={() => setPlaybackMode('all')}
              className={`w-10 h-10 flex flex-col items-center justify-center transition-all ${playbackMode === 'all' ? 'text-[#CCFF00]' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <LibraryIcon size={18} />
              <span className="text-[7px] font-black uppercase tracking-tighter mt-1">PLAY ALL</span>
            </button>

            {/* Main Controls Row */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => handleSkip('prev')}
                className="p-2 text-zinc-500 hover:text-white transition-all active:scale-90 disabled:opacity-20"
                disabled={currentSegmentIndex === 0}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button 
                onClick={togglePlay}
                className="w-[56px] h-[56px] bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black clay-accent hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(204,255,0,0.2)]"
              >
                {isPlaying ? (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button 
                onClick={() => handleSkip('next')}
                className="p-2 text-zinc-500 hover:text-white transition-all active:scale-90 disabled:opacity-20"
                disabled={currentSegmentIndex === segments.length - 1}
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* Focus Mode */}
            <button 
              onClick={() => setPlaybackMode('focus')}
              className={`w-10 h-10 flex flex-col items-center justify-center transition-all ${playbackMode === 'focus' ? 'text-[#CCFF00]' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <FlashIcon size={18} />
              <span className="text-[7px] font-black uppercase tracking-tighter mt-1">FOCUS</span>
            </button>
          </div>

          {/* Simple Progress Strip */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]" 
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
