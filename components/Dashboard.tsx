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
import VocabReview from './VocabReview';
import ComprehensiveReview from './ComprehensiveReview';
import { LibraryIcon, ChatBubbleIcon, FlameIcon } from './Icons';
import { foundationPath } from '../data/curriculum';
import type { Lesson as LessonType } from '../data/curriculum';
import { loadReviewItems, getDueReviews, createVocabReviewItem, saveReviewItems } from '../services/spacedRepetition';

type View = 'dashboard' | 'curriculum' | 'lesson' | 'practice' | 'review' | 'comprehensive-review';

interface LearningStats {
  streak: number;
  lastStudyDate: string;
  totalVocabLearned: number;
  grammarAccuracy: number;
  totalQuizzesCompleted: number;
  totalCorrectAnswers: number;
  viewedVocabIds: string[]; // Track which vocab items user has viewed
  completedQuizIds: string[]; // Track which quizzes user has completed
}

interface DashboardProps {
  onBack?: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [view, setView] = useState<View>('dashboard');
  const [currentLesson, setCurrentLesson] = useState<LessonType | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [practiceScenarioId, setPracticeScenarioId] = useState<string>('');
  const [reviewLessonId, setReviewLessonId] = useState<string | undefined>(undefined); // Track which lesson to review
  const [stats, setStats] = useState<LearningStats>({
    streak: 0,
    lastStudyDate: '',
    totalVocabLearned: 0,
    grammarAccuracy: 0,
    totalQuizzesCompleted: 0,
    totalCorrectAnswers: 0,
    viewedVocabIds: [],
    completedQuizIds: []
  });
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [lessonReviewCounts, setLessonReviewCounts] = useState<Map<string, number>>(new Map());

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

    // Load learning stats
    const savedStats = localStorage.getItem('neolingua_stats');
    if (savedStats) {
      const loadedStats = JSON.parse(savedStats);

      // Calculate streak
      const today = new Date().toDateString();
      const lastDate = new Date(loadedStats.lastStudyDate).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      let currentStreak = loadedStats.streak || 0;
      if (lastDate === today) {
        // Already studied today, keep streak
        currentStreak = loadedStats.streak || 1;
      } else if (lastDate === yesterday) {
        // Studied yesterday, can continue streak
        currentStreak = loadedStats.streak || 1;
      } else if (lastDate !== today && lastDate !== yesterday) {
        // Streak broken
        currentStreak = 0;
      }

      // Migration: Add missing arrays for backwards compatibility with old data format
      const migratedStats: LearningStats = {
        streak: currentStreak,
        lastStudyDate: loadedStats.lastStudyDate || '',
        totalVocabLearned: loadedStats.totalVocabLearned || 0,
        grammarAccuracy: loadedStats.grammarAccuracy || 0,
        totalQuizzesCompleted: loadedStats.totalQuizzesCompleted || 0,
        totalCorrectAnswers: loadedStats.totalCorrectAnswers || 0,
        viewedVocabIds: loadedStats.viewedVocabIds || [],
        completedQuizIds: loadedStats.completedQuizIds || []
      };

      setStats(migratedStats);

      // Save migrated data back to localStorage to prevent future migrations
      localStorage.setItem('neolingua_stats', JSON.stringify(migratedStats));
    }

    // Set default to first lesson if no progress
    if (!currentLesson && foundationPath.modules[0]?.lessons[0]) {
      setCurrentLesson(foundationPath.modules[0].lessons[0]);
    }

    // Load review items and check due count
    const reviewItems = loadReviewItems();
    const dueItems = getDueReviews(reviewItems);
    setDueReviewCount(dueItems.length);

    // Calculate review count per lesson
    const countsMap = new Map<string, number>();
    dueItems.forEach(item => {
      const count = countsMap.get(item.lessonId) || 0;
      countsMap.set(item.lessonId, count + 1);
    });
    setLessonReviewCounts(countsMap);
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

    // Update stats: streak and vocabulary count
    const today = new Date().toDateString();
    const lastDate = stats.lastStudyDate ? new Date(stats.lastStudyDate).toDateString() : '';
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = stats.streak;
    if (lastDate === today) {
      // Already studied today, keep streak
      newStreak = stats.streak;
    } else if (lastDate === yesterday || !lastDate) {
      // Studied yesterday or first time, increment streak
      newStreak = stats.streak + 1;
    } else {
      // Streak broken, restart
      newStreak = 1;
    }

    // Don't auto-increment vocab count here anymore
    // Vocab count is tracked when user actually views each card
    const updatedStats = {
      ...stats,
      streak: newStreak,
      lastStudyDate: new Date().toISOString()
    };

    setStats(updatedStats);
    localStorage.setItem('neolingua_stats', JSON.stringify(updatedStats));

