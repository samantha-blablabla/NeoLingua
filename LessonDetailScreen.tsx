
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData, VocabularyItem } from './types';
import { SoundHighIcon, CloseIcon, SparklesIcon, FlashIcon, LibraryIcon } from './components/Icons';
import { playNaturalSpeech } from './services/speechService';

interface Props {
  lesson: LessonData;
  savedVocabIds: string[];
  onToggleSaveVocab: (item: VocabularyItem) => void;
  onFinish: () => void;
  onBack: () => void;
}

type SprintType = 'WARMUP' | 'LOGIC' | 'LISTENING' | 'GRAMMAR' | 'SPOTLIGHT' | 'CHALLENGE' | 'MISSION';

const LessonDetailScreen: React.FC<Props> = ({ lesson, savedVocabIds, onToggleSaveVocab, onFinish, onBack }) => {
  const [sprint, setSprint] = useState<SprintType>('WARMUP');
  const [vocabIdx, setVocabIdx] = useState(0);

  const next = () => {
    if (sprint === 'WARMUP') setSprint('LOGIC');
    else if (sprint === 'LOGIC') setSprint('LISTENING');
    else if (sprint === 'LISTENING') setSprint('GRAMMAR');
    else if (sprint === 'GRAMMAR') setSprint('SPOTLIGHT');
    else if (sprint === 'SPOTLIGHT') {
      const vocabCount = (lesson.vocab_spotlight || []).length;
      if (vocabIdx < vocabCount - 1) setVocabIdx(v => v + 1);
      else setSprint('CHALLENGE');
    } else if (sprint === 'CHALLENGE') setSprint('MISSION');
    else onFinish();
  };

  const speak = (txt: string) => playNaturalSpeech(txt);

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="fixed inset-0 z-[150] bg-[#0A0A0A] flex flex-col pt-16 text-white overflow-hidden">
      {/* Header with Progress Bar */}
      <div className="px-8 flex justify-between items-center mb-10 shrink-0">
         <div className="flex gap-2 flex-1 mr-6">
            {(['WARMUP', 'LOGIC', 'LISTENING', 'GRAMMAR', 'SPOTLIGHT', 'CHALLENGE', 'MISSION'] as SprintType[]).map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${sprint === s ? (s === 'MISSION' ? 'bg-[#FF6B4A]' : (s === 'CHALLENGE' ? 'bg-[#BFA3FF]' : 'bg-[#CCFF00]')) : 'bg-white/10'}`} />
            ))}
         </div>
         <button onClick={onBack} className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-xl shrink-0 active:scale-90 transition-transform">
            <CloseIcon size={20} />
         </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-8 flex flex-col justify-center overflow-y-auto no-scrollbar pb-12">
        <AnimatePresence mode="wait">
          {sprint === 'WARMUP' && (
            <motion.div key="warmup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
              <span className="text-[#CCFF00] font-sans font-black tracking-[0.4em] text-[11px] uppercase">Sprint 01 • VIBE CHECK</span>
              <h2 className="text-[3.5rem] font-heading font-black tracking-tighter leading-[0.8]">{lesson.warmup?.intro}</h2>
              <div className="flex flex-wrap gap-5">
                {(lesson.warmup?.keywords || []).map(k => (
                  <button key={k} onClick={() => speak(k)} className="px-6 py-5 bg-zinc-900 border border-white/5 rounded-[24px] font-sans font-black text-[#CCFF00] text-sm active:border-[#CCFF00] active:scale-95 transition-all uppercase tracking-widest shadow-lg">
                    {k}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {sprint === 'LOGIC' && (
            <motion.div key="logic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="space-y-4">
                <span className="text-[#CCFF00] font-sans font-black tracking-[0.4em] text-[11px] uppercase">Sprint 02 • URBAN LOGIC</span>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(204,255,0,0.25)]">
                    <FlashIcon size={24} />
                  </div>
                  <h3 className="text-3xl font-heading font-black tracking-tighter uppercase leading-none">The Vibe Culture</h3>
                </div>
              </div>

              <div className="p-10 bg-[#CCFF00] rounded-[56px] shadow-[0_40px_80px_-15px_rgba(204,255,0,0.3)] relative overflow-hidden flex flex-col gap-8 transition-transform">
                 <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/30 blur-[70px] rounded-full pointer-events-none" />
                 <div className="space-y-4">
                   <p className="text-black/40 text-[10px] font-sans font-black uppercase tracking-widest">EN LOGIC</p>
                   <p className="text-black text-[1.8rem] font-heading font-black leading-[1.1] tracking-tight">{lesson.urban_logic?.en}</p>
                 </div>
                 <div className="h-px w-20 bg-black/10" />
                 <div className="space-y-4">
                   <p className="text-black/40 text-[10px] font-sans font-black uppercase tracking-widest">VI CHI TIẾT</p>
                   <p className="text-black/80 text-[1.1rem] font-sans font-bold leading-relaxed">{lesson.urban_logic?.vi}</p>
                 </div>
              </div>
            </motion.div>
          )}

          {sprint === 'LISTENING' && (
             <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-10">
                <span className="text-[#CCFF00] font-sans font-black tracking-[0.4em] text-[11px] uppercase">Sprint 03 • SCENE AUDIO</span>
                <div className="w-56 h-56 rounded-[70px] bg-[#CCFF00]/5 border border-[#CCFF00]/10 mx-auto flex items-center justify-center relative shadow-2xl">
                   <div className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center text-black clay-accent shadow-xl active:scale-95 transition-transform">
                      <SoundHighIcon size={32} />
                   </div>
                </div>
                <h3 className="text-3xl font-heading font-black uppercase tracking-tight">Immersive Listen</h3>
                <button onClick={() => speak((lesson.podcast_segments || []).map(s => s.en).join('. '))} className="w-full py-6 bg-zinc-900 border border-white/5 rounded-[28px] text-[#CCFF00] font-sans font-black uppercase tracking-widest text-[11px] active:scale-95 transition-all shadow-xl">PLAY FULL SCENE</button>
             </motion.div>
          )}

          {sprint === 'GRAMMAR' && (
            <motion.div key="grammar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <span className="text-[#BFA3FF] font-sans font-black tracking-[0.4em] text-[11px] uppercase">Sprint 04 • STREET GRAMMAR</span>
              <h3 className="text-[2.8rem] font-heading font-black tracking-tighter text-[#BFA3FF] leading-[0.9]">{lesson.grammar_focus?.point}</h3>
              <div className="p-10 bg-zinc-900/50 rounded-[48px] border border-[#BFA3FF]/20 space-y-8 shadow-2xl">
                 <p className="text-xl font-sans font-bold text-zinc-200 leading-relaxed">{lesson.grammar_focus?.vi_explain}</p>
                 <div className="p-8 bg-black/40 rounded-[32px] border-l-4 border-[#BFA3FF] shadow-inner">
                    <p className="text-[#BFA3FF] font-sans italic font-bold text-lg leading-snug">"{lesson.grammar_focus?.example}"</p>
                 </div>
              </div>
            </motion.div>
          )}

          {sprint === 'SPOTLIGHT' && lesson.vocab_spotlight[vocabIdx] && (
            <motion.div key={`spot-${vocabIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex justify-between items-end">
                <span className="text-[#CCFF00] font-sans font-black tracking-[0.4em] text-[11px] uppercase">Sprint 05 • VOCAB {vocabIdx + 1}/{(lesson.vocab_spotlight || []).length}</span>
                <button 
                  onClick={() => onToggleSaveVocab(lesson.vocab_spotlight[vocabIdx])}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${savedVocabIds.includes(lesson.vocab_spotlight[vocabIdx].id) ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-white/5 border-white/10 text-white'}`}
                >
                  <LibraryIcon size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{savedVocabIds.includes(lesson.vocab_spotlight[vocabIdx].id) ? 'SAVED' : 'SAVE TO VAULT'}</span>
                </button>
              </div>
              <div className="flex items-center gap-6">
                 <h2 className="text-6xl font-heading font-black text-[#CCFF00] tracking-tighter leading-none">{lesson.vocab_spotlight[vocabIdx].word}</h2>
                 <button onClick={() => speak(lesson.vocab_spotlight[vocabIdx].word)} className="w-14 h-14 bg-zinc-900 border border-white/5 rounded-[20px] text-[#CCFF00] flex items-center justify-center active:scale-90 transition-transform shadow-lg"><SoundHighIcon size={24} /></button>
              </div>
              <div className="p-10 bg-zinc-900 rounded-[48px] border border-white/5 space-y-10 shadow-2xl">
                 <div>
                    <p className="text-[10px] font-sans font-black text-zinc-700 uppercase mb-3 tracking-widest">Core Meaning • Nghĩa gốc</p>
                    <p className="text-2xl font-sans font-bold text-zinc-100 leading-tight">{lesson.vocab_spotlight[vocabIdx].meaning}</p>
                 </div>
                 <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] font-sans font-black text-[#CCFF00] uppercase mb-3 tracking-widest">Urban Slang Usage • Sắc thái</p>
                    <p className="text-[1.1rem] font-sans font-bold text-zinc-500 leading-relaxed italic opacity-90">{lesson.vocab_spotlight[vocabIdx].nuance_vi}</p>
                 </div>
              </div>
            </motion.div>
          )}

          {sprint === 'CHALLENGE' && (
            <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <span className="text-[#BFA3FF] font-sans font-black tracking-[0.4em] text-[11px] uppercase">Sprint 06 • VIBE CHECK QUIZ</span>
              <div className="p-8 bg-[#BFA3FF] text-black rounded-[40px] shadow-2xl relative overflow-hidden">
                 <p className="font-sans font-black text-lg leading-tight relative z-10">{lesson.daily_challenge?.urban_context}</p>
              </div>
              <h3 className="text-3xl font-heading font-black tracking-tight leading-snug px-1">{lesson.daily_challenge?.question}</h3>
              <div className="space-y-4 pt-2">
                 {(lesson.daily_challenge?.options || []).map(opt => (
                   <button key={opt} onClick={next} className="w-full p-7 bg-zinc-900 border border-white/5 rounded-[32px] text-left font-sans font-black text-base active:bg-[#BFA3FF] active:text-black transition-all shadow-xl">
                     {opt}
                   </button>
                 ))}
              </div>
            </motion.div>
          )}

          {sprint === 'MISSION' && (
            <motion.div key="mission" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center">
               <span className="text-[#FF6B4A] font-sans font-black tracking-[0.4em] text-[11px] uppercase">Sprint 07 • FINAL MISSION</span>
               <div className="flex flex-col items-center">
                  <div className="inline-block p-7 bg-[#FF6B4A] rounded-[40px] mb-8 text-black shadow-xl">
                     <SparklesIcon size={56} />
                  </div>
                  <h3 className="text-5xl font-heading font-black tracking-tighter uppercase text-[#FF6B4A] leading-none mb-4">{lesson.real_world_mission?.task}</h3>
               </div>
               <div className="p-10 bg-zinc-900 rounded-[56px] border-2 border-dashed border-[#FF6B4A]/30 relative shadow-2xl">
                  <p className="text-zinc-200 font-sans font-bold text-xl leading-relaxed">{lesson.real_world_mission?.description}</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-8 pb-12 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5">
        <button 
          onClick={next} 
          className={`w-full py-7 rounded-[32px] font-sans font-black uppercase tracking-[0.25em] text-[13px] clay-accent active:scale-95 transition-transform shadow-2xl ${sprint === 'MISSION' ? 'bg-[#FF6B4A] text-white' : 'bg-[#CCFF00] text-black'}`}
        >
          {sprint === 'MISSION' ? 'COMPLETE JOURNEY' : 'NEXT PHASE'}
        </button>
      </footer>
    </motion.div>
  );
};

export default LessonDetailScreen;
