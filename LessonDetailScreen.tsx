
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData } from './types';
import { SoundHighIcon, CloseIcon, SparklesIcon } from './components/Icons';
import { playNaturalSpeech } from './services/speechService';

interface LessonDetailScreenProps {
  lesson: LessonData;
  onFinish: () => void;
  onBack: () => void;
}

const LessonDetailScreen: React.FC<LessonDetailScreenProps> = ({ lesson, onFinish, onBack }) => {
  const [step, setStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const totalVocab = lesson.vocab_set.length;
  const totalSteps = totalVocab + 1; // Vocabs + 1 Grammar step
  const progress = ((step + 1) / totalSteps) * 100;

  const currentVocab = step < totalVocab ? lesson.vocab_set[step] : null;
  const isGrammarStep = step === totalVocab;

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    
    // Haptic Feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
    
    await playNaturalSpeech(text);
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (currentVocab && !isGrammarStep) {
      const timer = setTimeout(() => handleSpeak(currentVocab.word), 500);
      return () => clearTimeout(timer);
    }
  }, [step, isGrammarStep]);

  const nextStep = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onFinish();
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  const handleExit = () => {
    if (window.confirm("Bạn có chắc muốn dừng bài học này không?")) {
      onBack();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#0A0A0A] flex flex-col pt-12"
    >
      {/* Refined Modern Header */}
      <div className="px-6 mb-12">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[9px] font-sans font-medium text-zinc-500 uppercase tracking-[0.25em]">
            {isGrammarStep ? 'MASTERY PHASE' : `MODULE ${step + 1}/${totalVocab}`}
          </span>
          <button 
            onClick={handleExit}
            className="w-9 h-9 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white border border-zinc-800 hover:bg-zinc-800 transition-colors active:scale-90"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="h-[6px] w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", damping: 20, stiffness: 80 }}
            className="h-full bg-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.8)]"
          />
        </div>
      </div>

      <main className="flex-1 px-6 flex flex-col justify-center pb-24">
        <AnimatePresence mode="wait">
          {!isGrammarStep && currentVocab ? (
            <motion.div
              key={`vocab-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => handleSpeak(currentVocab.word)}
                  className="group flex items-center gap-5 cursor-pointer"
                >
                  <h2 className={`text-[32px] font-heading font-black tracking-tight leading-none transition-colors ${isSpeaking ? 'text-[#CCFF00]' : 'text-white'}`}>
                    {currentVocab.word}
                  </h2>
                  <div className={`p-3 rounded-xl border transition-all ${isSpeaking ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:bg-[#CCFF00] group-hover:text-black group-hover:border-[#CCFF00]'}`}>
                    <SoundHighIcon size={18} className={isSpeaking ? "animate-pulse" : ""} />
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 font-sans font-medium text-xs tracking-wider">
                    {currentVocab.pronunciation}
                  </span>
                </div>
              </div>

              <div className="bg-[#1C1C1E] rounded-[24px] p-6 hard-shadow border border-zinc-800/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/5 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-[9px] font-sans font-black text-[#CCFF00] uppercase tracking-[0.3em] opacity-50">DEFINITION</span>
                    <p className="text-[16px] font-sans font-normal text-white leading-relaxed">
                      {currentVocab.meaning}
                    </p>
                  </div>
                  
                  <div className="h-px w-full bg-zinc-800/40" />
                  
                  <div className="space-y-2">
                    <span className="text-[9px] font-sans font-black text-zinc-500 uppercase tracking-[0.3em] opacity-50">CONTEXT EXAMPLE</span>
                    <p className="text-[16px] font-sans font-normal text-zinc-400 italic leading-relaxed">
                      "{currentVocab.example}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grammar-step"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center mb-2">
                  <div className="bg-[#BFA3FF]/20 px-3 py-1 rounded-full border border-[#BFA3FF]/30">
                    <span className="text-[9px] font-sans font-black text-[#BFA3FF] uppercase tracking-[0.4em]">GRAMMAR FLOW</span>
                  </div>
                </div>
                <h2 className="text-[36px] font-heading font-black tracking-tighter text-white leading-[0.9]">Master the Structure</h2>
              </div>
              
              <div className="bg-[#BFA3FF] p-8 rounded-[32px] text-black clay-accent hard-shadow relative overflow-hidden flex flex-col gap-6 group">
                {/* Decorative Element */}
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                  <SparklesIcon size={120} color="black" />
                </div>

                <div className="space-y-2 relative z-10">
                  <span className="text-[10px] font-sans font-black text-black/40 uppercase tracking-[0.2em] block">THE RULE</span>
                  <p className="text-[19px] font-sans font-extrabold leading-snug">
                    {lesson.grammar_focus}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-black/10 relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-4 bg-black/20 rounded-full" />
                    <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-black/50">VÍ DỤ MINH HỌA</span>
                  </div>
                  <p className="text-[16px] font-sans font-semibold leading-relaxed text-black/90 italic bg-white/20 p-4 rounded-2xl border border-white/10 shadow-sm">
                    {lesson.grammar_example_vi}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-[24px] border border-zinc-800 hard-shadow flex items-start gap-4">
                 <div className="mt-1">
                   <SparklesIcon size={16} color="#CCFF00" />
                 </div>
                 <p className="text-[13px] font-sans font-medium text-zinc-400 leading-relaxed">
                   <span className="text-[#CCFF00] font-black mr-1 uppercase">PRO TIP:</span> 
                   Nhớ sử dụng cấu trúc này trong buổi networking sắp tới của bạn để tạo ấn tượng chuyên nghiệp hơn nhé!
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0A0A0A] to-transparent z-50">
        <div className="max-w-md mx-auto flex gap-4">
          <button 
            onClick={prevStep}
            className="flex-1 py-5 bg-transparent border-2 border-zinc-800 rounded-[20px] text-[11px] font-sans font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all active:scale-95"
          >
            BACK
          </button>
          <button 
            onClick={nextStep}
            className="flex-[2.5] py-5 bg-[#CCFF00] text-black rounded-[20px] text-[11px] font-sans font-black uppercase tracking-widest clay-accent hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isGrammarStep ? 'FINISH SESSION' : 'NEXT STEP'}
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default LessonDetailScreen;
