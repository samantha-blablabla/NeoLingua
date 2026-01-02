/**
 * LessonNav Component
 *
 * Navigation interface for browsing and selecting lessons from curriculum
 * Shows modules, lessons, and progress tracking
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Module, Lesson } from '../data/curriculum';

interface LessonNavProps {
  modules: Module[];
  currentLessonId?: string;
  completedLessonIds?: string[];
  onSelectLesson: (lesson: Lesson) => void;
  onClose?: () => void;
}

export default function LessonNav({
  modules,
  currentLessonId,
  completedLessonIds = [],
  onSelectLesson,
  onClose
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
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-sans font-bold text-zinc-500 mb-1 uppercase tracking-wider">LỘ TRÌNH HỌC TẬP</div>
              <h1 className="text-xl font-heading font-black tracking-tight">Giáo trình của bạn</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors font-sans"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {modules.map((module) => {
          const progress = getModuleProgress(module);
          const isExpanded = expandedModuleId === module.id;

          return (
            <div key={module.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
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
                    <div className="p-4 space-y-2">
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
                            className={`w-full p-4 rounded-lg text-left transition-all ${
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
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                isLocked
                                  ? 'bg-white/10 text-zinc-600'
                                  : isCompleted
                                  ? 'bg-[#CCFF00] text-black'
                                  : isCurrent
                                  ? 'bg-black text-[#CCFF00]'
                                  : 'bg-white/10 text-zinc-400'
                              }`}>
                                {isLocked ? '🔒' : isCompleted ? '✓' : index + 1}
                              </div>

                              {/* Lesson Info */}
                              <div className="flex-1">
                                <div className={`text-xs font-sans font-bold mb-1 uppercase ${
                                  isCurrent ? 'text-black/60' : 'text-zinc-500'
                                }`}>
                                  BÀI {index + 1} • {lesson.estimatedMinutes} PHÚT
                                </div>
                                <h3 className={`font-heading font-black tracking-tight mb-1 ${
                                  isCurrent ? 'text-black' : 'text-white'
                                }`}>
                                  {lesson.title}
                                </h3>
                                <p className={`text-sm font-sans ${
                                  isCurrent ? 'text-black/70' : 'text-zinc-400'
                                }`}>
                                  {lesson.description}
                                </p>

                                {/* Lesson Stats */}
                                <div className={`flex gap-4 mt-3 text-xs font-sans ${
                                  isCurrent ? 'text-black/60' : 'text-zinc-500'
                                }`}>
                                  <span>📚 {lesson.vocabulary.length} từ vựng</span>
                                  <span>📝 {lesson.grammar.title}</span>
                                  <span>💬 {lesson.practice.title}</span>
                                </div>
                              </div>

                              {/* Current Indicator */}
                              {isCurrent && (
                                <div className="flex-shrink-0 text-black text-xs font-sans font-bold">
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

      {/* Footer Stats */}
      <div className="sticky bottom-0 bg-black/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm font-sans">
            <div className="text-zinc-400">
              Tổng: {modules.reduce((sum, m) => sum + m.lessons.length, 0)} bài học
            </div>
            <div className="text-[#CCFF00] font-bold">
              Hoàn thành: {completedLessonIds.length} bài học
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
