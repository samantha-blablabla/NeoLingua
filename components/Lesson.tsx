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
    warmup: 'KHỞI ĐỘNG',
    vocabulary: 'TỪ VỰNG',
    grammar: 'NGỮ PHÁP',
    practice: 'LUYỆN TẬP',
    summary: 'ÔN TẬP'
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

    if (isCorrect) {
      setQuizFeedback('correct');
      setTimeout(() => {
        setQuizFeedback('');
        setQuizAnswer('');
        goToNextSection();
      }, 2500);
    } else {
      setQuizFeedback('incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-sans font-bold text-zinc-500 mb-1 uppercase">{lesson.level} • {lesson.estimatedMinutes} PHÚT</div>
              <h1 className="text-xl font-heading font-black tracking-tight">{lesson.title}</h1>
            </div>
            <div className="text-[#CCFF00] text-sm font-sans font-bold">
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
      <div className="pt-[140px] pb-40 px-6">
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
                <div className="text-xs font-sans font-bold text-zinc-500 mb-2 uppercase tracking-wider">KHỞI ĐỘNG • {lesson.warmup.type.toUpperCase()}</div>
                <h2 className="text-2xl font-heading font-black tracking-tight mb-4">{lesson.warmup.title}</h2>
                <div className="bg-white/5 border border-white/10 rounded-[24px] p-8">
                  <p className="text-lg font-sans leading-relaxed">{lesson.warmup.content}</p>
                </div>
                <button
                  onClick={goToNextSection}
                  className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
                >
                  Tiếp tục học từ vựng →
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
                <div className="text-xs font-sans font-bold text-zinc-500 mb-2 uppercase tracking-wider">TỪ VỰNG • {lesson.vocabulary.length} TỪ</div>
                <h2 className="text-2xl font-heading font-black tracking-tight mb-6">Từ vựng quan trọng</h2>

                <div className="grid gap-4">
                  {lesson.vocabulary.map((vocab, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-[#CCFF00]/50 transition-colors cursor-pointer"
                      onClick={() => setActiveVocab(vocab)}
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-xl font-heading font-black">{vocab.word}</span>
                        <span className="text-sm font-sans text-zinc-400">{vocab.partOfSpeech}</span>
                        <span className="text-sm font-mono text-[#CCFF00]">{vocab.pronunciation}</span>
                      </div>
                      <p className="font-sans text-zinc-300">{vocab.meaning}</p>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={goToNextSection}
                  className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
                >
                  Tiếp tục học ngữ pháp →
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
                <div className="text-xs font-sans font-bold text-zinc-500 mb-2 uppercase tracking-wider">ĐIỂM NGỮ PHÁP</div>
                <h2 className="text-2xl font-heading font-black tracking-tight mb-6">{lesson.grammar.title}</h2>

                <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 space-y-6">
                  {/* Parse and render grammar explanation with hierarchy */}
                  {lesson.grammar.explanationVi.split('\n\n').map((paragraph, pIndex) => {
                    // Check if paragraph is a heading (starts with **)
                    if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                      const heading = paragraph.trim().replace(/\*\*/g, '');
                      return (
                        <h3 key={pIndex} className="text-xl font-heading font-black text-[#CCFF00] tracking-tight mt-6 first:mt-0">
                          {heading}
                        </h3>
                      );
                    }

                    // Check if paragraph contains bullet points
                    if (paragraph.includes('- **')) {
                      const lines = paragraph.split('\n').filter(line => line.trim());
                      return (
                        <div key={pIndex} className="space-y-3">
                          {lines.map((line, lIndex) => {
                            // Bullet point with bold title
                            if (line.trim().startsWith('- **')) {
                              const match = line.match(/- \*\*(.+?)\*\* - (.+)/);
                              if (match) {
                                return (
                                  <div key={lIndex} className="flex gap-3">
                                    <span className="text-[#CCFF00] font-sans text-lg flex-shrink-0">•</span>
                                    <div>
                                      <span className="font-heading font-bold text-white">{match[1]}</span>
                                      <span className="font-sans text-zinc-300"> - {match[2]}</span>
                                    </div>
                                  </div>
                                );
                              }
                            }
                            // Regular bullet point
                            if (line.trim().startsWith('-')) {
                              return (
                                <div key={lIndex} className="flex gap-3">
                                  <span className="text-[#CCFF00] font-sans text-lg flex-shrink-0">•</span>
                                  <p className="font-sans text-zinc-300">{line.replace(/^-\s*/, '')}</p>
                                </div>
                              );
                            }
                            // Regular text within bullet section
                            return (
                              <p key={lIndex} className="font-sans text-zinc-300 leading-relaxed pl-6">
                                {line}
                              </p>
                            );
                          })}
                        </div>
                      );
                    }

                    // Regular numbered list
                    if (/^\d+\./.test(paragraph.trim())) {
                      const lines = paragraph.split('\n').filter(line => line.trim());
                      return (
                        <div key={pIndex} className="space-y-4">
                          {lines.map((line, lIndex) => {
                            const numberMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*/);
                            if (numberMatch) {
                              const [, number, title] = numberMatch;
                              const rest = line.replace(/^\d+\.\s+\*\*.+?\*\*\s*-?\s*/, '');
                              return (
                                <div key={lIndex} className="bg-black/40 rounded-[16px] p-4">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-heading font-black text-[#CCFF00] text-lg">{number}.</span>
                                    <span className="font-heading font-bold text-white">{title}</span>
                                  </div>
                                  {rest && (
                                    <p className="font-sans text-zinc-400 text-sm pl-7">{rest}</p>
                                  )}
                                </div>
                              );
                            }
                            // Sub-items under numbered list
                            if (line.trim().startsWith('-')) {
                              return (
                                <div key={lIndex} className="flex gap-2 pl-7">
                                  <span className="text-zinc-500 font-sans">→</span>
                                  <p className="font-sans text-zinc-300 text-sm">{line.replace(/^-\s*/, '')}</p>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      );
                    }

                    // Regular paragraph
                    return (
                      <p key={pIndex} className="font-sans text-zinc-300 leading-relaxed">
                        {paragraph.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                          .split('<strong')
                          .map((part, i) => {
                            if (i === 0) return part;
                            const [attrs, ...rest] = part.split('>');
                            const [content, ...after] = rest.join('>').split('</strong>');
                            return (
                              <React.Fragment key={i}>
                                <strong className="text-white font-bold">{content}</strong>
                                {after.join('</strong>')}
                              </React.Fragment>
                            );
                          })}
                      </p>
                    );
                  })}

                  {/* Examples section */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="text-xs font-sans font-bold text-[#CCFF00] mb-4 uppercase tracking-wider">VÍ DỤ</div>
                    <div className="space-y-3">
                      {lesson.grammar.examples.map((example, index) => (
                        <div key={index} className="bg-black/30 rounded-[20px] p-5">
                          <p className="font-sans text-[#CCFF00] mb-2 text-base">"{example.en}"</p>
                          <p className="text-sm font-sans text-zinc-400">"{example.vi}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grammar Quiz */}
                <div className="bg-white/5 border border-[#CCFF00]/30 rounded-[24px] p-8 space-y-4">
                  <div className="text-xs font-sans font-bold text-[#CCFF00] mb-2 uppercase tracking-wider">KIỂM TRA NHANH</div>
                  <p className="text-lg font-sans mb-4">{lesson.grammar.quiz.question}</p>

                  <input
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    className="w-full bg-black/50 border border-white/20 rounded-[16px] px-4 py-3 font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00]"
                    onKeyPress={(e) => e.key === 'Enter' && handleQuizSubmit()}
                  />

                  {quizFeedback === 'incorrect' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 rounded-[16px] p-4"
                    >
                      <p className="text-sm font-sans text-red-400">
                        💭 {lesson.grammar.quiz.feedback}
                      </p>
                    </motion.div>
                  )}

                  <button
                    onClick={handleQuizSubmit}
                    className="w-full bg-[#CCFF00] text-black py-3 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
                  >
                    Nộp bài
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
                <div className="text-xs font-sans font-bold text-zinc-500 mb-2 uppercase tracking-wider">LUYỆN TẬP HỘI THOẠI</div>
                <h2 className="text-2xl font-heading font-black tracking-tight mb-6">{lesson.practice.title}</h2>

                <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
                  <p className="text-lg font-sans text-zinc-300">{lesson.practice.description}</p>

                  <div className="bg-black/30 rounded-[20px] p-6 space-y-3">
                    <div className="text-xs font-sans font-bold text-[#CCFF00] mb-2 uppercase tracking-wider">VAI TRÒ CỦA BẠN</div>
                    <p className="font-sans text-zinc-300">{lesson.practice.userRole}</p>
                  </div>

                  <div className="bg-black/30 rounded-[20px] p-6 space-y-3">
                    <div className="text-xs font-sans font-bold text-[#CCFF00] mb-2 uppercase tracking-wider">TÌNH HUỐNG</div>
                    <p className="font-sans text-zinc-300">{lesson.practice.scenario}</p>
                  </div>

                  <button
                    onClick={() => {
                      onPractice?.(lesson.practice.scenarioId);
                      goToNextSection();
                    }}
                    className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
                  >
                    Bắt đầu luyện tập →
                  </button>
                </div>

                <button
                  onClick={goToNextSection}
                  className="w-full bg-white/10 text-white py-4 rounded-[28px] font-sans font-bold hover:bg-white/20 transition-colors"
                >
                  Bỏ qua và ôn tập
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
                <div className="text-xs font-sans font-bold text-zinc-500 mb-2 uppercase tracking-wider">ÔN TẬP BÀI HỌC</div>
                <h2 className="text-2xl font-heading font-black tracking-tight mb-6">Bạn làm tốt lắm!</h2>

                <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
                  <div>
                    <div className="text-xs font-sans font-bold text-[#CCFF00] mb-3 uppercase tracking-wider">TÓM TẮT</div>
                    <p className="font-sans text-zinc-300 leading-relaxed">{lesson.summary}</p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="text-xs font-sans font-bold text-[#CCFF00] mb-3 uppercase tracking-wider">BÀI TẬP VỀ NHÀ</div>
                    <p className="font-sans text-zinc-300 leading-relaxed">{lesson.homework}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {lesson.nextLessonId && (
                    <button
                      onClick={onNext}
                      className="flex-1 bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
                    >
                      Bài học tiếp theo →
                    </button>
                  )}
                  <button
                    onClick={onComplete}
                    className="flex-1 bg-white/10 text-white py-4 rounded-[28px] font-sans font-bold hover:bg-white/20 transition-colors"
                  >
                    {lesson.nextLessonId ? 'Hoàn thành sau' : 'Hoàn thành bài học'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quiz Success Celebration Modal */}
      <AnimatePresence>
        {quizFeedback === 'correct' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            />

            {/* Confetti particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: -20,
                  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
                  scale: 0
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800,
                  x: typeof window !== 'undefined'
                    ? (window.innerWidth / 2) + (Math.random() - 0.5) * 600
                    : Math.random() * 400,
                  rotate: Math.random() * 720,
                  scale: [0, 1, 1, 0.5]
                }}
                transition={{
                  duration: 2 + Math.random() * 1,
                  delay: Math.random() * 0.3,
                  ease: "easeOut"
                }}
                className="fixed w-3 h-3 rounded-sm z-50 pointer-events-none"
                style={{
                  backgroundColor: ['#CCFF00', '#00D9FF', '#FF00E5', '#FFE500', '#00FF94'][i % 5],
                  top: '40%'
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 100 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: 0.1
                }
              }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-lg mx-auto z-50"
            >
              <div className="bg-gradient-to-br from-[#CCFF00] via-[#CCFF00] to-[#99FF00] rounded-[48px] p-12 text-center relative overflow-hidden shadow-2xl">
                {/* Animated rays */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, white 10deg 20deg)'
                  }}
                />

                {/* Big celebration emoji */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-8xl mb-6 relative z-10"
                >
                  🎉
                </motion.div>

                {/* Text with Bricolage Grotesque */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-heading font-black text-black mb-3 relative z-10 tracking-tight leading-none"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  CHÍNH XÁC!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-heading font-bold text-black/80 relative z-10"
                >
                  Bạn làm tuyệt vời! ⭐
                </motion.p>

                {/* Floating sparkles around */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    animate={{
                      y: [0, -15, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="absolute text-3xl pointer-events-none"
                    style={{
                      left: `${15 + (i * 10)}%`,
                      top: `${20 + (i % 2) * 50}%`
                    }}
                  >
                    {['✨', '⭐', '💫', '🌟'][i % 4]}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-black border border-white/20 rounded-[32px] z-50 overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl font-heading font-black">{activeVocab.word}</h3>
                  <span className="text-sm font-sans text-zinc-400">{activeVocab.partOfSpeech}</span>
                </div>

                <div className="text-lg font-mono text-[#CCFF00]">{activeVocab.pronunciation}</div>

                <div className="bg-white/5 rounded-[20px] p-6">
                  <div className="text-xs font-sans font-bold text-zinc-500 mb-2 uppercase tracking-wider">NGHĨA</div>
                  <p className="text-lg font-sans text-zinc-300">{activeVocab.meaning}</p>
                </div>

                <div className="bg-white/5 rounded-[20px] p-6 space-y-3">
                  <div className="text-xs font-sans font-bold text-zinc-500 mb-2 uppercase tracking-wider">VÍ DỤ</div>
                  <p className="font-sans text-[#CCFF00] italic">"{activeVocab.exampleEN}"</p>
                  <p className="font-sans text-zinc-400">"{activeVocab.exampleVi}"</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handlePlayVocab(activeVocab)}
                    className="flex-1 bg-[#CCFF00] text-black py-3 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
                  >
                    🔊 Nghe phát âm
                  </button>
                  <button
                    onClick={() => setActiveVocab(null)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-[28px] font-sans font-bold hover:bg-white/20 transition-colors"
                  >
                    Đóng
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
