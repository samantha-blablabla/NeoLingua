/**
 * VocabReview Component
 *
 * Flashcard-style vocabulary review interface using spaced repetition
 * Shows word, lets user self-assess, then reveals answer
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VocabReviewItem,
  calculateNextReview,
  saveReviewItems,
  loadReviewItems,
  getDueReviews,
  saveReviewSession,
  getMasteryLevel
} from '../services/spacedRepetition';
import { playGoogleTTS } from '../services/googleTTS';

interface VocabReviewProps {
  onComplete?: (reviewed: number, accuracy: number) => void;
  onBack?: () => void;
  lessonId?: string; // Optional: filter to review only specific lesson's vocab
}

type ReviewState = 'question' | 'answer' | 'complete';

export default function VocabReview({ onComplete, onBack, lessonId }: VocabReviewProps) {
  const [reviewItems, setReviewItems] = useState<VocabReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<ReviewState>('question');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    const allItems = loadReviewItems();
    let dueItems = getDueReviews(allItems);

    // Filter by lesson if lessonId is provided
    if (lessonId) {
      dueItems = dueItems.filter(item => item.lessonId === lessonId);
    }

    setReviewItems(dueItems);
  }, [lessonId]);

  const currentItem = reviewItems[currentIndex];
  const hasMore = currentIndex < reviewItems.length - 1;
  const progress = reviewItems.length > 0 ? ((currentIndex + 1) / reviewItems.length) * 100 : 0;

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    // Normalize strings for comparison (remove accents, lowercase, trim)
    const normalizeVietnamese = (str: string) => {
      return str
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remove Vietnamese diacritics
    };

    const userNormalized = normalizeVietnamese(userAnswer);
    const correctNormalized = normalizeVietnamese(currentItem.meaning);

    const isCorrect = userNormalized === correctNormalized ||
                     userNormalized.includes(correctNormalized) ||
                     correctNormalized.includes(userNormalized);

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setState('answer');

    // Determine quality based on correctness
    const quality = isCorrect ? 5 : 1;

    // Update session stats
    setSessionTotal(prev => prev + 1);
    if (isCorrect) {
      setSessionCorrect(prev => prev + 1);
    }

    // Calculate next review using spaced repetition algorithm
    const updatedItem = calculateNextReview(currentItem, quality);

    // Update all review items
    const allItems = loadReviewItems();
    const updatedItems = allItems.map(item =>
      item.vocabId === updatedItem.vocabId ? updatedItem : item
    );
    saveReviewItems(updatedItems);
  };

  const handleNextWord = () => {
    const isCorrect = feedback === 'correct';

    // Move to next card or complete
    if (hasMore) {
      setCurrentIndex(prev => prev + 1);
      setState('question');
      setUserAnswer('');
      setFeedback(null);
    } else {
      setState('complete');

      // Save review session
      const accuracy = sessionTotal > 0 ? (sessionCorrect / sessionTotal) * 100 : 0;
      saveReviewSession({
        sessionId: `review_${Date.now()}`,
        date: new Date().toISOString(),
        vocabReviewed: sessionTotal,
        accuracy
      });

      onComplete?.(sessionTotal, accuracy);
    }
  };

  const handlePlayAudio = () => {
    if (currentItem) {
      playGoogleTTS(currentItem.word);
    }
  };

  if (!currentItem || reviewItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-heading font-black mb-4">Không có từ nào cần ôn!</h2>
          <p className="text-zinc-400 font-sans mb-8">Bạn đã ôn tập xong tất cả từ vựng hôm nay. Tuyệt vời!</p>
          <button
            onClick={onBack}
            className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (state === 'complete') {
    const accuracy = (sessionCorrect / sessionTotal) * 100;

    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-8xl mb-6"
            >
              {accuracy >= 80 ? '🌟' : accuracy >= 60 ? '👍' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-heading font-black mb-4">Hoàn thành!</h2>
            <p className="text-zinc-400 font-sans mb-8">
              Bạn đã ôn tập <span className="text-[#CCFF00] font-bold">{sessionTotal}</span> từ vựng
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 mb-6">
            <div className="text-xs font-sans font-bold text-zinc-500 mb-4 uppercase tracking-wider">KẾT QUẢ</div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-zinc-400">Độ chính xác</span>
                <span className="text-2xl font-heading font-black text-[#CCFF00]">{Math.round(accuracy)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-sans text-zinc-400">Trả lời đúng</span>
                <span className="text-xl font-heading font-black text-white">{sessionCorrect}/{sessionTotal}</span>
              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#CCFF00]"
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onBack}
              className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors"
            >
              Quay lại Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <div>
                <div className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-wider">ÔN TẬP TỪ VỰNG</div>
                <h1 className="text-xl font-heading font-black tracking-tight">Flashcard Review</h1>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-sans font-bold text-[#CCFF00]">{currentIndex + 1}/{reviewItems.length}</div>
              <div className="text-xs font-sans text-zinc-500">từ vựng</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#CCFF00]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Quiz Mode */}
      <div className="pt-32 pb-40 px-6 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              {/* Question Card */}
              <div className="bg-gradient-to-br from-[#CCFF00]/20 to-transparent border border-[#CCFF00]/30 rounded-[48px] p-12">
                <div className="text-center">
                  <div className="text-xs font-sans font-bold text-[#CCFF00] mb-6 uppercase tracking-wider">
                    DỊCH TỪ TIẾNG ANH SANG TIẾNG VIỆT
                  </div>

                  <h2 className="text-6xl font-heading font-black mb-8 text-white">
                    {currentItem.word}
                  </h2>

                  <button
                    onClick={handlePlayAudio}
                    className="w-16 h-16 rounded-full bg-[#CCFF00]/20 hover:bg-[#CCFF00]/30 flex items-center justify-center transition-colors mx-auto mb-8"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                  </button>

                  {/* Mastery indicator */}
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${
                      getMasteryLevel(currentItem) === 'mastered' ? 'bg-green-500' :
                      getMasteryLevel(currentItem) === 'reviewing' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="text-xs font-sans text-zinc-400">
                      {getMasteryLevel(currentItem) === 'mastered' ? 'Đã thành thạo' :
                       getMasteryLevel(currentItem) === 'reviewing' ? 'Đang ôn tập' :
                       'Đang học'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Answer Input */}
              {state === 'question' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                    placeholder="Nhập nghĩa tiếng Việt..."
                    className="w-full bg-black/50 border border-white/20 rounded-[20px] px-6 py-4 font-sans text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00]"
                    autoFocus
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim()}
                    className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kiểm tra
                  </button>
                </motion.div>
              )}

              {/* Feedback - Show after answer */}
              {state === 'answer' && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Correct Feedback */}
                  {feedback === 'correct' && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-[24px] p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">✅</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-black text-green-400 mb-2">Chính xác!</h3>
                          <p className="text-sm font-sans text-green-300">
                            Câu trả lời của bạn: <span className="font-bold">"{userAnswer}"</span>
                          </p>
                          <p className="text-sm font-sans text-zinc-400 mt-1">
                            Đáp án: <span className="font-bold text-white">"{currentItem.meaning}"</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Incorrect Feedback */}
                  {feedback === 'incorrect' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-[24px] p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">❌</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-black text-red-400 mb-2">Chưa đúng</h3>
                          <p className="text-sm font-sans text-red-300">
                            Câu trả lời của bạn: <span className="font-bold">"{userAnswer}"</span>
                          </p>
                          <div className="mt-3 pt-3 border-t border-red-500/20">
                            <p className="text-xs font-sans font-bold text-red-300 mb-1">ĐÁP ÁN ĐÚNG:</p>
                            <p className="text-lg font-heading font-black text-[#CCFF00]">"{currentItem.meaning}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleNextWord}
                    className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors"
                  >
                    {hasMore ? 'Từ tiếp theo →' : 'Hoàn thành'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
