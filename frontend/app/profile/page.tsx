"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft, Trophy, Award, Target, Star, Zap, TrendingUp, Sparkles } from "lucide-react";

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
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
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
            <circle cx="19.5" cy="14.5" r="1" fill="#FFD700" opacity="0.9"/>
          </svg>
          <div className="absolute top-1/2 left-full w-48 h-2 bg-gradient-to-r from-yellow-300 via-yellow-400/50 to-transparent opacity-80 blur-sm"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 border-2 border-[#c8a951]/30 text-[#c8a951] px-5 py-2.5 rounded-xl hover:bg-[#c8a951] hover:text-black transition-all duration-300 font-semibold backdrop-blur-sm shadow-lg hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-b from-white/5 to-transparent border-2 border-[#c8a951] rounded-3xl p-8 mb-8 shadow-[0_0_60px_rgba(200,169,81,0.2)] backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c8a951] to-[#d9b85c] rounded-full blur-xl opacity-50"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-[#c8a951] to-[#d9b85c] rounded-full flex items-center justify-center text-5xl font-bold text-black shadow-[0_0_40px_rgba(200,169,81,0.5)]">
                {profile.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#c8a951] text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1 shadow-lg animate-pulse">
                <Star className="w-4 h-4" />
                LVL {profile.user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#c8a951]/10 px-4 py-2 rounded-full border border-[#c8a951]/30 mb-2">
                <Sparkles className="w-4 h-4 text-[#c8a951] animate-pulse" />
                <span className="text-[#c8a951] font-semibold text-xs tracking-wider uppercase">Driver Profile</span>
              </div>
              <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{profile.user.name}</h1>
              <p className="text-gray-400 mb-4">{profile.user.email}</p>
              
              {/* XP Bar */}
              <div className="max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#c8a951] font-semibold">Level {profile.user.level}</span>
                  <span className="text-gray-400">
                    {profile.user.totalXp} / {profile.user.nextLevelXp || "MAX"} XP
                  </span>
                </div>
                <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border-2 border-[#c8a951]/30">
                  <div 
                    className="h-full bg-gradient-to-r from-[#c8a951] to-[#d9b85c] transition-all duration-500 rounded-full shadow-[0_0_20px_rgba(200,169,81,0.5)]"
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
              <div className="bg-gradient-to-br from-[#c8a951]/20 to-transparent border border-[#c8a951]/20 rounded-xl p-4 text-center backdrop-blur-sm hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 text-[#c8a951] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{profile.stats.totalQuizzes}</div>
                <div className="text-xs text-gray-400">Quizzes</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/20 rounded-xl p-4 text-center backdrop-blur-sm hover:scale-105 transition-transform">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{profile.stats.totalCorrect}</div>
                <div className="text-xs text-gray-400">Correct</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-[#c8a951]" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#c8a951] to-[#d9b85c] bg-clip-text text-transparent">Category Progress</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.categories.map((category, index) => (
              <div
                key={category.category_slug}
                className="bg-gradient-to-b from-white/5 to-transparent border-2 border-white/10 rounded-2xl p-6 hover:border-[#c8a951]/50 transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(200,169,81,0.1)] backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{category.category_name}</h3>
                  <div className={`px-3 py-1 rounded-full bg-[#c8a951]/10 border border-[#c8a951]/30 ${LEVEL_COLORS[category.current_level]}`}>
                    <span className="text-xs font-bold">LVL {category.current_level}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className={`w-5 h-5 ${LEVEL_COLORS[category.current_level]}`} />
                    <span className={`font-semibold ${LEVEL_COLORS[category.current_level]}`}>
                      {LEVEL_NAMES[category.current_level]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">{category.xp} XP</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Best: {category.highest_score}/10</span>
                  </div>

                  <div className="mt-4">
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
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

                  <button
                    onClick={() => router.push(`/quiz/${category.category_slug}`)}
                    className="w-full mt-4 py-2 bg-[#c8a951]/10 border border-[#c8a951]/30 text-[#c8a951] rounded-lg hover:bg-[#c8a951] hover:text-black transition-all font-semibold hover:scale-105"
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
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-[#c8a951]" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#c8a951] to-[#d9b85c] bg-clip-text text-transparent">Achievements</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Trophy, name: "First Steps", desc: "Complete 1 quiz", unlocked: profile.stats.totalQuizzes >= 1 },
              { icon: Star, name: "Dedicated", desc: "Complete 10 quizzes", unlocked: profile.stats.totalQuizzes >= 10 },
              { icon: Zap, name: "Rising Star", desc: "Reach Level 5", unlocked: profile.user.level >= 5 },
              { icon: Award, name: "Master", desc: "Reach Level 10", unlocked: profile.user.level >= 10 }
            ].map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-b from-white/5 to-transparent border-2 rounded-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 ${
                    achievement.unlocked ? "border-[#c8a951] hover:scale-105 shadow-[0_0_30px_rgba(200,169,81,0.3)]" : "border-gray-700 opacity-50"
                  }`}
                >
                  <Icon className={`w-12 h-12 mx-auto mb-3 ${achievement.unlocked ? "text-[#c8a951]" : "text-gray-600"}`} />
                  <h3 className="text-sm font-bold text-white mb-1">{achievement.name}</h3>
                  <p className="text-xs text-gray-400">{achievement.desc}</p>
                </div>
              );
            })}
          </div>
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
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
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