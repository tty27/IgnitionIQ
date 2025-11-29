"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft, Trophy, Award, Target, Star, Zap, TrendingUp } from "lucide-react";

type CategoryProgress = {
  category_name: string;
  category_slug: string;
  current_level: number;
  xp: number;
  highest_score: number;
};

type UserProfile = {
  user: {
    id: number;
    name: string;
    email: string;
    level: number;
    totalXp: number;
    nextLevelXp: number | null;
    xpToNextLevel: number;
  };
  stats: {
    totalQuizzes: number;
    totalCorrect: number;
  };
  categories: CategoryProgress[];
};

const LEVEL_COLORS = ["", "text-gray-400", "text-blue-400", "text-purple-400", "text-orange-400", "text-yellow-400"];
const LEVEL_NAMES = ["", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];

function ProfileContent() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('http://localhost:5000/api/levels/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a951] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#c8a951] text-lg">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">Failed to load profile</p>
      </main>
    );
  }

  const xpProgress = profile.user.nextLevelXp 
    ? ((profile.user.totalXp / profile.user.nextLevelXp) * 100)
    : 100;

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#c8a951]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 border-2 border-[#c8a951]/30 text-[#c8a951] px-5 py-2.5 rounded-xl hover:bg-[#c8a951] hover:text-black transition-all duration-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951] rounded-3xl p-8 mb-8 shadow-[0_0_60px_rgba(200,169,81,0.2)]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#c8a951] to-[#d9b85c] rounded-full flex items-center justify-center text-5xl font-bold text-black">
                {profile.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#c8a951] text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                <Star className="w-4 h-4" />
                LVL {profile.user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-white mb-2">{profile.user.name}</h1>
              <p className="text-gray-400 mb-4">{profile.user.email}</p>
              
              {/* XP Bar */}
              <div className="max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#c8a951] font-semibold">Level {profile.user.level}</span>
                  <span className="text-gray-400">
                    {profile.user.totalXp} / {profile.user.nextLevelXp || "MAX"} XP
                  </span>
                </div>
                <div className="w-full h-4 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#c8a951]/30">
                  <div 
                    className="h-full bg-gradient-to-r from-[#c8a951] to-[#d9b85c] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(xpProgress, 100)}%` }}
                  ></div>
                </div>
                {profile.user.nextLevelXp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.user.xpToNextLevel} XP to next level
                  </p>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] border border-[#c8a951]/20 rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 text-[#c8a951] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{profile.stats.totalQuizzes}</div>
                <div className="text-xs text-gray-400">Quizzes</div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#c8a951]/20 rounded-xl p-4 text-center">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{profile.stats.totalCorrect}</div>
                <div className="text-xs text-gray-400">Correct</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Progress */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#c8a951]" />
            Category Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.categories.map((category) => (
              <div
                key={category.category_slug}
                className="bg-gradient-to-b from-[#0a0a0a] to-black border-2 border-[#c8a951]/30 rounded-2xl p-6 hover:border-[#c8a951] transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(200,169,81,0.1)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{category.category_name}</h3>
                  <div className={`px-3 py-1 rounded-full bg-[#c8a951]/10 border border-[#c8a951]/30 ${LEVEL_COLORS[category.current_level]}`}>
                    <span className="text-xs font-bold">LVL {category.current_level}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Level Badge */}
                  <div className="flex items-center gap-2">
                    <Star className={`w-5 h-5 ${LEVEL_COLORS[category.current_level]}`} />
                    <span className={`font-semibold ${LEVEL_COLORS[category.current_level]}`}>
                      {LEVEL_NAMES[category.current_level]}
                    </span>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">{category.xp} XP</span>
                  </div>

                  {/* Best Score */}
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Best: {category.highest_score}/10</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${
                          category.current_level === 1 ? "from-gray-400 to-gray-500" :
                          category.current_level === 2 ? "from-blue-400 to-blue-500" :
                          category.current_level === 3 ? "from-purple-400 to-purple-500" :
                          category.current_level === 4 ? "from-orange-400 to-orange-500" :
                          "from-yellow-400 to-yellow-500"
                        } transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.min((category.xp / ((category.current_level + 1) * 100)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => router.push(`/quiz/${category.category_slug}`)}
                    className="w-full mt-4 py-2 bg-[#c8a951]/10 border border-[#c8a951]/30 text-[#c8a951] rounded-lg hover:bg-[#c8a951] hover:text-black transition-all font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-[#c8a951]" />
            Achievements
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Achievement badges */}
            <div className={`bg-gradient-to-b from-[#0a0a0a] to-black border-2 rounded-2xl p-6 text-center ${
              profile.stats.totalQuizzes >= 1 ? "border-[#c8a951]" : "border-gray-700 opacity-50"
            }`}>
              <Trophy className={`w-12 h-12 mx-auto mb-3 ${profile.stats.totalQuizzes >= 1 ? "text-[#c8a951]" : "text-gray-600"}`} />
              <h3 className="text-sm font-bold text-white mb-1">First Steps</h3>
              <p className="text-xs text-gray-400">Complete 1 quiz</p>
            </div>

            <div className={`bg-gradient-to-b from-[#0a0a0a] to-black border-2 rounded-2xl p-6 text-center ${
              profile.stats.totalQuizzes >= 10 ? "border-[#c8a951]" : "border-gray-700 opacity-50"
            }`}>
              <Star className={`w-12 h-12 mx-auto mb-3 ${profile.stats.totalQuizzes >= 10 ? "text-yellow-400" : "text-gray-600"}`} />
              <h3 className="text-sm font-bold text-white mb-1">Dedicated</h3>
              <p className="text-xs text-gray-400">Complete 10 quizzes</p>
            </div>

            <div className={`bg-gradient-to-b from-[#0a0a0a] to-black border-2 rounded-2xl p-6 text-center ${
              profile.user.level >= 5 ? "border-[#c8a951]" : "border-gray-700 opacity-50"
            }`}>
              <Zap className={`w-12 h-12 mx-auto mb-3 ${profile.user.level >= 5 ? "text-orange-400" : "text-gray-600"}`} />
              <h3 className="text-sm font-bold text-white mb-1">Rising Star</h3>
              <p className="text-xs text-gray-400">Reach Level 5</p>
            </div>

            <div className={`bg-gradient-to-b from-[#0a0a0a] to-black border-2 rounded-2xl p-6 text-center ${
              profile.user.level >= 10 ? "border-[#c8a951]" : "border-gray-700 opacity-50"
            }`}>
              <Award className={`w-12 h-12 mx-auto mb-3 ${profile.user.level >= 10 ? "text-purple-400" : "text-gray-600"}`} />
              <h3 className="text-sm font-bold text-white mb-1">Master</h3>
              <p className="text-xs text-gray-400">Reach Level 10</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}