    // Add vocabulary to spaced repetition system
    const existingReviews = loadReviewItems();
    const newReviews = currentLesson.vocabulary.map(vocab => {
      const reviewItem = createVocabReviewItem(
        `${currentLesson.id}_${vocab.word}`,
        vocab.word,
        vocab.meaning,
        currentLesson.id
      );
      // Make newly learned vocabulary available for immediate review
      reviewItem.nextReviewDate = new Date().toISOString();
      return reviewItem;
    });

    // Filter out duplicates
    const allReviews = [...existingReviews];
    newReviews.forEach(newItem => {
      if (!allReviews.find(item => item.vocabId === newItem.vocabId)) {
        allReviews.push(newItem);
      }
    });

    saveReviewItems(allReviews);

    // Update due review count
    const dueItems = getDueReviews(allReviews);
    setDueReviewCount(dueItems.length);

    // Update lesson review counts map
    const countsMap = new Map<string, number>();
    dueItems.forEach(item => {
      const count = countsMap.get(item.lessonId) || 0;
      countsMap.set(item.lessonId, count + 1);
    });
    setLessonReviewCounts(countsMap);

    console.log(`✅ Lesson completed! Created ${newReviews.length} review items. ${dueItems.length} items now due for review.`);

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

  // Calculate actual progress based on completion metrics
  // Each lesson has: warmup + vocabulary + grammar + practice sections
  // Count completed lessons + current lesson partial progress
  const calculateActualProgress = () => {
    const completedCount = completedLessonIds.length;

    // Add partial progress from current lesson if viewing one
    let partialProgress = 0;
    if (currentLesson && !completedLessonIds.includes(currentLesson.id)) {
      // This is an active lesson, count 0.5 progress for being in progress
      partialProgress = 0.5;
    }

    const totalProgress = completedCount + partialProgress;
    const percentage = (totalProgress / totalLessons) * 100;

    return {
      completed: completedCount,
      total: totalLessons,
      percentage: Math.round(percentage)
    };
  };

