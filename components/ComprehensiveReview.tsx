/**
 * ComprehensiveReview Component - Redesigned
 *
 * Mixed 4-skill review system (Listening, Speaking, Reading, Writing)
 * Professional teaching approach with varied exercise types
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playGoogleTTS } from '../services/googleTTS';

interface ReviewItem {
  word: string;
  meaning: string;
  lessonId: string;
  example?: string;
  exampleVi?: string;
}

interface ComprehensiveReviewProps {
  lessonId: string;
  lessonTitle: string;
  reviewItems: ReviewItem[];
  onComplete?: (results: ReviewResults) => void;
  onBack?: () => void;
}

interface ReviewResults {
  totalQuestions: number;
  correctAnswers: number;
  skillBreakdown: {
    listening: { score: number; total: number };
    speaking: { score: number; total: number };
    reading: { score: number; total: number };
    writing: { score: number; total: number };
  };
}

type ExerciseType =
  | 'listen-type-word'        // Listening: Hear word → type in English
  | 'speak-word'              // Speaking: See Vietnamese → speak English (voice recognition)
  | 'read-comprehension'      // Reading: Passage → answer questions in English
  | 'write-dictation'         // Writing: Hear sentence → write it
  | 'write-fill-blank'        // Writing: Fill in the blank
  | 'write-word-order';       // Writing: Arrange words to form sentence

interface Exercise {
  type: ExerciseType;
  skill: 'listening' | 'speaking' | 'reading' | 'writing';
  item: ReviewItem;
  question?: string;
  options?: string[];
  correctAnswer: string;
  passage?: string;
  audioText?: string;
  words?: string[];
}

export default function ComprehensiveReview({
  lessonId,
  lessonTitle,
  reviewItems,
  onComplete,
  onBack
}: ComprehensiveReviewProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [results, setResults] = useState<ReviewResults>({
    totalQuestions: 0,
    correctAnswers: 0,
    skillBreakdown: {
      listening: { score: 0, total: 0 },
      speaking: { score: 0, total: 0 },
      reading: { score: 0, total: 0 },
      writing: { score: 0, total: 0 }
    }
  });
  const [viewState, setViewState] = useState<'intro' | 'exercise' | 'complete'>('intro');

  const recognitionRef = useRef<any>(null);

  // Generate mixed exercises from review items
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const generatedExercises = generateMixedExercises(reviewItems);
    setExercises(generatedExercises);
  }, [reviewItems]);

  const generateMixedExercises = (items: ReviewItem[]): Exercise[] => {
    const exercises: Exercise[] = [];

    items.forEach((item, index) => {
      // For each vocabulary item, create 2-3 different exercise types

      // 1. Listening exercise - hear word, type in English
      exercises.push({
        type: 'listen-type-word',
        skill: 'listening',
        item,
        correctAnswer: item.word
      });

      // 2. Speaking exercise - see Vietnamese, speak English
      exercises.push({
        type: 'speak-word',
        skill: 'speaking',
        item,
        correctAnswer: item.word
      });

      // 3. Writing exercise - vary the type
      if (index % 3 === 0 && item.example) {
        // Fill in the blank
        const blankSentence = item.example.replace(
          new RegExp(`\\b${item.word}\\b`, 'i'),
          '______'
        );
        exercises.push({
          type: 'write-fill-blank',
          skill: 'writing',
          item,
          question: blankSentence,
          correctAnswer: item.word
        });
      } else if (index % 3 === 1 && item.example) {
        // Dictation - hear sentence, write it
        exercises.push({
          type: 'write-dictation',
          skill: 'writing',
          item,
          audioText: item.example,
          correctAnswer: item.example
        });
      } else if (item.example) {
        // Word ordering - arrange words to form sentence
        const words = item.example.split(' ').sort(() => Math.random() - 0.5);
        exercises.push({
          type: 'write-word-order',
          skill: 'writing',
          item,
          words,
          correctAnswer: item.example
        });
      }
    });

    // Shuffle exercises to mix all skills together
    return exercises.sort(() => Math.random() - 0.5);
  };

  // Generate reading comprehension passage from multiple items
  const generateReadingPassage = (items: ReviewItem[]): Exercise | null => {
    if (items.length < 3) return null;

    // Take 3-4 items to create a mini passage
    const selectedItems = items.slice(0, Math.min(4, items.length));

    // Create passage using example sentences
    const passage = selectedItems
      .filter(item => item.example)
      .map(item => item.example)
      .join(' ');

    if (!passage) return null;

    // Create comprehension question
    const targetItem = selectedItems[0];
    const question = `What does "${targetItem.word}" mean in this context?`;

    return {
      type: 'read-comprehension',
      skill: 'reading',
      item: targetItem,
      passage,
      question,
      correctAnswer: targetItem.meaning
    };
  };

  // Add reading comprehension to exercises
  useEffect(() => {
    if (reviewItems.length >= 3 && exercises.length > 0) {
      const readingExercise = generateReadingPassage(reviewItems);
      if (readingExercise) {
        // Insert reading exercise at a random position
        const randomIndex = Math.floor(Math.random() * exercises.length);
        setExercises(prev => {
          const newExercises = [...prev];
          newExercises.splice(randomIndex, 0, readingExercise);
          return newExercises;
        });
      }
    }
  }, [reviewItems]);

  const currentExercise = exercises[currentExerciseIndex];

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
        setUserAnswer(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      setTranscription('');
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const checkAnswer = () => {
    if (!currentExercise) return;

    let isCorrect = false;
    const userInput = currentExercise.type === 'write-word-order'
      ? selectedWords.join(' ')
      : userAnswer;

    // Normalize both answers for comparison
    const normalizedUser = normalizeText(userInput);
    const normalizedCorrect = normalizeText(currentExercise.correctAnswer);

    // Check correctness based on exercise type
    if (currentExercise.type === 'write-dictation' || currentExercise.type === 'write-word-order') {
      // For sentence-level exercises, allow minor differences
      const userWords = normalizedUser.split(' ');
      const correctWords = normalizedCorrect.split(' ');
      const matchCount = userWords.filter(word => correctWords.includes(word)).length;
      const accuracy = matchCount / correctWords.length;
      isCorrect = accuracy >= 0.8; // 80% accuracy threshold
    } else {
      // For word-level exercises, require exact match
      isCorrect = normalizedUser === normalizedCorrect;
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // Update results
    const skill = currentExercise.skill;
    setResults(prev => ({
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      skillBreakdown: {
        ...prev.skillBreakdown,
        [skill]: {
          score: prev.skillBreakdown[skill].score + (isCorrect ? 1 : 0),
          total: prev.skillBreakdown[skill].total + 1
        }
      }
    }));
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserAnswer('');
      setSelectedWords([]);
      setTranscription('');
      setFeedback(null);
    } else {
      // All exercises complete
      setViewState('complete');
      if (onComplete) {
        onComplete(results);
      }
    }
  };

  const handleWordSelect = (word: string) => {
    setSelectedWords(prev => [...prev, word]);
  };

  const handleWordRemove = (index: number) => {
    setSelectedWords(prev => prev.filter((_, i) => i !== index));
  };

  // Intro Screen
  if (viewState === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="text-6xl mb-6"
            >
              🎯
            </motion.div>
            <h1 className="text-4xl font-heading font-black mb-4">Ôn tập toàn diện</h1>
            <p className="text-zinc-400 font-sans text-lg">
              {lessonTitle}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#CCFF00]/10 to-transparent border border-[#CCFF00]/20 rounded-[40px] p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl font-heading font-black text-white mb-3">
                {exercises.length}
              </div>
              <div className="text-lg font-sans font-bold text-[#CCFF00] mb-2">
                BÀI TẬP
              </div>
              <div className="text-sm font-sans text-zinc-400 max-w-md mx-auto">
                Luyện tập toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setViewState('exercise')}
              className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors"
            >
              Bắt đầu ôn tập →
            </button>
            <button
              onClick={onBack}
              className="w-full bg-white/10 text-white py-4 rounded-[28px] font-sans font-bold hover:bg-white/15 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Complete Screen
  if (viewState === 'complete') {
    const accuracy = results.totalQuestions > 0
      ? (results.correctAnswers / results.totalQuestions) * 100
      : 0;

    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
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
            <h2 className="text-3xl font-heading font-black mb-4">Hoàn thành xuất sắc!</h2>
            <p className="text-zinc-400 font-sans">
              Bạn đã hoàn thành <span className="text-[#CCFF00] font-bold">{results.totalQuestions}</span> bài tập
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mb-6 space-y-4">
            <div className="text-center mb-6">
              <div className="text-5xl font-heading font-black text-[#CCFF00] mb-2">
                {Math.round(accuracy)}%
              </div>
              <div className="text-sm font-sans text-zinc-500">Độ chính xác tổng thể</div>
            </div>

            {(Object.entries(results.skillBreakdown) as [string, { score: number; total: number }][]).map(([skill, data]) => {
              const skillInfo = {
                listening: { icon: '👂', name: 'Listening', color: '#CCFF00' },
                speaking: { icon: '🗣️', name: 'Speaking', color: '#3B82F6' },
                reading: { icon: '📖', name: 'Reading', color: '#10B981' },
                writing: { icon: '✍️', name: 'Writing', color: '#F59E0B' }
              }[skill as keyof typeof results.skillBreakdown];

              const skillAccuracy = data.total > 0 ? (data.score / data.total) * 100 : 0;

              if (data.total === 0) return null;

              return (
                <div key={skill} className="flex items-center justify-between p-4 bg-white/5 rounded-[20px]">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{skillInfo?.icon}</div>
                    <div>
                      <div className="font-sans font-bold text-white">{skillInfo?.name}</div>
                      <div className="text-xs font-sans text-zinc-500">
                        {data.score}/{data.total} đúng
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-heading font-black" style={{ color: skillInfo?.color }}>
                    {Math.round(skillAccuracy)}%
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (onComplete) onComplete(results);
              if (onBack) onBack();
            }}
            className="w-full bg-[#CCFF00] text-black py-4 rounded-[28px] font-sans font-bold hover:bg-[#CCFF00]/90 transition-colors"
          >
            Quay lại Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // Exercise Screen
  if (!currentExercise) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
  const skillColors = {
    listening: '#CCFF00',
    speaking: '#3B82F6',
    reading: '#10B981',
    writing: '#F59E0B'
  };
  const skillColor = skillColors[currentExercise.skill];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                ←
              </button>
              <div>
                <div className="text-xs font-sans text-zinc-500">
                  {currentExercise.skill.toUpperCase()}
                </div>
                <div className="text-sm font-heading font-black">
                  Câu {currentExerciseIndex + 1}/{exercises.length}
                </div>
              </div>
            </div>
            <div className="text-sm font-heading font-black" style={{ color: skillColor }}>
              {Math.round(progress)}%
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: skillColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExerciseIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              {/* Render different exercise types */}
              {renderExercise(currentExercise)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  function renderExercise(exercise: Exercise) {
    switch (exercise.type) {
      case 'listen-type-word':
        return renderListeningExercise(exercise);
      case 'speak-word':
        return renderSpeakingExercise(exercise);
      case 'read-comprehension':
        return renderReadingExercise(exercise);
      case 'write-dictation':
        return renderDictationExercise(exercise);
      case 'write-fill-blank':
        return renderFillBlankExercise(exercise);
      case 'write-word-order':
        return renderWordOrderExercise(exercise);
      default:
        return null;
    }
  }

  function renderListeningExercise(exercise: Exercise) {
    return (
      <>
        <div
          className="border rounded-[48px] p-12 text-center"
          style={{
            background: `linear-gradient(to bottom right, ${skillColors.listening}20, transparent)`,
            borderColor: `${skillColors.listening}30`
          }}
        >
          <div className="text-xs font-sans font-bold uppercase tracking-wider mb-6" style={{ color: skillColors.listening }}>
            KỸ NĂNG NGHE
          </div>

          <p className="text-lg font-sans text-zinc-300 mb-8">
            Nhấn vào icon để nghe lại
          </p>

          <button
            onClick={() => playGoogleTTS(exercise.item.word)}
            className="w-32 h-32 rounded-full flex items-center justify-center transition-all mx-auto mb-6 hover:scale-110"
            style={{
              backgroundColor: `${skillColors.listening}20`,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={skillColors.listening} strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>

          <p className="text-sm font-sans text-zinc-500">
            Bạn nghe thấy từ gì? Hãy gõ bằng <span className="text-[#CCFF00] font-bold">tiếng Anh</span>
          </p>
        </div>

        {feedback === null ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
              placeholder="Type the English word..."
              className="w-full bg-black/50 border border-white/20 rounded-[20px] px-6 py-4 font-sans text-white text-lg placeholder-zinc-500 focus:outline-none"
              style={{ borderColor: `${skillColors.listening}50`, outlineColor: skillColors.listening }}
              autoFocus
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full text-black py-4 rounded-[28px] font-sans font-bold transition-colors disabled:opacity-50"
              style={{ backgroundColor: skillColors.listening }}
            >
              Kiểm tra
            </button>
          </motion.div>
        ) : (
          <FeedbackSection
            feedback={feedback}
            userAnswer={userAnswer}
            correctAnswer={exercise.correctAnswer}
            additionalInfo={`Nghĩa: ${exercise.item.meaning}`}
            onNext={handleNext}
            hasMore={currentExerciseIndex < exercises.length - 1}
            skillColor={skillColor}
          />
        )}
      </>
    );
  }

  function renderSpeakingExercise(exercise: Exercise) {
    return (
      <>
        <div
          className="border rounded-[48px] p-12 text-center"
          style={{
            background: `linear-gradient(to bottom right, ${skillColors.speaking}20, transparent)`,
            borderColor: `${skillColors.speaking}30`
          }}
        >
          <div className="text-xs font-sans font-bold uppercase tracking-wider mb-6" style={{ color: skillColors.speaking }}>
            KỸ NĂNG NÓI
          </div>

          <h2 className="text-4xl font-heading font-black mb-6 text-white">
            {exercise.item.meaning}
          </h2>

          <p className="text-lg font-sans text-zinc-300 mb-8">
            Hãy nói từ tiếng Anh tương ứng vào micro
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => playGoogleTTS(exercise.item.word)}
              className="px-6 py-3 rounded-[20px] font-sans font-bold transition-colors"
              style={{
                backgroundColor: `${skillColors.speaking}20`,
                color: skillColors.speaking
              }}
            >
              🔊 Nghe mẫu
            </button>

            {recognitionRef.current && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="px-8 py-3 rounded-[20px] font-sans font-bold transition-all"
                style={{
                  backgroundColor: isRecording ? '#EF4444' : skillColors.speaking,
                  color: 'white'
                }}
              >
                {isRecording ? '⏹ Dừng' : '🎤 Nói'}
              </button>
            )}
          </div>

          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-sm font-sans text-zinc-400"
            >
              Đang lắng nghe...
            </motion.div>
          )}

          {transcription && (
            <div className="mt-4 p-4 bg-white/5 rounded-[20px]">
              <div className="text-xs font-sans text-zinc-500 mb-1">Bạn đã nói:</div>
              <div className="text-lg font-sans text-white font-bold">{transcription}</div>
            </div>
          )}
        </div>

        {!recognitionRef.current && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-[20px] p-4">
            <p className="text-sm font-sans text-orange-400">
              ⚠️ Trình duyệt không hỗ trợ voice recognition. Hãy gõ từ thay thế:
            </p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type the English word..."
              className="w-full bg-black/50 border border-white/20 rounded-[20px] px-6 py-4 font-sans text-white mt-3"
              autoFocus
            />
          </div>
        )}

        {feedback === null && (transcription || userAnswer) ? (
          <button
            onClick={checkAnswer}
            className="w-full text-white py-4 rounded-[28px] font-sans font-bold"
            style={{ backgroundColor: skillColors.speaking }}
          >
            Kiểm tra
          </button>
        ) : feedback !== null ? (
          <FeedbackSection
            feedback={feedback}
            userAnswer={transcription || userAnswer}
            correctAnswer={exercise.correctAnswer}
            additionalInfo={`Correct pronunciation: ${exercise.item.word}`}
            onNext={handleNext}
            hasMore={currentExerciseIndex < exercises.length - 1}
            skillColor={skillColor}
          />
        ) : null}
      </>
    );
  }

  function renderReadingExercise(exercise: Exercise) {
    return (
      <>
        <div
          className="border rounded-[48px] p-12"
          style={{
            background: `linear-gradient(to bottom right, ${skillColors.reading}20, transparent)`,
            borderColor: `${skillColors.reading}30`
          }}
        >
          <div className="text-xs font-sans font-bold uppercase tracking-wider mb-6" style={{ color: skillColors.reading }}>
            KỸ NĂNG ĐỌC
          </div>

          <div className="bg-black/30 rounded-[24px] p-6 mb-6">
            <p className="text-lg font-sans text-white leading-relaxed">
              {exercise.passage}
            </p>
          </div>

          <div className="text-sm font-sans text-zinc-400 mb-4">
            {exercise.question}
          </div>
        </div>

        {feedback === null ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
              placeholder="Answer in English or Vietnamese..."
              className="w-full bg-black/50 border border-white/20 rounded-[20px] px-6 py-4 font-sans text-white text-lg placeholder-zinc-500 focus:outline-none"
              style={{ borderColor: `${skillColors.reading}50` }}
              autoFocus
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full text-black py-4 rounded-[28px] font-sans font-bold disabled:opacity-50"
              style={{ backgroundColor: skillColors.reading }}
            >
              Kiểm tra
            </button>
          </motion.div>
        ) : (
          <FeedbackSection
            feedback={feedback}
            userAnswer={userAnswer}
            correctAnswer={exercise.correctAnswer}
            onNext={handleNext}
            hasMore={currentExerciseIndex < exercises.length - 1}
            skillColor={skillColor}
          />
        )}
      </>
    );
  }

  function renderDictationExercise(exercise: Exercise) {
    return (
      <>
        <div
          className="border rounded-[48px] p-12 text-center"
          style={{
            background: `linear-gradient(to bottom right, ${skillColors.writing}20, transparent)`,
            borderColor: `${skillColors.writing}30`
          }}
        >
          <div className="text-xs font-sans font-bold uppercase tracking-wider mb-6" style={{ color: skillColors.writing }}>
            KỸ NĂNG VIẾT - DICTATION
          </div>

          <p className="text-lg font-sans text-zinc-300 mb-8">
            Nghe câu và viết lại hoàn chỉnh
          </p>

          <button
            onClick={() => playGoogleTTS(exercise.audioText || '')}
            className="w-24 h-24 rounded-full flex items-center justify-center transition-all mx-auto mb-6 hover:scale-110"
            style={{ backgroundColor: `${skillColors.writing}20` }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={skillColors.writing} strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </div>

        {feedback === null ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Write the sentence you heard..."
              rows={3}
              className="w-full bg-black/50 border border-white/20 rounded-[20px] px-6 py-4 font-sans text-white text-lg placeholder-zinc-500 focus:outline-none resize-none"
              style={{ borderColor: `${skillColors.writing}50` }}
              autoFocus
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full text-black py-4 rounded-[28px] font-sans font-bold disabled:opacity-50"
              style={{ backgroundColor: skillColors.writing }}
            >
              Kiểm tra
            </button>
          </motion.div>
        ) : (
          <FeedbackSection
            feedback={feedback}
            userAnswer={userAnswer}
            correctAnswer={exercise.correctAnswer}
            onNext={handleNext}
            hasMore={currentExerciseIndex < exercises.length - 1}
            skillColor={skillColor}
          />
        )}
      </>
    );
  }

  function renderFillBlankExercise(exercise: Exercise) {
    return (
      <>
        <div
          className="border rounded-[48px] p-12"
          style={{
            background: `linear-gradient(to bottom right, ${skillColors.writing}20, transparent)`,
            borderColor: `${skillColors.writing}30`
          }}
        >
          <div className="text-xs font-sans font-bold uppercase tracking-wider mb-6" style={{ color: skillColors.writing }}>
            KỸ NĂNG VIẾT - ĐIỀN CHỖ TRỐNG
          </div>

          <p className="text-lg font-sans text-white leading-relaxed mb-4">
            {exercise.question}
          </p>

          <p className="text-sm font-sans text-zinc-400">
            Điền từ còn thiếu vào chỗ trống
          </p>
        </div>

        {feedback === null ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
              placeholder="Type the missing word..."
              className="w-full bg-black/50 border border-white/20 rounded-[20px] px-6 py-4 font-sans text-white text-lg placeholder-zinc-500 focus:outline-none"
              style={{ borderColor: `${skillColors.writing}50` }}
              autoFocus
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full text-black py-4 rounded-[28px] font-sans font-bold disabled:opacity-50"
              style={{ backgroundColor: skillColors.writing }}
            >
              Kiểm tra
            </button>
          </motion.div>
        ) : (
          <FeedbackSection
            feedback={feedback}
            userAnswer={userAnswer}
            correctAnswer={exercise.correctAnswer}
            additionalInfo={`Full sentence: ${exercise.audioText || exercise.item.example}`}
            onNext={handleNext}
            hasMore={currentExerciseIndex < exercises.length - 1}
            skillColor={skillColor}
          />
        )}
      </>
    );
  }

  function renderWordOrderExercise(exercise: Exercise) {
    const availableWords = exercise.words?.filter(word => !selectedWords.includes(word)) || [];

    return (
      <>
        <div
          className="border rounded-[48px] p-12"
          style={{
            background: `linear-gradient(to bottom right, ${skillColors.writing}20, transparent)`,
            borderColor: `${skillColors.writing}30`
          }}
        >
          <div className="text-xs font-sans font-bold uppercase tracking-wider mb-6" style={{ color: skillColors.writing }}>
            KỸ NĂNG VIẾT - SẮP XẾP TỪ
          </div>

          <p className="text-lg font-sans text-zinc-300 mb-6">
            Sắp xếp các từ để tạo thành câu có nghĩa
          </p>

          <button
            onClick={() => playGoogleTTS(exercise.correctAnswer)}
            className="px-6 py-3 rounded-[20px] font-sans font-bold transition-colors"
            style={{
              backgroundColor: `${skillColors.writing}20`,
              color: skillColors.writing
            }}
          >
            🔊 Nghe câu mẫu
          </button>
        </div>

        {/* Selected words area */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 min-h-[100px]">
          <div className="text-xs font-sans text-zinc-500 mb-3">Câu của bạn:</div>
          <div className="flex flex-wrap gap-2">
            {selectedWords.length === 0 ? (
              <div className="text-sm font-sans text-zinc-600 italic">Chọn các từ bên dưới...</div>
            ) : (
              selectedWords.map((word, index) => (
                <motion.button
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => handleWordRemove(index)}
                  className="px-4 py-2 rounded-[12px] font-sans font-bold text-white transition-colors"
                  style={{ backgroundColor: skillColors.writing }}
                >
                  {word}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Available words */}
        <div className="bg-black/30 rounded-[24px] p-6">
          <div className="text-xs font-sans text-zinc-500 mb-3">Các từ có sẵn:</div>
          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordSelect(word)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-[12px] font-sans font-bold text-white transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {feedback === null ? (
          <button
            onClick={checkAnswer}
            disabled={selectedWords.length === 0}
            className="w-full text-black py-4 rounded-[28px] font-sans font-bold disabled:opacity-50"
            style={{ backgroundColor: skillColors.writing }}
          >
            Kiểm tra
          </button>
        ) : (
          <FeedbackSection
            feedback={feedback}
            userAnswer={selectedWords.join(' ')}
            correctAnswer={exercise.correctAnswer}
            onNext={handleNext}
            hasMore={currentExerciseIndex < exercises.length - 1}
            skillColor={skillColor}
          />
        )}
      </>
    );
  }
}

// Feedback Section Component
function FeedbackSection({
  feedback,
  userAnswer,
  correctAnswer,
  additionalInfo,
  onNext,
  hasMore,
  skillColor
}: {
  feedback: 'correct' | 'incorrect';
  userAnswer: string;
  correctAnswer: string;
  additionalInfo?: string;
  onNext: () => void;
  hasMore: boolean;
  skillColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-[32px] p-8 ${
        feedback === 'correct'
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="text-4xl">
          {feedback === 'correct' ? '✓' : '✕'}
        </div>
        <div className="flex-1">
          <h3 className={`text-2xl font-heading font-black mb-2 ${
            feedback === 'correct' ? 'text-green-400' : 'text-red-400'
          }`}>
            {feedback === 'correct' ? 'Chính xác!' : 'Chưa đúng'}
          </h3>

          {feedback === 'incorrect' && (
            <>
              <div className="text-sm font-sans text-zinc-400 mb-2">
                Câu trả lời của bạn: <span className="text-red-400 font-bold">{userAnswer}</span>
              </div>
              <div className="text-sm font-sans text-zinc-400">
                Đáp án đúng: <span className="text-green-400 font-bold">{correctAnswer}</span>
              </div>
            </>
          )}

          {additionalInfo && (
            <div className="text-sm font-sans text-zinc-500 mt-3 italic">
              {additionalInfo}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full text-black py-4 rounded-[28px] font-sans font-bold"
        style={{ backgroundColor: skillColor }}
      >
        {hasMore ? 'Câu tiếp theo →' : 'Hoàn thành'}
      </button>
    </motion.div>
  );
}
