
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData, PodcastSegment } from './types';
import { FlashIcon } from './components/Icons';

interface PodcastScreenProps {
  lesson: LessonData;
  onBack: () => void;
}

const Waveform: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <div className="flex items-end justify-center gap-[4px] h-24 mb-8">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        animate={isPlaying ? {
          height: [20, 80, 40, 90, 30][i % 5],
        } : { height: 20 }}
        transition={isPlaying ? {
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.05
        } : {}}
        className="w-2 bg-[#CCFF00] rounded-full"
      />
    ))}
  </div>
);

const PodcastScreen: React.FC<PodcastScreenProps> = ({ lesson, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopSpeech = () => {
    synth.cancel();
    setIsPlaying(false);
  };

  const playSegment = (index: number) => {
    stopSpeech();
    if (index >= lesson.podcast_segments.length) {
      setCurrentSegmentIndex(0);
      return;
    }

    setCurrentSegmentIndex(index);
    const segment = lesson.podcast_segments[index];
    const utterance = new SpeechSynthesisUtterance(segment.en);
    utterance.lang = 'en-US';
    utterance.rate = playbackRate;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      if (index + 1 < lesson.podcast_segments.length) {
        playSegment(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utteranceRef.current = utterance;
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

  const skipForward = () => {
    const next = Math.min(currentSegmentIndex + 1, lesson.podcast_segments.length - 1);
    playSegment(next);
  };

  const skipBackward = () => {
    const prev = Math.max(currentSegmentIndex - 1, 0);
    playSegment(prev);
  };

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-[#0A0A0A] flex flex-col p-6 overflow-hidden"
    >
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-zinc-500 font-bold uppercase text-xs">← Back</button>
        <h2 className="text-[#CCFF00] font-heading font-black text-sm tracking-widest uppercase">Urban Podcast</h2>
        <div className="w-10"></div>
      </header>

      <Waveform isPlaying={isPlaying} />

      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-32">
        {lesson.podcast_segments.map((segment, index) => (
          <motion.div 
            key={index}
            initial={false}
            animate={{ 
              opacity: currentSegmentIndex === index ? 1 : 0.4,
              scale: currentSegmentIndex === index ? 1 : 0.98,
              x: currentSegmentIndex === index ? 0 : -4
            }}
            className={`p-4 rounded-[20px] transition-all ${
              currentSegmentIndex === index ? 'bg-zinc-900 border border-[#CCFF00]/20' : ''
            }`}
            onClick={() => playSegment(index)}
          >
            <p className="text-xl font-heading font-bold text-white mb-2 leading-snug">
              {segment.en}
            </p>
            <p className="text-xs font-medium text-zinc-500 font-sans leading-relaxed">
              {segment.vi}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Modern Urban Player Controls */}
      <div className="absolute bottom-10 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-6 shadow-2xl clay-card">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            {[0.8, 1.0, 1.2].map(rate => (
              <button 
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`text-[10px] font-black uppercase px-3 py-1 rounded-full transition-all ${
                  playbackRate === rate ? 'bg-[#CCFF00] text-black' : 'text-zinc-500 bg-zinc-800'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
          <span className="text-[10px] font-bold text-zinc-500">
            SENTENCE {currentSegmentIndex + 1}/{lesson.podcast_segments.length}
          </span>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button onClick={skipBackward} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center text-black clay-accent hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button onClick={skipForward} className="text-zinc-500 hover:text-white transition-colors">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PodcastScreen;
