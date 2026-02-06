"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle, TrendingUp, Sparkles, Brain, Lightbulb } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

type IncorrectAnswer = {
  id: number;
  question: string;
  user_answer: string;
  correct_answer: string;
  explanation: string;
  image_url?: string;
  category_name: string;
  times_wrong: number;
  options: string[];
};

function ReviewContent() {
  const router = useRouter();
  const { token } = useAuth();
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

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
    if (token) {
      fetchData();
    }
  }, [token, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incorrectData, analyticsData] = await Promise.all([
        api.getIncorrectAnswers(
          token!,
          selectedCategory === 'all' ? undefined : selectedCategory
        ),
        api.getPerformanceAnalytics(token!)
      ]);

      setIncorrectAnswers(incorrectData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch review data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a951] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#c8a951] text-lg">Loading review data...</p>
        </div>
      </main>
    );
  }

  const carPosition = Math.min(scrollY * 0.5, 300);
  const carRotation = Math.min(scrollY * 0.05, 15);

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6 relative overflow-hidden">
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
          className="absolute w-96 h-96 bg-[#c8a951]/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-[#c8a951]/10 rounded-full blur-3xl animate-pulse"
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
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-[#c8a951]/40 to-transparent rounded-full"
              style={{
                left: `${5 + i * 5}%`,
                animation: `roadLine 2.5s linear infinite`,
                animationDelay: `${i * 0.3}s`,
                top: '-150px'
              }}
            ></div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute w-4 h-32 bg-gradient-to-b from-transparent via-[#c8a951]/40 to-transparent rounded-full"
              style={{
                right: `${5 + i * 5}%`,
                animation: `roadLine 2.5s linear infinite`,
                animationDelay: `${i * 0.3 + 0.15}s`,
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
          <div className="absolute inset-0 bg-[#c8a951] blur-3xl opacity-60 scale-[2]"></div>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-[0_0_30px_rgba(200,169,81,1)]">
            <path d="M5 13l1.5-4.5h11L19 13" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(200,169,81,0.3)"/>
            <path d="M4 13h16v5H4z" stroke="#c8a951" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(200,169,81,0.4)"/>
            <circle cx="7" cy="18" r="2.5" fill="#1a1a1a" stroke="#c8a951" strokeWidth="2"/>
            <circle cx="7" cy="18" r="1.5" fill="#c8a951"/>
            <circle cx="17" cy="18" r="2.5" fill="#1a1a1a" stroke="#c8a951" strokeWidth="2"/>
            <circle cx="17" cy="18" r="1.5" fill="#c8a951"/>
            <path d="M8 13V10h3v3m2 0V10h3v3" stroke="#c8a951" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="19.5" cy="14.5" r="1" fill="#d9b85c" opacity="0.9"/>
          </svg>
          <div className="absolute top-1/2 left-full w-48 h-2 bg-gradient-to-r from-[#c8a951] via-[#d9b85c]/50 to-transparent opacity-80 blur-sm"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 border-2 border-[#c8a951]/30 text-[#c8a951] px-5 py-2.5 rounded-xl hover:bg-[#c8a951] hover:text-black transition-all duration-300 font-semibold backdrop-blur-sm shadow-lg hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6 animate-float">
            <div className="p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-400/30 shadow-[0_0_50px_rgba(250,204,21,0.5)]">
              <BookOpen className="w-16 h-16 text-black" />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-[#c8a951]/10 px-6 py-2 rounded-full border border-[#c8a951]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-5 h-5 text-[#c8a951] animate-pulse" />
            <span className="text-[#c8a951] font-semibold text-sm tracking-wider uppercase">Learn From Mistakes</span>
            <Brain className="w-5 h-5 text-[#c8a951] animate-pulse" />
          </div>

          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">Review & Practice</h1>
          <p className="text-xl text-gray-400">Learn from your mistakes and improve</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500/20 to-transparent border-2 border-green-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h3 className="text-lg font-bold text-white">Overall Accuracy</h3>
              </div>
              <p className="text-4xl font-black text-green-400">
                {analytics.overall.accuracy_percentage || 0}%
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {analytics.overall.correct_answers} correct out of {analytics.overall.total_attempts}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-transparent border-2 border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Strongest Category</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {analytics.categories[0]?.category_name || 'N/A'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {analytics.categories[0]?.accuracy || 0}% accuracy
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-transparent border-2 border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-orange-400" />
                <h3 className="text-lg font-bold text-white">Needs Practice</h3>
              </div>
              <p className="text-2xl font-bold text-white">
                {analytics.difficultQuestions.length} questions
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Questions answered incorrectly
              </p>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'road-signs', 'dashboard', 'car-knowledge'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap backdrop-blur-sm ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#c8a951] to-[#d9b85c] text-black shadow-[0_0_20px_rgba(200,169,81,0.5)] scale-105'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-[#c8a951]/20 hover:text-[#c8a951] hover:border-[#c8a951]/30'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Incorrect Answers List */}
        <div className="space-y-6">
          {incorrectAnswers.length === 0 ? (
            <div className="bg-gradient-to-b from-white/5 to-transparent border-2 border-green-500/30 rounded-2xl p-12 text-center backdrop-blur-sm">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">Perfect Score!</h3>
              <p className="text-gray-400">You haven't missed any questions in this category yet.</p>
            </div>
          ) : (
            incorrectAnswers.map((answer, index) => (
              <div
                key={answer.id}
                className="bg-gradient-to-b from-white/5 to-transparent border-2 border-white/10 rounded-2xl p-6 hover:border-[#c8a951]/50 transition-all backdrop-blur-sm hover:scale-[1.01]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <span className="inline-block px-3 py-1 bg-[#c8a951]/20 text-[#c8a951] rounded-full text-sm font-semibold border border-[#c8a951]/30">
                      {answer.category_name}
                    </span>
                    {answer.times_wrong > 1 && (
                      <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold border border-red-500/30 animate-pulse">
                        Missed {answer.times_wrong} times
                      </span>
                    )}
                  </div>
                </div>

                {answer.image_url && (
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <img
                        src={answer.image_url}
                        alt="Question"
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-4 flex items-start gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  {answer.question}
                </h3>

                <div className="space-y-3 mb-6">
                  {answer.options.map((option) => (
                    <div
                      key={option}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        option === answer.correct_answer
                          ? 'bg-green-500/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                          : option === answer.user_answer
                          ? 'bg-red-500/10 border-red-500'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`${
                          option === answer.correct_answer
                            ? 'text-green-400 font-semibold'
                            : option === answer.user_answer
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}>
                          {option}
                        </span>
                        {option === answer.correct_answer && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {option === answer.user_answer && option !== answer.correct_answer && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#c8a951]/10 to-[#d9b85c]/10 border-2 border-[#c8a951]/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-[#c8a951] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-[#c8a951] mb-2">Explanation</h4>
                      <p className="text-gray-300 leading-relaxed">{answer.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes roadLine {
          0% { transform: translateY(-150px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <ProtectedRoute>
      <ReviewContent />
    </ProtectedRoute>
  );
}