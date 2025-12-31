
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
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
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="fixed inset-0 z-[60] bg-[#0A0A0A] flex flex-col pt-12"
    >
      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]"
          />
        </div>
        <div className="flex justify-between items-center mt-3 px-1">
          <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">
            {step + 1} / {totalSteps}
          </span>
          <button onClick={onBack} className="text-[10px] font-sans font-bold text-zinc-500 uppercase hover:text-[#CCFF00]">
            Quit
          </button>
        </div>
      </div>

      <main className="flex-1 px-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isGrammarStep && currentVocab ? (
            <motion.div
              key={`vocab-${step}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              className="space-y-12 text-center"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-sans font-bold text-[#CCFF00] uppercase tracking-[0.3em]">NEW WORD</span>
                <h2 className="text-6xl font-heading font-black tracking-tighter text-white break-words leading-[0.9]">
                  {currentVocab.word}
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <p className="text-sm font-sans font-medium text-zinc-500 italic">
                    {currentVocab.pronunciation}
                  </p>
                  <button 
                    onClick={() => speak(currentVocab.word)}
                    className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-[#CCFF00] border border-zinc-800 hover:bg-zinc-800 transition-colors"
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v18l-6-6H2V9h4l6-6zm4.5 9c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.61.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.39 6.5c-.36.14-.61.47-.61.85v.2c0 .65.73.99 1.24.71C18.44 18.75 21 15.67 21 12s-2.56-6.75-5.76-8.26c-.51-.28-1.24.06-1.24.71z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 bg-[#1C1C1E] rounded-[40px] border border-zinc-800 hard-shadow">
                <p className="text-lg font-sans font-bold text-[#CCFF00] leading-tight mb-4">
                  {currentVocab.meaning}
                </p>
                <div className="h-px w-8 bg-zinc-800 mx-auto mb-4" />
                <p className="text-xs font-sans font-medium text-zinc-400 italic leading-relaxed">
                  "{currentVocab.example}"
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grammar-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <span className="text-[10px] font-sans font-bold text-[#BFA3FF] uppercase tracking-[0.3em] block mb-2">GRAMMAR SPOT</span>
                <h2 className="text-4xl font-heading font-black tracking-tighter text-white">Urban Rules</h2>
              </div>
              
              <div className="bg-[#BFA3FF] p-8 rounded-[40px] text-black clay-accent">
                <p className="text-sm font-sans font-black uppercase tracking-widest opacity-40 mb-3">CONCEPTS</p>
                <p className="text-lg font-sans font-extrabold leading-snug">
                  {lesson.grammar_focus}
                </p>
              </div>

              <div className="bg-[#1C1C1E] p-8 rounded-[40px] border border-zinc-800 hard-shadow">
                 <p className="text-xs font-sans font-medium text-zinc-400 leading-relaxed">
                   Ghi nhớ: Sử dụng các quy tắc này trong các buổi meetup thực tế để tăng độ chuyên nghiệp cho cách diễn đạt của bạn.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="px-6 py-10 flex gap-4">
        <button 
          onClick={prevStep}
          className="flex-1 py-4 bg-zinc-900 rounded-[20px] text-[11px] font-sans font-black uppercase border border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          {step === 0 ? "Back" : "Previous"}
        </button>
        <button 
          onClick={nextStep}
          className="flex-[2] py-4 bg-[#CCFF00] text-black rounded-[20px] text-[11px] font-sans font-black uppercase clay-accent hover:scale-[1.02] transition-transform"
        >
          {isGrammarStep ? "Finish Lesson" : "Next Step"}
        </button>
      </footer>
    </motion.div>
  );
};

export default LessonDetailScreen;
