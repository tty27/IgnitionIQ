"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Star, Zap, Award, Sparkles, Flame } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

type Question = {
  id: number;
  image?: string;
  question: string;
  options: string[];
  correct: string;
  explanation?: string;
  category: string;
};

type ResultData = {
  xpEarned: number;
  perfectBonus: number;
  newUserLevel: number;
  leveledUp: boolean;
  totalXp: number;
  questionsAnswered: number;
};

function MixedModeQuizContent() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [readyPhase, setReadyPhase] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds total
  const [timeUp, setTimeUp] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    fetchMixedQuestions();
  }, [token]);

  const fetchMixedQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/levels/questions/mixed', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch questions');

      const data = await response.json();
      setQuestions(data.questions);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load questions');
      setLoading(false);
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
          category: 'mixed',
          score,
          totalQuestions: answeredQuestions,
          timeTaken,
          level: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResultData({
          ...data,
          questionsAnswered: answeredQuestions
        });
      }
    } catch (err) {
      console.error('Failed to save result:', err);
    }
  };

  const handleAnswer = (option: string) => {
  if (selected) return; // prevent double click

  setSelected(option);

  if (option === question.correct) {
    setScore(score + 1);
  }
  setTimeout(() => {
    if (current + 1 < questions.length && timeLeft > 0) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setShowResult(true);
      saveResult();
    }
  }, 600);
};


  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(90);
    setTimeUp(false);
    setStarted(false);
    setCountdown(3);
    setReadyPhase(true);
    setResultData(null);
    setAnsweredQuestions(0);
    fetchMixedQuestions();
  };

  const carPosition = Math.min(scrollY * 0.5, 300);
  const carRotation = Math.min(scrollY * 0.05, 15);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a951] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#c8a951] text-lg">Loading Mixed Mode...</p>
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
          <Flame className="w-20 h-20 text-[#c8a951] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#c8a951] mb-4">No Questions Available</h2>
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
  const progress = (timeLeft / 90) * circumference;

  const feedback =
    answeredQuestions === 0
      ? "Time's up! Try to answer faster next time!"
      : score === answeredQuestions
      ? "Perfect! You're unstoppable!"
      : score >= answeredQuestions * 0.75
      ? "Excellent! You're on fire!"
      : score >= answeredQuestions * 0.5
      ? "Good effort! Keep practicing!"
      : "Keep learning — you'll improve!";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a951' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        <div 
          className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            right: '10%',
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
            animationDelay: '1s'
          }}
        ></div>

        {/* Road Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`left-${i}`}
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent rounded-full"
              style={{
                left: `${5 + i * 5}%`,
                animation: `roadLine 2s linear infinite`,
                animationDelay: `${i * 0.25}s`,
                top: '-150px'
              }}
            ></div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-red-500/40 to-transparent rounded-full"
              style={{
                right: `${5 + i * 5}%`,
                animation: `roadLine 2s linear infinite`,
                animationDelay: `${i * 0.25 + 0.125}s`,
                top: '-150px'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Animated Car */}
      <div 
        className="fixed z-10 transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: '8%',
          top: `${100 + carPosition}px`,
          transform: `rotate(${carRotation}deg) scale(1.2)`,
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-orange-400 blur-3xl opacity-60 scale-[2]"></div>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-[0_0_30px_rgba(251,146,60,1)]">
            <path d="M5 13l1.5-4.5h11L19 13" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(251,146,60,0.3)"/>
            <path d="M4 13h16v5H4z" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(251,146,60,0.4)"/>
            <circle cx="7" cy="18" r="2.5" fill="#1a1a1a" stroke="#fb923c" strokeWidth="2"/>
            <circle cx="7" cy="18" r="1.5" fill="#fb923c"/>
            <circle cx="17" cy="18" r="2.5" fill="#1a1a1a" stroke="#fb923c" strokeWidth="2"/>
            <circle cx="17" cy="18" r="1.5" fill="#fb923c"/>
            <path d="M8 13V10h3v3m2 0V10h3v3" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="19.5" cy="14.5" r="1" fill="#FFD700" opacity="0.9"/>
          </svg>
          <div className="absolute top-1/2 left-full w-48 h-2 bg-gradient-to-r from-orange-300 via-orange-400/50 to-transparent opacity-80 blur-sm"></div>
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-orange-500/30 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/game")}
            className="flex items-center gap-2 border-2 border-orange-500/30 text-orange-400 px-5 py-2.5 rounded-xl hover:bg-orange-500 hover:text-black transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {!showResult && !timeUp && (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-xl">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
              <span className="font-bold text-orange-400">Mixed Mode Challenge</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mt-20">
        {readyPhase && (
          <div className="text-center">
            <div className="text-8xl font-black bg-gradient-to-r p-4 from-orange-400 to-red-500 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_40px_rgba(251,146,60,0.6)]">
              Ready!
            </div>
            <p className="text-2xl mt-4 text-orange-400">
              Answer as many questions as you can in 90 seconds!
            </p>
          </div>
        )}

        {!readyPhase && !started && countdown > 0 && (
          <div className="text-center">
            <div className="text-9xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent animate-bounce drop-shadow-[0_0_60px_rgba(251,146,60,0.8)]">
              {countdown}
            </div>
          </div>
        )}

        {(timeUp || showResult) && (
          <div className="text-center bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-orange-500 rounded-3xl p-12 shadow-[0_0_80px_rgba(251,146,60,0.3)] backdrop-blur-sm">
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

            <div className="flex justify-center mb-8">
              <div className="p-6 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 border-4 border-orange-500 animate-pulse">
                <Flame className="w-16 h-16 text-orange-400" />
              </div>
            </div>

            <h2 className="text-5xl font-black mb-6 p-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]">
              Challenge Complete!
            </h2>

            <p className="text-2xl text-gray-300 mb-8 font-light">{feedback}</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-orange-500/20 to-transparent border-2 border-orange-500/30 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-2">Questions Answered</p>
                <p className="text-4xl font-black text-orange-400">{answeredQuestions}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-transparent border-2 border-green-500/30 rounded-xl p-6">
                <p className="text-sm text-gray-400 mb-2">Correct Answers</p>
                <p className="text-4xl font-black text-green-400">{score}</p>
              </div>
            </div>

            {resultData && (
              <div className="mb-8 space-y-3">
                <div className="flex items-center justify-center gap-3 text-xl">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">+{resultData.xpEarned} XP</span>
                </div>
                
                {resultData.perfectBonus > 0 && (
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <Star className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-semibold">Perfect Bonus: +{resultData.perfectBonus} XP</span>
                  </div>
                )}
                
                <div className="text-gray-400 text-sm">
                  Total XP: {resultData.totalXp}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={restartQuiz}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(251,146,60,0.4)]"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/game')}
                className="px-8 py-4 rounded-xl border-2 border-orange-500 text-orange-400 font-bold text-lg hover:bg-orange-500 hover:text-black transition-all duration-300 hover:scale-105"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}

        {started && !showResult && !timeUp && (
          <div className="text-center bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-orange-500/30 rounded-3xl p-10 shadow-[0_0_60px_rgba(251,146,60,0.2)] backdrop-blur-sm">
            <div className="flex justify-center mb-8 relative">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r={circleRadius} stroke="#1a1a1a" strokeWidth="10" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r={circleRadius}
                  stroke={timeLeft > 15 ? "#fb923c" : "#ef4444"}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                  style={{ filter: `drop-shadow(0 0 10px ${timeLeft > 15 ? 'rgba(251,146,60,0.6)' : 'rgba(239,68,68,0.6)'})` }}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${timeLeft > 15 ? 'text-orange-400' : 'text-red-400 animate-pulse'}`}>
                {timeLeft}s
              </span>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Question {current + 1}</span>
                <span className="text-orange-400 font-bold">{answeredQuestions} Answered</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                  {question.category}
                </span>
              </div>
            </div>

            {question.image && (
              <div className="mb-8 flex justify-center">
                <div className="p-6 bg-[#1a1a1a] rounded-2xl border-2 border-orange-500/20">
                  <img
                    src={question.image}
                    alt="Question"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            )}

            <h3 className="text-2xl font-bold mb-8 text-white">
              {question.question}
            </h3>

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
                      : "border-orange-500/30 bg-[#1a1a1a] hover:bg-orange-500 hover:border-orange-500 hover:text-black hover:scale-105 text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes roadLine {
          0% { transform: translateY(-150px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </main>
  );
}

export default function MixedModeQuiz() {
  return (
    <ProtectedRoute>
      <MixedModeQuizContent />
    </ProtectedRoute>
  );
}