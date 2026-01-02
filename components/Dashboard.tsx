/**
 * Dashboard Component
 *
 * Main learning hub that integrates:
 * - Curriculum lessons
 * - Street Talk practice
 * - Progress tracking
 * - Quick access to current lesson
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lesson from './Lesson';
import LessonNav from './LessonNav';
import UrbanChat from './UrbanChat';
import { foundationPath } from '../data/curriculum';
import type { Lesson as LessonType } from '../data/curriculum';

type View = 'dashboard' | 'curriculum' | 'lesson' | 'practice';

export default function Dashboard() {
  const [view, setView] = useState<View>('dashboard');
  const [currentLesson, setCurrentLesson] = useState<LessonType | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [practiceScenarioId, setPracticeScenarioId] = useState<string>('');

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('neolingua_progress');
    if (savedProgress) {
      const { completedLessonIds: completed, currentLessonId } = JSON.parse(savedProgress);
      setCompletedLessonIds(completed || []);

      // Find current lesson
      if (currentLessonId) {
        const lesson = foundationPath.modules.flatMap(m => m.lessons).find(l => l.id === currentLessonId);
        if (lesson) setCurrentLesson(lesson);
      }
    }

    // Set default to first lesson if no progress
    if (!currentLesson && foundationPath.modules[0]?.lessons[0]) {
      setCurrentLesson(foundationPath.modules[0].lessons[0]);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (completed: string[], lessonId?: string) => {
    const progress = {
      completedLessonIds: completed,
      currentLessonId: lessonId || currentLesson?.id
    };
    localStorage.setItem('neolingua_progress', JSON.stringify(progress));
  };

  const handleLessonComplete = () => {
    if (!currentLesson) return;

    const newCompleted = [...completedLessonIds, currentLesson.id];
    setCompletedLessonIds(newCompleted);
    saveProgress(newCompleted, currentLesson.nextLessonId);

    // Auto-navigate to next lesson if available
    if (currentLesson.nextLessonId) {
      const nextLesson = foundationPath.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === currentLesson.nextLessonId);
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      } else {
        setView('dashboard');
      }
    } else {
      setView('dashboard');
    }
  };

  const handleSelectLesson = (lesson: LessonType) => {
    setCurrentLesson(lesson);
    saveProgress(completedLessonIds, lesson.id);
    setView('lesson');
  };

  const handlePractice = (scenarioId: string) => {
    setPracticeScenarioId(scenarioId);
    setView('practice');
  };

  const totalLessons = foundationPath.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progressPercentage = (completedLessonIds.length / totalLessons) * 100;

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-heading font-black tracking-tight">NeoLingua</h1>
            <p className="text-sm font-sans text-zinc-400 mt-1">Hành trình học tiếng Anh của bạn</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {/* Overall Progress */}
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
            <div className="text-xs font-sans font-bold text-zinc-500 mb-4 uppercase tracking-wider">TIẾN ĐỘ HỌC TẬP</div>
            <div className="flex items-baseline gap-4 mb-4">
              <h2 className="text-4xl font-heading font-black text-[#CCFF00]">{completedLessonIds.length}</h2>
              <span className="font-sans text-zinc-400">/ {totalLessons} bài học đã hoàn thành</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#CCFF00]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Current Lesson */}
          {currentLesson && (
            <div className="bg-gradient-to-br from-[#CCFF00]/20 to-transparent border border-[#CCFF00]/30 rounded-[48px] p-10">
              <div className="text-xs font-sans font-bold text-[#CCFF00] mb-4 uppercase tracking-wider">TIẾP TỤC HỌC</div>
              <h2 className="text-2xl font-heading font-black tracking-tight mb-2">{currentLesson.title}</h2>
              <p className="font-sans text-zinc-400 mb-6">{currentLesson.description}</p>

              <div className="flex gap-4 text-sm font-sans text-zinc-500 mb-6">
                <span>{currentLesson.level}</span>
                <span>•</span>
                <span>{currentLesson.estimatedMinutes} phút</span>
                <span>•</span>
                <span>{currentLesson.vocabulary.length} từ mới</span>
              </div>

              <button
                onClick={() => setView('lesson')}
                className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
              >
                {completedLessonIds.includes(currentLesson.id) ? 'Ôn tập bài học' : 'Bắt đầu học'} →
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setView('curriculum')}
              className="bg-white/5 border border-white/10 rounded-[40px] p-9 text-left hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-heading font-black tracking-tight mb-2">Xem giáo trình</h3>
              <p className="text-sm font-sans text-zinc-400">Duyệt toàn bộ bài học và theo dõi tiến độ</p>
            </button>

            <button
              onClick={() => {
                setPracticeScenarioId('coffee-shop');
                setView('practice');
              }}
              className="bg-white/5 border border-white/10 rounded-[40px] p-9 text-left hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-heading font-black tracking-tight mb-2">Luyện hội thoại</h3>
              <p className="text-sm font-sans text-zinc-400">Thực hành giao tiếp thực tế với AI</p>
            </button>
          </div>

          {/* Learning Path Overview */}
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
            <div className="text-xs font-sans font-bold text-zinc-500 mb-4 uppercase tracking-wider">LỘ TRÌNH HỌC TẬP</div>
            <h3 className="text-xl font-heading font-black tracking-tight mb-2">{foundationPath.title}</h3>
            <p className="font-sans text-zinc-400 mb-6">{foundationPath.description}</p>

            <div className="space-y-4">
              {foundationPath.modules.map((module) => {
                const moduleCompleted = module.lessons.filter(l =>
                  completedLessonIds.includes(l.id)
                ).length;
                const moduleTotal = module.lessons.length;
                const moduleProgress = (moduleCompleted / moduleTotal) * 100;

                return (
                  <div key={module.id} className="bg-black/30 rounded-[24px] p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-sans font-bold text-zinc-500 uppercase">{module.level}</div>
                        <div className="font-heading font-black tracking-tight mt-1">{module.title}</div>
                      </div>
                      <div className="text-sm font-sans text-zinc-400">
                        {moduleCompleted}/{moduleTotal}
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#CCFF00] transition-all duration-500"
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-[32px] p-8">
            <div className="flex gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-heading font-black tracking-tight mb-2">Mẹo học tập</h4>
                <p className="text-sm font-sans text-zinc-400">
                  Hoàn thành các bài học theo thứ tự để mở khóa nội dung mới. Luyện tập trong Street Talk để củng cố kiến thức đã học!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Curriculum View
  if (view === 'curriculum') {
    return (
      <LessonNav
        modules={foundationPath.modules}
        currentLessonId={currentLesson?.id}
        completedLessonIds={completedLessonIds}
        onSelectLesson={handleSelectLesson}
        onClose={() => setView('dashboard')}
      />
    );
  }

  // Lesson View
  if (view === 'lesson' && currentLesson) {
    return (
      <Lesson
        lesson={currentLesson}
        onComplete={handleLessonComplete}
        onNext={() => {
          if (currentLesson.nextLessonId) {
            const nextLesson = foundationPath.modules
              .flatMap(m => m.lessons)
              .find(l => l.id === currentLesson.nextLessonId);
            if (nextLesson) handleSelectLesson(nextLesson);
          }
        }}
        onPractice={handlePractice}
      />
    );
  }

  // Practice View
  if (view === 'practice') {
    return (
      <div className="relative">
        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setView('dashboard')}
            className="bg-black/80 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors text-sm font-mono"
          >
            ← Back to Dashboard
          </button>
        </div>
        <UrbanChat
          scenario="Coffee shop conversation"
          context_vi="Luyện tập hội thoại tại quán cà phê"
          onBack={() => setView('dashboard')}
        />
      </div>
    );
  }

  return null;
}
