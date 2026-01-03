/**
 * LessonNav Component
 *
 * Navigation interface for browsing and selecting lessons from curriculum
 * Shows modules, lessons, and progress tracking
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, BookIcon, PenIcon, MessageIcon } from './Icons';
import type { Module, Lesson } from '../data/curriculum';

interface LessonNavProps {
  modules: Module[];
  currentLessonId?: string;
  completedLessonIds?: string[];
  onSelectLesson: (lesson: Lesson) => void;
  onClose?: () => void;
  onReviewAll?: () => void;
  dueReviewCount?: number;
}

export default function LessonNav({
  modules,
  currentLessonId,
  completedLessonIds = [],
  onSelectLesson,
  onClose,
  onReviewAll,
  dueReviewCount = 0
}: LessonNavProps) {
  const [expandedModuleId, setExpandedModuleId] = useState<string>(modules[0]?.id);

  const isLessonCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);
  const isLessonCurrent = (lessonId: string) => currentLessonId === lessonId;
  const isLessonLocked = (lesson: Lesson, module: Module) => {
    const lessonIndex = module.lessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex === 0) return false; // First lesson always unlocked

    const previousLesson = module.lessons[lessonIndex - 1];
    return !isLessonCompleted(previousLesson.id);
  };

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter(l => isLessonCompleted(l.id)).length;
    const total = module.lessons.length;
    return { completed, total, percentage: (completed / total) * 100 };
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-sans font-bold text-zinc-500 mb-1 uppercase tracking-wider">LỘ TRÌNH HỌC TẬP</div>
              <h1 className="text-xl font-heading font-black tracking-tight">Giáo trình của bạn</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors font-sans text-xl"
              >
                ✕
              </button>
            )}
          </div>

          {/* Progress Stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
              <span className="text-sm font-sans text-zinc-400">
                Tổng: <span className="font-bold text-white">{modules.reduce((sum, m) => sum + m.lessons.length, 0)}</span> bài
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#CCFF00]"></div>
              <span className="text-sm font-sans text-zinc-400">
                Hoàn thành: <span className="font-bold text-[#CCFF00]">{completedLessonIds.length}</span> bài
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="max-w-4xl mx-auto px-6 py-8 pb-48 space-y-6">
        {/* Review Section */}
        {dueReviewCount > 0 && onReviewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onReviewAll}
            className="bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30 rounded-[40px] p-8 cursor-pointer hover:border-orange-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-sans font-bold text-orange-400 uppercase tracking-wider">
                📚 MỤC ÔN TẬP
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-orange-500 text-white text-xs font-sans font-bold px-3 py-1 rounded-full"
              >
                {dueReviewCount} từ
              </motion.div>
            </div>

            <h3 className="text-xl font-heading font-black mb-2 text-white">Ôn tập từ vựng</h3>
            <p className="text-sm font-sans text-zinc-300 mb-4">
              Bạn có <span className="text-orange-400 font-bold">{dueReviewCount} từ vựng</span> cần ôn tập để ghi nhớ lâu dài
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs font-sans text-zinc-400">
                <span>📝</span>
                <span>Flashcard nhanh</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-sans text-zinc-400">
                <span>🎯</span>
                <span>4 kỹ năng toàn diện</span>
              </div>
            </div>
          </motion.div>
        )}
        {modules.map((module) => {
          const progress = getModuleProgress(module);
          const isExpanded = expandedModuleId === module.id;

          return (
            <div key={module.id} className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
              {/* Module Header */}
              <button
                onClick={() => setExpandedModuleId(isExpanded ? '' : module.id)}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-xs font-sans font-bold text-zinc-500 mb-1 uppercase">{module.level} • {module.estimatedWeeks} TUẦN</div>
                    <h2 className="text-xl font-heading font-black tracking-tight mb-2">{module.title}</h2>
                    <p className="text-sm font-sans text-zinc-400">{module.description}</p>
                  </div>
                  <div className="text-[#CCFF00] ml-4 font-sans">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-sans text-zinc-500 mb-2">
                    <span>Tiến độ</span>
                    <span>{progress.completed}/{progress.total} bài học</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#CCFF00]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </button>

              {/* Lesson List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-3">
                      {module.lessons.map((lesson, index) => {
                        const isCompleted = isLessonCompleted(lesson.id);
                        const isCurrent = isLessonCurrent(lesson.id);
                        const isLocked = isLessonLocked(lesson, module);

                        return (
                          <motion.button
                            key={lesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => !isLocked && onSelectLesson(lesson)}
                            disabled={isLocked}
                            className={`w-full p-6 rounded-[20px] text-left transition-all ${
                              isLocked
                                ? 'bg-white/5 opacity-50 cursor-not-allowed'
                                : isCurrent
                                ? 'bg-[#CCFF00] text-black'
                                : isCompleted
                                ? 'bg-white/10 hover:bg-white/15'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* Status Icon */}
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                isLocked
                                  ? 'bg-white/10 text-zinc-600'
                                  : isCompleted
                                  ? 'bg-[#CCFF00] text-black font-bold text-lg'
                                  : isCurrent
                                  ? 'bg-black text-[#CCFF00] font-bold text-base'
                                  : 'bg-white/10 text-zinc-400 font-bold text-base'
                              }`}>
                                {isLocked ? <LockIcon size={18} className="text-zinc-600" /> : isCompleted ? '✓' : index + 1}
                              </div>

                              {/* Lesson Info */}
                              <div className="flex-1 min-w-0">
                                {/* Meta info */}
                                <div className={`text-xs font-sans font-bold mb-2 uppercase ${
                                  isCurrent ? 'text-black/60' : 'text-zinc-500'
                                }`}>
                                  BÀI {index + 1} • {lesson.estimatedMinutes} PHÚT
                                </div>

                                {/* Title */}
                                <h3 className={`text-lg font-heading font-black tracking-tight mb-3 ${
                                  isCurrent ? 'text-black' : 'text-white'
                                }`}>
                                  {lesson.title}
                                </h3>

                                {/* Description */}
                                <p className={`text-sm font-sans font-semibold mb-4 leading-relaxed ${
                                  isCurrent ? 'text-black/80' : 'text-zinc-300'
                                }`}>
                                  {lesson.descriptionVi || lesson.description}
                                </p>

                                {/* Lesson Stats - Grid layout for consistency */}
                                <div className="grid grid-cols-1 gap-2">
                                  <div className={`flex items-center gap-2 text-xs font-sans font-medium ${
                                    isCurrent ? 'text-black/70' : 'text-zinc-400'
                                  }`}>
                                    <BookIcon size={14} className={isCurrent ? 'text-black/70' : 'text-zinc-400'} />
                                    <span>{lesson.vocabulary.length} từ vựng</span>
                                  </div>
                                  <div className={`flex items-center gap-2 text-xs font-sans font-medium ${
                                    isCurrent ? 'text-black/70' : 'text-zinc-400'
                                  }`}>
                                    <PenIcon size={14} className={isCurrent ? 'text-black/70' : 'text-zinc-400'} />
                                    <span>{lesson.grammar.title}</span>
                                  </div>
                                  <div className={`flex items-center gap-2 text-xs font-sans font-medium ${
                                    isCurrent ? 'text-black/70' : 'text-zinc-400'
                                  }`}>
                                    <MessageIcon size={14} className={isCurrent ? 'text-black/70' : 'text-zinc-400'} />
                                    <span>{lesson.practice.title}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Current Indicator */}
                              {isCurrent && (
                                <div className="flex-shrink-0 text-black text-xs font-sans font-bold ml-2">
                                  HIỆN TẠI
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
