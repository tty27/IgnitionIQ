"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Medal, Award, Star, TrendingUp, Sparkles, Crown, Zap } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import api from "@/lib/api";

type LeaderboardEntry = {
  id: number;
  name: string;
  level: number;
  total_xp: number;
  total_quizzes: number;
  total_correct_answers: number;
};

export default function LeaderboardPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'global' | 'road-signs' | 'dashboard' | 'car-knowledge'>('global');
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
    fetchLeaderboard();
    if (user && token) {
      fetchMyRank();
    }
  }, [selectedTab, user, token]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedTab === 'global') {
        data = await api.getGlobalLeaderboard(50);
        setLeaderboard(data.leaderboard);
      } else {
        data = await api.getCategoryLeaderboard(selectedTab, 50);
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRank = async () => {
    if (!token) return;
    try {
      const data = await api.getMyRank(token);
      setMyRank(data);
    } catch (error) {
      console.error('Failed to fetch rank:', error);
      setMyRank(null);
    }
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const carPosition = Math.min(scrollY * 0.5, 300);
  const carRotation = Math.min(scrollY * 0.05, 15);

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6 relative overflow-hidden">
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
          className="absolute w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"
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

      <div 
        className="fixed z-10 transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: '8%',
          top: `${100 + carPosition}px`,
          transform: `rotate(${carRotation}deg) scale(1.2)`,
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-60 scale-[2]"></div>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-[0_0_30px_rgba(250,204,21,1)]">
            <path d="M5 13l1.5-4.5h11L19 13" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(250,204,21,0.3)"/>
            <path d="M4 13h16v5H4z" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(250,204,21,0.4)"/>
            <circle cx="7" cy="18" r="2.5" fill="#1a1a1a" stroke="#facc15" strokeWidth="2"/>
            <circle cx="7" cy="18" r="1.5" fill="#facc15"/>
            <circle cx="17" cy="18" r="2.5" fill="#1a1a1a" stroke="#facc15" strokeWidth="2"/>
            <circle cx="17" cy="18" r="1.5" fill="#facc15"/>
            <path d="M8 13V10h3v3m2 0V10h3v3" stroke="#facc15" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="19.5" cy="14.5" r="1" fill="#FFD700" opacity="0.9"/>
          </svg>
          <div className="absolute top-1/2 left-full w-48 h-2 bg-gradient-to-r from-yellow-300 via-yellow-400/50 to-transparent opacity-80 blur-sm"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
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
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 px-6 py-2 rounded-full border border-yellow-400/30 backdrop-blur-md mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-semibold text-sm tracking-wider uppercase">Top Performers</span>
            <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>

          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">Leaderboard</h1>
          <p className="text-xl text-gray-400">Compete with players around the world</p>
        </div>

        {myRank && myRank.user && (
          <div className="bg-gradient-to-r from-[#c8a951]/20 to-[#d9b85c]/20 border-2 border-[#c8a951] rounded-2xl p-6 mb-8 backdrop-blur-sm shadow-[0_0_40px_rgba(200,169,81,0.3)] hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getRankMedal(myRank.rank)}</div>
                <div>
                  <p className="text-sm text-gray-400">Your Rank</p>
                  <p className="text-2xl font-bold text-white">{myRank.user.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Level {myRank.user.level}</p>
                <p className="text-xl font-bold text-[#c8a951]">{myRank.user.total_xp} XP</p>
              </div>
            </div>
          </div>
        )}

        {!myRank && !loading && user && (
          <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <p className="text-blue-300">
                Complete your first quiz to appear on the leaderboard!
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['global', 'road-signs', 'dashboard', 'car-knowledge'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap backdrop-blur-sm ${
                selectedTab === tab
                  ? 'bg-gradient-to-r from-[#c8a951] to-[#d9b85c] text-black shadow-[0_0_20px_rgba(200,169,81,0.5)] scale-105'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-[#c8a951]/20 hover:text-[#c8a951] hover:border-[#c8a951]/30'
              }`}
            >
              {tab === 'global' ? 'Global' : tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-b from-white/5 to-transparent border-2 border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_0_60px_rgba(200,169,81,0.1)]">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#c8a951] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No Players Yet</h3>
              <p className="text-gray-500">Be the first to complete a quiz in this category!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">XP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Quizzes</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-white/5 hover:bg-[#c8a951]/5 transition-colors ${
                        user && entry.id === user.id ? 'bg-[#c8a951]/10' : ''
                      } ${index < 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankMedal(index + 1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-[#c8a951]'} rounded-full flex items-center justify-center text-black font-bold shadow-lg`}>
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{entry.name}</span>
                          {user && entry.id === user.id && (
                            <span className="text-xs bg-[#c8a951] text-black px-2 py-1 rounded-full font-bold">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#c8a951]" />
                          <span className="text-white font-semibold">{entry.level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-[#c8a951] font-bold">{entry.total_xp?.toLocaleString() || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400">{entry.total_quizzes || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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