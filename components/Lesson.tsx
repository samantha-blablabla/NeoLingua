/**
 * Lesson Component
 *
 * Displays a complete lesson from the curriculum with:
 * - Warmup content
 * - Vocabulary with pronunciation, POS, examples
 * - Grammar explanation and quiz
 * - Practice scenario link
 * - Summary and homework
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lesson, VocabItem } from '../data/curriculum';
import { playGoogleTTS, stopSpeech } from '../services/googleTTS';

interface LessonProps {
  lesson: Lesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPractice?: (scenarioId: string) => void;
}

type LessonSection = 'warmup' | 'vocabulary' | 'grammar' | 'practice' | 'summary';

export default function Lesson({ lesson, onComplete, onNext, onPractice }: LessonProps) {
  const [currentSection, setCurrentSection] = useState<LessonSection>('warmup');
  const [activeVocab, setActiveVocab] = useState<VocabItem | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [completedSections, setCompletedSections] = useState<Set<LessonSection>>(new Set());

  const sections: LessonSection[] = ['warmup', 'vocabulary', 'grammar', 'practice', 'summary'];
  const sectionTitles = {
    warmup: 'WARM-UP',
    vocabulary: 'VOCABULARY',
    grammar: 'GRAMMAR',
    practice: 'PRACTICE',
    summary: 'REVIEW'
  };

  const markSectionComplete = (section: LessonSection) => {
    setCompletedSections(prev => new Set(prev).add(section));
  };

  const goToNextSection = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      markSectionComplete(currentSection);
      setCurrentSection(sections[currentIndex + 1]);
    } else {
      markSectionComplete(currentSection);
      onComplete?.();
    }
  };

  const handlePlayVocab = (vocab: VocabItem) => {
    stopSpeech();
    playGoogleTTS(vocab.exampleEN);
  };

  const handleQuizSubmit = () => {
    const isCorrect = quizAnswer.trim().toLowerCase() === lesson.grammar.quiz.correctAnswer.toLowerCase();
    setQuizFeedback(isCorrect ? '✅ Chính xác!' : `❌ ${lesson.grammar.quiz.feedback}`);

    if (isCorrect) {
      setTimeout(() => {
        setQuizFeedback('');
        setQuizAnswer('');
        goToNextSection();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-500 mb-1">{lesson.level} • {lesson.estimatedMinutes} MIN</div>
              <h1 className="text-xl font-bold">{lesson.title}</h1>
            </div>
            <div className="text-[#CCFF00] text-sm">
              {sections.indexOf(currentSection) + 1}/{sections.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 right-0 z-40 h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#CCFF00]"
          initial={{ width: 0 }}
          animate={{ width: `${((sections.indexOf(currentSection) + 1) / sections.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Section Navigation */}
      <div className="fixed top-[74px] left-0 right-0 z-30 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex gap-4 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`text-xs whitespace-nowrap px-3 py-1 rounded transition-colors ${
                currentSection === section
                  ? 'bg-[#CCFF00] text-black'
                  : completedSections.has(section)
                  ? 'text-[#CCFF00]'
                  : 'text-zinc-500'
              }`}
            >
              {completedSections.has(section) && '✓ '}
              {sectionTitles[section]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[140px] pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* WARMUP SECTION */}
            {currentSection === 'warmup' && (
              <motion.div
                key="warmup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-xs text-zinc-500 mb-2">WARM-UP • {lesson.warmup.type.toUpperCase()}</div>
                <h2 className="text-2xl font-bold mb-4">{lesson.warmup.title}</h2>
                <div className="bg-white/5 border border-white/10 rounded-lg p-8">
                  <p className="text-lg leading-relaxed">{lesson.warmup.content}</p>
                </div>
                <button
                  onClick={goToNextSection}
                  className="w-full bg-[#CCFF00] text-black py-4 rounded-lg font-bold hover:bg-[#CCFF00]/90 transition-colors"
                >
                  Continue to Vocabulary →
                </button>
              </motion.div>
            )}

            {/* VOCABULARY SECTION */}
            {currentSection === 'vocabulary' && (
              <motion.div
                key="vocabulary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-xs text-zinc-500 mb-2">VOCABULARY • {lesson.vocabulary.length} WORDS</div>
                <h2 className="text-2xl font-bold mb-6">Key Vocabulary</h2>

                <div className="grid gap-4">
                  {lesson.vocabulary.map((vocab, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-[#CCFF00]/50 transition-colors cursor-pointer"
                      onClick={() => setActiveVocab(vocab)}
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-xl font-bold">{vocab.word}</span>
                        <span className="text-sm text-zinc-400">{vocab.partOfSpeech}</span>
                        <span className="text-sm font-mono text-[#CCFF00]">{vocab.pronunciation}</span>
                      </div>
                      <p className="text-zinc-300">{vocab.meaning}</p>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={goToNextSection}
                  className="w-full bg-[#CCFF00] text-black py-4 rounded-lg font-bold hover:bg-[#CCFF00]/90 transition-colors"
                >
                  Continue to Grammar →
                </button>
              </motion.div>
            )}

            {/* GRAMMAR SECTION */}
            {currentSection === 'grammar' && (
              <motion.div
                key="grammar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-xs text-zinc-500 mb-2">GRAMMAR POINT</div>
                <h2 className="text-2xl font-bold mb-6">{lesson.grammar.title}</h2>

                <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-4">
                  <p className="text-zinc-300 leading-relaxed">{lesson.grammar.explanationVi}</p>

                  <div className="space-y-3 mt-6">
                    {lesson.grammar.examples.map((example, index) => (
                      <div key={index} className="bg-black/30 rounded-lg p-4">
                        <p className="text-[#CCFF00] mb-1">"{example.en}"</p>
                        <p className="text-sm text-zinc-400">"{example.vi}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grammar Quiz */}
                <div className="bg-white/5 border border-[#CCFF00]/30 rounded-lg p-8 space-y-4">
                  <div className="text-xs text-[#CCFF00] mb-2">QUICK QUIZ</div>
                  <p className="text-lg mb-4">{lesson.grammar.quiz.question}</p>

                  <input
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00]"
                    onKeyPress={(e) => e.key === 'Enter' && handleQuizSubmit()}
                  />

                  {quizFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm ${quizFeedback.startsWith('✅') ? 'text-[#CCFF00]' : 'text-red-400'}`}
                    >
                      {quizFeedback}
                    </motion.div>
                  )}

                  <button
                    onClick={handleQuizSubmit}
                    className="w-full bg-[#CCFF00] text-black py-3 rounded-lg font-bold hover:bg-[#CCFF00]/90 transition-colors"
                  >
                    Submit Answer
                  </button>
                </div>
              </motion.div>
            )}

            {/* PRACTICE SECTION */}
            {currentSection === 'practice' && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-xs text-zinc-500 mb-2">STREET TALK PRACTICE</div>
                <h2 className="text-2xl font-bold mb-6">{lesson.practice.title}</h2>

                <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
                  <p className="text-lg text-zinc-300">{lesson.practice.description}</p>

                  <div className="bg-black/30 rounded-lg p-6 space-y-3">
                    <div className="text-xs text-[#CCFF00] mb-2">YOUR ROLE</div>
                    <p className="text-zinc-300">{lesson.practice.userRole}</p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6 space-y-3">
                    <div className="text-xs text-[#CCFF00] mb-2">SCENARIO</div>
                    <p className="text-zinc-300">{lesson.practice.scenario}</p>
                  </div>

                  <button
                    onClick={() => {
                      onPractice?.(lesson.practice.scenarioId);
                      goToNextSection();
                    }}
                    className="w-full bg-[#CCFF00] text-black py-4 rounded-lg font-bold hover:bg-[#CCFF00]/90 transition-colors"
                  >
                    Start Practice →
                  </button>
                </div>

                <button
                  onClick={goToNextSection}
                  className="w-full bg-white/10 text-white py-4 rounded-lg font-bold hover:bg-white/20 transition-colors"
                >
                  Skip to Review
                </button>
              </motion.div>
            )}

            {/* SUMMARY SECTION */}
            {currentSection === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-xs text-zinc-500 mb-2">LESSON REVIEW</div>
                <h2 className="text-2xl font-bold mb-6">Great Work!</h2>

                <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
                  <div>
                    <div className="text-xs text-[#CCFF00] mb-3">SUMMARY</div>
                    <p className="text-zinc-300 leading-relaxed">{lesson.summary}</p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="text-xs text-[#CCFF00] mb-3">HOMEWORK</div>
                    <p className="text-zinc-300 leading-relaxed">{lesson.homework}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {lesson.nextLessonId && (
                    <button
                      onClick={onNext}
                      className="flex-1 bg-[#CCFF00] text-black py-4 rounded-lg font-bold hover:bg-[#CCFF00]/90 transition-colors"
                    >
                      Next Lesson →
                    </button>
                  )}
                  <button
                    onClick={onComplete}
                    className="flex-1 bg-white/10 text-white py-4 rounded-lg font-bold hover:bg-white/20 transition-colors"
                  >
                    {lesson.nextLessonId ? 'Complete Later' : 'Complete Lesson'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Vocabulary Detail Modal */}
      <AnimatePresence>
        {activeVocab && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setActiveVocab(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-black border border-white/20 rounded-lg z-50 overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-bold">{activeVocab.word}</h3>
                  <span className="text-sm text-zinc-400">{activeVocab.partOfSpeech}</span>
                </div>

                <div className="text-lg font-mono text-[#CCFF00]">{activeVocab.pronunciation}</div>

                <div className="bg-white/5 rounded-lg p-6">
                  <div className="text-xs text-zinc-500 mb-2">MEANING</div>
                  <p className="text-lg text-zinc-300">{activeVocab.meaning}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 space-y-3">
                  <div className="text-xs text-zinc-500 mb-2">EXAMPLE</div>
                  <p className="text-[#CCFF00] italic">"{activeVocab.exampleEN}"</p>
                  <p className="text-zinc-400">"{activeVocab.exampleVi}"</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handlePlayVocab(activeVocab)}
                    className="flex-1 bg-[#CCFF00] text-black py-3 rounded-lg font-bold hover:bg-[#CCFF00]/90 transition-colors"
                  >
                    🔊 Listen
                  </button>
                  <button
                    onClick={() => setActiveVocab(null)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-lg font-bold hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
