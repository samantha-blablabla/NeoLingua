
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

type SprintType = 'WARMUP' | 'LISTENING' | 'SPOTLIGHT' | 'CHALLENGE' | 'MISSION';

const LessonDetailScreen: React.FC<Props> = ({ lesson, onFinish, onBack }) => {
  const [sprint, setSprint] = useState<SprintType>('WARMUP');
  const [vocabIdx, setVocabIdx] = useState(0);

  const next = () => {
    if (sprint === 'WARMUP') setSprint('LISTENING');
    else if (sprint === 'LISTENING') setSprint('SPOTLIGHT');
    else if (sprint === 'SPOTLIGHT') {
      const vocabCount = (lesson.vocab_spotlight || []).length;
      if (vocabIdx < vocabCount - 1) setVocabIdx(v => v + 1);
      else setSprint('CHALLENGE');
    } else if (sprint === 'CHALLENGE') setSprint('MISSION');
    else onFinish();
  };

  const speak = (txt: string) => playNaturalSpeech(txt);

  const getSprintLabel = (s: SprintType) => {
    switch(s) {
      case 'WARMUP': return 'WARM UP • KHỞI ĐỘNG';
      case 'LISTENING': return 'LISTENING • LUYỆN NGHE';
      case 'SPOTLIGHT': return 'SPOTLIGHT • TỪ VỰNG';
      case 'CHALLENGE': return 'CHALLENGE • THỬ THÁCH';
      case 'MISSION': return 'MISSION • NHIỆM VỤ';
    }
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="fixed inset-0 z-[150] bg-[#0A0A0A] flex flex-col pt-12 text-white">
      <div className="px-6 flex justify-between items-center mb-8">
         <div className="flex gap-2">
            {(['WARMUP', 'LISTENING', 'SPOTLIGHT', 'CHALLENGE', 'MISSION'] as SprintType[]).map(s => (
              <div key={s} className={`h-1 w-6 rounded-full ${sprint === s ? (s === 'MISSION' ? 'bg-[#FF6B4A]' : (s === 'CHALLENGE' ? 'bg-[#BFA3FF]' : 'bg-[#CCFF00]')) : 'bg-white/10'}`} />
            ))}
         </div>
         <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-xl">
            <CloseIcon size={18} />
         </button>
      </div>

      <main className="flex-1 px-8 flex flex-col justify-center overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {sprint === 'WARMUP' && (
            <motion.div key="warmup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
              <span className="text-[#CCFF00] font-black tracking-widest text-[10px] uppercase">{getSprintLabel('WARMUP')}</span>
              <h2 className="text-4xl font-heading font-black tracking-tighter leading-none">{lesson.warmup?.intro || "Ready to hustle?"}</h2>
              <div className="flex flex-wrap gap-3">
                {(lesson.warmup?.keywords || []).map(k => (
                  <button key={k} onClick={() => speak(k)} className="px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-3xl font-black text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
                    {k}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {sprint === 'LISTENING' && (
             <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                <span className="text-[#CCFF00] font-black tracking-widest text-[10px] uppercase mx-auto">{getSprintLabel('LISTENING')}</span>
                <div className="w-48 h-48 rounded-[60px] bg-[#CCFF00]/5 border border-[#CCFF00]/10 mx-auto flex items-center justify-center relative">
                   <div className="w-16 h-16 bg-[#CCFF00] rounded-full flex items-center justify-center text-black clay-accent">
                      <SoundHighIcon size={24} />
                   </div>
                   <div className="absolute -bottom-4 bg-zinc-900 px-4 py-1 rounded-full border border-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      {lesson.topic}
                   </div>
                </div>
                <h3 className="text-2xl font-heading font-black">Deep Listening • Nghe sâu</h3>
                <p className="text-zinc-500 text-sm px-4 leading-relaxed">
                  Listen to the conversation carefully and pay attention to urban intonation.
                  <br/>
                  <span className="italic opacity-60">Lắng nghe hội thoại và chú ý đến cách nhấn nhá trong ngữ cảnh đô thị.</span>
                </p>
                <button onClick={() => speak((lesson.podcast_segments || []).map(s => s.en).join('. '))} className="text-[#CCFF00] font-black uppercase tracking-widest text-[10px] p-4 bg-[#CCFF00]/10 rounded-2xl">Start Audio Flow • PHÁT ÂM THANH</button>
             </motion.div>
          )}

          {sprint === 'SPOTLIGHT' && lesson.vocab_spotlight && lesson.vocab_spotlight[vocabIdx] && (
            <motion.div key={`spot-${vocabIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <span className="text-[#CCFF00] font-black tracking-widest text-[10px] uppercase">{getSprintLabel('SPOTLIGHT')} {vocabIdx + 1}/{(lesson.vocab_spotlight || []).length}</span>
              <div className="flex items-center gap-4">
                 <h2 className="text-5xl font-heading font-black text-[#CCFF00]">{lesson.vocab_spotlight[vocabIdx].word}</h2>
                 <button onClick={() => speak(lesson.vocab_spotlight[vocabIdx].word)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[#CCFF00]"><SoundHighIcon size={24} /></button>
              </div>
              <div className="p-8 bg-zinc-900 rounded-[32px] border border-zinc-800 relative">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-[#CCFF00]/5 blur-3xl" />
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">MEANING • NGHĨA</p>
                 <p className="text-2xl font-sans font-bold mb-6 text-zinc-200">{lesson.vocab_spotlight[vocabIdx].meaning}</p>
                 
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">EXAMPLE • VÍ DỤ</p>
                 <p className="text-zinc-500 italic border-l-2 border-[#CCFF00] pl-4 leading-relaxed">"{lesson.vocab_spotlight[vocabIdx].example}"</p>
              </div>
            </motion.div>
          )}

          {sprint === 'CHALLENGE' && (
            <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <span className="text-[#BFA3FF] font-black tracking-widest text-[10px] uppercase">{getSprintLabel('CHALLENGE')}</span>
              <div className="p-5 bg-[#BFA3FF] text-black rounded-3xl shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 blur-2xl rounded-full" />
                 <span className="text-[10px] font-black uppercase opacity-60">SCENARIO • TÌNH HUỐNG</span>
                 <p className="font-bold text-base leading-tight mt-1 relative z-10">{lesson.daily_challenge?.urban_context || "Urban scenario"}</p>
              </div>
              <h3 className="text-2xl font-heading font-black">{lesson.daily_challenge?.question || "What's the right choice?"}</h3>
              <div className="space-y-3">
                 {(lesson.daily_challenge?.options || []).map(opt => (
                   <button key={opt} onClick={next} className="w-full p-6 bg-zinc-900 border border-zinc-800 rounded-[24px] text-left font-bold active:bg-[#BFA3FF] active:text-black transition-all hover:border-[#BFA3FF]/50">
                     {opt}
                   </button>
                 ))}
              </div>
            </motion.div>
          )}

          {sprint === 'MISSION' && (
            <motion.div key="mission" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
               <span className="text-[#FF6B4A] font-black tracking-widest text-[10px] uppercase mx-auto">{getSprintLabel('MISSION')}</span>
               <div className="text-center">
                  <div className="inline-block p-4 bg-[#FF6B4A] rounded-[30px] mb-6 text-black clay-accent shadow-[0_15px_30px_rgba(255,107,74,0.2)]">
                     <SparklesIcon size={32} />
                  </div>
                  <h3 className="text-3xl font-heading font-black tracking-tighter uppercase text-[#FF6B4A]">{lesson.real_world_mission?.task || "Urban Mission"}</h3>
               </div>
               
               <div className="p-8 bg-zinc-900 rounded-[40px] border-2 border-dashed border-[#FF6B4A]/20 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF6B4A]/5 blur-[60px] rounded-full" />
                  <span className="px-4 py-1 bg-[#FF6B4A]/10 rounded-full text-[10px] font-black text-[#FF6B4A] uppercase tracking-widest border border-[#FF6B4A]/10 relative z-10">PLATFORM: {lesson.real_world_mission?.platform || "Anywhere"}</span>
                  <p className="mt-6 text-zinc-300 font-medium leading-relaxed relative z-10">{lesson.real_world_mission?.description || "Complete the challenge."}</p>
               </div>
               
               <p className="text-center text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Complete this to Level Up! • HOÀN THÀNH ĐỂ LÊN CẤP</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-8">
        <button 
          onClick={next} 
          className={`w-full py-6 rounded-[28px] font-black uppercase tracking-[0.2em] clay-accent active:scale-95 transition-transform shadow-2xl ${sprint === 'MISSION' ? 'bg-[#FF6B4A] text-white shadow-[0_20px_40px_rgba(255,107,74,0.3)]' : 'bg-[#CCFF00] text-black'}`}
        >
          {sprint === 'MISSION' ? 'FINISH LEVEL • HOÀN THÀNH' : 'NEXT SPRINT • TIẾP TỤC'}
        </button>
      </footer>
    </motion.div>
  );
};

export default LessonDetailScreen;
