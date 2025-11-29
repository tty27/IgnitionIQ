"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Star, Zap, Award, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

type Question = {
  id: number;
  image?: string;
  question: string;
  options: string[];
  correct: string;
};

type LevelInfo = {
  currentLevel: number;
  totalLevels: number;
};

type ResultData = {
  xpEarned: number;
  perfectBonus: number;
  newUserLevel: number;
  leveledUp: boolean;
  totalXp: number;
};

type CategoryProgress = {
  currentLevel: number;
  xp: number;
  nextLevelXp: number | null;
};

const LEVEL_NAMES = ["", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];
const LEVEL_COLORS = ["", "text-gray-400", "text-blue-400", "text-purple-400", "text-orange-400", "text-yellow-400"];

function RoadSignsQuizContent() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({ currentLevel: 1, totalLevels: 5 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [readyPhase, setReadyPhase] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeUp, setTimeUp] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchCategoryProgress();
  }, [token]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/levels/questions/road-signs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch questions');

      const data = await response.json();
      setQuestions(data.questions);
      setLevelInfo({
        currentLevel: data.currentLevel,
        totalLevels: data.totalLevels
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load questions');
      setLoading(false);
    }
  };

  const fetchCategoryProgress = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/levels/progress/road-signs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategoryProgress(data);
      }
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  useEffect(() => {
    if (readyPhase) {
      const readyTimeout = setTimeout(() => {
        setReadyPhase(false);
      }, 1500);
      return () => clearTimeout(readyTimeout);
    } else if (!started && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStarted(true);
            setQuizStartTime(Date.now());
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [readyPhase, countdown, started]);

  useEffect(() => {
    if (!started || showResult) return;
    if (timeLeft <= 0) {
      setTimeUp(true);
      saveResult();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, showResult, timeLeft]);

  const saveResult = async () => {
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    
    try {
      const response = await fetch('http://localhost:5000/api/levels/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: 'road-signs',
          score,
          totalQuestions: questions.length,
          timeTaken,
          level: levelInfo.currentLevel
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResultData(data);
        // Refresh category progress
        await fetchCategoryProgress();
      }
    } catch (err) {
      console.error('Failed to save result:', err);
    }
  };

  const handleAnswer = (option: string) => {
    setSelected(option);
    const isCorrect = option === question.correct;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
        saveResult();
      }
    }, 800);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(60);
    setTimeUp(false);
    setStarted(false);
    setCountdown(3);
    setReadyPhase(true);
    setResultData(null);
  };

  const playNextLevel = async () => {
    setLoading(true);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(60);
    setTimeUp(false);
    setStarted(false);
    setCountdown(3);
    setReadyPhase(true);
    setResultData(null);
    
    // Fetch new questions for next level
    await fetchQuestions();
    await fetchCategoryProgress();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a951] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#c8a951] text-lg">Loading questions...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Quiz</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/game')}
            className="px-6 py-3 bg-[#c8a951] text-black rounded-xl font-bold hover:bg-[#d9b85c] transition-all"
          >
            Back to Menu
          </button>
        </div>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-20 h-20 text-[#c8a951] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#c8a951] mb-4">🎉 Congratulations!</h2>
          <p className="text-xl text-gray-300 mb-6">You've completed all levels!</p>
          <button
            onClick={() => router.push('/game')}
            className="px-6 py-3 bg-[#c8a951] text-black rounded-xl font-bold hover:bg-[#d9b85c] transition-all"
          >
            Back to Menu
          </button>
        </div>
      </main>
    );
  }

  const question = questions[current];
  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;
  const progress = (timeLeft / 60) * circumference;

  const feedback =
    score === questions.length
      ? "Perfect! You're a road sign master!"
      : score >= questions.length * 0.75
      ? "Excellent! You know your signs well!"
      : score >= questions.length * 0.5
      ? "Good effort! Keep practicing!"
      : "Keep learning — you'll improve!";

  // Check if user unlocked next level
  const hasNextLevel = categoryProgress && categoryProgress.currentLevel < levelInfo.totalLevels;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#c8a951]/30 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={() => router.push("/game")}
            className="flex items-center gap-2 border-2 border-[#c8a951]/30 text-[#c8a951] px-5 py-2.5 rounded-xl hover:bg-[#c8a951] hover:text-black hover:border-[#c8a951] transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Level Badge */}
          {!showResult && !timeUp && (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#c8a951]/10 border-2 border-[#c8a951]/30 rounded-xl">
              <Star className={`w-5 h-5 ${LEVEL_COLORS[levelInfo.currentLevel]}`} />
              <span className={`font-bold ${LEVEL_COLORS[levelInfo.currentLevel]}`}>
                Level {levelInfo.currentLevel}: {LEVEL_NAMES[levelInfo.currentLevel]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Add top padding for fixed header */}
      <div className="relative z-10 w-full max-w-4xl mt-20">
        {/* Ready Phase */}
        {readyPhase && (
          <div className="text-center">
            <div className="text-8xl font-black text-[#c8a951] animate-pulse drop-shadow-[0_0_40px_rgba(200,169,81,0.6)]">
              Ready!
            </div>
            <p className={`text-2xl mt-4 ${LEVEL_COLORS[levelInfo.currentLevel]}`}>
              Level {levelInfo.currentLevel}: {LEVEL_NAMES[levelInfo.currentLevel]}
            </p>
          </div>
        )}

        {/* Countdown Phase */}
        {!readyPhase && !started && countdown > 0 && (
          <div className="text-center">
            <div className="text-9xl font-black text-[#c8a951] animate-bounce drop-shadow-[0_0_60px_rgba(200,169,81,0.8)]">
              {countdown}
            </div>
          </div>
        )}

        {/* Time Up Screen */}
        {timeUp && !showResult && (
          <div className="text-center bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-3xl p-12 shadow-[0_0_60px_rgba(200,169,81,0.2)] backdrop-blur-sm">
            <h2 className="text-5xl font-bold mb-6 text-[#c8a951]">Time's Up!</h2>
            <p className="text-2xl mb-8 text-gray-300">
              You scored <span className="text-[#c8a951] font-bold">{score}/{questions.length}</span>
            </p>
            <button
              onClick={restartQuiz}
              className="px-8 py-4 bg-[#c8a951] text-black rounded-xl font-bold text-lg hover:bg-[#d9b85c] transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(200,169,81,0.4)]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result Screen with Next Level Option */}
        {showResult && (
          <div className="text-center bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951] rounded-3xl p-12 shadow-[0_0_80px_rgba(200,169,81,0.3)] backdrop-blur-sm">
            {/* Level Up Animation */}
            {resultData?.leveledUp && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-xl animate-pulse">
                <div className="flex items-center justify-center gap-3 text-yellow-400">
                  <Zap className="w-8 h-8" />
                  <span className="text-2xl font-bold">LEVEL UP!</span>
                  <Zap className="w-8 h-8" />
                </div>
                <p className="text-yellow-300 mt-2">You reached Level {resultData.newUserLevel}!</p>
              </div>
            )}

            {/* Next Level Unlocked */}
            {hasNextLevel && categoryProgress && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 rounded-xl">
                <div className="flex items-center justify-center gap-3 text-blue-400">
                  <Star className="w-8 h-8 animate-spin" />
                  <span className="text-2xl font-bold">Level {categoryProgress.currentLevel} Unlocked!</span>
                </div>
                <p className="text-blue-300 mt-2">{LEVEL_NAMES[categoryProgress.currentLevel]} difficulty available</p>
              </div>
            )}

            <div className="flex justify-center mb-8">
              <div className="p-6 rounded-full bg-[#c8a951]/10 border-4 border-[#c8a951] animate-pulse">
                <Trophy className="w-16 h-16 text-[#c8a951]" />
              </div>
            </div>

            <h2 className="text-5xl font-black mb-6 text-[#c8a951] drop-shadow-[0_0_20px_rgba(200,169,81,0.6)]">
              Level {levelInfo.currentLevel} Complete!
            </h2>

            <p className="text-2xl text-gray-300 mb-8 font-light">{feedback}</p>

            <div className="text-8xl font-black mb-6 text-[#c8a951] drop-shadow-[0_0_30px_rgba(200,169,81,0.8)]">
              {score}/{questions.length}
            </div>

            {/* XP Display */}
            {resultData && (
              <div className="mb-8 space-y-3">
                <div className="flex items-center justify-center gap-3 text-xl">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">+{resultData.xpEarned} XP</span>
                </div>
                
                {resultData.perfectBonus > 0 && (
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <Star className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-semibold">Perfect Score Bonus: +{resultData.perfectBonus} XP</span>
                  </div>
                )}
                
                <div className="text-gray-400 text-sm">
                  Total XP: {resultData.totalXp}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {/* Next Level Button (if unlocked) */}
              {hasNextLevel && categoryProgress && (
                <button
                  onClick={playNextLevel}
                  className="w-full px-8 py-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3"
                >
                  <span>Continue to Level {categoryProgress.currentLevel}</span>
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Regular Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={restartQuiz}
                  className="px-8 py-4 rounded-xl bg-[#c8a951] text-black font-bold text-lg hover:bg-[#d9b85c] transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(200,169,81,0.4)]"
                >
                  Replay Level {levelInfo.currentLevel}
                </button>
                <button
                  onClick={() => router.push("/game")}
                  className="px-8 py-4 rounded-xl border-2 border-[#c8a951] text-[#c8a951] font-bold text-lg hover:bg-[#c8a951] hover:text-black transition-all duration-300 hover:scale-105"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Interface */}
        {started && !showResult && !timeUp && (
          <div className="text-center bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-3xl p-10 shadow-[0_0_60px_rgba(200,169,81,0.2)] backdrop-blur-sm">
            {/* Timer Circle */}
            <div className="flex justify-center mb-8 relative">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r={circleRadius} stroke="#1a1a1a" strokeWidth="10" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r={circleRadius}
                  stroke="#c8a951"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(200,169,81,0.6))' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#c8a951]">
                {timeLeft}s
              </span>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Question {current + 1}</span>
                <span>{questions.length} Total</span>
              </div>
              <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#c8a951] transition-all duration-300 rounded-full"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Image */}
            {question.image && (
              <div className="mb-8 flex justify-center">
                <div className="p-6 bg-[#1a1a1a] rounded-2xl border-2 border-[#c8a951]/20">
                  <img
                    src={question.image}
                    alt="Road sign"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Question */}
            <h3 className="text-2xl font-bold mb-8 text-white">
              {question.question}
            </h3>

            {/* Options */}
            <div className="grid gap-4">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selected}
                  className={`px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border-2
                  ${
                    selected
                      ? option === question.correct
                        ? "border-green-500 bg-green-500/20 scale-105 text-green-400"
                        : option === selected
                        ? "border-red-500 bg-red-500/20 scale-95 text-red-400"
                        : "border-[#1a1a1a] bg-[#1a1a1a]/50 opacity-50 text-gray-500"
                      : "border-[#c8a951]/30 bg-[#1a1a1a] hover:bg-[#c8a951] hover:border-[#c8a951] hover:text-black hover:scale-105 text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function RoadSignsQuiz() {
  return (
    <ProtectedRoute>
      <RoadSignsQuizContent />
    </ProtectedRoute>
  );
}