
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonData } from './types';

interface LessonDetailScreenProps {
  lesson: LessonData;
  onFinish: () => void;
  onBack: () => void;
}

const LessonDetailScreen: React.FC<LessonDetailScreenProps> = ({ lesson, onFinish, onBack }) => {
  const [step, setStep] = useState(0);
  const totalVocab = lesson.vocab_set.length;
  const totalSteps = totalVocab + 1; // Vocabs + 1 Grammar step
  const progress = ((step + 1) / totalSteps) * 100;

  const currentVocab = step < totalVocab ? lesson.vocab_set[step] : null;
  const isGrammarStep = step === totalVocab;

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel(); // Stop any current speech
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
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
      {/* Top Progress Indicator */}
      <div className="px-6 mb-8">
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.5)] transition-all duration-500"
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
            <span className="text-[10px] font-sans font-black text-zinc-500 uppercase tracking-[0.2em]">
              {isGrammarStep ? 'PHẦN CUỐI' : `TỪ VỰNG ${step + 1}/${totalVocab}`}
            </span>
          </div>
          <button 
            onClick={onBack}
            className="text-[10px] font-sans font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            THOÁT
          </button>
        </div>
      </div>

      <main className="flex-1 px-6 flex flex-col justify-center pb-20">
        <AnimatePresence mode="wait">
          {!isGrammarStep && currentVocab ? (
            <motion.div
              key={`vocab-${step}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.05 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="space-y-10"
            >
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-heading font-black tracking-tighter text-white leading-[0.85] break-words">
                  {currentVocab.word}
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-zinc-500 font-sans font-medium text-sm tracking-wide">
                    {currentVocab.pronunciation}
                  </p>
                  <button 
                    onClick={() => speak(currentVocab.word)}
                    className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#CCFF00] border border-zinc-800 hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v18l-6-6H2V9h4l6-6zm4.5 9c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.61.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.39 6.5c-.36.14-.61.47-.61.85v.2c0 .65.73.99 1.24.71C18.44 18.75 21 15.67 21 12s-2.56-6.75-5.76-8.26c-.51-.28-1.24.06-1.24.71z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-[#1C1C1E] rounded-[40px] p-8 hard-shadow border border-zinc-800/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#CCFF00]/5 blur-2xl rounded-full -mr-12 -mt-12" />
                
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-sans font-black text-[#CCFF00] uppercase tracking-[0.2em] mb-2 block opacity-60">Ý NGHĨA</span>
                    <p className="text-xl font-sans font-bold text-white leading-tight">
                      {currentVocab.meaning}
                    </p>
                  </div>
                  
                  <div className="h-px w-full bg-zinc-800/50" />
                  
                  <div>
                    <span className="text-[9px] font-sans font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block opacity-60">VÍ DỤ</span>
                    <p className="text-sm font-sans font-medium text-zinc-400 italic leading-relaxed">
                      "{currentVocab.example}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grammar-step"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              <div className="text-center">
                <span className="text-[10px] font-sans font-black text-[#BFA3FF] uppercase tracking-[0.4em] block mb-3">GRAMMAR INSIGHT</span>
                <h2 className="text-5xl font-heading font-black tracking-tighter text-white leading-none">Cấu trúc<br/>Trọng tâm</h2>
              </div>
              
              <div className="bg-[#BFA3FF] p-8 rounded-[40px] text-black clay-accent hard-shadow relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 blur-xl rounded-full" />
                <p className="text-[10px] font-sans font-black uppercase tracking-widest opacity-40 mb-4">MÔ HÌNH NGÔN NGỮ</p>
                <p className="text-xl font-sans font-black leading-snug tracking-tight">
                  {lesson.grammar_focus}
                </p>
              </div>

              <div className="bg-[#1C1C1E] p-8 rounded-[40px] border border-zinc-800 hard-shadow">
                 <p className="text-xs font-sans font-semibold text-zinc-400 leading-relaxed">
                   <span className="text-white">Pro Tip:</span> Hãy thử áp dụng cấu trúc này vào phần Pitching của bạn trong các buổi Meetup sắp tới để tạo ấn tượng chuyên nghiệp hơn.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent">
        <div className="max-w-md mx-auto flex gap-4">
          <button 
            onClick={prevStep}
            className="flex-1 py-5 bg-transparent border-2 border-zinc-800 rounded-3xl text-[11px] font-sans font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-600 active:scale-95 transition-all"
          >
            Quay lại
          </button>
          <button 
            onClick={nextStep}
            className="flex-[2] py-5 bg-[#CCFF00] text-black rounded-3xl text-[11px] font-sans font-black uppercase tracking-widest clay-accent hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isGrammarStep ? 'Hoàn thành' : 'Tiếp theo'}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default LessonDetailScreen;