  const progress = calculateActualProgress();

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-black tracking-tight">NeoLingua</h1>
                <p className="text-sm font-sans text-zinc-400 mt-1">Hành trình học tiếng Anh của bạn</p>
              </div>
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-zinc-400 hover:text-white transition-colors font-sans text-xl"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 pb-40 space-y-8">
          {/* Smart Action Card - Priority: Review or Next Lesson */}
          {dueReviewCount > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30 rounded-[48px] p-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-sans font-bold text-orange-400 uppercase tracking-wider">🔔 HÀNH ĐỘNG TIẾP THEO</div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-orange-500 text-white text-xs font-sans font-bold px-3 py-1 rounded-full"
                >
                  {dueReviewCount} từ
                </motion.div>
              </div>
              <h2 className="text-2xl font-heading font-black tracking-tight mb-2 text-white">Đã đến giờ ôn tập!</h2>
              <p className="font-sans text-zinc-300 mb-6">
                Bạn có <span className="text-orange-400 font-bold">{dueReviewCount} từ vựng</span> từ <span className="text-orange-400 font-bold">{lessonReviewCounts.size} bài học</span> đang chờ ôn tập. Hãy củng cố kiến thức để nhớ lâu hơn!
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setReviewLessonId(undefined);
                    setView('review');
                  }}
                  className="bg-white/10 border border-white/20 text-white py-4 px-6 rounded-[24px] font-sans font-bold hover:bg-white/15 transition-colors text-left"
                >
                  <div className="text-xs text-zinc-400 mb-1">Ôn tập nhanh</div>
                  <div className="flex items-center justify-between">
                    <span>Flashcard →</span>
                    <span className="text-sm">📝</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (completedLessonIds.length > 0) {
                      // Get last completed lesson for comprehensive review
                      const lastLessonId = completedLessonIds[completedLessonIds.length - 1];
                      setReviewLessonId(lastLessonId);
                      setView('comprehensive-review');
                    }
                  }}
                  className="bg-orange-500 text-white py-4 px-6 rounded-[24px] font-sans font-bold hover:bg-orange-600 transition-colors text-left"
                >
                  <div className="text-xs text-orange-100 mb-1">Ôn tập toàn diện</div>
                  <div className="flex items-center justify-between">
                    <span>4 Kỹ năng →</span>
                    <span className="text-sm">🎯</span>
                  </div>
                </button>
              </div>
            </motion.div>
          ) : currentLesson && !completedLessonIds.includes(currentLesson.id) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#CCFF00]/20 to-transparent border border-[#CCFF00]/30 rounded-[48px] p-10"
            >
              <div className="text-xs font-sans font-bold text-[#CCFF00] mb-4 uppercase tracking-wider">🚀 HÀNH ĐỘNG TIẾP THEO</div>
              <h2 className="text-2xl font-heading font-black tracking-tight mb-2">Tiếp tục bài học mới</h2>
              <p className="font-sans text-zinc-400 mb-6">
                Bạn chưa hoàn thành bài <span className="text-[#CCFF00] font-bold">{currentLesson.title}</span>. Hãy tiếp tục học để mở khóa nội dung mới!
              </p>
              <button
                onClick={() => setView('lesson')}
                className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors"
              >
                Tiếp tục học →
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[48px] p-10 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-heading font-black mb-2">Xuất sắc!</h2>
              <p className="font-sans text-zinc-400">
                Bạn đã hoàn thành tất cả bài học và ôn tập. Tiếp tục duy trì streak để đạt kết quả tốt nhất!
              </p>
            </motion.div>
          )}

          {/* Current Lesson */}
          {currentLesson && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#CCFF00]/20 to-transparent border border-[#CCFF00]/30 rounded-[48px] p-10"
            >
              <div className="text-xs font-sans font-bold text-[#CCFF00] mb-4 uppercase tracking-wider">BÀI HỌC HIỆN TẠI</div>
              <h2 className="text-2xl font-heading font-black tracking-tight mb-2">{currentLesson.title}</h2>
              <p className="font-sans text-zinc-400 mb-6">{currentLesson.description}</p>

              <div className="flex gap-4 text-sm font-sans text-zinc-500 mb-6">
                <span>{currentLesson.level}</span>
                <span>•</span>
                <span>{currentLesson.estimatedMinutes} phút</span>
                <span>•</span>
                <span>{currentLesson.vocabulary.length} từ mới</span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setView('lesson')}
                  className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors clay-accent"
                >
                  {completedLessonIds.includes(currentLesson.id) ? 'Ôn tập bài học' : 'Bắt đầu học'} →
                </button>

                {/* Show review button for this lesson if it has due vocab */}
                {completedLessonIds.includes(currentLesson.id) && lessonReviewCounts.get(currentLesson.id) && (
                  <button
                    onClick={() => {
                      setReviewLessonId(currentLesson.id);
                      setView('review');
                    }}
                    className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-[28px] font-sans font-bold hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Ôn từ vựng bài này</span>
                    <span className="bg-[#CCFF00] text-black text-xs font-bold px-2 py-1 rounded-full">
                      {lessonReviewCounts.get(currentLesson.id)}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Overall Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-10"
          >
            <div className="text-xs font-sans font-bold text-zinc-500 mb-4 uppercase tracking-wider">TIẾN ĐỘ HỌC TẬP</div>
            <div className="flex items-baseline gap-4 mb-4">
              <h2 className="text-4xl font-heading font-black text-[#CCFF00]">{progress.completed}</h2>
              <span className="font-sans text-zinc-400">/ {progress.total} bài học đã hoàn thành</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#CCFF00]"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Streak Card */}
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">STREAK</div>
                <motion.div
                  animate={{
                    scale: stats.streak > 0 ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: stats.streak > 0 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <FlameIcon size={20} color={stats.streak > 0 ? "#CCFF00" : "#52525b"} />
                </motion.div>
              </div>
              <div className="text-3xl font-heading font-black text-white mb-1">{stats.streak}</div>
              <div className="text-xs font-sans text-zinc-500">ngày liên tục</div>
            </div>

            {/* Vocabulary Card */}
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
              <div className="text-xs font-sans font-bold text-zinc-500 mb-3 uppercase tracking-wider">TỪ VỰNG</div>
              <div className="text-3xl font-heading font-black text-[#CCFF00] mb-1">{stats.totalVocabLearned}</div>
              <div className="text-xs font-sans text-zinc-500">từ đã học</div>
            </div>

            {/* Grammar Accuracy Card */}
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
              <div className="text-xs font-sans font-bold text-zinc-500 mb-3 uppercase tracking-wider">NGỮ PHÁP</div>
              <div className="text-3xl font-heading font-black text-white mb-1">
                {stats.totalQuizzesCompleted > 0
                  ? Math.round((stats.totalCorrectAnswers / stats.totalQuizzesCompleted) * 100)
                  : 0}%
              </div>
              <div className="text-xs font-sans text-zinc-500">độ chính xác</div>
            </div>

            {/* Quiz Count Card */}
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
              <div className="text-xs font-sans font-bold text-zinc-500 mb-3 uppercase tracking-wider">BÀI TẬP</div>
              <div className="text-3xl font-heading font-black text-white mb-1">{stats.totalQuizzesCompleted}</div>
              <div className="text-xs font-sans text-zinc-500">đã hoàn thành</div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setView('curriculum')}
              className="bg-white/5 border border-white/10 rounded-[40px] p-9 text-left hover:bg-white/10 transition-colors group"
            >
              <div className="w-14 h-14 bg-[#CCFF00]/10 rounded-[20px] flex items-center justify-center mb-6 group-hover:bg-[#CCFF00]/20 transition-colors">
                <LibraryIcon size={28} color="#CCFF00" />
              </div>
              <h3 className="text-xl font-heading font-black tracking-tight mb-2">Xem giáo trình</h3>
              <p className="text-sm font-sans text-zinc-400">Duyệt toàn bộ bài học và theo dõi tiến độ</p>
            </button>

            <button
              onClick={() => {
                setPracticeScenarioId('coffee-shop');
                setView('practice');
              }}
              className="bg-white/5 border border-white/10 rounded-[40px] p-9 text-left hover:bg-white/10 transition-colors group"
            >
              <div className="w-14 h-14 bg-[#CCFF00]/10 rounded-[20px] flex items-center justify-center mb-6 group-hover:bg-[#CCFF00]/20 transition-colors">
                <ChatBubbleIcon size={28} color="#CCFF00" />
              </div>
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
        onReviewAll={() => {
          setReviewLessonId(undefined);
          setView('review');
        }}
        dueReviewCount={dueReviewCount}
      />
    );
  }

  // Handle quiz answer from Lesson component
  const handleQuizAnswer = (lessonId: string, isCorrect: boolean) => {
    // Only count quiz once per lesson
    if (stats.completedQuizIds.includes(lessonId)) {
      return; // Already completed this quiz, don't count again
    }

    const updatedStats = {
      ...stats,
      totalQuizzesCompleted: stats.totalQuizzesCompleted + 1,
      totalCorrectAnswers: stats.totalCorrectAnswers + (isCorrect ? 1 : 0),
      completedQuizIds: [...stats.completedQuizIds, lessonId]
    };

    setStats(updatedStats);
    localStorage.setItem('neolingua_stats', JSON.stringify(updatedStats));
  };

  // Handle vocab card view from Lesson component
  const handleVocabView = (vocabId: string) => {
    // Only count each vocab once
    if (stats.viewedVocabIds.includes(vocabId)) {
      return; // Already viewed this vocab
    }

    const updatedStats = {
      ...stats,
      totalVocabLearned: stats.totalVocabLearned + 1,
      viewedVocabIds: [...stats.viewedVocabIds, vocabId]
    };

    setStats(updatedStats);
    localStorage.setItem('neolingua_stats', JSON.stringify(updatedStats));
  };

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
        onBack={() => setView('curriculum')}
        onQuizAnswer={(isCorrect) => handleQuizAnswer(currentLesson.id, isCorrect)}
        onVocabView={handleVocabView}
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

  // Review View
  if (view === 'review') {
    return (
      <VocabReview
        lessonId={reviewLessonId} // Pass specific lesson ID or undefined for all
        onComplete={(reviewed, accuracy) => {
          // Update due count and lesson counts after review
          const reviewItems = loadReviewItems();
          const dueItems = getDueReviews(reviewItems);
          setDueReviewCount(dueItems.length);

          // Recalculate per-lesson review counts
          const countsMap = new Map<string, number>();
          dueItems.forEach(item => {
            const count = countsMap.get(item.lessonId) || 0;
            countsMap.set(item.lessonId, count + 1);
          });
          setLessonReviewCounts(countsMap);

          setView('dashboard');
        }}
        onBack={() => setView('dashboard')}
      />
    );
  }

  // Comprehensive Review View (4 skills)
  if (view === 'comprehensive-review') {
    // Get lesson for comprehensive review
    const reviewLesson = reviewLessonId
      ? foundationPath.modules.flatMap(m => m.lessons).find(l => l.id === reviewLessonId)
      : currentLesson;

    if (!reviewLesson) {
      setView('dashboard');
      return null;
    }

    // Prepare review items from lesson vocabulary
    const comprehensiveReviewItems = reviewLesson.vocabulary.map(vocab => ({
      word: vocab.word,
      meaning: vocab.meaning,
      lessonId: reviewLesson.id,
      example: vocab.example,
      exampleVi: vocab.exampleVi
    }));

    return (
      <ComprehensiveReview
        lessonId={reviewLesson.id}
        lessonTitle={reviewLesson.title}
        reviewItems={comprehensiveReviewItems}
        onComplete={(results) => {
          // Save comprehensive review results
          // Could extend this to save 4-skill stats separately
          console.log('Comprehensive review completed:', results);

          // Update due count after review
          const reviewItems = loadReviewItems();
          const dueItems = getDueReviews(reviewItems);
          setDueReviewCount(dueItems.length);

          // Update lesson review counts map
          const countsMap = new Map<string, number>();
          dueItems.forEach(item => {
            const count = countsMap.get(item.lessonId) || 0;
            countsMap.set(item.lessonId, count + 1);
          });
          setLessonReviewCounts(countsMap);

          setView('dashboard');
        }}
        onBack={() => setView('dashboard')}
      />
    );
  }

  return null;
}
