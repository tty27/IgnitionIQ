"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
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

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 border-2 border-[#c8a951]/30 text-[#c8a951] px-5 py-2.5 rounded-xl hover:bg-[#c8a951] hover:text-black transition-all duration-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-[#c8a951]/10 border-4 border-[#c8a951]">
              <BookOpen className="w-16 h-16 text-[#c8a951]" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-[#c8a951] mb-4">Review & Practice</h1>
          <p className="text-xl text-gray-400">Learn from your mistakes and improve</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h3 className="text-lg font-bold text-white">Overall Accuracy</h3>
              </div>
              <p className="text-4xl font-black text-[#c8a951]">
                {analytics.overall.accuracy_percentage || 0}%
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {analytics.overall.correct_answers} correct out of {analytics.overall.total_attempts}
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-2xl p-6">
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

            <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-2xl p-6">
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
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'road-signs', 'dashboard', 'car-knowledge'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#c8a951] text-black'
                  : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#c8a951]/20 hover:text-[#c8a951]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Incorrect Answers List */}
        <div className="space-y-6">
          {incorrectAnswers.length === 0 ? (
            <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-2xl p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Perfect Score!</h3>
              <p className="text-gray-400">You haven't missed any questions in this category yet.</p>
            </div>
          ) : (
            incorrectAnswers.map((answer) => (
              <div
                key={answer.id}
                className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-2xl p-6 hover:border-[#c8a951] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#c8a951]/20 text-[#c8a951] rounded-full text-sm font-semibold mb-2">
                      {answer.category_name}
                    </span>
                    {answer.times_wrong > 1 && (
                      <span className="ml-2 inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
                        Missed {answer.times_wrong} times
                      </span>
                    )}
                  </div>
                </div>

                {answer.image_url && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={answer.image_url}
                      alt="Question"
                      className="w-32 h-32 object-contain border-2 border-[#c8a951]/20 rounded-lg p-2"
                    />
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-4">{answer.question}</h3>

                <div className="space-y-3 mb-6">
                  {answer.options.map((option) => (
                    <div
                      key={option}
                      className={`p-4 rounded-xl border-2 ${
                        option === answer.correct_answer
                          ? 'bg-green-500/10 border-green-500'
                          : option === answer.user_answer
                          ? 'bg-red-500/10 border-red-500'
                          : 'bg-[#1a1a1a] border-[#c8a951]/20'
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

                <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-400 mb-2">Explanation</h4>
                      <p className="text-gray-300 leading-relaxed">{answer.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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