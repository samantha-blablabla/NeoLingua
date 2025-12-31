
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData } from './types';
import { SoundHighIcon, CloseIcon, SparklesIcon, FlashIcon } from './components/Icons';
import { playNaturalSpeech } from './services/speechService';

interface Props {
  lesson: LessonData;
  onFinish: () => void;
  onBack: () => void;
}

type SprintType = 'WARMUP' | 'LOGIC' | 'LISTENING' | 'GRAMMAR' | 'SPOTLIGHT' | 'CHALLENGE' | 'MISSION';

const LessonDetailScreen: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
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
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="fixed inset-0 z-[150] bg-[#0A0A0A] flex flex-col pt-12 text-white">
      {/* Header with Progress Bar - Spacing: 24px (px-6) */}
      <div className="px-6 flex justify-between items-center mb-8">
         <div className="flex gap-1.5 flex-1 mr-4">
            {(['WARMUP', 'LOGIC', 'LISTENING', 'GRAMMAR', 'SPOTLIGHT', 'CHALLENGE', 'MISSION'] as SprintType[]).map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${sprint === s ? (s === 'MISSION' ? 'bg-[#FF6B4A]' : (s === 'CHALLENGE' ? 'bg-[#BFA3FF]' : 'bg-[#CCFF00]')) : 'bg-white/10'}`} />
            ))}
         </div>
         <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-xl shrink-0">
            <CloseIcon size={18} />
         </button>
      </div>

      {/* Main Content Area - Spacing: 32px (px-8) */}
      <main className="flex-1 px-8 flex flex-col justify-center overflow-y-auto no-scrollbar pb-10">
        <AnimatePresence mode="wait">
          {sprint === 'WARMUP' && (
            <motion.div key="warmup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              <span className="text-[#CCFF00] font-sans font-black tracking-[0.3em] text-[10px] uppercase">Sprint 01 • VIBE CHECK</span>
              <h2 className="text-4xl font-heading font-black tracking-tighter leading-[0.9]">{lesson.warmup?.intro}</h2>
              <div className="flex flex-wrap gap-4">
                {(lesson.warmup?.keywords || []).map(k => (
                  <button key={k} onClick={() => speak(k)} className="px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-sans font-black text-[#CCFF00] text-xs hover:border-[#CCFF00] transition-colors uppercase tracking-widest">
                    {k}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {sprint === 'LOGIC' && (
            <motion.div key="logic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-4">
                <span className="text-[#CCFF00] font-sans font-black tracking-[0.3em] text-[10px] uppercase">Sprint 02 • URBAN LOGIC</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(204,255,0,0.2)]">
                    <FlashIcon size={20} />
                  </div>
                  <h3 className="text-2xl font-heading font-black tracking-tighter uppercase leading-none">Văn hóa Đô thị</h3>
                </div>
              </div>

              {/* Bilingual Logic Card - Spacing Rule: p-8 (32px), gap-6 (24px) */}
              <div className="p-8 bg-[#CCFF00] rounded-[48px] shadow-[0_30px_60px_-15px_rgba(204,255,0,0.25)] relative overflow-hidden flex flex-col gap-6">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 blur-[60px] rounded-full pointer-events-none" />
                 
                 <div className="space-y-3">
                   <p className="text-black/40 text-[9px] font-sans font-black uppercase tracking-widest">EN Context (Heading)</p>
                   <p className="text-black text-[1.5rem] font-heading font-black leading-[1.1] tracking-tight">
                     {lesson.urban_logic?.en}
                   </p>
                 </div>

                 <div className="h-px w-1/4 bg-black/10" />

                 <div className="space-y-3">
                   <p className="text-black/40 text-[9px] font-sans font-black uppercase tracking-widest">VI Ý nghĩa (Paragraph)</p>
                   <p className="text-black/80 text-[1rem] font-sans font-bold leading-relaxed">
                     {lesson.urban_logic?.vi}
                   </p>
                 </div>
              </div>
            </motion.div>
          )}

          {sprint === 'LISTENING' && (
             <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                <span className="text-[#CCFF00] font-sans font-black tracking-[0.3em] text-[10px] uppercase">Sprint 03 • AUDIO FLOW</span>
                <div className="w-48 h-48 rounded-[60px] bg-[#CCFF00]/5 border border-[#CCFF00]/10 mx-auto flex items-center justify-center relative">
                   <div className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center text-black clay-accent">
                      <SoundHighIcon size={24} />
                   </div>
                   <div className="absolute -bottom-4 bg-zinc-900 px-4 py-1 rounded-full border border-zinc-800 text-[9px] font-sans font-black text-zinc-500 uppercase tracking-widest">
                      {lesson.topic}
                   </div>
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-heading font-black uppercase tracking-tight">Deep Listening</h3>
                   <p className="text-zinc-500 font-sans font-medium text-sm px-4 leading-relaxed italic">
                      "Lắng nghe và để ý cách Barista và khách hàng tung hứng (interaction) với nhau."
                   </p>
                </div>
                <button onClick={() => speak((lesson.podcast_segments || []).map(s => s.en).join('. '))} className="text-[#CCFF00] font-sans font-black uppercase tracking-widest text-[10px] p-6 bg-[#CCFF00]/10 rounded-2xl border border-[#CCFF00]/20">
                   Play Audio Scene
                </button>
             </motion.div>
          )}

          {sprint === 'GRAMMAR' && (
            <motion.div key="grammar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <span className="text-[#BFA3FF] font-sans font-black tracking-[0.3em] text-[10px] uppercase">Sprint 04 • URBAN GRAMMAR</span>
              <h3 className="text-3xl font-heading font-black tracking-tighter text-[#BFA3FF] leading-[0.9]">{lesson.grammar_focus?.point}</h3>
              <div className="p-8 bg-zinc-900/50 rounded-[32px] border border-[#BFA3FF]/20 space-y-6">
                 <p className="text-lg font-sans font-bold text-zinc-200 leading-relaxed">{lesson.grammar_focus?.vi_explain}</p>
                 <div className="p-6 bg-black/40 rounded-2xl border-l-4 border-[#BFA3FF]">
                    <p className="text-[#BFA3FF] font-sans italic font-bold text-lg">"{lesson.grammar_focus?.example}"</p>
                 </div>
              </div>
            </motion.div>
          )}

          {sprint === 'SPOTLIGHT' && lesson.vocab_spotlight[vocabIdx] && (
            <motion.div key={`spot-${vocabIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <span className="text-[#CCFF00] font-sans font-black tracking-[0.3em] text-[10px] uppercase">Sprint 05 • VOCAB SPOTLIGHT {vocabIdx + 1}/{(lesson.vocab_spotlight || []).length}</span>
              <div className="flex items-center gap-6">
                 <h2 className="text-5xl font-heading font-black text-[#CCFF00] tracking-tighter">{lesson.vocab_spotlight[vocabIdx].word}</h2>
                 <button onClick={() => speak(lesson.vocab_spotlight[vocabIdx].word)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#CCFF00] active:scale-95 transition-transform"><SoundHighIcon size={20} /></button>
              </div>
              <div className="p-8 bg-zinc-900 rounded-[32px] border border-zinc-800 space-y-6">
                 <div>
                    <p className="text-[9px] font-sans font-black text-zinc-600 uppercase mb-2 tracking-widest">Meaning • Nghĩa</p>
                    <p className="text-xl font-sans font-bold text-zinc-100 leading-snug">{lesson.vocab_spotlight[vocabIdx].meaning}</p>
                 </div>
                 <div className="pt-6 border-t border-white/5">
                    <p className="text-[9px] font-sans font-black text-[#CCFF00] uppercase mb-2 tracking-widest">Urban Nuance • Sắc thái</p>
                    <p className="text-sm font-sans font-medium text-zinc-400 leading-relaxed italic">{lesson.vocab_spotlight[vocabIdx].nuance_vi}</p>
                 </div>
              </div>
            </motion.div>
          )}

          {sprint === 'CHALLENGE' && (
            <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <span className="text-[#BFA3FF] font-sans font-black tracking-[0.3em] text-[10px] uppercase">Sprint 06 • VIBE CHECK QUIZ</span>
              <div className="p-6 bg-[#BFA3FF] text-black rounded-[32px] shadow-lg relative overflow-hidden">
                 <p className="font-sans font-bold text-base leading-tight relative z-10">{lesson.daily_challenge?.urban_context}</p>
              </div>
              <h3 className="text-2xl font-heading font-black tracking-tight leading-snug">{lesson.daily_challenge?.question}</h3>
              <div className="space-y-4">
                 {(lesson.daily_challenge?.options || []).map(opt => (
                   <button key={opt} onClick={next} className="w-full p-6 bg-zinc-900 border border-zinc-800 rounded-[24px] text-left font-sans font-bold text-sm active:bg-[#BFA3FF] active:text-black transition-all">
                     {opt}
                   </button>
                 ))}
              </div>
            </motion.div>
          )}

          {sprint === 'MISSION' && (
            <motion.div key="mission" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
               <span className="text-[#FF6B4A] font-sans font-black tracking-[0.3em] text-[10px] uppercase">Sprint 07 • REAL MISSION</span>
               <div>
                  <div className="inline-block p-5 bg-[#FF6B4A] rounded-[32px] mb-6 text-black clay-accent">
                     <SparklesIcon size={40} />
                  </div>
                  <h3 className="text-4xl font-heading font-black tracking-tighter uppercase text-[#FF6B4A] leading-none">{lesson.real_world_mission?.task}</h3>
               </div>
               
               <div className="p-8 bg-zinc-900 rounded-[40px] border-2 border-dashed border-[#FF6B4A]/20 relative overflow-hidden">
                  <span className="px-4 py-1.5 bg-[#FF6B4A]/10 rounded-full text-[9px] font-sans font-black text-[#FF6B4A] uppercase tracking-widest">Platform: {lesson.real_world_mission?.platform}</span>
                  <p className="mt-6 text-zinc-300 font-sans font-bold text-lg leading-relaxed">{lesson.real_world_mission?.description}</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Spacing Rule: p-8 (32px) */}
      <footer className="p-8 pt-4">
        <button 
          onClick={next} 
          className={`w-full py-6 rounded-[24px] font-sans font-black uppercase tracking-[0.2em] text-[12px] clay-accent active:scale-95 transition-transform ${sprint === 'MISSION' ? 'bg-[#FF6B4A] text-white' : 'bg-[#CCFF00] text-black'}`}
        >
          {sprint === 'MISSION' ? 'FINISH LEVEL' : 'NEXT SPRINT'}
        </button>
      </footer>
    </motion.div>
  );
};

export default LessonDetailScreen;
